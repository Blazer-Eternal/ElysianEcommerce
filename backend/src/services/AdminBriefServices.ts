import https from "https";
import http from "http";
import mongoose from "mongoose";
import { OrderModel } from "../models/OrderModel";
import { ProductModel } from "../models/ProductModel";
import { MessageModel } from "../models/MessageModel";
import { ReviewModel } from "../models/ReviewModel";
import { UserModel } from "../models/UserModel";
import { CartModel } from "../models/CartModel";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "../enums/OrderEnums";
import { ProductStatusEnum } from "../enums/ProductEnums";
import { RoleEnum } from "../enums/UserEnums";

export type BriefSeverity = "critical" | "warning" | "success" | "info";

export interface BriefAction {
  label: string;
  href: string;
}

export interface BriefEntry {
  /** Stable id — the portal uses it to remember which items were already read. */
  key: string;
  severity: BriefSeverity;
  /** True when ignoring this item costs money, stock or a customer. */
  action_required: boolean;
  title: string;
  message: string;
  created_at: string;
  href?: string;
  actions?: BriefAction[];
}

export interface BriefGroup {
  key: "sales" | "inventory" | "support" | "shipping" | "system" | "marketing";
  label: string;
  subtitle: string;
  entries: BriefEntry[];
}

export interface AdminBrief {
  generated_at: string;
  action_required: number;
  total: number;
  groups: BriefGroup[];
}

/** Stock at or below this is worth telling the owner about. */
const LOW_STOCK_THRESHOLD = 10;
/** Orders above this are called out separately as VIP. */
const HIGH_VALUE_ORDER = 100000;
/** An order still sitting in `pending`/`paid` after this is overdue to ship. */
const SHIP_BY_HOURS = 48;
const NEW_ORDER_WINDOW_HOURS = 72;
const REVIEW_WINDOW_DAYS = 30;

const SEVERITY_RANK: Record<BriefSeverity, number> = {
  critical: 0,
  warning: 1,
  success: 2,
  info: 3,
};

const money = (value: number): string => `Rs. ${Math.round(value).toLocaleString("en-IN")}`;

const hoursAgo = (hours: number): Date => new Date(Date.now() - hours * 3_600_000);
const daysAgo = (days: number): Date => new Date(Date.now() - days * 86_400_000);

const iso = (value: Date | string | undefined): string =>
  value ? new Date(value).toISOString() : new Date().toISOString();

const bySeverityThenTime = (a: BriefEntry, b: BriefEntry): number =>
  SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

/*
 * ---------------------------------------------------------------------------
 * System probe (availability + TLS certificate)
 * ---------------------------------------------------------------------------
 * A single vendor loses every sale the moment the storefront stops answering,
 * so the brief pings the live site instead of guessing. The result is cached
 * for a minute: the brief polls often and a TLS handshake is not free.
 */
interface StorefrontProbe {
  ok: boolean;
  status: number;
  latency_ms: number;
  ssl_days_left: number | null;
  ssl_trusted: boolean | null;
  error: string | null;
}

const PROBE_CACHE_MS = 60_000;
let probeCache: { at: number; value: StorefrontProbe } | null = null;

const FAILED_PROBE = (error: string): StorefrontProbe => ({
  ok: false,
  status: 0,
  latency_ms: 0,
  ssl_days_left: null,
  ssl_trusted: null,
  error,
});

const probeUrl = (target: string): Promise<StorefrontProbe> =>
  new Promise((resolve) => {
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return resolve(FAILED_PROBE("Storefront URL is not configured correctly"));
    }

    const secure = parsed.protocol === "https:";
    const started = Date.now();
    let settled = false;
    let guard: ReturnType<typeof setTimeout> | undefined;

    const finish = (value: StorefrontProbe) => {
      if (settled) return;
      settled = true;
      clearTimeout(guard);
      resolve(value);
    };

    const readCertificate = (socket: unknown): { days: number | null; trusted: boolean | null } => {
      const tls = socket as {
        authorized?: boolean;
        getPeerCertificate?: () => { valid_to?: string };
      };
      if (!secure || typeof tls?.getPeerCertificate !== "function") return { days: null, trusted: null };

      const cert = tls.getPeerCertificate();
      if (!cert?.valid_to) return { days: null, trusted: null };

      const expires = new Date(cert.valid_to).getTime();
      if (!Number.isFinite(expires)) return { days: null, trusted: null };

      return { days: Math.floor((expires - Date.now()) / 86_400_000), trusted: Boolean(tls.authorized) };
    };

    const request = (secure ? https : http).get(
      {
        hostname: parsed.hostname,
        port: parsed.port || (secure ? 443 : 80),
        path: parsed.pathname || "/",
        timeout: 6000,
        // The certificate is inspected rather than enforced here — an expired
        // chain is reported as its own alert instead of hiding the ping.
        rejectUnauthorized: false,
        headers: { "user-agent": "ElysianEcommerce-Monitor/1.0", accept: "*/*" },
      },
      (res) => {
        const { days, trusted } = readCertificate(res.socket);
        res.resume();
        const status = res.statusCode ?? 0;
        res.on("end", () =>
          finish({
            ok: status >= 200 && status < 400,
            status,
            latency_ms: Date.now() - started,
            ssl_days_left: days,
            ssl_trusted: trusted,
            error: null,
          })
        );
      }
    );

    guard = setTimeout(() => finish(FAILED_PROBE("Timed out after 6 seconds")), 8000);
    request.on("timeout", () => request.destroy(new Error("Timed out after 6 seconds")));
    request.on("error", (error) =>
      finish({ ...FAILED_PROBE(error.message || "Unreachable"), latency_ms: Date.now() - started })
    );
  });

const getStorefrontProbe = async (): Promise<StorefrontProbe> => {
  if (probeCache && Date.now() - probeCache.at < PROBE_CACHE_MS) return probeCache.value;

  const target = process.env.FRONTEND_URL;
  const value = target ? await probeUrl(target) : FAILED_PROBE("FRONTEND_URL is not set");
  probeCache = { at: Date.now(), value };
  return value;
};

/**
 * Everything on this page is read live out of MongoDB — no seeded copy, no
 * invented numbers. A group with nothing to say renders empty rather than
 * padding itself with filler.
 */
export class AdminBriefServices {
  public async build(): Promise<AdminBrief> {
    const [sales, inventory, support, shipping, system, marketing] = await Promise.all([
      this.salesAndOrders(),
      this.inventory(),
      this.support(),
      this.shipping(),
      this.system(),
      this.marketing(),
    ]);

    const groups = [sales, inventory, support, shipping, system, marketing];
    const all = groups.flatMap((group) => group.entries);

    return {
      generated_at: new Date().toISOString(),
      action_required: all.filter((entry) => entry.action_required).length,
      total: all.length,
      groups,
    };
  }

  /* ------------------------------- Sales -------------------------------- */

  private async salesAndOrders(): Promise<BriefGroup> {
    const orders = await OrderModel.find({ created_at: { $gte: hoursAgo(NEW_ORDER_WINDOW_HOURS) } })
      .populate("user_id", "name email")
      .sort({ created_at: -1 })
      .limit(8);

    const cancelled = await OrderModel.find({
      status: OrderStatusEnum.cancelled,
      created_at: { $gte: daysAgo(REVIEW_WINDOW_DAYS) },
    })
      .populate("user_id", "name email")
      .sort({ created_at: -1 })
      .limit(3);

    const refunded = await OrderModel.find({
      payment_status: PaymentStatusEnum.refunded,
      created_at: { $gte: daysAgo(REVIEW_WINDOW_DAYS) },
    })
      .populate("user_id", "name email")
      .sort({ created_at: -1 })
      .limit(3);

    const nameOf = (order: { user_id: unknown }): string => {
      const user = order.user_id as { name?: string; email?: string } | null;
      return user?.name || user?.email || "A customer";
    };

    const entries: BriefEntry[] = [];

    for (const order of orders) {
      const href = `/admin/orders/${order._id}`;
      const who = nameOf(order);
      const amount = money(order.total_amount);
      const ageHours = (Date.now() - new Date(order.created_at).getTime()) / 3_600_000;

      if (order.payment_status === PaymentStatusEnum.unpaid && order.payment_method !== PaymentMethodEnum.cod && ageHours > 1) {
        entries.push({
          key: `payment-open:${order._id}`,
          severity: "critical",
          action_required: true,
          title: "Payment not completed",
          message: `Order #${order.order_number} from ${who} is still unpaid after ${Math.round(ageHours)} hours. ${amount} is at risk.`,
          created_at: iso(order.created_at),
          href,
          actions: [{ label: "Review payment", href }],
        });
      }

      if (order.total_amount >= HIGH_VALUE_ORDER) {
        entries.push({
          key: `order-vip:${order._id}`,
          severity: "success",
          action_required: false,
          title: "VIP order",
          message: `${who} just placed a ${amount} order (#${order.order_number}).`,
          created_at: iso(order.created_at),
          href,
          actions: [{ label: "View order", href }],
        });
      } else {
        entries.push({
          key: `order-new:${order._id}`,
          severity: "success",
          action_required: false,
          title: "New order received",
          message: `${who} placed order #${order.order_number} for ${amount}.`,
          created_at: iso(order.created_at),
          href,
          actions: [{ label: "View order", href }],
        });
      }
    }

    for (const order of refunded) {
      const href = `/admin/orders/${order._id}`;
      entries.push({
        key: `payment-refund:${order._id}`,
        severity: "critical",
        action_required: true,
        title: "Payment refunded",
        message: `${money(order.total_amount)} was refunded on #${order.order_number} for ${nameOf(order)}.`,
        created_at: iso(order.created_at),
        href,
        actions: [{ label: "Open order", href }],
      });
    }

    for (const order of cancelled) {
      const href = `/admin/orders/${order._id}`;
      entries.push({
        key: `order-cancelled:${order._id}`,
        severity: "warning",
        action_required: false,
        title: "Order cancelled",
        message: `${nameOf(order)} cancelled #${order.order_number} — ${money(order.total_amount)} lost.`,
        created_at: iso(order.created_at),
        href,
        actions: [{ label: "Open order", href }],
      });
    }

    return {
      key: "sales",
      label: "Sales & Orders",
      subtitle: "Every sale is your sale — these come first.",
      entries: entries.sort(bySeverityThenTime),
    };
  }

  /* ------------------------------ Inventory ----------------------------- */

  private async inventory(): Promise<BriefGroup> {
    const [outOfStock, lowStock] = await Promise.all([
      ProductModel.find({ stock: 0, status: ProductStatusEnum.active })
        .sort({ name: 1 })
        .limit(5)
        .select("name stock images"),
      ProductModel.find({
        stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD },
        status: ProductStatusEnum.active,
      })
        .sort({ stock: 1 })
        .limit(6)
        .select("name stock images"),
    ]);

    const entries: BriefEntry[] = [];

    for (const product of outOfStock) {
      entries.push({
        key: `stock-out:${product._id}`,
        severity: "critical",
        action_required: true,
        title: "Out of stock",
        message: `"${product.name}" is sold out. Remove it from ads or restock before more shoppers hit it.`,
        created_at: new Date().toISOString(),
        href: "/admin/products",
        actions: [{ label: "Update stock", href: "/admin/products" }],
      });
    }

    for (const product of lowStock) {
      entries.push({
        key: `stock-low:${product._id}`,
        severity: "warning",
        action_required: true,
        title: "Low stock warning",
        message: `"${product.name}" is down to ${product.stock} unit${product.stock === 1 ? "" : "s"}. Time to reorder.`,
        created_at: new Date().toISOString(),
        href: "/admin/products",
        actions: [{ label: "Update stock", href: "/admin/products" }],
      });
    }

    return {
      key: "inventory",
      label: "Inventory & Stock",
      subtitle: "You are the only vendor — nobody restocks for you.",
      entries: entries.sort(bySeverityThenTime),
    };
  }

  /* -------------------------- Customer service -------------------------- */

  private async support(): Promise<BriefGroup> {
    const [messages, unhappy, loved] = await Promise.all([
      MessageModel.find({ archived: false })
        .sort({ created_at: -1 })
        .limit(6),
      ReviewModel.find({ rating: { $lte: 2 }, created_at: { $gte: daysAgo(REVIEW_WINDOW_DAYS) } })
        .populate("product_id", "name")
        .populate("user_id", "name")
        .sort({ created_at: -1 })
        .limit(4),
      ReviewModel.find({ rating: 5, created_at: { $gte: daysAgo(REVIEW_WINDOW_DAYS) } })
        .populate("product_id", "name")
        .sort({ created_at: -1 })
        .limit(2),
    ]);

    const productName = (review: { product_id: unknown }): string => {
      const product = review.product_id as { name?: string } | null;
      return product?.name ?? "a product";
    };

    const entries: BriefEntry[] = [];

    for (const message of messages) {
      if (message.reply) continue;
      entries.push({
        key: `message:${message._id}`,
        severity: message.is_read ? "info" : "warning",
        action_required: !message.is_read,
        title: message.is_read ? "Customer message waiting for a reply" : "New customer message",
        message: `${message.name} — "${message.subject}"`,
        created_at: iso(message.created_at),
        href: "/admin/messages",
        actions: [{ label: "View & reply", href: "/admin/messages" }],
      });
    }

    for (const review of unhappy) {
      entries.push({
        key: `review-low:${review._id}`,
        severity: "critical",
        action_required: true,
        title: `${review.rating}-star review`,
        message: `On "${productName(review)}": ${review.comment ? `"${review.comment}"` : "no comment left."}`,
        created_at: iso(review.created_at),
        href: "/admin/reviews",
        actions: [{ label: "Moderate review", href: "/admin/reviews" }],
      });
    }

    for (const review of loved) {
      entries.push({
        key: `review-high:${review._id}`,
        severity: "success",
        action_required: false,
        title: "5-star review",
        message: `"${productName(review)}"${review.comment ? `: "${review.comment}"` : " got a perfect rating."}`,
        created_at: iso(review.created_at),
        href: "/admin/reviews",
        actions: [{ label: "Read reviews", href: "/admin/reviews" }],
      });
    }

    return {
      key: "support",
      label: "Customer Service & Operations",
      subtitle: "You handle every ticket yourself — nothing gets missed.",
      entries: entries.sort(bySeverityThenTime),
    };
  }

  /* ------------------------------- Shipping ----------------------------- */

  private async shipping(): Promise<BriefGroup> {
    const [overdue, inTransit, delivered] = await Promise.all([
      OrderModel.find({
        status: { $in: [OrderStatusEnum.pending, OrderStatusEnum.paid] },
        created_at: { $lt: hoursAgo(SHIP_BY_HOURS) },
      })
        .populate("user_id", "name email")
        .sort({ created_at: 1 })
        .limit(5),
      OrderModel.countDocuments({ status: OrderStatusEnum.shipped }),
      OrderModel.countDocuments({
        status: OrderStatusEnum.delivered,
        created_at: { $gte: daysAgo(7) },
      }),
    ]);

    const entries: BriefEntry[] = overdue.map((order) => {
      const href = `/admin/orders/${order._id}`;
      const days = Math.max(1, Math.floor((Date.now() - new Date(order.created_at).getTime()) / 86_400_000));
      return {
        key: `ship-overdue:${order._id}`,
        severity: "warning",
        action_required: true,
        title: "Past ship-by date",
        message: `#${order.order_number} has been waiting ${days} day${days === 1 ? "" : "s"} — pack it and print the label.`,
        created_at: iso(order.created_at),
        href,
        actions: [{ label: "Open order", href }],
      } satisfies BriefEntry;
    });

    if (inTransit > 0) {
      entries.push({
        key: `ship-transit:${inTransit}`,
        severity: "info",
        action_required: false,
        title: "In transit",
        message: `${inTransit} order${inTransit === 1 ? " is" : "s are"} currently with the carrier.`,
        created_at: new Date().toISOString(),
        href: "/admin/orders",
        actions: [{ label: "Track orders", href: "/admin/orders" }],
      });
    }

    if (delivered > 0) {
      entries.push({
        key: `ship-delivered:${delivered}`,
        severity: "success",
        action_required: false,
        title: "Deliveries completed",
        message: `${delivered} order${delivered === 1 ? "" : "s"} delivered in the last 7 days.`,
        created_at: new Date().toISOString(),
        href: "/admin/orders",
        actions: [{ label: "View orders", href: "/admin/orders" }],
      });
    }

    return {
      key: "shipping",
      label: "Shipping & Fulfillment",
      subtitle: "Boxes you still have to pack and hand over.",
      entries: entries.sort(bySeverityThenTime),
    };
  }

  /* ---------------------------- System & security ----------------------- */

  private async system(): Promise<BriefGroup> {
    const probe = await getStorefrontProbe();

    let collections = 0;
    try {
      const db = mongoose.connection.db;
      if (db) collections = (await db.listCollections().toArray()).length;
    } catch {
      collections = 0;
    }

    const uptimeSeconds = Math.floor(process.uptime());
    const uptime =
      uptimeSeconds < 3600
        ? `${Math.floor(uptimeSeconds / 60)}m ${uptimeSeconds % 60}s`
        : `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`;

    const entries: BriefEntry[] = [
      {
        key: "sys:storefront",
        severity: probe.ok ? "success" : "critical",
        action_required: !probe.ok,
        title: probe.ok ? "Storefront online" : "Storefront unreachable",
        message: probe.ok
          ? `${process.env.FRONTEND_URL} responded in ${probe.latency_ms}ms (HTTP ${probe.status}).`
          : `Ping to ${process.env.FRONTEND_URL} failed${probe.error ? ` — ${probe.error}` : ""}. Checkout is unavailable until it recovers.`,
        created_at: new Date().toISOString(),
      },
      {
        key: "sys:database",
        severity: mongoose.connection.readyState === 1 ? "success" : "critical",
        action_required: mongoose.connection.readyState !== 1,
        title: mongoose.connection.readyState === 1 ? "Database connected" : "Database disconnected",
        message:
          mongoose.connection.readyState === 1
            ? `${collections} collections reachable. Uptime for this process: ${uptime}.`
            : "The store cannot read or write orders while the connection is down.",
        created_at: new Date().toISOString(),
      },
    ];

    if (probe.ssl_days_left !== null) {
      const critical = probe.ssl_days_left <= 7;
      const expiring = probe.ssl_days_left <= 14;
      entries.push({
        key: "sys:ssl",
        severity: critical ? "critical" : expiring ? "warning" : "success",
        action_required: expiring,
        title: expiring ? "SSL certificate expiring" : "SSL certificate valid",
        message: probe.ssl_trusted
          ? `Certificate is trusted and expires in ${probe.ssl_days_left} days.`
          : `Certificate chain did not validate and expires in ${probe.ssl_days_left} days.`,
        created_at: new Date().toISOString(),
      });
    }

    return {
      key: "system",
      label: "System & Security",
      subtitle: "If the site is down, the revenue is too — checked live.",
      entries,
    };
  }

  /* -------------------------- Marketing & engagement --------------------- */

  private async marketing(): Promise<BriefGroup> {
    const [signups, recentReviewCount, abandoned] = await Promise.all([
      UserModel.find({ role: RoleEnum.customer, created_at: { $gte: daysAgo(7) } })
        .sort({ created_at: -1 })
        .limit(3)
        .select("name email created_at"),
      ReviewModel.countDocuments({ created_at: { $gte: daysAgo(7) } }),
      this.abandonedCarts(),
    ]);

    const entries: BriefEntry[] = signups.map((user) => ({
      key: `signup:${user._id}`,
      severity: "success",
      action_required: false,
      title: "New subscriber",
      message: `${user.email} created an account.`,
      created_at: iso(user.created_at),
      href: "/admin/users",
      actions: [{ label: "View customer", href: "/admin/users" }],
    }));

    if (abandoned > 0) {
      entries.push({
        key: `carts:abandoned:${abandoned}`,
        severity: "warning",
        action_required: true,
        title: "Abandoned carts",
        message: `${abandoned} shopper${abandoned === 1 ? "" : "s"} filled a cart and left without checking out.`,
        created_at: new Date().toISOString(),
        href: "/admin/products",
        actions: [{ label: "Browse products", href: "/admin/products" }],
      });
    }

    if (recentReviewCount > 0) {
      entries.push({
        key: `reviews:week:${recentReviewCount}`,
        severity: "success",
        action_required: false,
        title: "Review activity",
        message: `${recentReviewCount} review${recentReviewCount === 1 ? "" : "s"} written in the last 7 days.`,
        created_at: new Date().toISOString(),
        href: "/admin/reviews",
        actions: [{ label: "Read reviews", href: "/admin/reviews" }],
      });
    }

    return {
      key: "marketing",
      label: "Marketing & Engagement",
      subtitle: "Audience signals worth acting on.",
      entries: entries.sort(bySeverityThenTime),
    };
  }

  /** Carts with items, untouched for over 30 minutes, whose owner never ordered after. */
  private async abandonedCarts(): Promise<number> {
    const since = daysAgo(7);
    const carts = await CartModel.find({ "items.0": { $exists: true }, updated_at: { $gte: since } })
      .select("user_id updated_at")
      .limit(25)
      .lean();

    if (carts.length === 0) return 0;

    const cutoff = Date.now() - 30 * 60_000;
    const stale = carts.filter((cart) => new Date(cart.updated_at).getTime() < cutoff);
    if (stale.length === 0) return 0;

    const userIds = stale.map((cart) => cart.user_id);
    const orders = await OrderModel.find({ user_id: { $in: userIds } })
      .select("user_id created_at")
      .lean();

    const orderedSince = new Map<string, number>();
    for (const order of orders) {
      const key = String(order.user_id);
      const at = new Date(order.created_at).getTime();
      if (!orderedSince.has(key) || (orderedSince.get(key) as number) < at) orderedSince.set(key, at);
    }

    return stale.filter((cart) => {
      const lastOrder = orderedSince.get(String(cart.user_id));
      return lastOrder === undefined || lastOrder < new Date(cart.updated_at).getTime();
    }).length;
  }
}

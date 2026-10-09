import { Types } from "mongoose";
import type { CartInterface, CouponInterface, OrderInterface, WishlistInterface } from "../intefaces";
import { OrderModel } from "../models/OrderModel";
import { WishlistModel } from "../models/WishlistModel";
import { CartModel } from "../models/CartModel";
import { CouponModel } from "../models/CouponModel";
import { ReviewModel } from "../models/ReviewModel";
import { CustomerNotificationReadModel } from "../models/CustomerNotificationReadModel";
import { OrderStatusEnum, PaymentMethodEnum, PaymentStatusEnum } from "../enums/OrderEnums";
import { DiscountTypeEnum } from "../enums/CouponEnums";
import { ProductStatusEnum } from "../enums/ProductEnums";
import {
  CustomerNotification,
  CustomerNotificationCategoryEnum,
  CustomerNotificationWithRead,
} from "../intefaces/CustomerNotificationInterface";
import {
  LoyaltyServices,
  type LoyaltySummary as LoyaltyEngineSummary,
} from "./LoyaltyServices";

/** How many of the newest orders get a status entry. */
const ORDER_LIMIT = 6;
/** How many wishlisted products get a price/stock entry. */
const WISHLIST_LIMIT = 3;
/** How many idle/low-stock cart entries appear. */
const CART_IDLE_LIMIT = 1;
const CART_LOW_STOCK_LIMIT = 2;
/** How many delivered orders may raise a review request. */
const REVIEW_LIMIT = 2;
/** How many eligible coupons surface in the promotions group. */
const PROMO_LIMIT = 3;
/** A cart untouched for this long counts as abandoned. */
const IDLE_CART_HOURS = 24;
/** Stock at or below this (but above zero) counts as "running low". */
const LOW_STOCK_THRESHOLD = 2;

/** The product fields every notification needs, once `populate` has resolved. */
interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  mrp?: number;
  stock: number;
  status: ProductStatusEnum;
}

/** Narrowing guard: a populated path resolves to a product, an id or nothing. */
const isPopulatedProduct = (value: unknown): value is PopulatedProduct =>
  typeof value === "object" && value !== null && "name" in value;

interface LoyaltySummary {
  totalSpent: number;
  tierIndex: number;
  tierName: string;
  pointsRate: number;
  points: number;
  tierCrossedAt: Date | null;
  latestQualifyingOrder: Date | null;
  orderCount: number;
}

const money = (amount: number): string => amount.toLocaleString("en-IN");

const shortDate = (date: Date): string =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const tierRank = (name: string): number =>
  ["registered", "bronze", "gold", "platinum", "diamond"].indexOf(name.toLowerCase());

/**
 * Builds the signed-in customer's notification feed.
 *
 * Design rule: derive only what the database can prove. Every entry below is a
 * fact about a real record, current order status, a wishlist item's live price
 * and stock, an untouched cart, an unreviewed delivered order, a coupon that is
 * active and genuinely available to this customer's tier. Categories with no
 * backing data simply produce nothing; no message is ever invented to fill a
 * slot, and no event time is ever claimed that no collection records.
 */
export class CustomerNotificationServices {
  /** The full feed plus this customer's unread badge count. */
  public async getFeed(
    userId: string
  ): Promise<{ notifications: CustomerNotificationWithRead[]; unreadCount: number }> {
    const derived = await this.derive(userId);
    const readSet = new Set(await this.readKeys(userId));

    const notifications = derived
      .map((notification) => ({ ...notification, read: readSet.has(notification.key) }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
    };
  }

  /**
   * Persist read markers for the supplied keys, or for the whole feed when no
   * keys are given ("mark all as read"). Upserts keep the call idempotent.
   */
  public async markRead(userId: string, keys?: string[]): Promise<void> {
    const target = keys && keys.length > 0 ? keys : (await this.derive(userId)).map((n) => n.key);
    if (target.length === 0) return;

    const userRef = new Types.ObjectId(userId);
    await CustomerNotificationReadModel.bulkWrite(
      target.map((key) => ({
        updateOne: {
          filter: { user_id: userRef, key },
          update: { $setOnInsert: { read_at: new Date() } },
          upsert: true,
        },
      })),
      { ordered: false }
    );
  }

  private async readKeys(userId: string): Promise<string[]> {
    const rows = await CustomerNotificationReadModel.find({ user_id: new Types.ObjectId(userId) })
      .select("key")
      .lean();
    return rows.map((row) => row.key);
  }

  /** Builds every category from scratch; empty arrays drop the category. */
  private async derive(userId: string): Promise<CustomerNotification[]> {
    const userRef = new Types.ObjectId(userId);
    const now = new Date();

    const [orders, wishlist, cart, reviews, coupons, loyaltySummary] = await Promise.all([
      // Recent orders drive the status entries and the review requests.
      OrderModel.find({ user_id: userRef }).sort({ created_at: -1 }).limit(20),
      WishlistModel.find({ user_id: userRef })
        .populate("product_id", "name price mrp stock status")
        .sort({ created_at: -1 })
        .limit(20),
      CartModel.findOne({ user_id: userRef }).populate(
        "items.product_id",
        "name price mrp stock status"
      ),
      ReviewModel.find({ user_id: userRef }).select("product_id").lean(),
      // Candidates only; eligibility is filtered in derivePromotions.
      CouponModel.find({ is_active: true, expiry_date: { $gte: now } })
        .sort({ expiry_date: 1 })
        .limit(40),
      // The shared loyalty engine: tier, cycle and points, so this feed quotes
      // exactly the numbers the loyalty dashboard shows.
      new LoyaltyServices().evaluate(userId),
    ]);

    const loyalty = this.deriveLoyalty(loyaltySummary);

    return [
      ...this.deriveOrders(orders),
      ...this.deriveRewards(loyalty),
      ...this.deriveWishlist(wishlist, cart),
      ...this.deriveReviews(orders, reviews),
      ...await this.derivePromotions(coupons, loyalty.tierName, userRef, now),
    ];
  }

  /* ------------------------------------------------------------------ */
  /* Order & shipping updates                                            */
  /* ------------------------------------------------------------------ */

  /**
   * One entry per recent order reflecting its *current* status. The database
   * stores no per-status change time, so every entry is timestamped with the
   * order's creation date and labelled "Order placed" rather than implying a
   * ship or delivery moment the schema does not record.
   */
  private deriveOrders(orders: OrderDoc[]): CustomerNotification[] {
    const notifications: CustomerNotification[] = [];

    for (const order of orders.slice(0, ORDER_LIMIT)) {
      const number = order.order_number;
      const city = order.shipping_address?.city;
      const total = order.total_amount;
      const base = {
        key: `order:${order._id}:status:${order.status}`,
        category: CustomerNotificationCategoryEnum.orders,
        timestamp: order.created_at,
        timestampLabel: "Order placed",
        href: `/orders/${order._id}`,
      } as const;

      let title: string;
      let message: string;

      switch (order.status) {
        case OrderStatusEnum.pending:
          if (order.payment_status === PaymentStatusEnum.paid) {
            title = "Payment received";
            message = `We have received Rs. ${money(total)} for order ${number}.`;
          } else if (order.payment_method === PaymentMethodEnum.cod) {
            title = "Order confirmed";
            message = `Order ${number} is confirmed. Rs. ${money(total)} is due on delivery.`;
          } else {
            title = "Order confirmed";
            message = `Order ${number} is confirmed. Awaiting your eSewa payment of Rs. ${money(
              total
            )}.`;
          }
          break;

        case OrderStatusEnum.paid:
          title = "Payment received";
          message = `We have received Rs. ${money(total)} for order ${number}.`;
          break;

        case OrderStatusEnum.shipped:
          title = "Your order has shipped";
          message = `Order ${number} is on its way${city ? ` to ${city}` : ""}.`;
          break;

        case OrderStatusEnum.delivered:
          title = "Order delivered";
          message = `Order ${number} has been delivered${city ? ` to ${city}` : ""}. Enjoy!`;
          break;

        case OrderStatusEnum.cancelled:
          title = "Order cancelled";
          message =
            order.payment_status === PaymentStatusEnum.refunded
              ? `Order ${number} was cancelled and Rs. ${money(total)} has been refunded.`
              : `Order ${number} was cancelled.`;
          break;

        default:
          continue;
      }

      notifications.push({ ...base, title, message });
    }

    return notifications;
  }

  /* ------------------------------------------------------------------ */
  /* Rewards & loyalty                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Flattens the shared loyalty engine's summary into the shape the rewards
   * entries read: the level held, the day it was reached, the points that are
   * actually available (pending and expired balances are not announced) and
   * the lifetime figures the message quotes.
   */
  private deriveLoyalty(summary: LoyaltyEngineSummary): LoyaltySummary {
    const latestEntry = summary.history.find((entry) => entry.points > 0);
    return {
      totalSpent: summary.lifetimeSpend,
      tierIndex: summary.tier.index,
      tierName: summary.tier.name,
      pointsRate: summary.tier.pointsRate,
      points: summary.points.available,
      tierCrossedAt: summary.reached_at ? new Date(summary.reached_at) : null,
      latestQualifyingOrder: latestEntry ? new Date(latestEntry.date) : null,
      orderCount: summary.lifetimeOrders,
    };
  }

  private deriveRewards(loyalty: LoyaltySummary): CustomerNotification[] {
    const notifications: CustomerNotification[] = [];

    // Reaching any level is news: Bronze is earned now, not handed out at
    // signup, so even the entry level gets its own announcement.
    if (loyalty.tierIndex >= 0 && loyalty.tierCrossedAt) {
      notifications.push({
        key: `rewards:tier:${loyalty.tierName}`,
        category: CustomerNotificationCategoryEnum.rewards,
        title: `You have reached ${loyalty.tierName} tier`,
        message: `${loyalty.tierName} members earn ${(loyalty.pointsRate * 100).toFixed(
          1
        )}% back in loyalty points on every order.`,
        timestamp: loyalty.tierCrossedAt,
        timestampLabel: "Tier reached",
        href: "/dashboard/loyalty",
      });
    }

    if (loyalty.points > 0 && loyalty.latestQualifyingOrder) {
      const orders = loyalty.orderCount;
      notifications.push({
        key: `rewards:points:${loyalty.points}`,
        category: CustomerNotificationCategoryEnum.rewards,
        title: `You have ${money(loyalty.points)} loyalty points`,
        message: `Earned at the ${loyalty.tierName} rate on Rs. ${money(
          loyalty.totalSpent
        )} across ${orders} order${orders === 1 ? "" : "s"} that ${
          orders === 1 ? "was" : "were"
        } not cancelled.`,
        timestamp: loyalty.latestQualifyingOrder,
        timestampLabel: "Latest qualifying order",
        href: "/dashboard/loyalty",
      });
    }

    return notifications;
  }

  /* ------------------------------------------------------------------ */
  /* Wishlist, stock and cart                                            */
  /* ------------------------------------------------------------------ */

  private deriveWishlist(wishlist: WishlistDoc[], cart: CartDoc | null): CustomerNotification[] {
    const notifications: CustomerNotification[] = [];

    for (const item of wishlist) {
      if (notifications.length >= WISHLIST_LIMIT) break;

      // `populate` swaps the id for a document at runtime; narrow via unknown
      // so the guard does the work instead of an unchecked cast.
      const populated: unknown = item.product_id;
      // Deleted or unlisted products are skipped: linking to them would be a
      // dead end, and a stock/price claim about an inactive listing misleads.
      if (!isPopulatedProduct(populated) || populated.status !== ProductStatusEnum.active) continue;
      const product = populated;

      const savedAt = item.created_at;
      const href = `/products/${product._id}`;

      if (product.stock <= 0) {
        notifications.push({
          key: `wishlist:${product._id}:out-of-stock`,
          category: CustomerNotificationCategoryEnum.wishlist,
          title: `${product.name} is out of stock`,
          message: `The item you saved is currently unavailable.`,
          timestamp: savedAt,
          timestampLabel: "Saved to wishlist",
          href,
        });
      } else if (product.stock <= LOW_STOCK_THRESHOLD) {
        notifications.push({
          key: `wishlist:${product._id}:low-stock:${product.stock}`,
          category: CustomerNotificationCategoryEnum.wishlist,
          title: `Only ${product.stock} left of ${product.name}`,
          message: `This item on your wishlist has ${product.stock} unit${
            product.stock === 1 ? "" : "s"
          } left in stock.`,
          timestamp: savedAt,
          timestampLabel: "Saved to wishlist",
          href,
        });
      } else if (typeof product.mrp === "number" && product.mrp > product.price) {
        notifications.push({
          key: `wishlist:${product._id}:price-drop:${product.price}`,
          category: CustomerNotificationCategoryEnum.wishlist,
          title: `${product.name} is on sale`,
          message: `Now Rs. ${money(product.price)} against a Rs. ${money(
            product.mrp
          )} MRP, Rs. ${money(product.mrp - product.price)} less than the listed price.`,
          timestamp: savedAt,
          timestampLabel: "Saved to wishlist",
          href,
        });
      }
    }

    if (!cart || !cart.updated_at || cart.items.length === 0) return notifications;
    const cartUpdatedAt = new Date(cart.updated_at);
    const lineCount = cart.items.length;

    const idleHours = (Date.now() - cartUpdatedAt.getTime()) / 3_600_000;
    if (idleHours >= IDLE_CART_HOURS && notifications.length < WISHLIST_LIMIT + CART_IDLE_LIMIT) {
      notifications.push({
        // The timestamp is part of the key so a changed cart reads as new again.
        key: `cart:idle:${cart._id}:${cartUpdatedAt.toISOString()}`,
        category: CustomerNotificationCategoryEnum.wishlist,
        title: `You left ${lineCount} item${lineCount === 1 ? "" : "s"} in your cart`,
        message: `Your cart is saved. Check out whenever you are ready.`,
        timestamp: cartUpdatedAt,
        timestampLabel: "Cart updated",
        href: "/cart",
      });
    }

    let lowStockAdded = 0;
    for (const line of cart.items) {
      if (lowStockAdded >= CART_LOW_STOCK_LIMIT) break;

      const populated: unknown = line.product_id;
      if (!isPopulatedProduct(populated) || populated.status !== ProductStatusEnum.active) continue;
      if (populated.stock <= 0 || populated.stock > LOW_STOCK_THRESHOLD) continue;
      const product = populated;

      lowStockAdded += 1;
      notifications.push({
        key: `cart:${product._id}:low-stock:${product.stock}`,
        category: CustomerNotificationCategoryEnum.wishlist,
        title: `Only ${product.stock} left of ${product.name}`,
        message: `${product.name} in your cart has ${product.stock} unit${
          product.stock === 1 ? "" : "s"
        } in stock.`,
        timestamp: cartUpdatedAt,
        timestampLabel: "Cart updated",
        href: "/cart",
      });
    }

    return notifications;
  }

  /* ------------------------------------------------------------------ */
  /* Account: review requests                                            */
  /* ------------------------------------------------------------------ */

  private deriveReviews(orders: OrderDoc[], reviews: Array<{ product_id: unknown }>) {
    const reviewed = new Set(reviews.map((review) => String(review.product_id)));
    const alreadyRaised = new Set<string>();
    const notifications: CustomerNotification[] = [];

    for (const order of orders) {
      if (notifications.length >= REVIEW_LIMIT) break;
      if (order.status !== OrderStatusEnum.delivered) continue;

      for (const item of order.items) {
        if (notifications.length >= REVIEW_LIMIT) break;

        const productId = String(item.product_id);
        if (!productId || reviewed.has(productId) || alreadyRaised.has(productId)) continue;
        alreadyRaised.add(productId);

        notifications.push({
          key: `review:${productId}`,
          category: CustomerNotificationCategoryEnum.account,
          title: "How did we do?",
          message: `Rate ${item.product_name} from order ${order.order_number}.`,
          timestamp: order.created_at,
          timestampLabel: "Order placed",
          href: `/products/${productId}`,
        });
      }
    }

    return notifications;
  }

  /* ------------------------------------------------------------------ */
  /* Promotions                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Coupons that are genuinely redeemable by this customer right now: active,
   * inside their start/expiry window, under the global usage cap, allowed by
   * their loyalty tier, and still within their personal redemption window.
   *
   * The tier compared here uses the same thresholds the dashboard renders, so
   * an offer advertised in the feed is the one checkout will actually accept.
   */
  private async derivePromotions(
    coupons: CouponDoc[],
    tierName: string,
    userRef: Types.ObjectId,
    now: Date
  ): Promise<CustomerNotification[]> {
    const eligible = coupons.filter((coupon) => {
      if (coupon.starts_at && new Date(coupon.starts_at) > now) return false;
      if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) return false;
      if (coupon.min_tier && tierRank(tierName) < tierRank(coupon.min_tier)) return false;
      return true;
    });

    const notifications: CustomerNotification[] = [];

    for (const coupon of eligible) {
      if (notifications.length >= PROMO_LIMIT) break;

      if (coupon.per_user_limit !== null && coupon.per_user_limit !== undefined) {
        const windowDays = coupon.per_user_window_days ?? 30;
        const windowStart = new Date(now.getTime() - windowDays * 86_400_000);
        const redemptions = await OrderModel.countDocuments({
          user_id: userRef,
          coupon_id: coupon._id,
          created_at: { $gte: windowStart },
        });
        if (redemptions >= coupon.per_user_limit) continue;
      }

      const isPercentage = coupon.discount_type === DiscountTypeEnum.percentage;
      const headline = isPercentage
        ? `${coupon.value}% off with code ${coupon.code}`
        : `Rs. ${money(coupon.value)} off with code ${coupon.code}`;

      const qualifiers: string[] = [];
      if (isPercentage && coupon.max_discount !== null && coupon.max_discount !== undefined) {
        qualifiers.push(`capped at Rs. ${money(coupon.max_discount)}`);
      }
      if (coupon.min_order_amount > 0) {
        qualifiers.push(`on orders from Rs. ${money(coupon.min_order_amount)}`);
      }

      notifications.push({
        key: `coupon:${coupon._id}`,
        category: CustomerNotificationCategoryEnum.promotions,
        title: isPercentage
          ? `${coupon.code}: ${coupon.value}% off`
          : `${coupon.code}: Rs. ${money(coupon.value)} off`,
        message: `${headline}${
          qualifiers.length ? `, ${qualifiers.join(", ")}` : ""
        }, valid until ${shortDate(coupon.expiry_date)}.`,
        timestamp: coupon.created_at,
        timestampLabel: "Offer added",
        href: "/products",
      });
    }

    return notifications;
  }
}

/* -------------------------------------------------------------------- */
/* Query result shapes                                                   */
/* -------------------------------------------------------------------- */

type OrderDoc = OrderInterface;
type WishlistDoc = WishlistInterface;
type CartDoc = CartInterface;
type CouponDoc = CouponInterface;

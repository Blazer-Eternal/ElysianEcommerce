import { useMemo } from "react";
import { Link } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routes";
import { useMyOrders } from "../../hooks/useMyOrders";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import type { Order, PaymentMethod, PaymentStatus } from "../../types/order.types";
import {
  AlertIcon,
  ArrowRightIcon,
  BanknoteIcon,
  BoxIcon,
  CheckIcon,
  CreditCardIcon,
  ZapIcon,
} from "../../components/icons";

const CARD = "rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)]";

/**
 * Payment methods the storefront actually supports. The order schema only ever
 * records `cod` or `esewa`, so this list is derived from the customer's own
 * orders rather than a saved-card vault — none exists in this system.
 */
const METHOD_META: Record<PaymentMethod, { label: string; blurb: string; icon: React.ReactNode; iconClassName: string }> = {
  cod: {
    label: "Cash on Delivery",
    blurb: "Pay the courier when your order arrives.",
    icon: <BanknoteIcon size={20} />,
    iconClassName: "bg-green-50 text-green-600",
  },
  esewa: {
    label: "eSewa",
    blurb: "Paid online through the eSewa gateway at checkout.",
    icon: <ZapIcon size={20} />,
    iconClassName: "bg-amber-50 text-amber-500",
  },
};

const STATUS_META: Record<PaymentStatus, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-green-50 text-green-700" },
  unpaid: { label: "Due", className: "bg-amber-50 text-amber-700" },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-600" },
};

const Payments = () => {
  const { data: ordersData, isLoading } = useMyOrders();

  const orders = useMemo(() => ordersData?.data ?? [], [ordersData]);

  // Methods actually seen on this customer's orders, most recently used first.
  const methods = useMemo(() => {
    const buckets = new Map<PaymentMethod, { count: number; lastUsed: string }>();
    for (const order of orders) {
      const current = buckets.get(order.payment_method) ?? { count: 0, lastUsed: order.created_at };
      current.count += 1;
      // Orders arrive newest-first, so the first sighting is the latest use.
      buckets.set(order.payment_method, current);
    }
    return [...buckets.entries()]
      .map(([method, stats]) => ({ method, ...stats }))
      .sort((a, b) => +new Date(b.lastUsed) - +new Date(a.lastUsed));
  }, [orders]);

  const totals = useMemo(() => {
    let paid = 0;
    let due = 0;
    for (const order of orders) {
      if (order.payment_status === "paid") paid += order.total_amount;
      else if (order.payment_status === "unpaid") due += order.total_amount;
    }
    return { paid, due };
  }, [orders]);

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="py-24">
          <Spinner size="lg" />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <section className={CARD}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CreditCardIcon size={22} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment methods</h1>
                <p className="text-sm text-gray-500">
                  How you pay, and every payment you have made.
                </p>
              </div>
            </div>

            {orders.length > 0 && (
              <div className="flex gap-2">
                <div className="rounded-xl border border-[#ece1d0] bg-cream px-4 py-2.5 text-right">
                  <p className="text-[11px] font-medium text-gray-500">Settled</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(totals.paid)}</p>
                </div>
                <div className="rounded-xl border border-[#ece1d0] bg-cream px-4 py-2.5 text-right">
                  <p className="text-[11px] font-medium text-gray-500">Outstanding</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(totals.due)}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Methods used */}
        <section className={CARD}>
          <h2 className="text-base font-bold text-gray-900">Methods you have used</h2>

          {methods.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-sand bg-cream/60 p-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink/40">
                <CreditCardIcon size={22} />
              </span>
              <p className="mt-3 text-sm font-semibold text-gray-900">No payments yet</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                Your payment methods will be listed here once you place your first order.
              </p>
              <Link
                to={ROUTES.PRODUCTS}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Browse the catalog <ArrowRightIcon size={15} />
              </Link>
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {methods.map(({ method, count, lastUsed }) => {
                const meta = METHOD_META[method];
                return (
                  <li
                    key={method}
                    className="flex items-start gap-3 rounded-xl border border-[#ece1d0] bg-cream/60 p-4"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.iconClassName}`}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{meta.blurb}</p>
                      <p className="mt-2 text-[11px] font-medium text-gray-500">
                        Used on {count} order{count === 1 ? "" : "s"} · last on{" "}
                        {formatDate(lastUsed)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-cream/70 px-4 py-3 text-xs leading-relaxed text-gray-500">
            <AlertIcon size={14} className="mt-0.5 shrink-0 text-ink/45" />
            <span>
              This store takes Cash on Delivery and eSewa only — card numbers are never stored on
              your account, so there is no card vault to manage.
            </span>
          </p>
        </section>

        {/* Payment history */}
        <section className={CARD}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-gray-900">Payment history</h2>
            <Link
              to={ROUTES.ORDER_HISTORY}
              className="text-sm font-semibold text-brand hover:text-brand-dark hover:underline"
            >
              View all orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-sand bg-cream px-4 py-8 text-center text-sm text-gray-500">
              Once an order is placed, every payment against it is listed here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-cream-deep">
              {orders.map((order: Order) => {
                const method = METHOD_META[order.payment_method];
                const status = STATUS_META[order.payment_status];
                return (
                  <li key={order._id}>
                    <Link
                      to={ROUTES.ORDER_DETAIL(order._id)}
                      className="group flex flex-wrap items-center gap-x-4 gap-y-2 py-3 transition-colors"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <BoxIcon size={17} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-gray-900 group-hover:text-brand">
                          Order #{order.order_number}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {formatDate(order.created_at)} · {method.label} ·{" "}
                          {order.items.length} item{order.items.length === 1 ? "" : "s"}
                        </span>
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>

                      <span className="w-28 text-right text-sm font-bold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </span>

                      <ArrowRightIcon
                        size={16}
                        className="shrink-0 text-gray-300 transition-colors group-hover:text-brand"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {orders.length > 0 && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
              <CheckIcon size={13} /> Every row is read straight from your orders — nothing is
              recorded separately for payments.
            </p>
          )}
        </section>
      </div>
    </CustomerLayout>
  );
};

export default Payments;

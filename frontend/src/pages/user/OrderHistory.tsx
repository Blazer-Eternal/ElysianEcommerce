import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import OrderCard from "../../components/order/OrderCard";
import OrderTrackingModal from "../../components/order/OrderTrackingModal";
import MyReviews from "../../components/review/MyReviews";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { isActiveOrder } from "../../utils/customerDashboard";
import { useLoyalty } from "../../hooks/useLoyalty";
import type { Order } from "../../types/order.types";
import type { OrderFlag } from "../../types/loyalty.types";

/** Client-side views over the current page of orders; statuses stay untouched. */
const FILTERS = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "In Progress" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const matchesFilter = (order: Order, filter: FilterKey): boolean => {
  if (filter === "all") return true;
  if (filter === "in_progress") return isActiveOrder(order);
  return order.status === filter;
};

/**
 * "Orders and Reviews" — two views over the same corner of the portal.
 *
 * The Orders side is byte-for-byte the old order history (same query key,
 * same filter chips, same cards, same pagination); Reviews is a sibling tab
 * that lists the customer's own ratings with edit and delete.
 */
const OrderHistory = () => {
  const [tab, setTab] = useState<"orders" | "reviews">("orders");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", page],
    queryFn: ({ signal }) => orderService.getMyOrders(page, 10, { signal }),
  });

  // Per-order tier labels ("Counts", "Pending until …", "Doesn't count") come
  // from the same server engine that computes the tier, so the list always
  // matches the loyalty page.
  const { data: loyalty } = useLoyalty();
  const loyaltyFlags = useMemo(() => {
    const map = new Map<string, OrderFlag>();
    (loyalty?.orders ?? []).forEach((flag) => map.set(flag.order_id, flag));
    return map;
  }, [loyalty]);

  const orders = data?.data || [];
  const visibleOrders = orders.filter((order) => matchesFilter(order, filter));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
      {/* Header with the two tabs */}
      <div className="mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Orders and Reviews
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-gray-600">
            {tab === "orders"
              ? "View order history, track shipments, and follow delivery status"
              : "Everything you have rated, with the comments you left — all editable."}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Orders and reviews"
          className="mt-5 inline-flex rounded-full border border-sand bg-cream-deep p-1"
        >
          {([
            { key: "orders", label: "Orders" },
            { key: "reviews", label: "Reviews" },
          ] as const).map((option) => {
            const active = tab === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(option.key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand text-white shadow-[0_1px_3px_rgba(61,5,12,0.14)]"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "orders" ? (
        <>
          {/* Status view filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map((option) => {
              const isActive = filter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFilter(option.key)}
                  aria-pressed={isActive}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-brand text-white shadow-[0_1px_3px_rgba(61,5,12,0.14)]"
                      : "bg-cream-deep text-ink/70 hover:bg-sand hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="py-24">
              <Spinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-24 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-cream-deep to-cream">
                  <svg className="w-10 h-10 text-brand/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">No orders yet</p>
                  <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                </div>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-brand to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  <span>Browse Products</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Orders */}
              {visibleOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center">
                  <p className="text-sm font-semibold text-gray-900">No orders in this view</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Orders you place will show up here with live tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleOrders.map((order) => (
                    <div key={order._id} className="animate-fade-in">
                      <OrderCard
                        order={order}
                        onTrack={() => setTrackingOrder(order)}
                        loyaltyFlag={loyaltyFlags.get(order._id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data?.pagination && (
                <div className="mt-12 animate-fade-in">
                  <Pagination pagination={data.pagination} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="animate-fade-in">
          <MyReviews />
        </div>
      )}

      <OrderTrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
    </div>
  );
};

export default OrderHistory;

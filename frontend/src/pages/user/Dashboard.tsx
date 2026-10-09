import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import CustomerLayout from "../../components/layout/CustomerLayout";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import OrderTrackingModal from "../../components/order/OrderTrackingModal";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routes";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../constants/orderStatus";
import { useAuth } from "../../hooks/useAuth";
import { useMyOrders } from "../../hooks/useMyOrders";
import { useWishlist } from "../../hooks/useWishlist";
import { useCartActions } from "../../hooks/useCart";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, formatLongDate } from "../../utils/formatDate";
import { cloudinaryImg } from "../../utils/imageUrl";
import {
  getActiveOrders,
  getActiveShipment,
  getRepeatBuys,
  getTotalSpent,
} from "../../utils/customerDashboard";
import { getTrackingSteps, trackingCircleClass, type TrackingStep } from "../../utils/orderTracking";
import { useLoyalty } from "../../hooks/useLoyalty";
import type { Order } from "../../types/order.types";
import {
  ArrowRightIcon,
  BagIcon,
  BanknoteIcon,
  BoxIcon,
  CheckIcon,
  CrownIcon,
  CreditCardIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  PlusIcon,
  StarIcon,
  TruckIcon,
} from "../../components/icons";

/** Shared panel skin for every card in the bento grid. */
const CARD = "rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)]";

const QUICK_ACTIONS: Array<{ label: string; to: string; icon: React.ReactNode; iconClassName: string }> = [
  { label: "Browse the catalog", to: ROUTES.PRODUCTS, icon: <BagIcon size={18} />, iconClassName: "bg-amber-50 text-amber-500" },
  { label: "Review your orders", to: ROUTES.ORDER_HISTORY, icon: <BoxIcon size={18} />, iconClassName: "bg-green-50 text-green-600" },
  { label: "Manage addresses", to: ROUTES.ADDRESSES, icon: <MapPinIcon size={18} />, iconClassName: "bg-brand/10 text-brand" },
  { label: "Payment methods", to: ROUTES.PAYMENTS, icon: <CreditCardIcon size={18} />, iconClassName: "bg-rose/10 text-rose" },
  { label: "Redeem loyalty rewards", to: ROUTES.LOYALTY, icon: <GiftIcon size={18} />, iconClassName: "bg-cyan-100 text-cyan-700" },
];

/** Green check once a milestone is reached; the step's own icon otherwise. */
const stepGlyph = (step: TrackingStep) => {
  if (step.state === "done") return <CheckIcon size={16} />;
  if (step.status === "shipped") return <TruckIcon size={16} />;
  if (step.status === "delivered") return <HomeIcon size={16} />;
  return <CheckIcon size={16} />;
};

interface StatCardProps {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  hint: string;
}

const StatCard = ({ icon, iconClassName, label, value, hint }: StatCardProps) => (
  <div className="rounded-2xl border border-[#ece1d0] bg-white p-5 shadow-[0_2px_16px_rgba(61,5,12,0.06)] transition-shadow hover:shadow-[0_6px_24px_rgba(61,5,12,0.1)]">
    <div className="flex items-start gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 truncate text-xl font-bold text-gray-900">{value}</p>
        <p className="mt-0.5 truncate text-[11px] text-gray-400">{hint}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { addItem } = useCartActions();
  const { items: wishlistItems } = useWishlist();
  const { data: ordersData, isLoading } = useMyOrders();
  const { data: loyalty } = useLoyalty();

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    []
  );

  const orders = useMemo(() => ordersData?.data ?? [], [ordersData]);

  const totalSpent = useMemo(() => getTotalSpent(orders), [orders]);
  const activeOrders = useMemo(() => getActiveOrders(orders), [orders]);
  const shipment = useMemo(() => getActiveShipment(orders), [orders]);
  const repeatBuys = useMemo(() => getRepeatBuys(orders), [orders]);
  const steps = useMemo(() => (shipment ? getTrackingSteps(shipment) : []), [shipment]);

  // Product records only supply the photo, current price and stock for the
  // "Buy it again" rows, the order lines themselves carry the name/price paid.
  const productQueries = useQueries({
    queries: repeatBuys.map((item) => ({
      queryKey: ["product", item.productId],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        productService.getById(item.productId, { signal }),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  // Tier, cycle and points are all derived server-side from the order
  // history. This snapshot quotes the same numbers as the loyalty page.
  const loyaltyTier = loyalty?.tier ?? null;
  const loyaltyPoints = loyalty?.points.available ?? 0;
  const spendProgress =
    loyalty?.checklist.find((item) => item.key === "spend")?.progress ?? 0;
  const nextTier = loyalty?.nextTier ?? null;
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const handleAddToCart = async (productId: string) => {
    setAddingId(productId);
    try {
      await addItem(productId, 1);
      setAddedId(productId);
      if (addedTimer.current) clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setAddedId(null), 2500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingId(null);
    }
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="py-24">
          <Spinner size="lg" />
        </div>
      </CustomerLayout>
    );
  }

  const currentIndex = steps.findIndex((step) => step.state === "current");
  const activeCount = activeOrders.length;
  const countedOrders = orders.filter((order) => order.status !== "cancelled").length;

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Greeting header */}
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {activeCount > 0
                ? `You have ${activeCount} active order${activeCount === 1 ? "" : "s"} on the way`
                : "Nothing is on the way right now"}
            </p>
          </div>
          <p className="text-sm font-medium text-gray-500">{formatLongDate()}</p>
        </header>

        {/*
          Bento grid, in reading order: the four key numbers, the active
          shipment, recent orders, the loyalty snapshot, quick actions, and
          finally the repeat-buy rail.
        */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {/* Key numbers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 xl:col-span-4 xl:grid-cols-4">
            <StatCard
              icon={<BanknoteIcon size={22} />}
              iconClassName="bg-cyan-100 text-cyan-700"
              label="Total Spent"
              value={formatCurrency(totalSpent)}
              hint={`across ${countedOrders} order${countedOrders === 1 ? "" : "s"}`}
            />
            <StatCard
              icon={<TruckIcon size={22} />}
              iconClassName="bg-green-50 text-green-600"
              label="Active Orders"
              value={`${activeCount} Order${activeCount === 1 ? "" : "s"}`}
              hint={activeCount > 0 ? "being processed or shipped" : "nothing in transit"}
            />
            <StatCard
              icon={<StarIcon size={22} />}
              iconClassName="bg-amber-50 text-amber-500"
              label="Loyalty Points"
              value={`${loyaltyPoints.toLocaleString("en-IN")} pts`}
              hint={
                loyaltyTier && loyaltyTier.index >= 0
                  ? `earned at your ${loyaltyTier.name} tier rate`
                  : "earn points from every delivered order"
              }
            />
            <StatCard
              icon={<HeartIcon size={22} />}
              iconClassName="bg-brand/10 text-brand"
              label="Wishlist Items"
              value={`${wishlistItems.length} Saved`}
              hint="products you are watching"
            />
          </div>

          {/* Active shipment, live tracking hero */}
          {shipment && currentIndex >= 0 ? (
            <section className={`${CARD} lg:col-span-2 xl:col-span-4`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <Badge className={`uppercase tracking-wide ${ORDER_STATUS_COLORS[shipment.status]}`}>
                    {ORDER_STATUS_LABELS[shipment.status]}
                  </Badge>
                  <h2 className="mt-3 text-2xl font-bold text-gray-900">
                    Order #{shipment.order_number}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Placed {formatDate(shipment.created_at)} · {shipment.items.length} item
                    {shipment.items.length === 1 ? "" : "s"} · {formatCurrency(shipment.total_amount)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTrackingOrder(shipment)}
                  className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_3px_rgba(61,5,12,0.14)] transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  Live Tracking Details
                  <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <hr className="my-5 border-[#ece1d0]" />

              <ol className="grid grid-cols-4">
                {steps.map((step, index) => (
                  <li key={step.status} className="relative flex flex-col items-center px-1 text-center">
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden
                        className={`absolute top-5 left-1/2 z-0 h-0.75 w-full -translate-y-1/2 ${
                          index < currentIndex ? "bg-green-500" : "bg-sand"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${trackingCircleClass[step.state]}`}
                    >
                      {stepGlyph(step)}
                    </span>
                    <span
                      className={`mt-3 text-xs font-semibold ${
                        step.state === "current"
                          ? "text-brand"
                          : step.state === "upcoming"
                            ? "text-gray-400"
                            : "text-gray-900"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-tight text-gray-400">
                      {step.detail ?? "\u00A0"}
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-5 text-sm text-gray-600">
                Status:{" "}
                <span className="font-semibold text-gray-900">{steps[currentIndex].label}</span>.
                Updates appear here as soon as the carrier scans your parcel.
              </p>
            </section>
          ) : (
            <section className={`${CARD} flex flex-col justify-center lg:col-span-2 xl:col-span-4`}>
              <p className="text-xs font-bold uppercase tracking-wide text-gold">Active Shipment</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">No package in transit</h2>
              <p className="mt-2 text-sm text-gray-600">
                Every order you place shows its live tracking steps right here.
              </p>
              <Link
                to={ROUTES.ORDER_HISTORY}
                className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark hover:underline"
              >
                View order history <ArrowRightIcon size={16} />
              </Link>
            </section>
          )}

          {/* Recent order updates */}
          <section className={`${CARD} lg:col-span-2 xl:col-span-4`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
              <Link
                to={ROUTES.ORDER_HISTORY}
                className="text-sm font-semibold text-brand hover:text-brand-dark hover:underline"
              >
                View all
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-sand bg-cream px-4 py-6 text-center text-sm text-gray-500">
                No orders yet. Once you place one, its status shows up here.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {orders.slice(0, 4).map((order) => (
                  <Link
                    key={order._id}
                    to={ROUTES.ORDER_DETAIL(order._id)}
                    className="group flex items-center gap-3 rounded-xl border border-[#ece1d0] bg-cream px-4 py-3 transition-colors hover:border-brand/30 hover:bg-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <BoxIcon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">
                        Order #{order.order_number}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-gray-500">
                        {formatDate(order.created_at)} · {formatCurrency(order.total_amount)}
                      </span>
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <ArrowRightIcon size={16} className="shrink-0 text-gray-400 transition-colors group-hover:text-brand" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Loyalty snapshot, full details live on the dedicated Loyalty & Rewards page */}
          <section className={`${CARD} flex flex-col lg:col-span-1 xl:col-span-2`}>
            <h2 className="text-base font-bold text-gray-900">Loyalty Snapshot</h2>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                <CrownIcon size={12} />
                {loyaltyTier && loyaltyTier.index >= 0 ? `${loyaltyTier.name} Tier` : "Registered"}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {loyaltyPoints.toLocaleString("en-IN")} pts
              </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-linear-to-r from-brand to-cyan-600 transition-all duration-700"
                style={{ width: `${Math.round(spendProgress * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {nextTier
                ? `${formatCurrency(Math.max(0, nextTier.requirements.spend - (loyalty?.counters.spend ?? 0)))} in qualifying spend to ${nextTier.name}`
                : "top tier reached"}
            </p>
            <Link
              to={ROUTES.LOYALTY}
              className="mt-auto w-fit rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
            >
              View rewards
            </Link>
          </section>

          {/* Quick actions */}
          <section className={`${CARD} lg:col-span-1 xl:col-span-2`}>
            <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-2.5">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="group flex items-center gap-3 rounded-xl border border-[#ece1d0] bg-cream px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-brand/30 hover:bg-white hover:text-brand"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.iconClassName}`}>
                    {action.icon}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{action.label}</span>
                  <ArrowRightIcon size={16} className="shrink-0 text-gray-400 transition-colors group-hover:text-brand" />
                </Link>
              ))}
            </div>
          </section>

          {/* Buy it again */}
          <section className={`${CARD} lg:col-span-2 xl:col-span-4`}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">Buy It Again</h2>
              <Link
                to={ROUTES.ORDER_HISTORY}
                className="text-sm font-semibold text-brand hover:text-brand-dark hover:underline"
              >
                View All History
              </Link>
            </div>

            {repeatBuys.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-sand bg-white p-8 text-center text-sm text-gray-500">
                Once you have placed an order, your past purchases will appear here for a one-tap re-order.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {repeatBuys.map((item, index) => {
                  const product = productQueries[index]?.data?.data;
                  const imageUrl = product?.images?.[0] || "/placeholder.svg";
                  const price = product?.price ?? item.unitPrice;
                  const outOfStock = product ? product.stock === 0 : false;
                  const isAdding = addingId === item.productId;
                  const justAdded = addedId === item.productId;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-start gap-4 rounded-2xl border border-[#ece1d0] bg-white p-4 shadow-[0_2px_16px_rgba(61,5,12,0.06)] transition-shadow hover:shadow-[0_6px_24px_rgba(61,5,12,0.1)]"
                    >
                      <Link
                        to={ROUTES.PRODUCT_DETAIL(item.productId)}
                        className="shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-cyan-50 to-[#f7ecdb]"
                      >
                        <img
                          src={cloudinaryImg(imageUrl, 160)}
                          alt={product?.name ?? item.name}
                          width={72}
                          height={72}
                          loading="lazy"
                          className="h-16 w-16 object-cover sm:h-18 sm:w-18"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={ROUTES.PRODUCT_DETAIL(item.productId)}
                          className="block truncate text-sm font-semibold text-gray-900 hover:text-brand"
                        >
                          {product?.name ?? item.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-gray-500">{formatCurrency(price)}</p>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item.productId)}
                          disabled={isAdding || outOfStock}
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark disabled:cursor-not-allowed disabled:text-gray-400"
                        >
                          {outOfStock ? (
                            "Out of stock"
                          ) : justAdded ? (
                            <>
                              <CheckIcon size={16} /> Added to cart
                            </>
                          ) : (
                            <>
                              <PlusIcon size={16} /> {isAdding ? "Adding..." : "Add to Cart"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      <OrderTrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
    </CustomerLayout>
  );
};

export default Dashboard;

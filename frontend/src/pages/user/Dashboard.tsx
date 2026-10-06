import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useMyOrders } from "../../hooks/useMyOrders";
import { useWishlist } from "../../hooks/useWishlist";
import { useCartActions } from "../../hooks/useCart";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { cloudinaryImg } from "../../utils/imageUrl";
import {
  getActiveOrders,
  getActiveShipment,
  getRepeatBuys,
  getTotalSpent,
} from "../../utils/customerDashboard";
import { getLoyaltyPoints, getTierStatus, POINTS_PER_UNIT } from "../../utils/loyalty";
import type { OrderStatus } from "../../types/order.types";
import {
  ArrowRightIcon,
  BanknoteIcon,
  BoxIcon,
  CheckIcon,
  HeartIcon,
  HomeIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
} from "../../components/icons";

/* Shipment stepper — maps 1:1 onto the backend's OrderStatus values. */
const SHIPMENT_STEPS: Array<{ status: OrderStatus; label: string; glyph: React.ReactNode }> = [
  { status: "pending", label: "Placed", glyph: <CheckIcon size={16} /> },
  { status: "paid", label: "Processed", glyph: <CheckIcon size={16} /> },
  { status: "shipped", label: "In Transit", glyph: <TruckIcon size={16} /> },
  { status: "delivered", label: "Delivered", glyph: <HomeIcon size={16} /> },
];

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

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
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

  // Product records only supply the photo, current price and stock for the
  // "Buy it again" rows — the order lines themselves carry the name/price paid.
  const productQueries = useQueries({
    queries: repeatBuys.map((item) => ({
      queryKey: ["product", item.productId],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        productService.getById(item.productId, { signal }),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  const loyaltyPoints = getLoyaltyPoints(totalSpent);
  const { tier, next, progress } = getTierStatus(totalSpent);
  const firstName = user?.name?.split(" ")[0] ?? "there";

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

  const currentIndex = shipment ? SHIPMENT_STEPS.findIndex((step) => step.status === shipment.status) : -1;
  const activeCount = activeOrders.length;
  const countedOrders = orders.filter((order) => order.status !== "cancelled").length;

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#7a0f1c] via-[#b01a2a] to-[#b5691f] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-white/5" />

          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            Welcome Back
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Glad to see you, {firstName}! 👋
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {activeCount > 0 ? (
              <>
                You have <strong className="font-semibold">{activeCount} active package{activeCount === 1 ? "" : "s"}</strong>{" "}
                currently being prepared or shipped. Check live tracking below or manage your recent
                purchases.
              </>
            ) : (
              <>
                Nothing is on the way right now — review your past orders below or discover something
                new in the catalog.
              </>
            )}
          </p>
        </section>

        {/* Key numbers */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            hint={`1 pt per Rs. ${POINTS_PER_UNIT} spent`}
          />
          <StatCard
            icon={<HeartIcon size={22} />}
            iconClassName="bg-brand/10 text-brand"
            label="Wishlist Items"
            value={`${wishlistItems.length} Saved`}
            hint="products you are watching"
          />
        </section>

        {/* Active shipment */}
        <section className="rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gold">Active Shipment</p>
              {shipment ? (
                <>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">Order #{shipment.order_number}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(shipment.created_at)} · {shipment.items.length} item
                    {shipment.items.length === 1 ? "" : "s"} · {formatCurrency(shipment.total_amount)}
                  </p>
                </>
              ) : (
                <h2 className="mt-1 text-2xl font-bold text-gray-900">No package in transit</h2>
              )}
            </div>
            {shipment && (
              <Link
                to={ROUTES.ORDER_DETAIL(shipment._id)}
                className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
              >
                Detailed Status
              </Link>
            )}
          </div>

          <hr className="my-5 border-[#ece1d0]" />

          {shipment && currentIndex >= 0 ? (
            <>
              <ol className="flex items-start">
                {SHIPMENT_STEPS.map((step, index) => {
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  return (
                    <li
                      key={step.status}
                      className="relative flex flex-1 flex-col items-center text-center last:flex-none"
                    >
                      {index < SHIPMENT_STEPS.length - 1 && (
                        <span
                          aria-hidden
                          className={`absolute left-1/2 top-3.75 z-0 h-0.75 w-full ${
                            index < currentIndex ? "bg-brand" : "bg-sand"
                          }`}
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                          isCompleted
                            ? isCurrent
                              ? "bg-brand text-white ring-4 ring-brand/15"
                              : "bg-brand text-white"
                            : "bg-sand text-gray-400"
                        }`}
                      >
                        {step.glyph}
                      </span>
                      <span
                        className={`mt-2 text-[11px] font-semibold sm:text-xs ${
                          isCompleted ? (isCurrent ? "text-brand" : "text-gray-900") : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-5 text-sm text-gray-600">
                Status:{" "}
                <span className="font-semibold text-gray-900">
                  {shipment.status === "delivered" ? "Delivered" : SHIPMENT_STEPS[currentIndex].label}
                </span>{" "}
                — updates appear here as soon as the carrier scans your parcel.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Every order you place shows its live tracking steps right here.
              </p>
              <Link
                to={ROUTES.ORDER_HISTORY}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark hover:underline"
              >
                View order history <ArrowRightIcon size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* Buy it again */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Buy It Again</h2>
            <Link to={ROUTES.ORDER_HISTORY} className="text-sm font-semibold text-brand hover:text-brand-dark hover:underline">
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
                      className="shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-[#fdf8f0] to-[#f7ecdb]"
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

        {/* Loyalty & rewards */}
        <section id="rewards" className="rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)] scroll-mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <SparklesIcon size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Loyalty &amp; Rewards</h2>
                <p className="text-sm text-gray-500">
                  You are on the <span className="font-semibold text-gray-800">{tier.name}</span> tier with{" "}
                  <span className="font-semibold text-gray-800">{loyaltyPoints.toLocaleString("en-IN")} points</span>.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {tier.name} Tier
            </span>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>{tier.name}</span>
              <span>
                {next ? `${formatCurrency(Math.max(0, next.minSpend - totalSpent))} to ${next.name}` : "Top tier reached"}
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-deep">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-amber-500 transition-all duration-700"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Earn 1 point for every Rs. {POINTS_PER_UNIT} spent on non-cancelled orders — points and tier are
              calculated from your real order history.
            </p>
          </div>
        </section>

        {/* Quick links */}
        <section className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-3">
          {[
            { to: ROUTES.ORDER_HISTORY, icon: <BoxIcon size={18} />, label: "All Orders" },
            { to: ROUTES.WISHLIST, icon: <HeartIcon size={18} />, label: "Wishlist" },
            { to: ROUTES.PROFILE, icon: <StarIcon size={18} />, label: "Profile & Addresses" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="flex items-center gap-3 rounded-2xl border border-[#ece1d0] bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-brand/40 hover:text-brand"
            >
              <span className="text-brand">{link.icon}</span>
              {link.label}
              <ArrowRightIcon size={16} className="ml-auto text-sand" />
            </Link>
          ))}
        </section>
      </div>
    </CustomerLayout>
  );
};

export default Dashboard;

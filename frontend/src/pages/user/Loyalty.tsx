import { useMemo } from "react";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Spinner from "../../components/ui/Spinner";
import { useMyOrders } from "../../hooks/useMyOrders";
import {
  getLoyaltyPoints,
  getTierStatus,
  TIERS,
} from "../../utils/loyalty";
import { getTotalSpent } from "../../utils/customerDashboard";
import { formatCurrency } from "../../utils/formatCurrency";
import { SparklesIcon } from "../../components/icons";

const TIER_PERKS: Record<string, string> = {
  Bronze: "0.5% back in points, free standard delivery above Rs. 5,000",
  Gold: "1% back in points, GOLD10 coupon, free delivery above Rs. 2,000",
  Platinum: "1.5% back in points, PLAT12 coupon, free delivery on all orders",
  Diamond: "2% back in points, DIAMOND15 coupon, free express delivery",
};

const Loyalty = () => {
  const { data: ordersData, isLoading } = useMyOrders();
  const orders = useMemo(() => ordersData?.data ?? [], [ordersData]);
  const totalSpent = useMemo(() => getTotalSpent(orders), [orders]);
  const loyaltyPoints = getLoyaltyPoints(totalSpent);
  const { tier, next, progress } = getTierStatus(totalSpent);

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
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <section className="rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <SparklesIcon size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Loyalty &amp; Rewards</h1>
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

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>{tier.name}</span>
              <span>
                {next
                  ? `${formatCurrency(Math.max(0, next.minSpend - totalSpent))} to ${next.name}`
                  : "Top tier reached"}
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-deep">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-amber-500 transition-all duration-700"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Earn points worth 0.5% to 2% back depending on your tier, 1 point equals Rs. 1, on non-cancelled
              orders. Points and tier are calculated from your real order history. Lifetime spend: {formatCurrency(totalSpent)}.
            </p>
          </div>
        </section>

        {/* Tier ladder */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Tier ladder</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {TIERS.map((t) => {
              const active = t.name === tier.name;
              return (
                <div
                  key={t.name}
                  className={`rounded-2xl border p-5 transition-shadow ${
                    active
                      ? "border-brand bg-brand/5 shadow-[0_6px_24px_rgba(192,30,46,0.12)]"
                      : "border-[#ece1d0] bg-white shadow-[0_2px_16px_rgba(61,5,12,0.06)]"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-500">Qualifying spend</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {t.minSpend === 0 ? "Free" : formatCurrency(t.minSpend)}+
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-gray-900">{t.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{TIER_PERKS[t.name]}</p>
                  {active && (
                    <span className="mt-4 inline-flex rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                      Current tier
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
};

export default Loyalty;

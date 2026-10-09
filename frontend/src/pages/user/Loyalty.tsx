import { useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckIcon,
  CoinsIcon,
  GiftIcon,
  GemIcon,
  SparklesIcon,
  StarIcon,
} from "../../components/icons";
import { useLoyalty } from "../../hooks/useLoyalty";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  POINTS_RULES,
  RETURN_WINDOW_DAYS,
  TIER_LEVELS,
  type TierLevel,
} from "../../utils/loyalty";
import type { TierName } from "../../types/loyalty.types";

/** Join truthy class fragments — the codebase has no shared cn helper. */
const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");

/** The tiers a customer climbs to — Registered is where everyone starts. */
const EARNED_TIERS: TierLevel[] = TIER_LEVELS;

const TIER_ICONS: Record<TierLevel["name"], ReactNode> = {
  Bronze: <CoinsIcon className="h-5 w-5" />,
  Gold: <StarIcon className="h-5 w-5" />,
  Platinum: <SparklesIcon className="h-5 w-5" />,
  Diamond: <GemIcon className="h-5 w-5" />,
};

const TIER_BADGES: Record<TierName, string> = {
  Registered: "bg-cyan-100 text-cyan-800",
  Bronze: "bg-cyan-200 text-cyan-900",
  Gold: "bg-gold/15 text-gold-dark",
  Platinum: "bg-teal-100 text-teal-800",
  Diamond: "bg-teal-600 text-white",
};

const TIER_GLOW: Record<TierName, string> = {
  Registered: "bg-linear-to-br from-cyan-100 to-cyan-300 text-cyan-800",
  Bronze: "bg-linear-to-br from-cyan-300 to-cyan-600 text-white",
  Gold: "bg-linear-to-br from-gold/40 to-gold text-gold-dark",
  Platinum: "bg-linear-to-br from-teal-300 to-teal-600 text-white",
  Diamond: "bg-linear-to-br from-teal-500 to-teal-900 text-white",
};

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** The requirement rows shown on the floating card, built from one tier. */
function requirementRows(tier: TierLevel) {
  const rows = [
    { label: "Minimum spend", value: `${formatCurrency(tier.spend)} in a cycle` },
    { label: "Qualifying orders", value: `${tier.orders} orders` },
    {
      label: "Active months",
      value: `${tier.activeMonths} months with a qualifying order`,
    },
  ];
  if (tier.returnRate !== null) {
    rows.push({
      label: "Return / cancel rate",
      value: `20% or less of settled orders`,
    });
  }
  return rows;
}

export default function Loyalty() {
  const navigate = useNavigate();
  const { data: loyalty, isLoading, error } = useLoyalty();

  const tier = loyalty?.tier;
  const cycle = loyalty?.cycle;
  const checklist = loyalty?.checklist ?? [];
  const history = loyalty?.history ?? [];

  /**
   * The callout sits under the tier being worked towards: the current level
   * once earned, otherwise Bronze — the first one to unlock.
   */
  const calloutTier = useMemo<TierLevel | null>(() => {
    if (!tier) return null;
    if (tier.index >= 0) return TIER_LEVELS[tier.index] ?? null;
    return EARNED_TIERS[0] ?? null;
  }, [tier]);
  const calloutColumn = useMemo(() => {
    if (!calloutTier) return 1;
    return EARNED_TIERS.findIndex((t) => t.name === calloutTier.name) + 1;
  }, [calloutTier]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-44 rounded-3xl bg-cream-deep" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-cream-deep" />
            ))}
          </div>
          <div className="h-64 rounded-3xl bg-cream-deep" />
        </div>
      </div>
    );
  }

  if (error || !loyalty || !tier) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-3xl text-ink">
          We couldn't load your loyalty status
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          Your tier and points are safe. Please refresh the page or try again in
          a moment.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
        >
          Try again
        </button>
      </div>
    );
  }

  const points = loyalty.points;
  const expiringSoon = points.expiring;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* ============ HEADER ============ */}
      <section className="relative overflow-hidden rounded-3xl border border-gold/15 bg-linear-to-br from-cream via-cream-deep to-cream px-6 py-8 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(209,128,41,0.14),transparent_55%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg",
                  TIER_GLOW[tier.name]
                )}
              >
                <GemIcon className="h-8 w-8" />
              </div>
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow ring-1 ring-gold/30">
                <SparklesIcon className="h-3.5 w-3.5 text-gold" />
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark">
                Elysian
              </p>
              <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">
                Loyalty &amp; Rewards
              </h1>
              <p className="mt-1.5 text-sm text-ink/60">
                Earn points with every order, climb the tiers, unlock exclusive
                rewards.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium",
                TIER_BADGES[tier.name]
              )}
            >
              {tier.index >= 0 ? `${tier.name} Tier` : "Registered"}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/rewards")}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
              >
                Redeem Points
              </button>
              <button
                onClick={() => navigate("/compare-benefits")}
                className="rounded-full border border-gold/40 bg-white px-5 py-2.5 text-sm font-medium text-gold-dark transition hover:bg-cream-deep"
              >
                Compare Benefits
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TIER PROGRESS RAIL + REQUIREMENTS CALLOUT ============ */}
      <section className="rounded-3xl border border-ink/8 bg-white px-4 py-8 sm:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {EARNED_TIERS.map((level, i) => {
            const isCurrent = tier.name === level.name;
            const isComplete = tier.index > i;
            const isLocked = tier.index < i;
            return (
              <div
                key={level.name}
                className={cn(
                  "relative flex flex-col items-center text-center",
                  isLocked ? "text-ink/55" : "text-ink"
                )}
              >
                {/* connector to the next tier, desktop only */}
                {!isLocked && i < EARNED_TIERS.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-6 left-1/2 hidden h-0.5 w-[calc(100%+1rem)] lg:block",
                      isComplete
                        ? "bg-linear-to-r from-gold/60 to-gold"
                        : "bg-linear-to-r from-gold/60 to-gold/25"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition",
                    isCurrent
                      ? "scale-105 border-gold bg-linear-to-br from-gold/40 to-gold text-gold-dark shadow-lg shadow-gold/30"
                      : isComplete
                        ? "border-gold bg-linear-to-br from-gold/25 to-gold/60 text-gold-dark"
                        : "border-ink/15 bg-white text-ink/40"
                  )}
                >
                  {isComplete ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    TIER_ICONS[level.name]
                  )}
                </span>
                <span
                  className={cn(
                    "mt-3 text-sm font-medium",
                    isCurrent && "text-gold-dark"
                  )}
                >
                  {level.name}
                </span>
                <span className="mt-1 text-xs text-ink/55">
                  Free delivery from {formatCurrency(level.freeDeliveryFrom)}
                </span>
              </div>
            );
          })}

          {/* Requirements callout — aligned under the tier it describes */}
          {calloutTier && (
            <div
              className={cn(
                "col-span-2 lg:col-span-1",
                calloutColumn === 1 && "lg:col-start-1",
                calloutColumn === 2 && "lg:col-start-2",
                calloutColumn === 3 && "lg:col-start-3",
                calloutColumn === 4 && "lg:col-start-4"
              )}
            >
              <div className="relative mx-auto w-full max-w-80 rounded-2xl border border-gold/25 bg-cream px-5 py-4 shadow-sm">
                <span
                  aria-hidden
                  className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-gold/25 bg-cream"
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
                  {calloutTier.name} Tier requirements
                </p>
                <ul className="mt-3 space-y-2">
                  {requirementRows(calloutTier).map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-ink/70">{row.label}</span>
                      <span className="text-right font-medium text-ink">
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
                {cycle && (
                  <p className="mt-3 border-t border-ink/10 pt-2.5 text-xs text-ink/55">
                    Your current cycle runs until{" "}
                    <span className="font-medium text-ink">
                      {formatDate(cycle.end) ?? "—"}
                    </span>
                    . Spend, orders and active months in this window decide
                    whether you hold this level or move up.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ CURRENT CYCLE ============ */}
      <section className="overflow-hidden rounded-3xl border border-ink/8 bg-white">
        <div className="flex flex-col gap-2 border-b border-ink/8 bg-cream-deep px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="font-serif text-2xl text-ink">My current cycle</h2>
            <p className="mt-1 text-sm text-ink/60">
              {tier.index >= 0
                ? `You're in your ${tier.name.toLowerCase()} tier cycle.`
                : "Your first cycle began when you created your account."}{" "}
              Counters reset when a new cycle begins.
            </p>
          </div>
          {cycle && (
            <div className="text-sm text-ink/70 sm:text-right">
              <p>
                Current cycle:{" "}
                <span className="font-semibold text-ink">
                  {formatDate(cycle.start)} – {formatDate(cycle.end)}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-ink/55">
                {cycle.daysLeft} {cycle.daysLeft === 1 ? "day" : "days"} left ·{" "}
                {cycle.months}-month cycle
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          {checklist.length === 0 ? (
            <p className="text-sm text-ink/60 lg:col-span-4">
              No active requirements right now — you've met everything for this
              cycle.
            </p>
          ) : (
            checklist.map((item) => {
              const percent = Math.round(Math.min(1, Math.max(0, item.progress)) * 100);
              return (
                <div
                  key={item.key}
                  className={cn(
                    "rounded-2xl border p-4",
                    item.met
                      ? "border-gold/30 bg-cream-deep"
                      : "border-ink/10 bg-white"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        item.met
                          ? "bg-linear-to-br from-gold/50 to-gold text-gold-dark"
                          : "bg-ink/10 text-ink/40"
                      )}
                    >
                      {item.met ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <ArrowRightIcon className="h-3 w-3" />
                      )}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/60">{item.requirement}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <span
                      className="block h-full rounded-full bg-linear-to-r from-gold/60 to-gold transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-ink/50">
                    {item.current} · {percent}%
                  </p>
                </div>
              );
            })
          )}
        </div>

        {loyalty.nextStep && (
          <div className="border-t border-ink/8 bg-cream px-6 py-5 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
              Next step
            </p>
            <p className="mt-1 text-sm text-ink/75">{loyalty.nextStep}</p>
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ============ POINTS SUMMARY ============ */}
        <section className="rounded-3xl border border-ink/8 bg-white px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-gold/30 to-gold text-gold-dark">
              <CoinsIcon className="h-5 w-5" />
            </span>
            <h2 className="font-serif text-2xl text-ink">Points summary</h2>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-cream-deep px-4 py-4">
              <p className="text-xs text-ink/60">Available</p>
              <p className="mt-1 font-serif text-2xl text-ink">
                {points.available}
              </p>
            </div>
            <div className="rounded-2xl bg-cream px-4 py-4">
              <p className="text-xs text-ink/60">Pending</p>
              <p className="mt-1 font-serif text-2xl text-ink">
                {points.pending}
              </p>
              <p className="mt-1 text-[11px] text-ink/50">
                Unlocks after the {RETURN_WINDOW_DAYS}-day return window closes
              </p>
            </div>
            <div className="rounded-2xl bg-cream px-4 py-4">
              <p className="text-xs text-ink/60">Expiring</p>
              <p className="mt-1 font-serif text-2xl text-ink">
                {expiringSoon?.points ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-ink/50">
                {expiringSoon
                  ? `On ${formatDate(expiringSoon.date) ?? expiringSoon.date}`
                  : `Points expire ${points.validityMonths} months after you earn them`}
              </p>
            </div>
          </div>

          {expiringSoon && (
            <p className="mt-4 rounded-2xl border border-gold/30 bg-cream px-4 py-3 text-sm text-ink/75">
              You have {expiringSoon.points} points expiring on{" "}
              {formatDate(expiringSoon.date) ?? expiringSoon.date}. Use them on
              your next order before they're gone.
            </p>
          )}

          <ul className="mt-5 space-y-2 text-xs text-ink/60">
            <li>
              You earn{" "}
              <span className="font-semibold text-ink">
                {(tier.pointsRate * 100).toFixed(1).replace(/\.0$/, "")}% of
                your spend
              </span>{" "}
              in points on every qualifying order.
            </li>
            <li>
              Some categories earn at a different rate — electronics earns{" "}
              <span className="font-semibold text-ink">
                {POINTS_RULES.electronicsMultiplier}×
              </span>{" "}
              points.
            </li>
            <li>
              Redeem from{" "}
              <span className="font-semibold text-ink">
                {points.redemptionMin} points
              </span>
              , up to{" "}
              <span className="font-semibold text-ink">
                {Math.round(points.redemptionCap * 100)}%
              </span>{" "}
              of an order's value. Points are removed from your balance when an
              order is refunded, and they have no cash value.
            </li>
          </ul>

          <button
            onClick={() => navigate("/rewards")}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition hover:text-brand-dark"
          >
            <GiftIcon className="h-4 w-4" />
            Browse rewards
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </section>

        {/* ============ POINTS HISTORY LOG ============ */}
        <section className="rounded-3xl border border-ink/8 bg-white px-6 py-6 sm:px-8">
          <h2 className="font-serif text-2xl text-ink">Points history log</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-cream-deep text-[11px] uppercase tracking-[0.14em] text-ink/60">
                  <th className="px-4 py-3 font-medium">Activity</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-10 text-center text-sm text-ink/55"
                    >
                      No points activity yet. Points appear here as soon as
                      your orders are delivered.
                    </td>
                  </tr>
                ) : (
                  history.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-t border-ink/8 hover:bg-cream"
                    >
                      <td className="px-4 py-3 font-medium text-ink">
                        {entry.activity}
                      </td>
                      <td className="px-4 py-3 text-ink/65">{entry.date}</td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-semibold",
                          entry.points < 0
                            ? "text-brand"
                            : entry.status === "pending"
                              ? "text-ink/50"
                              : "text-gold-dark"
                        )}
                      >
                        {entry.points > 0 ? `+${entry.points}` : entry.points}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink/55">
            Pending points appear here until the return window closes, then
            move to your available balance.
          </p>
        </section>
      </div>
    </div>
  );
}

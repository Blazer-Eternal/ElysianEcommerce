import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ArrowRightIcon, CheckIcon } from "../components/icons";
import { formatCurrency } from "../utils/formatCurrency";
import {
  FREE_DELIVERY_FEE,
  MAX_COUNTED_SPEND_PER_ORDER,
  MIN_COUNTED_ORDER,
  ORDER_SPACING_DAYS,
  POINTS_RULES,
  RETURN_WINDOW_DAYS,
  TIER_LEVELS,
} from "../utils/loyalty";

/**
 * Every figure on this page comes from `utils/loyalty.ts`, the same constants
 * the plans rail and the loyalty portal quote. The server-side engine
 * (`LoyaltyServices`) is the source of truth; these numbers mirror it so the
 * storefront speaks with one voice.
 */
const tierColumn = (name: (typeof TIER_LEVELS)[number]["name"]) =>
  TIER_LEVELS.find((tier) => tier.name === name)!;

const percent = (rate: number) =>
  `${(rate * 100).toFixed(1).replace(/\.0$/, "")}%`;

const comparisonRows: {
  label: string;
  registered: string;
  bronze: string;
  gold: string;
  platinum: string;
  diamond: string;
}[] = [
  {
    label: "How you get there",
    registered: "Create an account",
    bronze: "Earned in your first cycle",
    gold: "Earned in a 12-month cycle",
    platinum: "Earned in a 12-month cycle",
    diamond: "Earned in a 12-month cycle",
  },
  {
    label: "Points earned",
    registered: `${percent(tierColumn("Bronze").pointsRate)} of qualifying spend`,
    bronze: `${percent(tierColumn("Bronze").pointsRate)} of qualifying spend`,
    gold: `${percent(tierColumn("Gold").pointsRate)} of qualifying spend`,
    platinum: `${percent(tierColumn("Platinum").pointsRate)} of qualifying spend`,
    diamond: `${percent(tierColumn("Diamond").pointsRate)} of qualifying spend`,
  },
  {
    label: "Standard delivery",
    registered: `Rs. ${FREE_DELIVERY_FEE} fee on every order`,
    bronze: `Free from ${formatCurrency(tierColumn("Bronze").freeDeliveryFrom)}`,
    gold: `Free from ${formatCurrency(tierColumn("Gold").freeDeliveryFrom)}`,
    platinum: `Free from ${formatCurrency(tierColumn("Platinum").freeDeliveryFrom)}`,
    diamond: `Free from ${formatCurrency(tierColumn("Diamond").freeDeliveryFrom)}`,
  },
  {
    label: "Tier coupon",
    registered: "-",
    bronze: "-",
    gold: "GOLD10: 10% off, up to Rs. 1,500",
    platinum: "PLAT12: 12% off, up to Rs. 2,500",
    diamond: "DIAMOND15: 15% off, up to Rs. 4,000",
  },
  {
    label: "Sale early access",
    registered: "-",
    bronze: "-",
    gold: "Seasonal sales open to you 24 hours early",
    platinum: "Seasonal sales open 24 hours early, plus flash-sale invitations",
    diamond:
      "Seasonal sales open 24 hours early, plus occasional invite-only offers",
  },
  {
    label: "Support response",
    registered: "Standard support, within 48 hours",
    bronze: "Standard support, within 48 hours",
    gold: "Priority support, within 24 hours",
    platinum: "Priority support, within 12 hours",
    diamond: "Dedicated support line, within 12 hours",
  },
];

const requirementRows = [
  {
    tier: "Bronze",
    cycle: "First 6 months of your account",
    spend: tierColumn("Bronze").spend,
    orders: tierColumn("Bronze").orders,
    months: tierColumn("Bronze").activeMonths,
    rate: "Not checked",
  },
  {
    tier: "Gold",
    cycle: "Every 12-month cycle",
    spend: tierColumn("Gold").spend,
    orders: tierColumn("Gold").orders,
    months: tierColumn("Gold").activeMonths,
    rate: "20% or less",
  },
  {
    tier: "Platinum",
    cycle: "Every 12-month cycle",
    spend: tierColumn("Platinum").spend,
    orders: tierColumn("Platinum").orders,
    months: tierColumn("Platinum").activeMonths,
    rate: "20% or less",
  },
  {
    tier: "Diamond",
    cycle: "Every 12-month cycle",
    spend: tierColumn("Diamond").spend,
    orders: tierColumn("Diamond").orders,
    months: tierColumn("Diamond").activeMonths,
    rate: "20% or less",
  },
];

const qualifyingRules = [
  `Only delivered orders count, and only once the ${RETURN_WINDOW_DAYS}-day return window after delivery has closed.`,
  `An order must be worth at least ${formatCurrency(MIN_COUNTED_ORDER)} to count at all.`,
  `One order contributes at most ${formatCurrency(MAX_COUNTED_SPEND_PER_ORDER)} towards the spend requirement, so a single large purchase cannot carry a level on its own.`,
  `Orders placed within ${ORDER_SPACING_DAYS} days of each other count as one order for the order count. Their spend still counts in full.`,
  "An active month is any calendar month in which you placed at least one qualifying order.",
  "Refunds and cancellations remove the qualifying spend and order count of the affected order.",
  "Spend is the item subtotal after discounts. Delivery fees and the value of redeemed points do not count.",
];

const cycleRules = [
  "Everyone starts at Registered. Your first cycle runs for 6 months from the day you created your account. Reach Bronze inside it to start earning points.",
  `From Gold up, each level is measured over a fixed 12-month cycle that starts on the day you earned the level. Your spend, order and active-month counters reset when a new cycle begins.`,
  "Meet every requirement mid-cycle and you upgrade immediately, one level at a time. Your new benefits apply from your very next order.",
  `When a cycle ends, meeting the requirements for your level keeps it. Missing them drops you by exactly one level, and Registered is as low as you can go.`,
  "Points sit outside the tier system: a level change leaves them intact, and they stay yours until they expire.",
];

const pointsRules = [
  `Points stay pending until the ${RETURN_WINDOW_DAYS}-day return window after delivery closes, then move to your available balance.`,
  `Points expire ${POINTS_RULES.validityMonths} months after the day you earn them. Your account shows any balance expiring in the next 30 days.`,
  `Redeem from ${POINTS_RULES.redemptionMin} points, and use points on up to ${POINTS_RULES.redemptionCap * 100}% of an order's value.`,
  `Some categories earn at a different rate: electronics earns ${POINTS_RULES.electronicsMultiplier}× the usual points.`,
  "Points are removed when an order is refunded, and they have no cash value.",
];

const couponRows = [
  {
    code: "WELCOME10",
    offer: "10% off, up to Rs. 1,000",
    min: formatCurrency(1_000),
    limits: "Registered customers, once per account",
  },
  {
    code: "GOLD10",
    offer: "10% off, up to Rs. 1,500",
    min: formatCurrency(3_000),
    limits: "Gold and above, 2 uses per account every 30 days, electronics excluded",
  },
  {
    code: "PLAT12",
    offer: "12% off, up to Rs. 2,500",
    min: formatCurrency(3_000),
    limits: "Platinum and above, 2 uses per account every 30 days, electronics excluded",
  },
  {
    code: "DIAMOND15",
    offer: "15% off, up to Rs. 4,000",
    min: formatCurrency(3_000),
    limits: "Diamond, 2 uses per account every 30 days, electronics excluded",
  },
  {
    code: "FREESHIP",
    offer: `Standard delivery fee (Rs. ${FREE_DELIVERY_FEE}) waived`,
    min: formatCurrency(2_000),
    limits: "Up to 3 uses per account every 30 days",
  },
  {
    code: "SAVE500",
    offer: "Rs. 500 off",
    min: formatCurrency(5_000),
    limits: "1 use per account every 30 days, 1,000 redemptions total, electronics excluded",
  },
  {
    code: "FESTIVE15",
    offer: "15% off, up to Rs. 2,000",
    min: formatCurrency(5_000),
    limits: "Festival dates only, 1 use per account every 30 days, 1,000 redemptions total",
  },
  {
    code: "CLEAR30",
    offer: "30% off, up to Rs. 3,000",
    min: formatCurrency(5_000),
    limits: "Clearance-tagged fashion, footwear and bags, once per account, 100 redemptions total",
  },
];

const CompareBenefits = () => {
  return (
    <div className="space-y-20 pb-20 sm:pb-28">
      {/* Hero */}
      <div className="relative pt-12 pb-6 overflow-hidden sm:pt-20 sm:pb-10">
        <div className="mx-auto max-w-4xl space-y-5 px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold tracking-[0.25em] text-brand uppercase">
            Membership &amp; Savings
          </p>
          <h1 className="text-4xl font-semibold text-ink sm:text-5xl lg:text-6xl">
            Compare <span className="text-brand">every benefit</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink/70">
            Four membership levels above Registered, fixed yearly cycles, one
            set of rules. This page states exactly how each level is earned,
            what it returns, and the terms every coupon runs under.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <div className="h-px w-16 bg-brand/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
          </div>
        </div>
      </div>

      {/* Level comparison matrix */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
            The five stages, side by side
          </h2>
          <p className="leading-relaxed text-ink/65">
            Every level keeps the benefits of the one below it, so moving up
            only ever adds. Registered is where every account starts, Bronze
            and above are earned.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-sand bg-white shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="bg-cream-deep text-left">
                <th className="px-5 py-4 font-semibold text-ink/60">Benefit</th>
                <th className="px-5 py-4 font-semibold text-ink">Registered</th>
                <th className="px-5 py-4 font-semibold text-ink">Bronze</th>
                <th className="px-5 py-4 font-semibold text-ink">Gold</th>
                <th className="px-5 py-4 font-semibold text-ink">Platinum</th>
                <th className="px-5 py-4 font-semibold text-brand">Diamond</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 1 ? "bg-cream/60" : ""}>
                  <td className="px-5 py-4 font-semibold text-ink">
                    {row.label}
                  </td>
                  <td className="px-5 py-4 text-ink/70">{row.registered}</td>
                  <td className="px-5 py-4 text-ink/70">{row.bronze}</td>
                  <td className="px-5 py-4 text-ink/70">{row.gold}</td>
                  <td className="px-5 py-4 text-ink/70">{row.platinum}</td>
                  <td className="px-5 py-4 text-ink/70">{row.diamond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink/50">
          Early access opens the sale to you 24 hours before it goes public.
          Diamond invitations arrive occasionally and while the offer lasts.
        </p>
      </section>

      {/* Exact requirements */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
            Exactly what each level requires
          </h2>
          <p className="leading-relaxed text-ink/65">
            All three conditions must be met inside the same cycle. Spend,
            orders and active months are tracked on your loyalty page, so you
            can see your position at any time.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-sand bg-white shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
          <table className="w-full min-w-180 text-sm">
            <thead>
              <tr className="bg-cream-deep text-left">
                <th className="px-5 py-4 font-semibold text-ink/60">Level</th>
                <th className="px-5 py-4 font-semibold text-ink/60">Cycle</th>
                <th className="px-5 py-4 font-semibold text-ink/60">
                  Qualifying spend
                </th>
                <th className="px-5 py-4 font-semibold text-ink/60">
                  Qualifying orders
                </th>
                <th className="px-5 py-4 font-semibold text-ink/60">
                  Active months
                </th>
                <th className="px-5 py-4 font-semibold text-ink/60">
                  Return / cancel rate
                </th>
              </tr>
            </thead>
            <tbody>
              {requirementRows.map((row, i) => (
                <tr key={row.tier} className={i % 2 === 1 ? "bg-cream/60" : ""}>
                  <td className="px-5 py-4 font-semibold text-ink">
                    {row.tier}
                  </td>
                  <td className="px-5 py-4 text-ink/70">{row.cycle}</td>
                  <td className="px-5 py-4 font-semibold text-brand">
                    {formatCurrency(row.spend)}
                  </td>
                  <td className="px-5 py-4 text-ink/70">{row.orders}</td>
                  <td className="px-5 py-4 text-ink/70">{row.months}</td>
                  <td className="px-5 py-4 text-ink/70">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink/50">
          The return / cancel rate is measured across your last 4 settled
          orders. Bronze is not checked, since it is earned inside your first
          cycle.
        </p>
      </section>

      {/* Qualifying rules */}
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
            Which orders count
          </h2>
          <p className="leading-relaxed text-ink/65">
            A level should say something about how you shop, not about one
            lucky purchase. Qualifying spend is counted this way:
          </p>
        </div>
        <ul className="space-y-3">
          {qualifyingRules.map((rule) => (
            <li key={rule} className="flex items-start gap-3 text-ink/80">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                <CheckIcon size={11} strokeWidth={3.5} />
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* Cycles */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="max-w-2xl text-3xl font-semibold text-ink sm:text-4xl">
          How cycles work
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {cycleRules.map((rule, i) => (
            <div
              key={rule}
              className="rounded-2xl border border-sand bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.05)]"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">
                Rule {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 leading-relaxed text-ink/75">{rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Points */}
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
            How points work
          </h2>
          <p className="mt-4 leading-relaxed text-ink/65">
            Points are separate from your level. You earn them on qualifying
            orders at your level's rate, and they belong to you until they
            expire.
          </p>
        </div>
        <ul className="space-y-4">
          {pointsRules.map((rule) => (
            <li
              key={rule}
              className="flex items-start gap-3 leading-relaxed text-ink/80"
            >
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                <CheckIcon size={11} strokeWidth={3.5} />
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* Coupons */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
          Coupons and their terms
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink/65">
          Tier coupons appear in the checkout of members at the right level and
          stay available while the offer lasts. One coupon per order; codes
          do not stack with each other or with sale pricing.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-sand bg-white shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
          <table className="w-full min-w-180 text-sm">
            <thead>
              <tr className="bg-cream-deep text-left">
                <th className="px-5 py-4 font-semibold text-ink/60">Code</th>
                <th className="px-5 py-4 font-semibold text-ink/60">Offer</th>
                <th className="px-5 py-4 font-semibold text-ink/60">
                  Min. order
                </th>
                <th className="px-5 py-4 font-semibold text-ink/60">Limits</th>
              </tr>
            </thead>
            <tbody>
              {couponRows.map((c, i) => (
                <tr key={c.code} className={i % 2 === 1 ? "bg-cream/60" : ""}>
                  <td className="px-5 py-4 font-bold tracking-wide text-brand">
                    {c.code}
                  </td>
                  <td className="px-5 py-4 text-ink/80">{c.offer}</td>
                  <td className="px-5 py-4 text-ink/70">{c.min}</td>
                  <td className="px-5 py-4 text-ink/70">{c.limits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-ink/50">
          Our weekend flash sale runs for a limited number of redemptions and is
          released to Platinum and Diamond members before any public window. The
          code reaches members in their account and email, so it is not
          published on this page.
        </p>
      </section>

      {/* Program terms */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
          Program terms
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-sand bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
            <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">
              Fair use
            </p>
            <p className="mt-3 leading-relaxed text-ink/75">
              Orders placed to artificially reach a level, for example bulk
              orders that are then returned, do not count towards your
              requirements. We may pause coupons or levels while we review
              activity that looks like abuse.
            </p>
          </div>
          <div className="rounded-2xl border border-sand bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
            <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">
              Changes to the program
            </p>
            <p className="mt-3 leading-relaxed text-ink/75">
              Requirements, benefits and coupon terms may change as the program
              evolves. Levels you have already earned stand for the rest of
              their cycle, and any change is published on this page with its
              effective date.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="space-y-5 rounded-2xl border border-sand bg-linear-to-br from-white to-cream p-10 text-center">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
            Ready to see what you have earned?
          </h2>
          <p className="text-ink/65">
            Your current level, cycle dates, points and per-order counting all
            live in your loyalty dashboard.
          </p>
          <Link
            to={ROUTES.DASHBOARD}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-[0_14px_30px_-16px_rgba(61,5,12,0.9)] transition-colors duration-300 hover:bg-brand-dark"
          >
            Open loyalty dashboard
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareBenefits;

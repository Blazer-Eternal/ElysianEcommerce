import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ArrowRightIcon, CheckIcon } from "../components/icons";

const comparisonRows: { label: string; bronze: string; gold: string; platinum: string; diamond: string }[] = [
  { label: "Points earned", bronze: "0.5% back", gold: "1% back", platinum: "1.5% back", diamond: "2% back" },
  { label: "Standard delivery", bronze: "Rs. 150, free above Rs. 5,000", gold: "Free above Rs. 2,000", platinum: "Free, all orders", diamond: "Free express, all orders" },
  { label: "Tier coupon", bronze: "WELCOME10 on first order", gold: "GOLD10, 10% up to Rs. 1,500", platinum: "PLAT12, 12% up to Rs. 2,500", diamond: "DIAMOND15, 15% up to Rs. 4,000" },
  { label: "Early access", bronze: "—", gold: "Seasonal sales", platinum: "Flash sales (FLASH25)", diamond: "Invite-only offers" },
  { label: "Support", bronze: "Standard", gold: "Standard", platinum: "Priority", diamond: "Dedicated" },
];

const thresholdRows = [
  { tier: "Bronze", spend: "Join free", orders: "—", share: "Everyone" },
  { tier: "Gold", spend: "Rs. 30,000", orders: "3", share: "Roughly the top 30% of customers" },
  { tier: "Platinum", spend: "Rs. 100,000", orders: "8", share: "Roughly the top 10%" },
  { tier: "Diamond", spend: "Rs. 250,000", orders: "15", share: "The top 2–3%" },
];

const qualifyingRules = [
  "Only delivered orders count, and only after the 7-day return window has passed.",
  "Spend is the item subtotal after discounts. Delivery fees and points redeemed do not count.",
  "Each order counts for at most Rs. 50,000. A Rs. 2,14,000 phone counts as Rs. 50,000, so one big purchase cannot carry a tier.",
  "We look at a rolling 12 months, not your lifetime history, so your level reflects how you shop today.",
  "You need both the spend threshold and the minimum order count. Either one alone is not enough.",
];

const movementRules = [
  "Upgrades apply the moment both conditions are met; the new benefits start on your very next order.",
  "Level reviews happen once every 12 months. A step down is by one tier at most, never more.",
  "Benefits only stack upward. A Diamond member keeps every Bronze, Gold and Platinum perk as well.",
  "Refunds and cancellations remove the qualifying spend of the affected order.",
];

const groundRules = [
  "Electronics earn points at half the usual rate and are excluded from percentage coupons. Fixed-amount coupons such as TECH2K and BIGBUY5K cover them instead.",
  "Points can pay for at most 10% of an order.",
  "One coupon per order, no stacking, no combining with sale pricing.",
  "Your final line price always stays at least 5% above our cost on every item.",
  "Total reward cost on an order, discount plus points plus any delivery subsidy, is capped at about 40% of the gross margin on that order.",
];

const publicCoupons = [
  { code: "WELCOME10", offer: "10% off, up to Rs. 1,000", min: "Rs. 1,000", limits: "New customers, first order only" },
  { code: "FREESHIP", offer: "Standard delivery fee waived", min: "Rs. 2,000", limits: "Up to 3 uses per account every 30 days" },
  { code: "SAVE500", offer: "Rs. 500 off", min: "Rs. 5,000", limits: "1 use per account every 30 days, 1,000 total" },
  { code: "FESTIVE15", offer: "15% off, up to Rs. 2,000", min: "Rs. 5,000", limits: "Festival dates only, 1,000 total" },
  { code: "FLASH25", offer: "25% off, up to Rs. 3,000", min: "Rs. 8,000", limits: "Friday 6 PM – Sunday 11:59 PM, high-margin categories, 150 total" },
  { code: "CLEAR30", offer: "30% off, up to Rs. 3,000", min: "Rs. 5,000", limits: "Clearance-tagged fashion, footwear and bags, 100 total" },
];

const measures = [
  {
    metric: "Reward cost as a share of gross margin",
    detail: "Every discount, point and free delivery is charged against order margin, not revenue. If a tier or coupon would push us past 40% of margin on a category, the cap catches it before the customer ever sees the price.",
  },
  {
    metric: "Tier distribution",
    detail: "We track how many members sit at each level and re-check thresholds every quarter against real order percentiles: Gold near the top 30%, Platinum near the top 10%, Diamond at the top 2–3%. If Diamond creeps past that, thresholds move up.",
  },
  {
    metric: "Points liability",
    detail: "Outstanding points are treated as a future discount owed. We publish the rate per tier (0.5% to 2% back) so this obligation is bounded, and we cap redemption at 10% of any order.",
  },
  {
    metric: "Repeat purchase and basket size",
    detail: "The point of the tiers is habit, not one big haul. We watch 90-day repeat rate and average basket by tier, and we want both to rise as the level rises.",
  },
  {
    metric: "Coupon redemption quality",
    detail: "Each code's redemptions, revenue generated and margin impact are reviewed monthly. Codes that cannibalise full-price sales without growing new demand get their terms tightened or retired.",
  },
  {
    metric: "Delivery subsidy per order",
    detail: "Free-delivery promises are priced, not assumed. We measure average delivery cost covered per order for each tier and tune the free-delivery minimums so the promise stays funded.",
  },
];

const CompareBenefits = () => {
  return (
    <div className="space-y-20 pb-20 sm:pb-28">
      {/* Hero */}
      <div className="relative pt-12 pb-6 sm:pt-20 sm:pb-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">Membership &amp; Savings</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink">
            Compare <span className="text-brand">every benefit</span>
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed max-w-2xl mx-auto">
            Four membership levels, a handful of live coupons, one set of rules. This page explains
            exactly how each level is earned, what it returns, and how we keep every promise funded.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <div className="h-px w-16 bg-brand/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
          </div>
        </div>
      </div>

      {/* Level comparison matrix */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink">The four levels, side by side</h2>
          <p className="text-ink/65 leading-relaxed">
            Every level keeps the benefits of the one below it, so moving up only ever adds. Higher
            levels never trade one perk for another.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#ece1d0] bg-white shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
          <table className="w-full min-w-180 text-sm">
            <thead>
              <tr className="bg-[#fdfaf3] text-left">
                <th className="px-5 py-4 font-semibold text-ink/60">Benefit</th>
                <th className="px-5 py-4 font-semibold text-ink">Bronze</th>
                <th className="px-5 py-4 font-semibold text-ink">Gold</th>
                <th className="px-5 py-4 font-semibold text-ink">Platinum</th>
                <th className="px-5 py-4 font-semibold text-brand">Diamond</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 1 ? "bg-cream/60" : ""}>
                  <td className="px-5 py-4 font-semibold text-ink">{row.label}</td>
                  <td className="px-5 py-4 text-ink/70">{row.bronze}</td>
                  <td className="px-5 py-4 text-ink/70">{row.gold}</td>
                  <td className="px-5 py-4 text-ink/70">{row.platinum}</td>
                  <td className="px-5 py-4 text-ink/70">{row.diamond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How your level is calculated */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-5">
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink">How your level is calculated</h2>
          <p className="text-ink/65 leading-relaxed">
            A level should say something about how you shop, not about one lucky purchase. Qualifying
            spend is counted this way:
          </p>
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
        </div>
        <div className="rounded-2xl border border-[#ece1d0] bg-white p-6 sm:p-8 shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Thresholds</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">Qualifying spend in a rolling 12 months</h3>
          <div className="mt-6 space-y-4">
            {thresholdRows.map((row) => (
              <div key={row.tier} className="flex items-baseline justify-between gap-4 border-b border-[#ece1d0] pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-ink">{row.tier}</p>
                  <p className="text-xs text-ink/55">{row.share}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand">{row.spend}</p>
                  <p className="text-xs text-ink/55">{row.orders === "—" ? "no minimum" : `${row.orders}+ orders`}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-ink/50">
            At an average basket of around Rs. 4,000, Diamond works out to roughly one order a week for
            a year, demanding, but a level a regular customer can genuinely earn.
          </p>
        </div>
      </section>

      {/* Movement rules */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-ink max-w-2xl">Moving up, moving down</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {movementRules.map((rule, i) => (
            <div key={rule} className="rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Rule {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-ink/75 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ground rules */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink">The ground rules for points and coupons</h2>
          <p className="mt-4 text-ink/65 leading-relaxed">
            Rewards should feel generous without selling below cost. These rules apply to every level
            and every code, at every checkout.
          </p>
        </div>
        <ul className="space-y-4">
          {groundRules.map((rule) => (
            <li key={rule} className="flex items-start gap-3 text-ink/80 leading-relaxed">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                <CheckIcon size={11} strokeWidth={3.5} />
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* Public coupons */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-ink">Coupons open to everyone</h2>
        <p className="mt-4 max-w-2xl text-ink/65 leading-relaxed">
          Six public codes, each with its own window or run-count. Tier coupons such as GOLD10,
          PLAT12 and DIAMOND15 appear automatically in the checkout of members at the right level.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#ece1d0] bg-white shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
          <table className="w-full min-w-180 text-sm">
            <thead>
              <tr className="bg-[#fdfaf3] text-left">
                <th className="px-5 py-4 font-semibold text-ink/60">Code</th>
                <th className="px-5 py-4 font-semibold text-ink/60">Offer</th>
                <th className="px-5 py-4 font-semibold text-ink/60">Min. order</th>
                <th className="px-5 py-4 font-semibold text-ink/60">Limits</th>
              </tr>
            </thead>
            <tbody>
              {publicCoupons.map((c, i) => (
                <tr key={c.code} className={i % 2 === 1 ? "bg-cream/60" : ""}>
                  <td className="px-5 py-4 font-bold tracking-wide text-brand">{c.code}</td>
                  <td className="px-5 py-4 text-ink/80">{c.offer}</td>
                  <td className="px-5 py-4 text-ink/70">{c.min}</td>
                  <td className="px-5 py-4 text-ink/70">{c.limits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Measurement */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink">How we measure all of this</h2>
          <p className="text-ink/65 leading-relaxed">
            A benefits page is a promise. These are the numbers we watch to keep the promise honest,
            reviewed monthly by our retail and finance teams together.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {measures.map((m) => (
            <div key={m.metric} className="rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.05)]">
              <h3 className="font-semibold text-ink">{m.metric}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-[#ece1d0] bg-linear-to-br from-white to-[#fdfaf3] p-10 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-ink">Ready to see what you have earned?</h2>
          <p className="text-ink/65">Your current level, points and qualifying spend live in your loyalty dashboard.</p>
          <Link
            to={ROUTES.LOYALTY}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_14px_30px_-16px_rgba(61,5,12,0.9)] transition-colors duration-300 hover:bg-brand-dark"
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

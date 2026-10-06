import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { ArrowRightIcon, CheckIcon, CoinsIcon, CrownIcon, TicketIcon, TruckIcon, ZapIcon } from "../icons";

type PlanKind = "tier" | "savings";

interface Plan {
  id: string;
  name: string;
  kind: PlanKind;
  /** Pill shown top-right: level number for tiers, live coupon code for savings. */
  badge: string;
  /** The single number a shopper cares about: eligibility or the discount. */
  headline: string;
  description: string;
  perks: string[];
  icon: ReactNode;
  /** Tailwind gradient classes for the icon tile + top accent. */
  accent: string;
}

/**
 * Membership levels mirror `utils/loyalty.ts` (Bronze → Diamond) and the
 * savings plans use the real seeded coupon codes, so every number on this
 * section is something the storefront actually honours.
 */
const plans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    kind: "tier",
    badge: "Level 1",
    headline: "Free — joins with your first order",
    description: "Every account starts here, so you earn from the very first rupee you spend.",
    icon: <CrownIcon size={24} />,
    accent: "from-amber-700 to-orange-800",
    perks: [
      "1 reward point for every Rs. 2 spent",
      "10% off your first order with WELCOME10",
      "Flat Rs. 150 delivery, free above Rs. 2,000",
      "Real-time tracking on every order",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    kind: "tier",
    badge: "Level 2",
    headline: "Unlocks at Rs. 50,000 lifetime spend",
    description: "For regular shoppers: the delivery fee disappears and your points double.",
    icon: <CoinsIcon size={24} />,
    accent: "from-amber-500 to-amber-700",
    perks: [
      "2x reward points on every order",
      "20% off with the VIP20 loyalty coupon",
      "Free standard delivery above Rs. 2,000",
      "Early access to seasonal sales & offers",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    kind: "tier",
    badge: "Level 3",
    headline: "Unlocks at Rs. 150,000 lifetime spend",
    description: "Priority handling and free delivery, plus first look at every flash sale.",
    icon: <TruckIcon size={24} />,
    accent: "from-stone-400 to-stone-600",
    perks: [
      "3x reward points on every order",
      "Free delivery on all orders, no minimum",
      "Priority order processing & support",
      "First access to FLASH25 weekend deals",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    kind: "tier",
    badge: "Level 4",
    headline: "Unlocks at Rs. 400,000 lifetime spend",
    description: "Our highest level: the best discount ceiling and invite-only offers.",
    icon: <CrownIcon size={24} />,
    accent: "from-rose-500 to-brand",
    perks: [
      "4x reward points on every order",
      "Free express delivery, always",
      "15% off premium orders with BIGBUY15",
      "Invite-only offers & dedicated support",
    ],
  },
  {
    id: "freeship",
    name: "Free Shipping Saver",
    kind: "savings",
    badge: "FREESHIP",
    headline: "Rs. 150 off · min. order Rs. 2,000",
    description: "Takes the delivery charge off your cart — the number one reason carts get abandoned.",
    icon: <TruckIcon size={24} />,
    accent: "from-brand to-brand-dark",
    perks: [
      "Covers standard shipping in full",
      "Unlimited uses until 31 Dec 2026",
      "Nudges your cart past Rs. 2,000",
    ],
  },
  {
    id: "save500",
    name: "Spend & Save",
    kind: "savings",
    badge: "SAVE500",
    headline: "Rs. 500 off · min. order Rs. 5,000",
    description: "Add one more item, cross Rs. 5,000 and watch Rs. 500 come off the bill.",
    icon: <CoinsIcon size={24} />,
    accent: "from-cyan-500 to-teal-600",
    perks: [
      "Instant discount at checkout",
      "No usage cap until 31 Dec 2026",
      "Best value on mid-size baskets",
    ],
  },
  {
    id: "flash25",
    name: "Weekend Flash Deal",
    kind: "savings",
    badge: "FLASH25",
    headline: "25% off · min. order Rs. 8,000",
    description: "A short, sharp discount that runs all weekend while the stock lasts.",
    icon: <ZapIcon size={24} />,
    accent: "from-[#c9566e] to-brand",
    perks: [
      "One of the deepest live discounts",
      "150 redemptions per campaign",
      "Stacked on already-reduced sale items",
    ],
  },
  {
    id: "clear30",
    name: "Seasonal Clearance",
    kind: "savings",
    badge: "CLEAR30",
    headline: "30% off · min. order Rs. 5,000",
    description: "The biggest markdown of the year on last-season stock, while quantities last.",
    icon: <TicketIcon size={24} />,
    accent: "from-gold-dark to-[#5c0a14]",
    perks: [
      "Clears end-of-season inventory",
      "100 redemptions per campaign",
      "Applies to already-reduced items",
    ],
  },
];

const PlanCard = ({ plan }: { plan: Plan }) => (
  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_18px_44px_-22px_rgba(61,5,12,0.4)] animate-fade-in">
    {/* Top accent strip */}
    <span className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${plan.accent}`} />

    <div className="flex items-start justify-between gap-3">
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${plan.accent} text-white shadow-md transition-transform duration-500 group-hover:scale-110`}
      >
        {plan.icon}
      </span>
      <span className="shrink-0 rounded-full border border-brand/25 bg-brand/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
        {plan.badge}
      </span>
    </div>

    <h3 className="mt-4 text-xl font-semibold text-ink">{plan.name}</h3>
    <p className="mt-1 text-sm font-semibold text-brand">{plan.headline}</p>
    <p className="mt-2 text-sm leading-relaxed text-ink/65">{plan.description}</p>

    <ul className="mt-4 space-y-2.5">
      {plan.perks.map((perk) => (
        <li key={perk} className="flex items-start gap-2.5 text-sm text-ink/75">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
            <CheckIcon size={11} strokeWidth={3.5} />
          </span>
          {perk}
        </li>
      ))}
    </ul>

    <div className="mt-auto pt-5">
      {plan.kind === "savings" ? (
        <div className="rounded-xl border border-dashed border-brand/40 bg-brand/5 px-3 py-2 text-center text-xs font-semibold text-ink/70">
          Use code <span className="font-black tracking-wide text-brand">{plan.badge}</span> at checkout
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl bg-[#fdfaf3] px-3 py-2 text-xs text-ink/55">
          <span>Earned, not bought</span>
          <span className="font-bold text-ink/80">{plan.badge}</span>
        </div>
      )}
    </div>
  </div>
);

/**
 * Home "plans" section — replaces the old About block. Membership levels come
 * first (4 cards), then a "See more plans" toggle reveals the live coupon-backed
 * savings plans.
 */
const PlansSection = () => {
  const [expanded, setExpanded] = useState(false);

  const tierPlans = plans.filter((plan) => plan.kind === "tier");
  const savingsPlans = plans.filter((plan) => plan.kind === "savings");
  const visible = expanded ? [...tierPlans, ...savingsPlans] : tierPlans;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-[#fdfaf3] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            Membership &amp; Savings Plans
          </span>

          <h2 className="text-4xl sm:text-5xl font-semibold text-ink leading-[1.06]">
            Shop more, <span className="text-brand">save more</span>
          </h2>

          <p className="text-ink/65 text-sm sm:text-base leading-relaxed">
            One store, four membership levels and a stack of live promo codes — every plan below is
            powered by rewards, coupons and delivery benefits you can actually use today.
          </p>
        </div>

        {/* Plans grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {visible.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Progressive disclosure: 4 membership levels first, rest behind the button */}
        <div className="mt-9 flex flex-col items-center gap-3">
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_14px_30px_-16px_rgba(61,5,12,0.9)] transition-colors duration-300 hover:bg-brand-dark"
            >
              See more plans
              <ArrowRightIcon
                size={18}
                className="transition-transform duration-300 group-hover:translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          ) : (
            <>
              <Link
                to={ROUTES.FEATURES}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                Compare every benefit
                <ArrowRightIcon
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-xs font-semibold text-ink/45 hover:text-brand transition-colors"
              >
                Show fewer plans
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;

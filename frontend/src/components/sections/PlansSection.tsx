import { useCallback, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  ArrowRightIcon,
  CheckIcon,
  CoinsIcon,
  CrownIcon,
  GemIcon,
  TicketIcon,
  TruckIcon,
  ZapIcon,
} from "../icons";

type PlanKind = "tier" | "savings";

interface Plan {
  id: string;
  name: string;
  kind: PlanKind;
  /** Pill shown top-right: level number for tiers, live code for savings. */
  badge: string;
  /** The single number a shopper cares about: requirements or the discount. */
  headline: string;
  description: string;
  perks: string[];
  icon: ReactNode;
  /** Tailwind gradient classes for the icon tile + top accent. */
  accent: string;
  /** Members-first offers never print their code on a public page. */
  codeHidden?: boolean;
}

/**
 * Membership levels mirror `utils/loyalty.ts` (Bronze → Diamond): every
 * threshold, points rate and delivery minimum here is the published figure,
 * and the savings plans use the real seeded coupon terms. FLASH25 stays
 * member-only, so its code is deliberately absent.
 */
const plans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    kind: "tier",
    badge: "Level 1",
    headline: "2 qualifying orders + Rs. 3,000 within 6 months",
    description:
      "Everyone starts at Registered — Bronze is the first level you earn, and it starts your points.",
    icon: <CrownIcon size={20} />,
    accent: "from-amber-700 to-orange-800",
    perks: [
      "0.5% of your qualifying spend back in points",
      "Free standard delivery from Rs. 5,000",
      "Points unlock after the 7-day return window",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    kind: "tier",
    badge: "Level 2",
    headline: "Rs. 30,000 spend · 4 orders · 3 active months in 12 months",
    description:
      "For regular shoppers: better points, a monthly tier coupon and delivery that clears sooner.",
    icon: <CoinsIcon size={20} />,
    accent: "from-amber-500 to-amber-700",
    perks: [
      "1% of qualifying spend back in points",
      "GOLD10: 10% off up to Rs. 1,500 (min. Rs. 3,000)",
      "Free standard delivery from Rs. 2,000",
      "Seasonal sales open 24 hours early",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    kind: "tier",
    badge: "Level 3",
    headline: "Rs. 1,00,000 spend · 8 orders · 5 active months in 12 months",
    description:
      "Delivery rarely costs anything again, and weekend flash sales reach you first.",
    icon: <TruckIcon size={20} />,
    accent: "from-teal-400 to-teal-600",
    perks: [
      "1.5% of qualifying spend back in points",
      "PLAT12: 12% off up to Rs. 2,500 (min. Rs. 3,000)",
      "Free standard delivery from Rs. 500",
      "Priority support, reply within 12 hours",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    kind: "tier",
    badge: "Level 4",
    headline: "Rs. 2,50,000 spend · 15 orders · 8 active months in 12 months",
    description:
      "Our highest level: the strongest tier coupon, dedicated support and the occasional private offer.",
    icon: <GemIcon size={20} />,
    accent: "from-teal-500 to-teal-800",
    perks: [
      "2% of qualifying spend back in points",
      "DIAMOND15: 15% off up to Rs. 4,000 (min. Rs. 3,000)",
      "Free standard delivery from Rs. 500",
      "Occasional invite-only offers & dedicated support",
    ],
  },
  {
    id: "freeship",
    name: "Free Shipping Saver",
    kind: "savings",
    badge: "FREESHIP",
    headline: "Waives the Rs. 150 delivery fee · min. order Rs. 2,000",
    description: "Takes the standard delivery charge off your cart in full.",
    icon: <TruckIcon size={20} />,
    accent: "from-brand to-brand-dark",
    perks: [
      "Up to 3 uses per account every 30 days",
      "Standard delivery only, no express upgrades",
      "Cannot be combined with other coupons",
    ],
  },
  {
    id: "save500",
    name: "Spend & Save",
    kind: "savings",
    badge: "SAVE500",
    headline: "Rs. 500 off · min. order Rs. 5,000",
    description: "Applies to eligible items once your cart reaches Rs. 5,000.",
    icon: <CoinsIcon size={20} />,
    accent: "from-cyan-500 to-teal-600",
    perks: [
      "One use per account every 30 days",
      "Not valid on electronics",
      "Cannot be combined with other coupons",
    ],
  },
  {
    id: "flash25",
    name: "Weekend Flash Sale",
    kind: "savings",
    badge: "Members first",
    headline: "25% off up to Rs. 3,000 · min. order Rs. 8,000",
    description:
      "Released to Platinum and Diamond in their account and email before any public window.",
    icon: <ZapIcon size={20} />,
    accent: "from-teal-500 to-brand",
    codeHidden: true,
    perks: [
      "150 redemptions per sale, one per account",
      "Fashion, beauty, jewellery, toys and home décor",
      "The code is shared with members rather than published here",
    ],
  },
  {
    id: "clear30",
    name: "Seasonal Clearance",
    kind: "savings",
    badge: "CLEAR30",
    headline: "30% off up to Rs. 3,000 · min. order Rs. 5,000",
    description: "On items tagged Clearance in fashion, footwear and bags.",
    icon: <TicketIcon size={20} />,
    accent: "from-gold-dark to-teal-900",
    perks: [
      "First 100 redemptions, one per account",
      "Clearance-tagged items only",
      "Cannot be combined with other coupons",
    ],
  },
];

/** Compact carousel card: fixed width so the rail scrolls in clean steps. */
const PlanCard = ({ plan }: { plan: Plan }) => (
  <div className="group relative flex h-full w-72 shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-sand bg-white p-5 shadow-[0_2px_16px_rgba(61,5,12,0.05)] transition-all duration-500 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_18px_44px_-22px_rgba(61,5,12,0.4)] sm:w-80">
    {/* Top accent strip */}
    <span className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${plan.accent}`} />

    <div className="flex items-start justify-between gap-3">
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${plan.accent} text-white shadow-md transition-transform duration-500 group-hover:scale-110`}
      >
        {plan.icon}
      </span>
      <span className="shrink-0 rounded-full border border-brand/25 bg-brand/8 px-2.5 py-1 text-[10px] font-bold tracking-wider text-brand uppercase">
        {plan.badge}
      </span>
    </div>

    <h3 className="mt-3 text-lg font-semibold text-ink">{plan.name}</h3>
    <p className="mt-1 text-[13px] font-semibold text-brand">{plan.headline}</p>
    <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65">
      {plan.description}
    </p>

    <ul className="mt-3.5 space-y-2">
      {plan.perks.map((perk) => (
        <li key={perk} className="flex items-start gap-2 text-[13px] text-ink/75">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
            <CheckIcon size={11} strokeWidth={3.5} />
          </span>
          {perk}
        </li>
      ))}
    </ul>

    <div className="mt-auto pt-4">
      {plan.kind === "savings" ? (
        plan.codeHidden ? (
          <div className="rounded-xl border border-dashed border-teal-500/40 bg-teal-50 px-3 py-2 text-center text-xs font-semibold text-teal-800">
            Code shared with members while the offer lasts
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-brand/40 bg-brand/5 px-3 py-2 text-center text-xs font-semibold text-ink/70">
            Use code{" "}
            <span className="font-black tracking-wide text-brand">
              {plan.badge}
            </span>{" "}
            at checkout
          </div>
        )
      ) : (
        <div className="flex items-center justify-between rounded-xl bg-cream-deep px-3 py-2 text-xs text-ink/55">
          <span>Earned, not bought</span>
          <span className="font-bold text-ink/80">{plan.badge}</span>
        </div>
      )}
    </div>
  </div>
);

/**
 * Home plans rail: one horizontal snap-scrolling track of compact cards with
 * left/right arrow controls — membership levels first, then the live
 * coupon-backed savings plans. No expand/collapse, nothing hidden.
 */
const PlansSection = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft >= max - 4);
  }, []);

  const handleScroll = useCallback(
    (direction: 1 | -1) => {
      const rail = railRef.current;
      if (!rail) return;
      const card = rail.querySelector<HTMLElement>("[data-plan-card]");
      const step = card ? card.offsetWidth + 20 : Math.round(rail.clientWidth * 0.8);
      rail.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    []
  );

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header with carousel controls */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-4 py-2 text-[11px] font-bold tracking-[0.2em] text-brand uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
              </span>
              Membership &amp; Savings Plans
            </span>

            <h2 className="text-4xl leading-[1.06] font-semibold text-ink sm:text-5xl">
              Shop more, <span className="text-brand">save more</span>
            </h2>

            <p className="text-sm leading-relaxed text-ink/65 sm:text-base">
              Four earned membership levels and a set of live promo codes —
              every plan below states its exact requirements or terms, so you
              know exactly what you are using.
            </p>
          </div>

          {/* Left / right arrows */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => handleScroll(-1)}
              disabled={atStart}
              aria-label="Previous plans"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-sand bg-white text-ink shadow-sm transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-sand disabled:hover:text-ink"
            >
              <ArrowRightIcon size={18} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll(1)}
              disabled={atEnd}
              aria-label="Next plans"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-sand bg-white text-ink shadow-sm transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-sand disabled:hover:text-ink"
            >
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </div>

        {/* Plans rail */}
        <div
          ref={railRef}
          onScroll={updateEdges}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {plans.map((plan) => (
            <div key={plan.id} data-plan-card className="flex">
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            to={ROUTES.COMPARE_BENEFITS}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            Compare every benefit
            <ArrowRightIcon
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;

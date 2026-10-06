import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { RefreshIcon, SearchIcon, TruckIcon } from "../icons";

/**
 * "What we do best" — the three-card row that replaces the old Why-Choose-Us
 * grid. Each card is a branded gradient panel (the store has no photography to
 * lean on, so the panel is the artwork) with a white glyph, a crimson icon tile
 * breaking the bottom-left edge, then title, body and pill tags on white.
 */

interface Pillar {
  id: string;
  title: string;
  body: string;
  tags: string[];
  /** Oversized watermark glyph inside the panel. */
  icon: React.ReactNode;
  /** Same glyph at tile size, for the crimson tile on the panel edge. */
  tile: React.ReactNode;
  /** Coloured bloom in the top-right of the panel — keeps the three apart. */
  glow: string;
}

const PILLARS: Pillar[] = [
  {
    id: "truth",
    title: "A catalogue that stays true",
    body: "Every listing is checked for stock, specification and price before it goes live, and checked again when any of the three moves. If the page says it is available, it is available.",
    tags: ["Checked specs", "Real stock", "Clear pricing"],
    icon: <SearchIcon size={72} strokeWidth={1.1} />,
    tile: <SearchIcon size={22} strokeWidth={2} />,
    glow: "radial-gradient(120% 100% at 88% 8%, rgba(209,128,41,0.65) 0%, rgba(209,128,41,0) 58%)",
  },
  {
    id: "delivery",
    title: "Delivery you can follow",
    body: "Orders leave within the working day and you get a status at every step after that. Standard delivery is free above Rs. 2,000, and cash on delivery remains an option across the whole catalogue.",
    tags: ["Free above Rs. 2,000", "Live status", "Cash on delivery"],
    icon: <TruckIcon size={72} strokeWidth={1.1} />,
    tile: <TruckIcon size={22} strokeWidth={2} />,
    glow: "radial-gradient(120% 100% at 88% 8%, rgba(212,139,146,0.7) 0%, rgba(212,139,146,0) 58%)",
  },
  {
    id: "returns",
    title: "Returns without the runaround",
    body: "Thirty days to send anything back, a full refund instead of store credit, and a support desk that reads the whole message before it replies. No restocking fee, no fine print.",
    tags: ["30-day window", "Full refund", "Human replies"],
    icon: <RefreshIcon size={72} strokeWidth={1.1} />,
    tile: <RefreshIcon size={22} strokeWidth={2} />,
    glow: "radial-gradient(120% 100% at 88% 8%, rgba(240,192,112,0.75) 0%, rgba(240,192,112,0) 58%)",
  },
];

const SignatureSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#fdfaf3] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              What we do best
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
          </div>

          <h2 className="mt-5 text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl">
            Three things we take seriously
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/65 sm:text-base">
            The rest of the site is built on top of these. Get them right and everything else —
            the ranges, the offers, the loyalty tiers — is worth having.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#ece1d0] bg-white shadow-[0_2px_16px_rgba(61,5,12,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-[0_18px_44px_-22px_rgba(61,5,12,0.4)]"
            >
              {/* Panel */}
              <div
                className="relative h-52 overflow-hidden sm:h-56"
                style={{
                  background:
                    "linear-gradient(145deg, #c01e2e 0%, #9e1526 58%, #7a0f1c 100%)",
                }}
              >
                {/* bloom */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: pillar.glow }}
                />
                {/* dot lattice */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.16]"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Large glyph */}
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-2 text-white/15 transition-transform duration-700 group-hover:-translate-y-1 group-hover:-rotate-3"
                >
                  {pillar.icon}
                </span>

                {/* Icon tile breaking the panel edge */}
                <span className="absolute bottom-[-22px] left-6 z-10 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-[3px] border-white bg-brand text-white shadow-[0_10px_24px_-10px_rgba(61,5,12,0.8)] transition-transform duration-500 group-hover:scale-105">
                  {pillar.tile}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-6 pb-6 pt-9">
                <h3 className="text-[22px] font-semibold leading-snug text-ink">{pillar.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{pillar.body}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {pillar.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-[#f7e4e4] px-3 py-1.5 text-[11px] font-semibold text-brand-dark"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Footer link — same target the old section offered */}
        <div className="mt-10 flex justify-center">
          <Link
            to={ROUTES.FEATURES}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            See every feature
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignatureSection;

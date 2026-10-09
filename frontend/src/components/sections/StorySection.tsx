import { CheckIcon, CoinsIcon, CreditCardIcon, RefreshIcon, TruckIcon } from "../icons";

/**
 * "Our Story", replaces the old Why-Choose-Us grid.
 *
 * Left side is a designed brand card rather than stock photography: a framed
 * promise panel listing the terms the storefront actually honours (every value
 * here is sourced from PlansSection / utils/loyalty.ts / the refund policy),
 * with an offset blush block behind it for depth.
 */

const PROMISES: Array<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = [
  {
    icon: <TruckIcon size={20} />,
    label: "Sourcing",
    value: "Every listing checked, priced and photographed",
  },
  {
    icon: <CreditCardIcon size={20} />,
    label: "Packaging",
    value: "Sealed, tracked, Kathmandu to your door",
  },
  {
    icon: <RefreshIcon size={20} />,
    label: "Transparency",
    value: "No markups, no hidden fees, no surprises",
  },
  {
    icon: <CoinsIcon size={20} />,
    label: "Care",
    value: "Real reviews, real support, no bots",
  },
];

const CHECKS = [
  "Stock and pricing verified before a listing goes live",
  "Sealed, tracked packaging on every parcel we send",
  "Real product photography, never catalogue filler",
  "A human replies to every message, usually within a day",
];

const StorySection = () => {
  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---------------------------------------------------------- Left:
              the promise card, with a blush block offset behind it */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -left-5 -top-5 h-40 w-40 rounded-4xl bg-[#f3d9d6] sm:h-48 sm:w-48"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-6 -right-4 h-28 w-28 rounded-full border border-[#ecd3b4] sm:h-36 sm:w-36"
            />

            <article className="relative overflow-hidden rounded-[1.75rem] border border-[#ece1d0] bg-white shadow-[0_18px_50px_-24px_rgba(61,5,12,0.35)]">
              {/* Card header */}
              <div className="flex items-center justify-between gap-4 border-b border-[#f0e7d8] bg-[#fdfaf3] px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/Bestlogo.jpg"
                    alt=""
                    width={256}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#ece1d0]"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                    The Elysian promise
                  </span>
                </div>
                <span className="hidden rounded-full border border-[#ecd3b4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-dark sm:inline">
                  Nepal
                </span>
              </div>

              {/* Promise rows */}
              <dl className="divide-y divide-[#f2eade]">
                {PROMISES.map((row) => (
                  <div key={row.label} className="flex items-start gap-4 px-6 py-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      {row.icon}
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-dark">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-sm leading-relaxed text-ink/80">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {/* Card footer */}
              <div className="flex items-center justify-between gap-4 border-t border-[#f0e7d8] bg-brand px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  No fine print, no asterisks
                </p>
                <span className="text-xs font-bold text-[#f0c070]">elysian</span>
              </div>
            </article>
          </div>

          {/* --------------------------------------------------------- Right:
              the story itself */}
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-brand/50" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-dark">
                Our story
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl">
              Built for the way Nepal
              <span className="block text-brand">actually shops</span>
            </h2>

            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/70 sm:text-base">
              <p>
                Elysian began with a complaint we heard often: online shopping here meant guessing
                on quality, paying before anything had shipped, and chasing a delivery with no news.
                So we kept the catalogue small enough to check and the terms plain enough to hold
                ourselves to.
              </p>
              <p>
                Cash on delivery still matters, and so does paying upfront on eSewa, both work on
                every order. Prices are shown in rupees, delivery gets freer the higher you climb,
                and if
                something arrives wrong you have thirty days to send it back.
              </p>
            </div>

            <ul className="mt-8 space-y-3.5">
              {CHECKS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f7e7d2] text-gold-dark">
                    <CheckIcon size={13} strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-ink/80 sm:text-[15px]">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 font-script text-2xl text-brand sm:text-[28px]">
              the Elysian team, Kathmandu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;

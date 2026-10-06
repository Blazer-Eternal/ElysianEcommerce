/**
 * Crimson highlight band, a slow horizontal ticker of the store's headline
 * promises, separated by a small gold lozenge. Sits directly under the hero.
 *
 * The track renders the item list twice and slides by -50%, so the loop is
 * seamless with no duplicated markup logic at the call site. Hovering pauses
 * it, and the global prefers-reduced-motion rule collapses the animation.
 */

const HIGHLIGHTS = [
  "Checked before it ships",
  "From Kathmandu to all of Nepal",
  "No hidden charges",
  "Fair prices, always",
  "Real help, real people",
  "Returns in 30 days, full refund",
  "Points on every rupee",
];

const Lozenge = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="shrink-0 text-[#f0c070]"
  >
    <path d="M12 2.5 15.5 12 12 21.5 8.5 12z" fill="currentColor" />
    <path d="M12 7.2 13.7 12 12 16.8 10.3 12z" fill="#c01e2e" />
  </svg>
);

const Row = () => (
  <ul className="flex shrink-0 items-center">
    {HIGHLIGHTS.map((item) => (
      <li key={item} className="flex shrink-0 items-center">
        <span className="whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white sm:px-8 sm:text-xs">
          {item}
        </span>
        <Lozenge />
      </li>
    ))}
  </ul>
);

const MarqueeTicker = () => (
  <section
    aria-label="Store highlights"
    className="relative overflow-hidden border-y border-[#8d1222] bg-brand"
  >
    {/* Soft gold wash so the flat crimson band still has depth */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{
        background:
          "linear-gradient(90deg, rgba(61,5,12,0.55) 0%, rgba(61,5,12,0) 18%, rgba(61,5,12,0) 82%, rgba(61,5,12,0.55) 100%)",
      }}
    />

    <div className="relative py-3 sm:py-3.5">
      <div className="marquee-track">
        <Row />
        {/* Duplicate, hidden from assistive tech so the list is announced once */}
        <div aria-hidden="true" className="flex shrink-0">
          <Row />
        </div>
      </div>
    </div>
  </section>
);

export default MarqueeTicker;

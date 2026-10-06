import { useMemo, useState } from "react";
import { CheckIcon } from "../icons";

/**
 * "Elysian, on your phone" — the download-app panel that closes the landing
 * page. Crimson slab with a faint ornament lattice, story on the left, a white
 * QR card on the right.
 *
 * The QR encodes the current origin (there is no published app store build
 * yet), so it always resolves to something real. If the QR service is
 * unreachable the card falls back to printing the address instead of showing a
 * broken image.
 */

const PERKS = [
  "Track an order from dispatch to doorstep",
  "Reorder a past basket in two taps",
  "Get the word first when saved items restock",
];

const DownloadGlyph = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PlayGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4 2.5v19c0 .6.6 1 1.1.7l14.4-9.5c.5-.3.5-1 0-1.4L5.1 1.8C4.6 1.5 4 1.9 4 2.5z" />
  </svg>
);

const AppleGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.2 1.2-2.4 1.3-2.5-.1 0-2.5-1-2.5-3.6zM14.1 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z" />
  </svg>
);

const StoreBadge = ({ glyph, top, bottom }: { glyph: React.ReactNode; top: string; bottom: string }) => (
  <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-[#2a1a14] px-3 py-2.5">
    <span className="text-white/90">{glyph}</span>
    <span className="min-w-0 leading-tight">
      <span className="block text-[8px] font-semibold uppercase tracking-[0.16em] text-white/60">
        {top}
      </span>
      <span className="block text-[13px] font-semibold text-white">{bottom}</span>
    </span>
  </div>
);

const AppSection = () => {
  const [qrFailed, setQrFailed] = useState(false);

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : "elysian.com.np"),
    []
  );

  const qrSrc = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&ecc=M&data=${encodeURIComponent(
        origin
      )}`,
    [origin]
  );

  return (
    <section className="bg-cream px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand shadow-[0_30px_70px_-40px_rgba(61,5,12,0.9)]">
        <div className="relative">
          {/* Ornament lattice */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          {/* Gold bloom in the top-right corner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 90% at 95% 0%, rgba(209,128,41,0.55) 0%, rgba(209,128,41,0) 60%)",
            }}
          />

          <div className="relative grid grid-cols-1 gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:p-14">
            {/* ------------------------------------------------------ Left */}
            <div>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[#f0c070]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#f0c070]">
                  Shop on the go
                </span>
              </div>

              <h2 className="mt-5 text-4xl font-semibold leading-[1.05] text-white sm:text-5xl">
                Elysian, on your phone
              </h2>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-base">
                The app is still in build. Until it ships, the code below opens the storefront on
                your phone — same catalogue, same cart, same account, sized for a smaller screen.
              </p>

              <ul className="mt-7 space-y-3.5">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f0c070] text-brand-dark">
                      <CheckIcon size={13} strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-white/85 sm:text-[15px]">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ----------------------------------------------------- Right */}
            <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.7)] sm:p-6">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-ink/50">
                Get the app
              </p>

              <div className="mt-4 rounded-2xl border-2 border-dashed border-[#ecd3b4] bg-[#fdfaf3] p-4">
                <div className="mx-auto flex h-[200px] w-[200px] items-center justify-center">
                  {qrFailed ? (
                    <span className="break-all px-2 text-center text-xs font-semibold text-ink/60">
                      {origin}
                    </span>
                  ) : (
                    <img
                      src={qrSrc}
                      alt={`QR code linking to ${origin}`}
                      width={240}
                      height={240}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                      onError={() => setQrFailed(true)}
                    />
                  )}
                </div>
              </div>

              <a
                href={origin}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
              >
                <DownloadGlyph />
                Scan &amp; open the storefront
              </a>

              <div className="mt-3 flex gap-3">
                <StoreBadge glyph={<PlayGlyph />} top="Get it on" bottom="Google Play" />
                <StoreBadge glyph={<AppleGlyph />} top="Download on the" bottom="App Store" />
              </div>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/50">
                Both stores pending release. The code above works today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppSection;

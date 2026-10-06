import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { CoinsIcon, CreditCardIcon, RefreshIcon, TruckIcon } from "../icons";

const ArrowIcon = memo(() => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
));

ArrowIcon.displayName = "ArrowIcon";

const TRUST = [
  { icon: <TruckIcon size={22} />, label: "Free delivery", detail: "above Rs. 2,000" },
  { icon: <CreditCardIcon size={22} />, label: "Pay your way", detail: "COD or eSewa" },
  { icon: <RefreshIcon size={22} />, label: "30-day returns", detail: "full refund" },
  { icon: <CoinsIcon size={22} />, label: "Reward points", detail: "Rs. 2 = 1 point" },
];

const HeroSection = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for animations on view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const node = containerRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-cream pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24 section-container animation-container"
      style={{ contain: "layout style paint" }}
    >
      {/* Warm washes — cheap, static, no canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 8% 0%, rgba(212,139,146,0.28) 0%, rgba(212,139,146,0) 60%), radial-gradient(55% 65% at 100% 15%, rgba(209,128,41,0.24) 0%, rgba(209,128,41,0) 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(192,30,46,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(70% 60% at 50% 40%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 40%, #000 0%, transparent 75%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div
            className={`space-y-7 order-2 lg:order-1 transition-smooth ${
              isInView ? "animate-slide-in-left" : "opacity-0"
            }`}
          >
            <div className="space-y-5">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-[#ecd3b4] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand animate-fade-in"
                style={{ animationDelay: isInView ? "0.1s" : "0s" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
                Free delivery above Rs. 2,000
              </div>

              <h1
                className="text-[2.6rem] leading-[1.02] font-bold text-ink sm:text-6xl lg:text-[4.25rem] animate-fade-in"
                style={{ animationDelay: isInView ? "0.2s" : "0s" }}
              >
                Where every find
                <span className="block text-brand">feels special.</span>
              </h1>

              <p
                className="text-[15px] leading-relaxed text-ink/70 max-w-xl animate-fade-in sm:text-lg"
                style={{ animationDelay: isInView ? "0.3s" : "0s" }}
              >
                A curated store for Nepal — checked products, rupee prices you can read at a
                glance, cash on delivery or eSewa, and thirty days to change your mind.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
              <Link
                to={ROUTES.PRODUCTS}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3.5 sm:py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_14px_30px_-16px_rgba(61,5,12,0.9)] transition-colors hover:bg-brand-dark gpu-accelerate"
              >
                Shop the collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>

              <Link
                to={ROUTES.FEATURES}
                className="inline-flex items-center justify-center rounded-xl border border-brand/30 bg-white px-8 py-3.5 sm:py-4 text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:border-brand hover:bg-brand/5 gpu-accelerate"
              >
                See how it works
              </Link>
            </div>

            {/* Trust strip */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#e8dcc8] pt-6 sm:grid-cols-4 sm:gap-x-4">
              {TRUST.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="mt-0.5 text-brand">{item.icon}</span>
                  <div className="min-w-0">
                    <dt className="text-[13px] font-bold leading-tight text-ink">{item.label}</dt>
                    <dd className="mt-0.5 text-[12px] leading-tight text-ink/55">{item.detail}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Right side - brand mark */}
          <div
            className={`order-1 lg:order-2 flex justify-center lg:justify-end transition-smooth ${
              isInView ? "animate-slide-in-right" : "opacity-0"
            }`}
            style={{ contain: "layout style paint" }}
          >
            <div className="relative w-full max-w-md">
              {/* offset blush block */}
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-4 h-32 w-32 rounded-[1.75rem] bg-[#f3d9d6] sm:h-40 sm:w-40"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full border border-[#ecd3b4] sm:h-36 sm:w-36"
              />

              <div className="relative overflow-hidden rounded-[2rem] border border-[#ece1d0] bg-white shadow-[0_28px_60px_-32px_rgba(61,5,12,0.5)]">
                <div className="aspect-square flex items-center justify-center overflow-hidden bg-[#fdfaf3]">
                  <img
                    src="/images/NewLogo.jpg"
                    alt="Elysian E-commerce — where every find feels special"
                    width={1000}
                    height={1080}
                    fetchPriority="high"
                    className="w-full h-full object-contain p-4 gpu-accelerate"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Floating chips */}
              <div className="absolute -left-3 top-6 hidden rounded-xl border border-[#ece1d0] bg-white px-3.5 py-2 shadow-[0_10px_26px_-16px_rgba(61,5,12,0.7)] sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                  Curated
                </p>
                <p className="text-[12px] font-semibold text-ink">Checked before listing</p>
              </div>

              <div className="absolute -right-3 bottom-8 hidden rounded-xl bg-brand px-3.5 py-2 shadow-[0_12px_28px_-14px_rgba(61,5,12,0.9)] sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f0c070]">
                  Returns
                </p>
                <p className="text-[12px] font-semibold text-white">30 days, no questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;

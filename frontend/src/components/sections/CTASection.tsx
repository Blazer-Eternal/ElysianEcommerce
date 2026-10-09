import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const ArrowIcon = () => (
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
);

const SparkleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const styles = `

  @keyframes slide-right {
    from {
      transform: translateX(-4px);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .cta-button {
    position: relative;
    overflow: hidden;
    transition: var(--transition-visual-props) 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .cta-button:hover {
    transform: translateY(-2px);
  }

  .arrow-icon {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .cta-button:hover .arrow-icon {
    transform: translateX(4px);
  }

  .line-accent {
    position: relative;
    overflow: hidden;
  }

  .line-accent::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      #c01e2e,
      transparent
    );
    animation: slide-right 1s ease 0.5s forwards;
  }

  .cta-card {
    transition: var(--transition-visual-props) 0.3s ease;
  }

  .cta-card:hover {
    transform: none;
    box-shadow: 0 10px 40px rgba(192, 30, 46, 0.15);
  }
`;

const CTASection = () => {
  return (
    <>
      <style>{styles}</style>

      <div className="py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div>
            <div className="relative group">

              {/* Main CTA card */}
              <div className="cta-card relative glass-strong rounded-3xl p-6 sm:p-8 lg:p-10 text-center space-y-6 border border-[#ece1d0]">

                {/* Content */}
                <div className="space-y-4">

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/8 border border-brand/20 mb-2">
                    <SparkleIcon />

                    <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-brand">
                      Ready when you are
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold wrap-break-word text-ink leading-[1.06]">
                    Start with the{" "}
                    <span className="block text-brand">
                      latest arrivals
                    </span>
                  </h2>

                  <p className="text-ink/65 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium line-clamp-3">
                    Browse what has just landed, or search for the one thing you came for.
                    Checkout takes cash on delivery or eSewa, and your delivery charge shrinks as
                    you climb the membership tiers.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">

                  {/* Primary CTA */}
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="cta-button relative px-6 sm:px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide text-white text-xs sm:text-sm bg-brand hover:bg-brand-dark flex items-center justify-center gap-2 group shadow-[0_14px_30px_-16px_rgba(61,5,12,0.9)] border border-brand whitespace-nowrap"
                  >
                    <span>Browse products</span>
                    <ArrowIcon />
                  </Link>

                  {/* Secondary CTA */}
                  <Link
                    to={ROUTES.CONTACT}
                    className="cta-button secondary-cta relative px-6 sm:px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide text-brand text-xs sm:text-sm bg-white flex items-center justify-center gap-2 border border-brand/30 hover:border-brand hover:bg-brand/5 whitespace-nowrap"
                  >
                    Talk to us
                  </Link>
                </div>

                {/* Footer note with animation */}
                <div className="pt-4 border-t border-[#ece1d0]">
                  <p className="text-xs sm:text-sm text-ink/60 font-medium line-accent">
                    New stock lands weekly. Create an account to keep your points, wishlist and
                    order history in one place.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTASection;
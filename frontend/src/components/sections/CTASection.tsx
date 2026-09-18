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
  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      box-shadow:
        0 0 20px rgba(14, 124, 133, 0.3),
        0 0 40px rgba(6, 182, 212, 0.2);
    }

    50% {
      box-shadow:
        0 0 30px rgba(14, 124, 133, 0.5),
        0 0 60px rgba(6, 182, 212, 0.3);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }

    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes radiant-glow {
    0%, 100% {
      box-shadow:
        0 0 20px rgba(14, 124, 133, 0.4),
        inset 0 0 20px rgba(6, 182, 212, 0.1);
    }

    50% {
      box-shadow:
        0 0 40px rgba(14, 124, 133, 0.6),
        inset 0 0 30px rgba(6, 182, 212, 0.2);
    }
  }

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

  @keyframes subtle-scale {
    0%, 100% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.02);
    }
  }

  .gradient-animated {
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }

  .cta-button {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 3s infinite;
    transition: all 0.5s ease;
  }

  .cta-button:hover::before {
    left: 100%;
  }

  .cta-button:hover {
    transform: translateY(-2px);
  }

  .primary-cta {
    animation: subtle-scale 3s ease-in-out infinite;
  }

  .primary-cta:hover {
    animation: radiant-glow 2s ease-in-out infinite;
  }

  .arrow-icon {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .cta-button:hover .arrow-icon {
    transform: translateX(4px);
  }

  .secondary-cta:hover {
    animation: glow-pulse 2s ease-in-out infinite;
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
      #0e7c85,
      transparent
    );
    animation: slide-right 1s ease 0.5s forwards;
  }

  .cta-card {
    transition: all 0.3s ease;
  }

  .cta-card:hover {
    transform: none;
    box-shadow: 0 10px 40px rgba(14, 124, 133, 0.15);
  }
`;

const CTASection = () => {
  return (
    <>
      <style>{styles}</style>

      <div className="py-8 sm:py-10 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 -z-10">

          {/* Primary gradient blob */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-linear-to-br from-cyan-300/40 via-teal-300/30 to-blue-200/20 rounded-full blur-3xl animate-blob" />

          {/* Secondary gradient blob */}
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-linear-to-tr from-teal-300/40 via-cyan-300/30 to-cyan-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

          {/* Tertiary accent blob */}
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-linear-to-r from-blue-300/30 to-cyan-300/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div>
            <div className="relative group">

              {/* Radiant border effect */}
              <div className="absolute inset-0 bg-linear-to-r from-teal-400/30 via-cyan-400/30 to-blue-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Main CTA card */}
              <div className="cta-card relative glass-strong rounded-3xl p-6 sm:p-8 lg:p-10 text-center space-y-6 border border-white/20 backdrop-blur-xl">

                {/* Content */}
                <div className="space-y-4">

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-teal-100/40 to-cyan-100/40 border border-teal-200/30 mb-2">
                    <SparkleIcon />

                    <span className="text-xs sm:text-sm font-semibold text-teal-700">
                      Limited Time Offer
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent wrap-break-word">
                    Ready to Start{" "}
                    <span className="block bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent gradient-animated">
                      Shopping?
                    </span>
                  </h2>

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium line-clamp-3">
                    Premium products handpicked for you. Experience shopping redefined with elegance, quality, and care.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">

                  {/* Primary CTA */}
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="cta-button primary-cta relative px-6 sm:px-8 py-3 rounded-2xl font-semibold text-white text-sm sm:text-base bg-linear-to-br from-teal-500 via-teal-600 to-cyan-600 hover:from-teal-600 hover:via-teal-700 hover:to-cyan-700 flex items-center justify-center gap-2 group shadow-lg hover:shadow-2xl border border-teal-400/50 whitespace-nowrap"
                  >
                    <span>Explore Products</span>
                    <ArrowIcon />
                  </Link>

                  {/* Secondary CTA */}
                  <Link
                    to={ROUTES.CONTACT}
                    className="cta-button secondary-cta relative px-6 sm:px-8 py-3 rounded-2xl font-semibold text-teal-700 text-sm sm:text-base bg-linear-to-br from-white/80 to-white/60 hover:from-white hover:to-white/80 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl border-2 border-teal-200/60 hover:border-teal-300 whitespace-nowrap"
                  >
                    Get in Touch
                  </Link>
                </div>

                {/* Footer note with animation */}
                <div className="pt-4 border-t border-white/40">
                  <p className="text-xs sm:text-sm text-gray-700 font-semibold line-accent">
                    💝 Subscribe to our newsletter for exclusive deals and
                    early access to new collections
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
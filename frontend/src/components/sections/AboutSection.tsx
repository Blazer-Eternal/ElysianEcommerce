import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { GemIcon, HeartIcon, PenToolIcon, StarIcon, TargetIcon } from "../icons";

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AboutSection = () => {
  const stats = [
    { label: "Excellence & Care", value: <StarIcon size={36} />, color: "from-brand" },
    { label: "Beautiful Experience", value: <HeartIcon size={36} />, color: "from-cyan-500" },
    { label: "Thoughtful Design", value: <PenToolIcon size={36} />, color: "from-teal-400" },
    { label: "Premium Always", value: <GemIcon size={36} />, color: "from-blue-500" },
  ];

  const benefits = [
    "Curated selection of premium products",
    "Hassle-free returns & exchanges",
    "Transparent pricing with no hidden fees",
    "Dedicated customer success team",
  ];

  return (
    <div className="py-12 sm:py-16 relative overflow-hidden">
      <style>{`

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .group-hover-lift {
          transition: var(--transition-visual-props) 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group:hover .group-hover-lift {
          transform: translateY(-8px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-bold text-brand border border-gray-200 group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
                About ElysianEcommerce
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black text-gray-900 leading-tight">
                Your Trusted Online{' '}
                <span className="text-brand" style={{ backgroundSize: '200% 200%' }}>
                  Shopping Partner
                </span>
              </h2>

              <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-light">
                We're committed to bringing you an exceptional shopping experience. Our platform combines the latest technology with a passion for customer satisfaction, ensuring every purchase is a delight.
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group/benefit flex items-start gap-4 p-3 rounded-lg hover:bg-white transition-all duration-300 cursor-default"
                >
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-linear-to-br from-brand to-cyan-500 flex items-center justify-center text-white shrink-0 group-hover/benefit:scale-110 group-hover/benefit:shadow-lg group-hover/benefit:shadow-brand/50 transition-all duration-300 transform">
                    <CheckIcon />
                  </div>
                  <span className="text-gray-700 font-medium text-base sm:text-lg group-hover/benefit:text-gray-900 transition-colors duration-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to={ROUTES.ABOUT}
              className="inline-block group/cta relative px-8 py-4 rounded-2xl font-bold text-white bg-linear-to-r from-brand via-cyan-500 to-teal-400 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden text-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Learn more about us
                <span className="transform group-hover/cta:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </Link>
          </div>

          {/* Right side - Stats */}
          <div className="space-y-6">
            {/* Main Stats Card */}
            <div className="glass rounded-3xl p-8 sm:p-12 border border-gray-200 hover:border-brand/80 transition-all duration-500 group space-y-8 group-hover-lift">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-brand transition-colors duration-300">
                What We Bring
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat p-4 rounded-xl hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10 transition-all duration-400 cursor-default"
                  >
                    <div className="space-y-3">
                      <div className={`text-5xl sm:text-6xl font-black`}>
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 font-semibold group-hover/stat:text-gray-900 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-transparent via-white/50 to-transparent group-hover:via-white/70 transition-all duration-300"></div>

              {/* Additional info */}
              <div className="space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed font-light group-hover:text-gray-800 transition-colors duration-300">
                  Discover the art of purposeful shopping where every item is chosen with intention and care.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative glass rounded-3xl p-8 sm:p-10 border border-gray-200 hover:border-brand/80 bg-linear-to-br from-brand/8 to-cyan-200/8 hover:from-brand/15 hover:to-cyan-200/15 transition-all duration-500 group-hover-lift overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-brand/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

              <div className="relative z-10 space-y-4">
                <p className="text-lg font-bold text-brand group-hover:text-cyan-600 transition-colors duration-300"><TargetIcon size={18} className="inline-block align-[-3px] mr-1.5" />Our Mission</p>
                <p className="text-gray-700 leading-relaxed font-light group-hover:text-gray-800 transition-colors duration-300">
                  To make online shopping straightforward: honest product descriptions, fair prices, deliveries you can track, and returns that actually work.
                </p>
              </div>

              {/* Animated bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-brand via-cyan-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
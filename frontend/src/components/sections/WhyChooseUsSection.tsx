import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const TruckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
    <polygon points="16 8 20 8 23 11 23 16 21 18 21 19 1 19 1 18 3 16"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const HeadsetIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    <path d="M14 7a4 4 0 0 1 4 4"/>
  </svg>
);

const StarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: "delivery",
    title: "Fast Delivery",
    description: "Get your orders delivered quickly and safely to your doorstep with our reliable logistics partners.",
    icon: <TruckIcon />,
  },
  {
    id: "support",
    title: "24/7 Support",
    description: "Our dedicated customer support team is always ready to help you with any questions or concerns.",
    icon: <HeadsetIcon />,
  },
  {
    id: "quality",
    title: "Premium Quality",
    description: "Every product is carefully selected and quality-checked to meet our high standards.",
    icon: <StarIcon />,
  },
  {
    id: "secure",
    title: "Secure Payment",
    description: "Shop with confidence with our encrypted payment gateway and buyer protection policy.",
    icon: <ShieldIcon />,
  },
];

const WhyChooseUsSection = () => {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Why Choose Us</h2>
            <p className="text-gray-600 text-sm sm:text-base">Discover what makes us different</p>
          </div>
          <Link
            to={ROUTES.FEATURES}
            className="hidden sm:inline-block text-sm font-semibold text-[#0e7c85] hover:text-[#0b6169] transition-colors relative group"
          >
            See all features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0e7c85] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-500 cursor-pointer h-full hover:shadow-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(14, 124, 133, 0.1)",
                transitionDelay: `${index * 50}ms`
              }}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-[#0e7c85]/5 to-cyan-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(45deg, #0e7c85, transparent)",
                  padding: "1px",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              ></div>

              {/* Content wrapper */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #0e7c85/15 0%, #06b6d4/10 100%)",
                  }}
                >
                  <div className="text-[#0e7c85] group-hover:text-[#0a5a62] transition-colors duration-500">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-[#0e7c85]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                  {feature.description}
                </p>

                {/* Animated underline */}
                <div className="mt-4 h-0.5 bg-linear-to-r from-[#0e7c85] to-cyan-400 w-0 group-hover:w-12 transition-all duration-500 rounded-full"></div>
              </div>

              {/* Hover lift effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 rounded-2xl opacity-0 group-hover:opacity-5 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Mobile "See all features" link */}
        <div className="sm:hidden mt-8">
          <Link
            to={ROUTES.FEATURES}
            className="inline-block text-sm font-semibold text-[#0e7c85] hover:text-[#0b6169] transition-colors relative group"
          >
            See all features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0e7c85] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsSection;


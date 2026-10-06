import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { HeadsetIcon, ShieldIcon, StarIcon, TruckIcon } from "../icons";

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
            className="hidden sm:inline-block text-sm font-semibold text-brand hover:text-brand-dark transition-colors relative group"
          >
            See all features
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-500 cursor-pointer h-full hover:shadow-2xl gpu-accelerate"
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(192, 30, 46, 0.1)",
                transitionDelay: `${index * 50}ms`,
                contain: "layout style paint",
                transform: "translateZ(0)"
              }}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-brand/5 to-cyan-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(45deg, #c01e2e, transparent)",
                  padding: "1px",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              ></div>

              {/* Content wrapper */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg gpu-accelerate"
                  style={{
                    background: "linear-gradient(135deg, #c01e2e/15 0%, #d18029/10 100%)",
                    transform: "translateZ(0)",
                    willChange: "transform, opacity"
                  }}
                >
                  <div className="text-brand group-hover:text-[#8d1222] transition-colors duration-500">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-brand">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                  {feature.description}
                </p>

                {/* Animated underline */}
                <div className="mt-4 h-0.5 bg-linear-to-r from-brand to-cyan-400 w-12 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
              </div>

              {/* Hover lift effect */}
              <div className="absolute inset-0 bg-white group-hover:bg-white rounded-2xl opacity-0 group-hover:opacity-5 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Mobile "See all features" link */}
        <div className="sm:hidden mt-8">
          <Link
            to={ROUTES.FEATURES}
            className="inline-block text-sm font-semibold text-brand hover:text-brand-dark transition-colors relative group"
          >
            See all features
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsSection;


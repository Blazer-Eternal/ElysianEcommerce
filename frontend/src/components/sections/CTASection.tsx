import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CTASection = () => {
  return (
    <div className="py-16 sm:py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-200/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-teal-200/30 to-cyan-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-8">
          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Ready to Start <span className="bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Shopping?</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Browse our full catalog and find something you'll love. With our easy checkout process and secure payments, shopping has never been simpler.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to={ROUTES.PRODUCTS}
              className="glass-strong px-8 py-3 sm:py-4 rounded-xl font-semibold text-gray-900 hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Explore Products
              <ArrowIcon />
            </Link>

            <Link
              to={ROUTES.CONTACT}
              className="glass px-8 py-3 sm:py-4 rounded-xl font-semibold text-gray-700 hover:bg-white/70 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/40">
            <p className="text-sm text-gray-600">
              💝 Subscribe to our newsletter for exclusive deals and updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;

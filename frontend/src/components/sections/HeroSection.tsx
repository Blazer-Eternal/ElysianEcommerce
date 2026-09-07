import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const HeroSection = () => {
  return (
    <div className="relative min-h-[60vh] sm:min-h-[70vh] overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-24">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-cyan-200/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-teal-200/40 to-cyan-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-block glass px-4 py-2 rounded-full text-sm font-medium text-[#0e7c85]">
                ✨ Welcome to Excellence
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Discover <span className="bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Premium</span> Products
              </h1>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Explore our curated collection of high-quality products delivered with elegance. Experience shopping like never before with our seamless platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to={ROUTES.PRODUCTS}
                className="glass-strong px-8 py-3 sm:py-4 rounded-xl font-semibold text-gray-900 hover:bg-white/90 transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 group text-center"
              >
                Shop Now
                <ArrowIcon />
              </Link>
              
              <Link
                to={ROUTES.FEATURES}
                className="glass px-8 py-3 sm:py-4 rounded-xl font-semibold text-gray-700 hover:bg-white/70 transition-all duration-300 text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-8 pt-4 flex-wrap">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-[#0e7c85]">50k+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-[#0e7c85]">100%</div>
                <div className="text-xs sm:text-sm text-gray-600">Authentic</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-[#0e7c85]">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-8 bg-gradient-to-br from-[#0e7c85]/10 to-cyan-300/10 rounded-3xl blur-2xl"></div>
              
              {/* Main glass card */}
              <div className="glass rounded-3xl p-8 sm:p-12 relative z-10">
                <div className="aspect-square bg-gradient-to-br from-[#eafcfd] to-[#bcecef] rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-white/40 to-cyan-100/40 flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="opacity-60">
                      <rect x="40" y="60" width="120" height="100" rx="8" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M80 80v60M120 80v60" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"/>
                      <circle cx="70" cy="100" r="3" fill="currentColor"/>
                      <circle cx="100" cy="110" r="4" fill="currentColor"/>
                      <circle cx="130" cy="95" r="3" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-3 font-semibold text-[#0e7c85]">
                  30% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

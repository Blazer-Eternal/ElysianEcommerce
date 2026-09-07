import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AboutSection = () => {
  const stats = [
    { label: "Happy Customers", value: "50k+" },
    { label: "Products Listed", value: "10k+" },
    { label: "Categories", value: "50+" },
    { label: "Avg Rating", value: "4.8★" },
  ];

  const benefits = [
    "Curated selection of premium products",
    "Hassle-free returns & exchanges",
    "Transparent pricing with no hidden fees",
    "Dedicated customer success team",
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <div className="inline-block glass px-4 py-2 rounded-full text-sm font-medium text-[#0e7c85]">
                About ElysianEcommerce
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Your Trusted Online <span className="bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Shopping Partner</span>
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We're committed to bringing you an exceptional shopping experience. Our platform combines the latest technology with a passion for customer satisfaction, ensuring every purchase is a delight.
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#0e7c85] to-cyan-600 flex items-center justify-center text-white">
                    <CheckIcon />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to={ROUTES.ABOUT}
              className="inline-block glass-strong px-6 py-3 rounded-xl font-semibold text-gray-900 hover:bg-white/90 transition-all duration-300 text-center"
            >
              Learn more about us
            </Link>
          </div>

          {/* Right side - Stats */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-8 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">By The Numbers</h3>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

              {/* Additional info */}
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Join thousands of satisfied customers who trust us for their shopping needs.
                </p>
                <p className="text-xs text-gray-500">
                  ✓ Established in 2024 • MERN Stack • Always improving
                </p>
              </div>
            </div>

            {/* Decorative card */}
            <div className="glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#0e7c85]/5 to-cyan-200/5 border-l-4 border-[#0e7c85]">
              <p className="text-sm font-semibold text-[#0e7c85] mb-2">🎯 Our Mission</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                To revolutionize online shopping by providing quality products, exceptional service, and an unforgettable user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

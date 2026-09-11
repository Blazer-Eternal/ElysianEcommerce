import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AboutSection = () => {
  const stats = [
    { label: "Happy Customers", value: "50k+", color: "from-[#0e7c85]" },
    { label: "Products Listed", value: "10k+", color: "from-cyan-500" },
    { label: "Categories", value: "50+", color: "from-teal-400" },
    { label: "Avg Rating", value: "4.8★", color: "from-blue-500" },
  ];

  const benefits = [
    "Curated selection of premium products",
    "Hassle-free returns & exchanges",
    "Transparent pricing with no hidden fees",
    "Dedicated customer success team",
  ];

  return (
    <div className="py-16 sm:py-32 relative overflow-hidden">
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-shimmer {
          background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .group-hover-lift {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group:hover .group-hover-lift {
          transform: translateY(-8px);
        }
      `}</style>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-float-slow" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-[#0e7c85]/20 to-cyan-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" style={{ animationDelay: '-2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 sm:space-y-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-bold text-[#0e7c85] backdrop-blur-xl border border-white/60 group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0e7c85] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0e7c85]"></span>
                </span>
                About ElysianEcommerce
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black text-gray-900 leading-tight">
                Your Trusted Online{' '}
                <span className="bg-gradient-to-r from-[#0e7c85] via-cyan-500 to-teal-400 bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% 200%' }}>
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
                  className="group/benefit flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-all duration-300 cursor-default"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-[#0e7c85] to-cyan-500 flex items-center justify-center text-white flex-shrink-0 group-hover/benefit:scale-110 group-hover/benefit:shadow-lg group-hover/benefit:shadow-[#0e7c85]/50 transition-all duration-300 transform">
                    <CheckIcon />
                  </div>
                  <span className="text-gray-700 font-medium text-base sm:text-lg group-hover/benefit:text-gray-900 transition-colors duration-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to={ROUTES.ABOUT}
              className="inline-block group/cta relative px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#0e7c85] via-cyan-500 to-teal-400 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 overflow-hidden text-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Learn more about us
                <span className="transform group-hover/cta:translate-x-2 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover/cta:translate-x-0 transition-transform duration-500 animate-shimmer" />
            </Link>
          </div>

          {/* Right side - Stats */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Main Stats Card */}
            <div className="glass rounded-3xl p-8 sm:p-12 backdrop-blur-2xl border border-white/70 hover:border-[#0e7c85]/80 transition-all duration-500 group space-y-8 group-hover-lift">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-[#0e7c85] transition-colors duration-300">
                By The Numbers
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="group/stat p-4 rounded-xl hover:bg-gradient-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10 transition-all duration-400 cursor-default"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="space-y-3">
                      <div className={`text-5xl sm:text-6xl font-black animate-gradient`} style={{
                        backgroundImage: `linear-gradient(90deg, #0e7c85, #06b6d4, #14b8a6, #0e7c85)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundSize: '200% 200%'
                      }}>
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-semibold group-hover/stat:text-gray-800 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-white/70 transition-all duration-300"></div>

              {/* Additional info */}
              <div className="space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed font-light group-hover:text-gray-800 transition-colors duration-300">
                  Join thousands of satisfied customers who trust us for their shopping needs.
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  ✓ Established in 2024 • MERN Stack • Always improving
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative glass rounded-3xl p-8 sm:p-10 backdrop-blur-2xl border border-white/60 hover:border-[#0e7c85]/80 bg-gradient-to-br from-[#0e7c85]/8 to-cyan-200/8 hover:from-[#0e7c85]/15 hover:to-cyan-200/15 transition-all duration-500 group-hover-lift overflow-hidden">
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0e7c85]/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
              
              <div className="relative z-10 space-y-4">
                <p className="text-lg font-bold text-[#0e7c85] group-hover:text-cyan-600 transition-colors duration-300">🎯 Our Mission</p>
                <p className="text-gray-700 leading-relaxed font-light group-hover:text-gray-800 transition-colors duration-300">
                  To revolutionize online shopping by providing quality products, exceptional service, and an unforgettable user experience.
                </p>
              </div>

              {/* Animated bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0e7c85] via-cyan-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;


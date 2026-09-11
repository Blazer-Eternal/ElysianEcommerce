import { GhostFibers } from "../components/GhostFibers";

const TruckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
    <polygon points="16 8 20 8 23 11 23 16 21 18 21 19 1 19 1 18 3 16"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const HeadsetIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2-8.83"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Worldwide Delivery",
    description: "Fast and reliable shipping to your doorstep, wherever you are in the world.",
    icon: <TruckIcon />,
  },
  {
    title: "24/7 Customer Support",
    description: "Our dedicated support team is always ready to help with any questions.",
    icon: <HeadsetIcon />,
  },
  {
    title: "Premium Quality",
    description: "Every product is carefully selected and quality-checked before shipment.",
    icon: <StarIcon />,
  },
  {
    title: "Secure Checkout",
    description: "Your data and payment information are protected with industry-standard encryption.",
    icon: <CreditCardIcon />,
  },
  {
    title: "Easy Returns",
    description: "Hassle-free 30-day return policy on eligible items with full refunds.",
    icon: <RefreshIcon />,
  },
  {
    title: "Buyer Protection",
    description: "Shop with confidence knowing you're covered by our buyer protection guarantee.",
    icon: <ShieldIcon />,
  },
];

const Features = () => {
  return (
    <div className="space-y-20 pb-20 sm:pb-32">
      {/* Hero Section with GhostFibers */}
      <div className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 overflow-hidden">
        {/* GhostFibers background */}
        <div className="absolute inset-0 -z-10" style={{ width: '100%', height: '100%' }}>
          <GhostFibers
            lineColor="#0e7c85"
            glowColor="#06b6d4"
            speed={0.2}
            scale={2.2}
            rotation={0}
            rotationSpeed={0.15}
            layers={4}
            waveAmplitude={0.015}
            waveFrequency={3}
            waveSpeed={0.15}
            layerSpeed={0.08}
            twist={0.1}
            twistFrequency={5}
            twistSpeed={1.2}
            lineFrequency={5}
            lineSpacing={2}
            lineSharpness={16}
            glowFalloff={10}
            glowIntensity={1.6}
            brightness={2}
            blueBoost={1.2}
            vignette={0.7}
            grain={0.04}
            dpr={1}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 animate-fade-in-up">
            Why Shop With <span className="bg-linear-to-r from-[#0e7c85] via-cyan-500 to-teal-400 bg-clip-text text-transparent animate-pulse">Us</span>
          </h1>
          <p
            className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            Everything we do is built around getting this right — delivering excellence in every interaction.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background Animation */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#0e7c85]/10 via-cyan-500/5 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />

              {/* Card */}
              <div className="relative glass rounded-2xl p-8 backdrop-blur-xl border border-white/40 hover:border-[#0e7c85]/50 hover:bg-white/60 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-cyan-500/20">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#0e7c85]/25 via-cyan-300/15 to-teal-200/25 rounded-xl group-hover:from-[#0e7c85]/40 group-hover:via-cyan-400/30 group-hover:to-teal-300/40 transition-all duration-500 mb-4 text-[#0e7c85] group-hover:scale-110 transform group-hover:rotate-6">
                  {feature.icon}
                </div>

                {/* Content */}
                <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#0e7c85] transition-colors duration-300">
                  {feature.title}
                </h2>

                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Animated Bottom Bar */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 bg-linear-to-r from-[#0e7c85] to-cyan-500 rounded-full w-1 group-hover:w-8 transition-all duration-500" />
                  <div className="flex-1 h-0.5 bg-linear-to-r from-[#0e7c85]/50 to-transparent group-hover:from-cyan-500/50 group-hover:to-teal-400/50 transition-all duration-500 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Quality Assurance
            </h2>

            <p className="text-gray-600 leading-relaxed">
              We go above and beyond to ensure every product meets our stringent quality standards. Our team manually inspects and verifies each item before it ships to you.
            </p>

            <ul className="space-y-3">
              {[
                "Rigorous quality control process",
                "Authentic product verification",
                "Safe packaging and handling",
                "Real-time tracking updates",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-gray-700 group/item hover:text-[#0e7c85] transition-colors duration-300 cursor-default"
                >
                  <span className="shrink-0 w-2 h-2 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500 group-hover/item:scale-150 transition-transform duration-300"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl p-8 sm:p-12 space-y-8 backdrop-blur-xl border border-white/40 hover:border-[#0e7c85]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 animate-fade-in-up">
            <style>{`
              @keyframes gradient-shift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }

              .animate-gradient {
                background-size: 200% 200%;
                animation: gradient-shift 6s ease infinite;
              }
            `}</style>

            <div className="space-y-2 group/stat p-4 rounded-xl hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10 transition-all duration-300">
              <div
                className="text-4xl font-bold animate-gradient"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #0e7c85, #06b6d4, #14b8a6, #0e7c85)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                100%
              </div>

              <div className="text-gray-600 group-hover/stat:text-gray-700 transition-colors duration-300">
                Authentic Products
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-[#0e7c85]/40 to-transparent"></div>

            <div className="space-y-2 group/stat p-4 rounded-xl hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10 transition-all duration-300">
              <div
                className="text-4xl font-bold animate-gradient"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #0e7c85, #06b6d4, #14b8a6, #0e7c85)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                4.8★
              </div>

              <div className="text-gray-600 group-hover/stat:text-gray-700 transition-colors duration-300">
                Average Rating
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-[#0e7c85]/40 to-transparent"></div>

            <div className="space-y-2 group/stat p-4 rounded-xl hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10 transition-all duration-300">
              <div
                className="text-4xl font-bold animate-gradient"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #0e7c85, #06b6d4, #14b8a6, #0e7c85)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                0%
              </div>

              <div className="text-gray-600 group-hover/stat:text-gray-700 transition-colors duration-300">
                Hidden Fees
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <div className="relative group animate-fade-in-up">
          {/* Gradient background glow */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-[#0e7c85]/20 via-cyan-500/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

          {/* Card */}
          <div className="relative glass-strong rounded-3xl p-12 text-center space-y-6 backdrop-blur-xl border border-white/50 group-hover:border-[#0e7c85]/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/30">
            <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 via-[#0e7c85] to-gray-900 bg-clip-text text-transparent">
              Experience the Difference
            </h2>

            <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">
              Start shopping today and discover why thousands choose ElysianEcommerce.
            </p>

            <a
              href="/products"
              className="inline-block group/btn relative px-8 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#0e7c85] via-cyan-500 to-teal-400 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Browse Products
                <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>

              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
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
    <div className="space-y-20">
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Why Shop With <span className="bg-linear-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
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
              className="glass rounded-2xl p-8 hover:bg-white/80 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#0e7c85]/20 to-cyan-200/20 rounded-xl group-hover:from-[#0e7c85]/30 group-hover:to-cyan-200/30 transition-all duration-300 mb-4 text-[#0e7c85]">
                {feature.icon}
              </div>

              {/* Content */}
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h2>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>

              {/* Hover indicator */}
              <div className="mt-4 w-1 h-1 bg-[#0e7c85] rounded-full group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Quality Assurance</h2>
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
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#0e7c85]"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-8 sm:p-12 space-y-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#0e7c85]">100%</div>
              <div className="text-gray-600">Authentic Products</div>
            </div>
            <div className="h-px bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#0e7c85]">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="h-px bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#0e7c85]">0%</div>
              <div className="text-gray-600">Hidden Fees</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong rounded-3xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Experience the Difference</h2>
          <p className="text-gray-600 text-lg">
            Start shopping today and discover why thousands choose ElysianEcommerce.
          </p>
          <a
            href="/products"
            className="inline-block glass px-8 py-3 rounded-xl font-semibold text-gray-900 hover:bg-white/70 transition-all duration-300"
          >
            Browse Products →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;

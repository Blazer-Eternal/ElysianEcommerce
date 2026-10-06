import {
  CreditCardIcon,
  HeadsetIcon,
  RefreshIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
} from "../components/icons";

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
    <div className="space-y-24 pb-20 sm:pb-32">
      {/* Hero Section */}
      <div className="relative pt-12 pb-8 sm:pt-24 sm:pb-16 overflow-hidden">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink">
            Why Shop With <span className="text-brand">Us</span>
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed max-w-2xl mx-auto">
            Every order is held to these standards, from the warehouse to your doorstep.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <div className="h-px w-16 bg-brand/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Gradient Background Animation */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" style={{ background: "linear-gradient(to bottom right, rgba(192,30,46,0.10), rgba(209,128,41,0.06), rgba(212,139,146,0.10))" }} />

              {/* Card */}
              <div className="relative glass rounded-2xl p-8 border border-[#ece1d0] hover:border-brand/40 hover:bg-white transition-all duration-500 h-full hover:shadow-[0_16px_40px_rgba(61,5,12,0.12)]">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-brand/25 via-cyan-300/15 to-teal-200/25 rounded-xl group-hover:from-brand/40 group-hover:via-cyan-400/30 group-hover:to-teal-300/40 transition-all duration-500 mb-4 text-brand group-hover:scale-110 transform group-hover:rotate-6">
                  {feature.icon}
                </div>

                {/* Content */}
                <h2 className="text-xl font-semibold text-ink mb-3 group-hover:text-brand transition-colors duration-300">
                  {feature.title}
                </h2>

                <p className="text-ink/70 leading-relaxed group-hover:text-ink/80 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Animated Bottom Bar */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 bg-linear-to-r from-brand to-cyan-500 rounded-full w-8 -mr-7 [clip-path:inset(0_28px_0_0_round_2px)] group-hover:[clip-path:inset(0_0_0_0_round_2px)] transition-[clip-path] duration-500" />
                  <div className="flex-1 h-0.5 bg-linear-to-r from-brand/50 to-transparent group-hover:from-cyan-500/50 group-hover:to-teal-400/50 transition-all duration-500 rounded-full group-hover:translate-x-7" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink">
              Quality Assurance
            </h2>

            <div className="h-px w-16 bg-brand/40" />

            <p className="text-ink/70 leading-relaxed">
              Our team manually inspects and verifies each item before it ships to you. Nothing leaves the warehouse unchecked.
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
                  className="flex items-center gap-3 text-ink/80 group/item hover:text-brand transition-colors duration-300 cursor-default"
                >
                  <span className="shrink-0 w-2 h-2 rounded-full bg-linear-to-r from-brand to-cyan-500 group-hover/item:scale-150 transition-transform duration-300"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-8 sm:p-10 space-y-6 border border-[#ece1d0] hover:border-brand/40 transition-all duration-500 hover:shadow-[0_16px_40px_rgba(61,5,12,0.12)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              By the numbers
            </p>

            <div className="space-y-2 group/stat p-4 rounded-xl hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="text-4xl font-bold text-brand">
                100%
              </div>

              <div className="text-ink/70 group-hover/stat:text-ink/80 transition-colors duration-300">
                Authentic Products
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-brand/40 to-transparent"></div>

            <div className="space-y-2 group/stat p-4 rounded-xl hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="text-4xl font-bold text-brand">
                4.8★
              </div>

              <div className="text-ink/70 group-hover/stat:text-ink/80 transition-colors duration-300">
                Average Rating
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-brand/40 to-transparent"></div>

            <div className="space-y-2 group/stat p-4 rounded-xl hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="text-4xl font-bold text-brand">
                0%
              </div>

              <div className="text-ink/70 group-hover/stat:text-ink/80 transition-colors duration-300">
                Hidden Fees
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <div className="relative group">

          {/* Card */}
          <div className="relative glass-strong rounded-2xl p-10 sm:p-12 text-center space-y-6 border border-[#ece1d0] group-hover:border-brand/40 transition-all duration-500 group-hover:shadow-[0_16px_40px_rgba(61,5,12,0.12)]">
            <div className="flex justify-center gap-3">
              <div className="h-px w-16 bg-brand/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
            </div>

            <h2 className="text-3xl font-bold text-ink">
              Ready when you are
            </h2>

            <p className="text-ink/70 text-lg transition-colors duration-300">
              Free delivery over Rs. 2,000, and 30-day returns on eligible items.
            </p>

            <a
              href="/products"
              className="inline-block group/btn relative px-8 py-3 rounded-xl font-semibold text-white bg-brand hover:bg-brand-dark transition-all duration-300 shadow-[0_2px_16px_rgba(61,5,12,0.18)] hover:shadow-[0_8px_24px_rgba(61,5,12,0.24)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Browse Products
                <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>

            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
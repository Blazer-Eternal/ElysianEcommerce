import { HeartIcon, SproutIcon, TargetIcon, TrendUpIcon, UsersIcon, ZapIcon } from "../components/icons";

const Values = () => {
  const coreValues = [
    {
      title: "Integrity & Transparency",
      description:
        "We believe in honest communication and transparent practices. Every price you see is what you pay, with no hidden fees or surprise charges. Our commitment to transparency extends to our supply chain, product sourcing, and customer service policies.",
      icon: <TargetIcon size={28} />,
      details: [
        "No hidden charges or surprise fees",
        "Clear return and refund policies",
        "Transparent product sourcing",
        "Honest customer reviews and ratings",
      ],
    },
    {
      title: "Customer-First Excellence",
      description:
        "Our customers are at the heart of everything we do. We don't just sell products; we build relationships. Every decision is made with your satisfaction in mind, from product curation to post-purchase support.",
      icon: <HeartIcon size={28} />,
      details: [
        "24/7 dedicated customer support",
        "Personalized shopping experiences",
        "Loyalty rewards program",
        "Community feedback integration",
      ],
    },
    {
      title: "Innovation & Technology",
      description:
        "Smart, intuitive technology that adapts to you. We continuously innovate to provide seamless, secure, and delightful shopping experiences.",
      icon: <ZapIcon size={28} />,
      details: [
        "Personalized recommendations",
        "Real-time inventory updates",
        "Secure payment processing",
        "Mobile-first experience",
      ],
    },
    {
      title: "Sustainability & Ethics",
      description:
        "We're committed to reducing our environmental footprint and supporting ethical practices. From eco-friendly packaging to fair trade partnerships, we believe business should be a force for good.",
      icon: <SproutIcon size={28} />,
      details: [
        "Eco-friendly packaging solutions",
        "Carbon-neutral shipping options",
        "Support for fair trade practices",
        "Sustainable supplier partnerships",
      ],
    },
    {
      title: "Diversity & Inclusion",
      description:
        "We celebrate diversity in all its forms. Our platform is designed to be accessible to everyone, with inclusive product selections and a welcoming community that respects all backgrounds and perspectives.",
      icon: <UsersIcon size={28} />,
      details: [
        "Inclusive product categories",
        "Accessible website design (WCAG compliant)",
        "Support for minority-owned businesses",
        "Diverse team representation",
      ],
    },
    {
      title: "Continuous Improvement",
      description:
        "We never settle. Our culture of continuous learning and improvement drives us to enhance every aspect of the platform. Your feedback directly shapes our roadmap and priorities.",
      icon: <TrendUpIcon size={28} />,
      details: [
        "Regular feature updates",
        "User feedback integration",
        "Performance optimization",
        "Security enhancement cycles",
      ],
    },
  ];

  const promises = [
    {
      title: "Quality Guarantee",
      content:
        "Every product is checked before it reaches you. We partner only with verified sellers and manufacturers who meet our standards. If something doesn't meet expectations, we make it right, guaranteed.",
    },
    {
      title: "Fair Pricing",
      content:
        "We negotiate directly with suppliers to offer you the best prices without compromising quality. Our competitive pricing model ensures you get maximum value for your money.",
    },
    {
      title: "Lightning-Fast Delivery",
      content:
        "Our optimized logistics network ensures your orders arrive quickly and safely. Track every package in real-time and receive updates at every step of your journey.",
    },
    {
      title: "Hassle-Free Returns",
      content:
        "Changed your mind? No problem. Our flexible 30-day return policy means you can shop with confidence. Free return shipping on most items makes returns effortless.",
    },
    {
      title: "Secure & Private",
      content:
        "Your data is sacred. We use bank-level encryption and comply with all major data protection regulations. Your shopping history, payment info, and personal details are always secure.",
    },
    {
      title: "Community First",
      content:
        "You're not just a customer; you're part of our community. Share reviews, connect with other shoppers, and help shape the future of ElysianEcommerce through your voice.",
    },
  ];

  const techStack = [
    { name: "Speed", role: "Lightning fast" },
    { name: "Security", role: "Bank-level" },
    { name: "Simplicity", role: "Intuitive design" },
    { name: "Quality", role: "Never compromised" },
    { name: "Support", role: "Always here" },
    { name: "Innovation", role: "Constantly improving" },
  ];

  return (
    <div className="relative space-y-24 overflow-hidden pb-20 sm:pb-32">
      <style>{`

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .group-hover-lift {
          transition: var(--transition-visual-props) 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group:hover .group-hover-lift {
          transform: translateY(-12px);
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative z-10 pt-12 pb-8 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-5xl space-y-8 px-4 text-center sm:px-6">
          <h1 className="text-5xl leading-tight font-black text-gray-900 sm:text-6xl lg:text-7xl">
            Our{" "}
            <span
              className="text-brand"
              style={{ backgroundSize: "200% 200%" }}
            >
              Core Values
            </span>
          </h1>

          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-gray-700 sm:text-2xl"
          >
            These six principles decide how we source products, set prices, and handle returns. They are
            the reason customers come back.
          </p>

          <div
            className="flex justify-center gap-4"
          >
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-brand to-cyan-500" />
            <div className="h-1 w-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-400 opacity-70" />
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 space-y-4 text-center">
          <h2
            className="text-4xl font-bold text-gray-900 sm:text-5xl"
          >
            Six Pillars of Our Philosophy
          </h2>

          <p
            className="mx-auto max-w-2xl text-lg font-light text-gray-600"
          >
            The standards behind every order we ship
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className="group relative"
            >

              {/* Card */}
              <div className="group-hover-lift glass relative h-full overflow-hidden rounded-3xl border border-gray-200 p-8 transition-all duration-500 hover:border-brand/80 hover:shadow-2xl sm:p-10">
                {/* Icon */}
                <div className="mb-6 inline-block transform text-6xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-125">
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="mb-6 font-light leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  {value.description}
                </p>

                {/* Details List */}
                <div className="space-y-3">
                  {value.details.map((detail, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-gray-600 transition-colors duration-300 group-hover:text-gray-700"
                    >
                      <span className="mt-1 font-bold text-brand">✓</span>
                      <span className="text-sm font-medium">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Accent */}
                <div className="mt-8 border-t border-gray-200 pt-6 transition-colors duration-300 group-hover:border-brand/30">
                  <div className="h-1 w-full rounded-full bg-linear-to-r from-brand to-cyan-500 [clip-path:inset(0_calc(100%-48px)_0_0_round_2px)] group-hover:[clip-path:inset(0_0_0_0_round_2px)] transition-[clip-path] duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Promises Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 space-y-4 text-center">
          <h2
            className="text-4xl font-bold text-gray-900 sm:text-5xl"
          >
            Our Promises to You
          </h2>

          <p
            className="mx-auto max-w-2xl text-lg font-light text-gray-600"
          >
            Commitments we stand behind, every single day
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-brand/20 to-cyan-500/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

              {/* Card */}
              <div className="group-hover-lift glass relative h-full rounded-2xl border border-gray-200 p-8 transition-all duration-500 hover:border-brand/80 hover:shadow-xl">
                {/* Number Badge */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-brand/30 to-cyan-500/30 text-lg font-bold text-brand transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                  {index + 1}
                </div>

                {/* Title */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand">
                  {promise.title}
                </h3>

                {/* Content */}
                <p className="font-light leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  {promise.content}
                </p>

                {/* Arrow */}
                <div className="mt-6 transform text-brand opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Tech Stack */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="group relative"
        >

          {/* Card */}
          <div className="glass relative rounded-3xl border border-gray-200 p-8 transition-all duration-500 hover:border-brand/80 group-hover:shadow-2xl sm:p-16">
            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  Built on Modern{" "}
                  <span className="text-brand">
                    Technology
                  </span>
                </h2>

                <p className="mx-auto max-w-2xl text-lg font-light text-gray-600">
                  The latest technology powers our platform. Designed for speed, security, and simplicity. Everything you need, nothing you don't.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 md:grid-cols-3 lg:grid-cols-6">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="group/tech relative text-center"
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand/20 to-cyan-500/20 opacity-0 blur-lg transition-all duration-300 group-hover/tech:opacity-100" />

                    {/* Content */}
                    <div className="relative rounded-2xl border border-gray-200 p-6 transition-all duration-300 group-hover/tech:border-brand/50 group-hover/tech:bg-white group-hover/tech:shadow-lg group-hover/tech:">
                      <p className="mb-2 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover/tech:text-brand">
                        {tech.name}
                      </p>

                      <p className="text-sm font-light text-gray-600 transition-colors duration-300 group-hover/tech:text-gray-700">
                        {tech.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Content */}
          <div
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Why{" "}
              <span className="text-brand">
                ElysianEcommerce
              </span>{" "}
              Stands Apart
            </h2>

            <div className="space-y-6">
              <div className="group rounded-xl p-6 transition-all duration-300 hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand">
                  Design-Driven Excellence
                </h3>

                <p className="font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  Clean layouts, readable type, and a checkout that never gets
                  in your way. Everything is built to load fast and work on any
                  screen, from phone to desktop.
                </p>
              </div>

              <div className="group rounded-xl p-6 transition-all duration-300 hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand">
                  Security First
                </h3>

                <p className="font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  Bank-level encryption protects your data. We comply with
                  GDPR, CCPA, and all major data protection standards. Your
                  trust is our greatest asset.
                </p>
              </div>

              <div className="group rounded-xl p-6 transition-all duration-300 hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand">
                  Performance Optimized
                </h3>

                <p className="font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  Lightning-fast load times, smooth animations, and responsive
                  design. Every interaction feels instant. We measure in
                  milliseconds, not seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Stats */}
          <div
            className=""
          >
            <div className="glass group  space-y-8 rounded-3xl border border-gray-200 p-8 transition-all duration-500 hover:border-brand/80 hover:shadow-2xl sm:p-12">
              <h3 className="text-3xl font-bold text-gray-900">
                Our Core Beliefs
              </h3>

              <div className="space-y-8">
                {[
                  {
                    quote: "Say What the Product Is",
                    author: "Honest descriptions, real photos, no fine print",
                  },
                  {
                    quote: "Prices Without Surprises",
                    author: "The price you see is the price you pay",
                  },
                  {
                    quote: "Returns Without Excuses",
                    author: "30 days to change your mind",
                  },
                  {
                    quote: "Support That Answers",
                    author: "Real people, 24/7",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group/stat rounded-xl p-4 transition-all duration-300 hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10"
                  >
                    <div className="text-xl font-bold text-gray-900">
                      {item.quote}
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      {item.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className="group relative"
        >

          {/* Card */}
          <div className="glass-strong relative overflow-hidden rounded-3xl border border-gray-200 p-8 text-center transition-all duration-500 group-hover:border-brand/80 group-hover:shadow-2xl sm:p-16">
            {/* Content */}
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-bold sm:text-5xl text-gray-900">
                Join Our Community Today
              </h2>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-700">
                Experience the ElysianEcommerce difference. Where values
                matter, quality never compromises, and every customer is
                cherished. Start your journey with us.
              </p>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <a
                  href="/products"
                  className="group/btn relative overflow-hidden rounded-2xl bg-linear-to-r from-brand via-cyan-500 to-teal-400 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all duration-500 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Products

                    <span className="text-xl transform transition-transform duration-300 group-hover/btn:translate-x-2">
                      →
                    </span>
                  </span>

                </a>

                <a
                  href="/about"
                  className="group/btn relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-10 py-4 text-lg font-bold text-brand transition-all duration-500 hover:border-brand/50 hover:bg-white hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Back to About

                    <span className="transform transition-transform duration-300 group-hover/btn:-translate-y-1">
                      ↑
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Values;
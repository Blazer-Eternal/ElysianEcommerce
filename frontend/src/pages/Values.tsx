const Values = () => {
  const coreValues = [
    {
      title: "Integrity & Transparency",
      description:
        "We believe in honest communication and transparent practices. Every price you see is what you pay, with no hidden fees or surprise charges. Our commitment to transparency extends to our supply chain, product sourcing, and customer service policies.",
      icon: "🎯",
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
      icon: "💝",
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
        "Built with the modern MERN stack, ElysianEcommerce represents the pinnacle of web technology. We continuously innovate to provide seamless, secure, and intelligent shopping experiences that adapt to your needs.",
      icon: "⚡",
      details: [
        "AI-powered recommendations",
        "Real-time inventory management",
        "Secure payment processing",
        "Mobile-first design approach",
      ],
    },
    {
      title: "Sustainability & Ethics",
      description:
        "We're committed to reducing our environmental footprint and supporting ethical practices. From eco-friendly packaging to fair trade partnerships, we believe business should be a force for good.",
      icon: "🌱",
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
      icon: "🤝",
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
      icon: "📈",
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
        "Every product undergoes rigorous quality checks before reaching you. We partner only with verified sellers and manufacturers who meet our strict standards. If something doesn't meet expectations, we make it right—guaranteed.",
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
    { name: "React", role: "Dynamic UI" },
    { name: "Node.js", role: "Scalable Backend" },
    { name: "Express", role: "Robust API" },
    { name: "MongoDB", role: "Data Management" },
    { name: "TypeScript", role: "Type Safety" },
    { name: "Tailwind CSS", role: "Modern Styling" },
  ];

  return (
    <div className="relative space-y-32 overflow-hidden pb-20 sm:pb-40">
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(14, 124, 133, 0.3);
          }
          50% {
            box-shadow:
              0 0 40px rgba(14, 124, 133, 0.6),
              0 0 60px rgba(6, 182, 212, 0.3);
          }
        }

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

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-shimmer {
          background-image: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.3),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .group-hover-lift {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group:hover .group-hover-lift {
          transform: translateY(-12px);
        }
      `}</style>

      {/* Decorative Background Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-float rounded-full bg-linear-to-br from-cyan-300/20 to-teal-300/20 opacity-30 mix-blend-multiply blur-3xl filter" />

        <div
          className="absolute right-1/3 bottom-32 h-96 w-96 animate-float rounded-full bg-linear-to-br from-[#0e7c85]/20 to-cyan-300/20 opacity-30 mix-blend-multiply blur-3xl filter"
          style={{ animationDelay: "-2s" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-12 pb-8 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-5xl space-y-8 px-4 text-center sm:px-6">
          <h1 className="animate-fade-in-up text-5xl leading-tight font-black text-gray-900 sm:text-6xl lg:text-7xl">
            Our{" "}
            <span
              className="animate-gradient bg-linear-to-r from-[#0e7c85] via-cyan-500 to-teal-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% 200%" }}
            >
              Core Values
            </span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto max-w-3xl text-lg leading-relaxed font-light text-gray-700 sm:text-2xl"
            style={{ animationDelay: "0.1s" }}
          >
            We don't just build an ecommerce platform—we build a community
            rooted in integrity, innovation, and customer excellence. Discover
            what drives us every single day.
          </p>

          <div
            className="animate-fade-in-up flex justify-center gap-4"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500" />
            <div className="h-1 w-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-400 opacity-70" />
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 space-y-4 text-center">
          <h2
            className="animate-fade-in-up text-4xl font-bold text-gray-900 sm:text-5xl"
            style={{ animationDelay: "0.3s" }}
          >
            Six Pillars of Our Philosophy
          </h2>

          <p
            className="animate-fade-in-up mx-auto max-w-2xl text-lg font-light text-gray-600"
            style={{ animationDelay: "0.4s" }}
          >
            Each value isn't just words on a wall—it's woven into our DNA
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {coreValues.map((value, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              {/* Glow Background */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#0e7c85]/20 via-cyan-500/10 to-teal-400/20 opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100" />

              {/* Card */}
              <div className="group-hover-lift glass relative h-full overflow-hidden rounded-3xl border border-white/60 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-[#0e7c85]/80 hover:shadow-2xl hover:shadow-cyan-500/40 sm:p-10">
                {/* Icon */}
                <div className="mb-6 inline-block transform text-6xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-125">
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0e7c85]">
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
                      <span className="mt-1 font-bold text-[#0e7c85]">✓</span>
                      <span className="text-sm font-medium">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Accent */}
                <div className="mt-8 border-t border-white/30 pt-6 transition-colors duration-300 group-hover:border-[#0e7c85]/30">
                  <div className="h-1 w-12 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500 transition-all duration-500 group-hover:w-full" />
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
            className="animate-fade-in-up text-4xl font-bold text-gray-900 sm:text-5xl"
            style={{ animationDelay: "1s" }}
          >
            Our Promises to You
          </h2>

          <p
            className="animate-fade-in-up mx-auto max-w-2xl text-lg font-light text-gray-600"
            style={{ animationDelay: "1.1s" }}
          >
            Commitments we stand behind, every single day
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${1.1 + index * 0.08}s` }}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#0e7c85]/20 to-cyan-500/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

              {/* Card */}
              <div className="group-hover-lift glass relative h-full rounded-2xl border border-white/60 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-[#0e7c85]/80 hover:shadow-xl hover:shadow-cyan-500/30">
                {/* Number Badge */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#0e7c85]/30 to-cyan-500/30 text-lg font-bold text-[#0e7c85] transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                  {index + 1}
                </div>

                {/* Title */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0e7c85]">
                  {promise.title}
                </h3>

                {/* Content */}
                <p className="font-light leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  {promise.content}
                </p>

                {/* Arrow */}
                <div className="mt-6 transform text-[#0e7c85] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
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
          className="group relative animate-fade-in-up"
          style={{ animationDelay: "1.8s" }}
        >
          {/* Glow Background */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-[#0e7c85]/30 via-cyan-500/30 to-teal-400/30 opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100" />

          {/* Card */}
          <div className="glass relative rounded-3xl border border-white/70 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-[#0e7c85]/80 group-hover:shadow-2xl group-hover:shadow-cyan-500/40 sm:p-16">
            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  Built on Modern{" "}
                  <span className="bg-linear-to-r from-[#0e7c85] to-cyan-500 bg-clip-text text-transparent">
                    Technology
                  </span>
                </h2>

                <p className="mx-auto max-w-2xl text-lg font-light text-gray-600">
                  The MERN Stack Powers Excellence. TypeScript ensures
                  reliability. Tailwind CSS delivers beauty. Everything
                  optimized for performance, security, and scale.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 md:grid-cols-3 lg:grid-cols-6">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="group/tech relative animate-fade-in-up text-center"
                    style={{ animationDelay: `${1.8 + index * 0.1}s` }}
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#0e7c85]/20 to-cyan-500/20 opacity-0 blur-lg transition-all duration-300 group-hover/tech:opacity-100" />

                    {/* Content */}
                    <div className="relative rounded-2xl border border-white/40 p-6 transition-all duration-300 group-hover/tech:border-[#0e7c85]/50 group-hover/tech:bg-white/70 group-hover/tech:shadow-lg group-hover/tech:shadow-cyan-500/30">
                      <p className="mb-2 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover/tech:text-[#0e7c85]">
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
            className="animate-slide-in-left space-y-8"
            style={{ animationDelay: "2.2s" }}
          >
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Why{" "}
              <span className="bg-linear-to-r from-[#0e7c85] to-cyan-500 bg-clip-text text-transparent">
                ElysianEcommerce
              </span>{" "}
              Stands Apart
            </h2>

            <div className="space-y-6">
              <div className="group rounded-xl p-6 transition-all duration-300 hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0e7c85]">
                  🎨 Design-Driven Excellence
                </h3>

                <p className="font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  Every pixel is purposeful. Our glass-morphism design, smooth
                  animations, and intuitive UX create an unforgettable
                  shopping journey that feels premium and modern.
                </p>
              </div>

              <div className="group rounded-xl p-6 transition-all duration-300 hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0e7c85]">
                  🛡️ Security First
                </h3>

                <p className="font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                  Bank-level encryption protects your data. We comply with
                  GDPR, CCPA, and all major data protection standards. Your
                  trust is our greatest asset.
                </p>
              </div>

              <div className="group rounded-xl p-6 transition-all duration-300 hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10">
                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0e7c85]">
                  ⚡ Performance Optimized
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
            className="animate-slide-in-right"
            style={{ animationDelay: "2.2s" }}
          >
            <div className="glass group animate-glow-pulse space-y-8 rounded-3xl border border-white/70 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-[#0e7c85]/80 hover:shadow-2xl hover:shadow-cyan-500/40 sm:p-12">
              <h3 className="text-3xl font-bold text-gray-900">
                By The Numbers
              </h3>

              <div className="space-y-8">
                {[
                  {
                    stat: "99.9%",
                    label: "Uptime Guarantee",
                    desc: "Reliable service, always",
                  },
                  {
                    stat: "0ms",
                    label: "Cold Start",
                    desc: "Instant performance",
                  },
                  {
                    stat: "256-bit",
                    label: "Encryption",
                    desc: "Military-grade security",
                  },
                  {
                    stat: "100%",
                    label: "SSL Secure",
                    desc: "All connections encrypted",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group/stat rounded-xl p-4 transition-all duration-300 hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10"
                  >
                    <div className="bg-linear-to-r from-[#0e7c85] to-cyan-500 bg-clip-text text-4xl font-black text-transparent">
                      {item.stat}
                    </div>

                    <div className="mt-2 font-bold text-gray-900">
                      {item.label}
                    </div>

                    <div className="text-sm text-gray-600 transition-colors duration-300 group-hover/stat:text-gray-700">
                      {item.desc}
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
          className="group relative animate-fade-in-up"
          style={{ animationDelay: "2.8s" }}
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-[#0e7c85]/30 via-cyan-500/30 to-teal-400/30 opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100" />

          {/* Card */}
          <div className="glass-strong relative overflow-hidden rounded-3xl border border-white/70 p-8 text-center backdrop-blur-2xl transition-all duration-500 group-hover:border-[#0e7c85]/80 group-hover:shadow-2xl group-hover:shadow-cyan-500/40 sm:p-16">
            {/* Shimmer on hover */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-6">
              <h2 className="bg-linear-to-r from-gray-900 via-[#0e7c85] to-gray-900 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
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
                  className="group/btn relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0e7c85] via-cyan-500 to-teal-400 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all duration-500 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 hover:shadow-2xl hover:shadow-cyan-500/60"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Products

                    <span className="text-xl transform transition-transform duration-300 group-hover/btn:translate-x-2">
                      →
                    </span>
                  </span>

                  <div className="absolute inset-0 translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover/btn:translate-x-0" />
                </a>

                <a
                  href="/about"
                  className="group/btn relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 px-10 py-4 text-lg font-bold text-[#0e7c85] backdrop-blur transition-all duration-500 hover:border-[#0e7c85]/50 hover:bg-white/80 hover:shadow-lg"
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
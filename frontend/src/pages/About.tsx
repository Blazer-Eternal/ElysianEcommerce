const TeamMemberIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MissionIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-7 6.87 1.18 6.88L12 17.77l-6.18 3.85L7 14.14 0 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ValuesIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m16 12-4-4-4 4" />
  </svg>
);

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const About = () => {
  const values: Value[] = [
    {
      title: "Quality First",
      description:
        "Every product is rigorously selected and quality-tested to ensure excellence.",
      icon: <MissionIcon />,
    },
    {
      title: "Customer Centric",
      description:
        "We prioritize your satisfaction with 24/7 support and hassle-free returns.",
      icon: <TeamMemberIcon />,
    },
    {
      title: "Innovation",
      description:
        "Built with cutting-edge MERN stack technology for seamless shopping.",
      icon: <ValuesIcon />,
    },
  ];

  const milestones = [
    {
      year: "2024",
      event: "ElysianEcommerce launched with full MERN stack",
    },
    {
      year: "2024",
      event: "Reached 1000+ active users",
    },
    {
      year: "2024",
      event: "Introduced glass-morphism UI design",
    },
  ];

  const stats = [
    { value: "50k+", label: "Happy Customers", delay: "0s" },
    { value: "10k+", label: "Products Available", delay: "0.2s" },
    { value: "50+", label: "Categories", delay: "0.4s" },
    { value: "24/7", label: "Customer Support", delay: "0.6s" },
  ];

  return (
    <div className="relative space-y-28 pb-20 sm:pb-32">
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
            transform: translateY(-15px);
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

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes blob-rotate {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          33% {
            transform: rotate(120deg) scale(1.1);
          }
          66% {
            transform: rotate(240deg) scale(0.9);
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
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background-image: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-blob-rotate {
          animation: blob-rotate 4s ease-in-out infinite;
        }

        .group-hover-grow {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group:hover .group-hover-grow {
          transform: scale(1.05);
        }
      `}</style>

      {/* Decorative Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-linear-to-br from-cyan-300/20 to-teal-300/20 opacity-30 mix-blend-multiply blur-3xl filter animate-blob-rotate" />

        <div
          className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-linear-to-br from-[#0e7c85]/20 to-cyan-300/20 opacity-30 mix-blend-multiply blur-3xl filter animate-blob-rotate"
          style={{ animationDelay: "-2s" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-12 pb-8 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-5xl space-y-8 px-4 text-center sm:px-6">
          <h1
            className="animate-fade-in-up text-4xl leading-tight font-black text-gray-900 sm:text-5xl lg:text-7xl"
            style={{ animationDelay: "0s" }}
          >
            About{" "}
            <span
              className="animate-gradient bg-linear-to-r from-[#0e7c85] via-cyan-500 to-teal-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% 200%" }}
            >
              ElysianEcommerce
            </span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto max-w-3xl text-lg leading-relaxed font-light text-gray-600 sm:text-xl"
            style={{ animationDelay: "0.1s" }}
          >
            We believe that exceptional shopping experiences matter. That's
            why we built ElysianEcommerce with care, using the latest
            technology to serve you better.
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

      {/* Main Story Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div
            className="animate-slide-in-left space-y-8"
            style={{ animationDelay: "0.3s" }}
          >
            <div>
              <h2 className="mb-6 bg-linear-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                Our Story
              </h2>

              <div className="mb-8 h-1 w-16 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500" />
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed font-light text-gray-700">
                ElysianEcommerce was born from a vision to revolutionize online
                shopping. We saw a gap in the market for a platform that
                combines elegance, simplicity, and reliability.
              </p>

              <p className="text-lg leading-relaxed font-light text-gray-700">
                Built on the MERN stack with TypeScript, our platform
                represents the pinnacle of modern web technology. Every feature
                is designed with you in mind — from intuitive browsing to
                secure checkout.
              </p>

              <p className="text-lg leading-relaxed font-light text-gray-700">
                Today, thousands of customers trust us with their purchases,
                and we're committed to maintaining that trust through excellence
                and innovation.
              </p>
            </div>

            <a
              href="/products"
              className="group/cta relative mt-4 inline-block overflow-hidden rounded-2xl bg-linear-to-r from-[#0e7c85] via-cyan-500 to-teal-400 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-500 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 hover:shadow-2xl hover:shadow-cyan-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Discover Our Products
                <span className="transform transition-transform duration-300 group-hover/cta:translate-x-2">
                  →
                </span>
              </span>

              <div className="animate-shimmer absolute inset-0 translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/cta:translate-x-0" />
            </a>
          </div>

          {/* Right Stats Card */}
          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="glass group animate-glow-pulse space-y-6 rounded-3xl border border-white/60 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-[#0e7c85]/80 hover:shadow-2xl hover:shadow-cyan-500/30 sm:p-12">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                By The Numbers
              </h3>

              <div className="space-y-5">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat cursor-default rounded-xl p-4 transition-all duration-400 hover:bg-linear-to-br hover:from-[#0e7c85]/10 hover:to-cyan-500/10"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="flex items-end justify-between">
                      <div>
                        <div
                          className="animate-gradient text-5xl font-black sm:text-6xl"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, #0e7c85, #06b6d4, #14b8a6, #0e7c85)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundSize: "200% 200%",
                          }}
                        >
                          {stat.value}
                        </div>

                        <div className="mt-2 font-medium text-gray-600 transition-colors duration-300 group-hover/stat:text-gray-800">
                          {stat.label}
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-[#0e7c85]/20 to-cyan-200/20 transition-all duration-300 group-hover/stat:scale-110 group-hover/stat:from-[#0e7c85]/40 group-hover/stat:to-cyan-300/40">
                        <div className="h-6 w-6 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500 opacity-60" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/30 pt-4">
                <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  ✓ Established in 2024 • MERN Stack • Always improving
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 space-y-4 text-center">
          <h2
            className="animate-fade-in-up text-4xl font-bold text-gray-900 sm:text-5xl"
            style={{ animationDelay: "0.4s" }}
          >
            Our Core Values
          </h2>

          <p
            className="animate-fade-in-up mx-auto max-w-2xl text-lg font-light text-gray-600"
            style={{ animationDelay: "0.5s" }}
          >
            Everything we do is guided by these principles
          </p>

          <div
            className="animate-fade-in-up flex justify-center gap-2"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500" />
            <div className="h-1 w-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-400 opacity-70" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative animate-scale-in"
              style={{ animationDelay: `${0.6 + index * 0.15}s` }}
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#0e7c85]/20 via-cyan-500/10 to-teal-400/20 opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100" />

              {/* Main Card */}
              <div className="group-hover-grow glass relative h-full overflow-hidden rounded-3xl border border-white/60 p-8 text-center backdrop-blur-2xl transition-all duration-500 hover:border-[#0e7c85]/80 hover:shadow-2xl hover:shadow-cyan-500/40 sm:p-10">
                {/* Icon Container */}
                <div className="mb-6 flex justify-center text-[#0e7c85] transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 group-hover:text-cyan-600">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#0e7c85]/30 to-cyan-500/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative">
                      {value.icon}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0e7c85]">
                  {value.title}
                </h3>

                <p className="font-light leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {value.description}
                </p>

                {/* Animated Bottom Border */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div className="h-1 w-3 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500 transition-all duration-500 group-hover:w-8" />

                  <div className="h-0.5 flex-1 rounded-full bg-linear-to-r from-cyan-500/50 to-transparent transition-all duration-500 group-hover:from-teal-400/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-16 space-y-4 text-center">
          <h2
            className="animate-fade-in-up text-4xl font-bold text-gray-900 sm:text-5xl"
            style={{ animationDelay: "1.2s" }}
          >
            Our Journey
          </h2>

          <p
            className="animate-fade-in-up text-lg font-light text-gray-600"
            style={{ animationDelay: "1.3s" }}
          >
            Key moments in our growth
          </p>

          <div
            className="animate-fade-in-up flex justify-center gap-2"
            style={{ animationDelay: "1.4s" }}
          >
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-[#0e7c85] to-cyan-500" />
            <div className="h-1 w-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-400 opacity-70" />
          </div>
        </div>

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${1.4 + index * 0.15}s` }}
            >
              {/* Glow Background */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#0e7c85]/10 to-cyan-500/10 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

              {/* Card */}
              <div className="glass relative rounded-2xl border-l-4 border-[#0e7c85] p-6 backdrop-blur-2xl transition-all duration-500 group-hover:-translate-x-2 group-hover:border-cyan-500 group-hover:bg-white/70 group-hover:shadow-lg group-hover:shadow-cyan-500/40 sm:p-8">
                <div className="flex items-start gap-6">
                  {/* Year Badge */}
                  <div className="shrink-0">
                    <div className="flex h-14 w-14 transform items-center justify-center rounded-xl bg-linear-to-br from-[#0e7c85]/20 to-cyan-200/20 font-bold text-[#0e7c85] transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:from-[#0e7c85]/40 group-hover:to-cyan-300/40">
                      {milestone.year.slice(2)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold uppercase tracking-wide text-[#0e7c85] transition-colors duration-300 group-hover:text-cyan-600">
                      {milestone.year}
                    </p>

                    <p className="mt-2 text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
                      {milestone.event}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 pt-1 text-[#0e7c85] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className="group relative animate-fade-in-up"
          style={{ animationDelay: "2s" }}
        >
          {/* Glowing Background */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-[#0e7c85]/30 via-cyan-500/30 to-teal-400/30 opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100" />

          {/* Main Card */}
          <div className="glass-strong relative overflow-hidden rounded-3xl border border-white/70 p-8 text-center backdrop-blur-2xl transition-all duration-500 group-hover:border-[#0e7c85]/80 group-hover:shadow-2xl group-hover:shadow-cyan-500/40 sm:p-16">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-8">
              <h2 className="bg-linear-to-r from-gray-900 via-[#0e7c85] to-gray-900 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                Ready to Experience the Difference?
              </h2>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-800 sm:text-xl">
                Join thousands of satisfied customers shopping with
                ElysianEcommerce today. Discover premium products, exceptional
                service, and an unforgettable experience.
              </p>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <a
                  href="/products"
                  className="group/btn relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0e7c85] via-cyan-500 to-teal-400 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all duration-500 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 hover:shadow-2xl hover:shadow-cyan-500/60"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Shopping

                    <span className="text-xl transform transition-transform duration-300 group-hover/btn:translate-x-2">
                      →
                    </span>
                  </span>

                  <div className="absolute inset-0 translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover/btn:translate-x-0" />
                </a>

                <a
                  href="/values"
                  className="group/btn relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 px-10 py-4 text-lg font-bold text-[#0e7c85] backdrop-blur transition-all duration-500 hover:border-[#0e7c85]/50 hover:bg-white/80 hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Learn More

                    <span className="transform transition-transform duration-300 group-hover/btn:translate-y-1">
                      ↓
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

export default About;
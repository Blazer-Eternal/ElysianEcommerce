import { GemIcon, HeartIcon, PenToolIcon, StarIcon } from "../components/icons";

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
        "Fast search, secure checkout, and order tracking that keeps you posted at every step.",
      icon: <ValuesIcon />,
    },
  ];

  const milestones = [
    {
      year: "2024",
      event: "Brought our vision to life with elegance and care",
    },
    {
      year: "2024",
      event: "Focused on delivering excellence in every detail",
    },
    {
      year: "2024",
      event: "Committed to continuous excellence and innovation",
    },
  ];

  const stats = [
    { value: <StarIcon size={32} />, label: "Excellence in Every Detail", delay: "0s" },
    { value: <HeartIcon size={32} />, label: "Passionate About Service", delay: "0.2s" },
    { value: <PenToolIcon size={32} />, label: "Beautifully Designed", delay: "0.4s" },
    { value: <GemIcon size={32} />, label: "Premium Quality Always", delay: "0.6s" },
  ];

  return (
    <div className="relative space-y-24 pb-20 sm:pb-32">
      <style>{`

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

        .group-hover-grow {
          transition: var(--transition-visual-props) 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group:hover .group-hover-grow {
          transform: scale(1.05);
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative z-10 pt-12 pb-8 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-5xl space-y-8 px-4 text-center sm:px-6">
          <h1
            className="text-4xl leading-tight font-black text-gray-900 sm:text-5xl lg:text-7xl"
          >
            About{" "}
            <span
              className="text-brand"
              style={{ backgroundSize: "200% 200%" }}
            >
              ElysianEcommerce
            </span>
          </h1>

          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-gray-600 sm:text-xl"
          >
            We believe that exceptional shopping experiences matter. That's
            why we built ElysianEcommerce with care, using the latest
            technology to serve you better.
          </p>

          <div
            className="flex justify-center gap-4"
          >
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-brand to-cyan-500" />
            <div className="h-1 w-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-400 opacity-70" />
          </div>
        </div>
      </div>

      {/* Main Story Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div
            className="space-y-8"
          >
            <div>
              <h2 className="mb-6 text-4xl font-bold sm:text-5xl text-gray-900">
                Our Story
              </h2>

              <div className="mb-8 h-1 w-16 rounded-full bg-linear-to-r from-brand to-cyan-500" />
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed font-light text-gray-700">
                ElysianEcommerce started with a simple frustration: online shopping meant vague product descriptions, surprise costs, and returns that were more trouble than they were worth. We built the store we wanted to shop at.
              </p>

              <p className="text-lg leading-relaxed font-light text-gray-700">
                Today, we're focused on delivering premium products and exceptional service. We listen to our customers, refine our craft, and never stop improving.
              </p>
            </div>

            <a
              href="/products"
              className="group/cta relative mt-4 inline-block overflow-hidden rounded-2xl bg-linear-to-r from-brand via-cyan-500 to-teal-400 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-500 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Discover Our Products
                <span className="transform transition-transform duration-300 group-hover/cta:translate-x-2">
                  →
                </span>
              </span>

            </a>
          </div>

          {/* Right Stats Card */}
          <div
            className=""
          >
            <div className="glass group  space-y-6 rounded-3xl border border-gray-200 p-8 transition-all duration-500 hover:border-brand/80 hover:shadow-2xl sm:p-12">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                What Makes Us Special
              </h3>

              <div className="space-y-5">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat cursor-default rounded-xl p-4 transition-all duration-400 hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-5xl font-black sm:text-6xl text-brand">
                          {stat.value}
                        </div>

                        <div className="mt-2 font-medium text-gray-600 transition-colors duration-300 group-hover/stat:text-gray-800">
                          {stat.label}
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-brand/20 to-cyan-200/20 transition-all duration-300 group-hover/stat:scale-110 group-hover/stat:from-brand/40 group-hover/stat:to-cyan-300/40">
                        <div className="h-6 w-6 rounded-full bg-linear-to-r from-brand to-cyan-500 opacity-60" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  Where elegance meets accessibility, and shopping becomes an experience.
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
            className="text-4xl font-bold text-gray-900 sm:text-5xl"
          >
            Our Core Values
          </h2>

          <p
            className="mx-auto max-w-2xl text-lg font-light text-gray-600"
          >
            Everything we do is guided by these principles
          </p>

          <div
            className="flex justify-center gap-2"
          >
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-brand to-cyan-500" />
            <div className="h-1 w-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-400 opacity-70" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Animated Gradient Background */}

              {/* Main Card */}
              <div className="group-hover-grow glass relative h-full overflow-hidden rounded-3xl border border-gray-200 p-8 text-center transition-all duration-500 hover:border-brand/80 hover:shadow-2xl sm:p-10">
                {/* Icon Container */}
                <div className="mb-6 flex justify-center text-brand transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 group-hover:text-cyan-600">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-brand/30 to-cyan-500/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative">
                      {value.icon}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand">
                  {value.title}
                </h3>

                <p className="font-light leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {value.description}
                </p>

                {/* Animated Bottom Border */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div className="h-1 w-8 -mr-5 rounded-full bg-linear-to-r from-brand to-cyan-500 [clip-path:inset(0_20px_0_0_round_2px)] group-hover:[clip-path:inset(0_0_0_0_round_2px)] transition-[clip-path] duration-500" />

                  <div className="h-0.5 flex-1 rounded-full bg-linear-to-r from-cyan-500/50 to-transparent transition-all duration-500 group-hover:from-teal-400/50 group-hover:translate-x-5" />
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
            className="text-4xl font-bold text-gray-900 sm:text-5xl"
          >
            Our Journey
          </h2>

          <p
            className="text-lg font-light text-gray-600"
          >
            Key moments in our growth
          </p>

          <div
            className="flex justify-center gap-2"
          >
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-brand to-cyan-500" />
            <div className="h-1 w-3 rounded-full bg-linear-to-r from-cyan-500 to-teal-400 opacity-70" />
          </div>
        </div>

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-brand/10 to-cyan-500/10 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

              {/* Card */}
              <div className="glass relative rounded-2xl border-l-4 border-brand p-6 transition-all duration-500 group-hover:-translate-x-2 group-hover:border-cyan-500 group-hover:bg-white group-hover:shadow-lg sm:p-8">
                <div className="flex items-start gap-6">
                  {/* Year Badge */}
                  <div className="shrink-0">
                    <div className="flex h-14 w-14 transform items-center justify-center rounded-xl bg-linear-to-br from-brand/20 to-cyan-200/20 font-bold text-brand transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:from-brand/40 group-hover:to-cyan-300/40">
                      {milestone.year.slice(2)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold uppercase tracking-wide text-brand transition-colors duration-300 group-hover:text-cyan-600">
                      {milestone.year}
                    </p>

                    <p className="mt-2 text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
                      {milestone.event}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 pt-1 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
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
          className="group relative"
        >

          {/* Main Card */}
          <div className="glass-strong relative overflow-hidden rounded-3xl border border-gray-200 p-8 text-center transition-all duration-500 group-hover:border-brand/80 group-hover:shadow-2xl sm:p-16">
            {/* Content */}
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl font-bold sm:text-5xl text-gray-900">
                Ready to Experience the Difference?
              </h2>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-800 sm:text-xl">
                Discover premium products curated with care. Experience shopping reimagined with elegance, quality, and exceptional service.
              </p>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <a
                  href="/products"
                  className="group/btn relative overflow-hidden rounded-2xl bg-linear-to-r from-brand via-cyan-500 to-teal-400 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all duration-500 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Shopping

                    <span className="text-xl transform transition-transform duration-300 group-hover/btn:translate-x-2">
                      →
                    </span>
                  </span>

                </a>

                <a
                  href="/values"
                  className="group/btn relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-10 py-4 text-lg font-bold text-brand transition-all duration-500 hover:border-brand/50 hover:bg-white hover:shadow-lg"
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
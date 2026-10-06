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
      event: "ElysianEcommerce opened for business",
    },
    {
      year: "2024",
      event: "Descriptions, pricing and returns written to be clear",
    },
    {
      year: "2024",
      event: "Ongoing improvements shaped by customer feedback",
    },
  ];

  const stats = [
    { value: <StarIcon size={32} />, label: "Checked Before It Ships", delay: "0s" },
    { value: <HeartIcon size={32} />, label: "Support Around the Clock", delay: "0.2s" },
    { value: <PenToolIcon size={32} />, label: "Readable on Any Screen", delay: "0.4s" },
    { value: <GemIcon size={32} />, label: "Verified Sellers Only", delay: "0.6s" },
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
        <div className="mx-auto max-w-4xl space-y-7 px-4 text-center sm:px-6">
          <h1 className="text-4xl leading-[1.08] font-semibold text-ink sm:text-5xl lg:text-6xl">
            About{" "}
            <span
              className="text-brand"
              style={{ backgroundSize: "200% 200%" }}
            >
              ElysianEcommerce
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink/70 sm:text-xl">
            An online store built on a plain promise: accurate descriptions,
            prices with no surprises, and returns that don't fight you.
          </p>

          <div className="flex justify-center gap-3 pt-1">
            <div className="h-px w-16 bg-brand/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
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
              <h2 className="mb-6 text-4xl font-bold text-ink sm:text-5xl">
                Our Story
              </h2>

              <div className="mb-8 h-px w-16 bg-brand/40" />
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-ink/80">
                ElysianEcommerce started with a simple frustration: online shopping meant vague product descriptions, surprise costs, and returns that were more trouble than they were worth. We built the store we wanted to shop at.
              </p>

              <p className="text-lg leading-relaxed text-ink/80">
                Today the focus hasn't moved: quality-checked products, support that actually answers, and a returns process you can finish in one sitting.
              </p>
            </div>

            <a
              href="/products"
              className="group/cta relative mt-4 inline-block overflow-hidden rounded-2xl bg-brand px-8 py-4 font-semibold text-white shadow-[0_2px_16px_rgba(61,5,12,0.18)] transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_8px_24px_rgba(61,5,12,0.24)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Browse the collection
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
            <div className="glass group space-y-6 rounded-2xl border border-[#ece1d0] p-8 transition-all duration-500 hover:border-brand/40 hover:shadow-[0_16px_40px_rgba(61,5,12,0.12)] sm:p-10">
              <h3 className="text-2xl font-bold text-ink sm:text-3xl">
                What Makes Us Special
              </h3>

              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat cursor-default rounded-xl p-4 transition-all duration-400 hover:bg-linear-to-br hover:from-brand/10 hover:to-cyan-500/10"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-5xl font-semibold sm:text-6xl text-brand">
                          {stat.value}
                        </div>

                        <div className="mt-2 font-medium text-ink/70 transition-colors duration-300 group-hover/stat:text-ink">
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

              <div className="border-t border-[#ece1d0] pt-5">
                <p className="text-sm text-ink/70 transition-colors duration-300 group-hover:text-ink">
                  Free delivery over Rs. 2,000, 30-day returns on eligible items, and payment by Cash on Delivery or eSewa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-4xl font-bold text-ink sm:text-5xl">
            Our Core Values
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-ink/70">
            Everything we do is guided by these principles
          </p>

          <div className="flex justify-center gap-3 pt-1">
            <div className="h-px w-16 bg-brand/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
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
              <div className="group-hover-grow glass relative h-full overflow-hidden rounded-2xl border border-[#ece1d0] p-8 text-center transition-all duration-500 hover:border-brand/40 hover:shadow-[0_16px_40px_rgba(61,5,12,0.12)] sm:p-10">
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
                <h3 className="mb-4 text-2xl font-bold text-ink transition-colors duration-300 group-hover:text-brand">
                  {value.title}
                </h3>

                <p className="leading-relaxed text-ink/70 transition-colors duration-300 group-hover:text-ink/80">
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
          <h2 className="text-4xl font-bold text-ink sm:text-5xl">
            Our Journey
          </h2>

          <p className="text-lg text-ink/70">
            Key moments in our growth
          </p>

          <div className="flex justify-center gap-3 pt-1">
            <div className="h-px w-16 bg-brand/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
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

                    <p className="mt-2 text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-ink">
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
          <div className="glass-strong relative overflow-hidden rounded-2xl border border-[#ece1d0] p-8 text-center transition-all duration-500 group-hover:border-brand/40 group-hover:shadow-[0_16px_40px_rgba(61,5,12,0.12)] sm:p-16">
            {/* Content */}
            <div className="relative z-10 space-y-8">
              <div className="flex justify-center gap-3">
                <div className="h-px w-16 bg-brand/40" />
                <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
              </div>

              <h2 className="text-4xl font-bold sm:text-5xl text-ink">
                Take a look for yourself
              </h2>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink/70 sm:text-xl">
                Every item is quality-checked before it ships, with 30-day returns on eligible
                items and free delivery over Rs. 2,000.
              </p>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <a
                  href="/products"
                  className="group/btn relative overflow-hidden rounded-2xl bg-brand px-10 py-4 text-lg font-bold text-white shadow-[0_2px_16px_rgba(61,5,12,0.18)] transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_8px_24px_rgba(61,5,12,0.24)]"
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
                  className="group/btn relative overflow-hidden rounded-2xl border border-[#ece1d0] bg-white px-10 py-4 text-lg font-bold text-brand transition-all duration-300 hover:border-brand/50 hover:bg-brand/5 hover:shadow-[0_8px_24px_rgba(61,5,12,0.10)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Read our values

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
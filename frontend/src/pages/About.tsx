const TeamMemberIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MissionIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-7 6.87 1.18 6.88L12 17.77l-6.18 3.85L7 14.14 0 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const ValuesIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="m16 12-4-4-4 4"/>
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
      description: "Every product is rigorously selected and quality-tested to ensure excellence.",
      icon: <MissionIcon />,
    },
    {
      title: "Customer Centric",
      description: "We prioritize your satisfaction with 24/7 support and hassle-free returns.",
      icon: <TeamMemberIcon />,
    },
    {
      title: "Innovation",
      description: "Built with cutting-edge MERN stack technology for seamless shopping.",
      icon: <ValuesIcon />,
    },
  ];

  const milestones = [
    { year: "2024", event: "ElysianEcommerce launched with full MERN stack" },
    { year: "2024", event: "Reached 1000+ active users" },
    { year: "2024", event: "Introduced glass-morphism UI design" },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="pt-12 sm:pt-20 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            About <span className="bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">ElysianEcommerce</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We believe that exceptional shopping experiences matter. That's why we built ElysianEcommerce with care, using the latest technology to serve you better.
          </p>
        </div>
      </div>

      {/* Main Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              ElysianEcommerce was born from a vision to revolutionize online shopping. We saw a gap in the market for a platform that combines elegance, simplicity, and reliability.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Built on the MERN stack with TypeScript, our platform represents the pinnacle of modern web technology. Every feature is designed with you in mind — from intuitive browsing to secure checkout.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, thousands of customers trust us with their purchases, and we're committed to maintaining that trust through excellence and innovation.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 sm:p-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#0e7c85]">50k+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#0e7c85]">10k+</div>
                <div className="text-gray-600">Products Available</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#0e7c85]">50+</div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#0e7c85]">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="glass rounded-2xl p-8 text-center hover:bg-white/80 transition-all duration-300">
              <div className="flex justify-center mb-4 text-[#0e7c85]">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="glass rounded-2xl p-6 sm:p-8 border-l-4 border-[#0e7c85]">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-[#0e7c85]/20 to-cyan-200/20 text-[#0e7c85] font-bold">
                    {milestone.year.slice(2)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0e7c85]">{milestone.year}</p>
                  <p className="text-gray-700 text-lg">{milestone.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-strong rounded-3xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Experience the Difference?</h2>
          <p className="text-gray-600 text-lg">
            Join thousands of satisfied customers shopping with ElysianEcommerce today.
          </p>
          <a
            href="/products"
            className="inline-block glass px-8 py-3 rounded-xl font-semibold text-gray-900 hover:bg-white/70 transition-all duration-300"
          >
            Start Shopping →
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
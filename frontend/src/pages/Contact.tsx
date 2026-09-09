import { useState, type FormEvent } from "react";

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21s-8-6.5-8-11a8 8 0 0 1 16 0c0 4.5-8 11-8 11Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="pt-12 sm:pt-20 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Get in <span className="bg-linear-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question or feedback, don't hesitate to reach out.
          </p>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <p className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wide mb-2">Contact Info</p>
              <p className="text-gray-600 leading-relaxed">
                Have a question or feedback? We're here to help. Reach out through any of the methods below.
              </p>
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-6 space-y-4 hover:bg-white/80 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-[#0e7c85] to-cyan-600 flex items-center justify-center text-white">
                  <LocationIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-sm text-gray-600 mt-1">Kathmandu, Bagmati</p>
                  <p className="text-sm text-gray-600">Nepal</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="glass rounded-2xl p-6 space-y-4 hover:bg-white/80 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-[#0e7c85] to-cyan-600 flex items-center justify-center text-white">
                  <PhoneIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-sm text-gray-600 mt-1">+977 980-000-0000</p>
                  <p className="text-xs text-gray-500 mt-2">Available 24/7</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass rounded-2xl p-6 space-y-4 hover:bg-white/80 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-[#0e7c85] to-cyan-600 flex items-center justify-center text-white">
                  <EmailIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600 mt-1">support@elysian.com</p>
                  <p className="text-xs text-gray-500 mt-2">We'll reply within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-strong rounded-2xl p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 text-sm mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {submitted && (
                <div className="mb-6 glass bg-linear-to-r from-[#eafcfd] to-[#d7f4f6] border-l-4 border-[#0e7c85] rounded-lg px-6 py-4">
                  <p className="text-[#0e7c85] font-semibold">✓ Message Received!</p>
                  <p className="text-[#0e7c85] text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0e7c85] transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0e7c85] transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="+977 98X-XXX-XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0e7c85] transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
                  <textarea
                    placeholder="Tell us how we can help..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0e7c85] transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-[#0b6169] hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              q: "What are your business hours?",
              a: "We operate 24/7 to serve you better. Our support team responds to inquiries within 24 hours.",
            },
            {
              q: "How can I track my order?",
              a: "You'll receive a tracking link via email once your order ships. You can also view tracking in your account.",
            },
            {
              q: "What's your return policy?",
              a: "We offer a hassle-free 30-day return policy on eligible items. Visit our Refund Policy page for details.",
            },
            {
              q: "Do you offer international shipping?",
              a: "Yes! We ship worldwide. Shipping costs and delivery times vary by location.",
            },
          ].map((item, i) => (
            <details key={i} className="glass rounded-lg p-6 hover:bg-white/80 transition-all duration-300 cursor-pointer group">
              <summary className="font-semibold text-gray-900 flex items-center justify-between">
                {item.q}
                <span className="text-[#0e7c85] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;

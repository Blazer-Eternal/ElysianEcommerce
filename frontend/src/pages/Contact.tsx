import { useState, type FormEvent } from "react";
import { messageService } from "../services/messageService";
import { getErrorMessage } from "../utils/getErrorMessage";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await messageService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 pb-20 sm:pb-32">
      {/* Hero Section */}
      <div className="pt-12 pb-8 sm:pt-24 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink">
            Get in <span className="text-brand">Touch</span>
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed max-w-2xl mx-auto">
            Questions about an order, a product, or a return? Reach out, we answer within 24 hours.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <div className="h-px w-16 bg-brand/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
          </div>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-gold uppercase tracking-[0.2em] mb-3">Contact Info</p>
              <p className="text-ink/70 leading-relaxed">
                Have a question or feedback? We're here to help. Reach out through any of the methods below.
              </p>
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-6 space-y-4 hover:bg-white transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-brand to-cyan-600 flex items-center justify-center text-white">
                  <LocationIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Location</h3>
                  <p className="text-sm text-ink/70 mt-1">Kathmandu, Bagmati</p>
                  <p className="text-sm text-ink/70">Nepal</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="glass rounded-2xl p-6 space-y-4 hover:bg-white transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-brand to-cyan-600 flex items-center justify-center text-white">
                  <PhoneIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Phone</h3>
                  <p className="text-sm text-ink/70 mt-1">+977 980-000-0000</p>
                  <p className="text-xs text-ink/55 mt-2">Available 24/7</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass rounded-2xl p-6 space-y-4 hover:bg-white transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-brand to-cyan-600 flex items-center justify-center text-white">
                  <EmailIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Email</h3>
                  <p className="text-sm text-ink/70 mt-1">support@elysian.com</p>
                  <p className="text-xs text-ink/55 mt-2">We'll reply within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-strong rounded-2xl p-8 sm:p-10 border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
              <h2 className="text-2xl font-bold text-ink mb-2">Send us a Message</h2>
              <div className="mb-4 h-px w-16 bg-brand/40" />
              <p className="text-ink/70 text-sm mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {submitted && (
                <div className="mb-6 glass bg-linear-to-r from-cyan-50 to-[#f7ecdb] border-l-4 border-brand rounded-lg px-6 py-4">
                  <p className="text-brand font-semibold">✓ Message Received!</p>
                  <p className="text-brand text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 glass bg-red-50 border-l-4 border-red-500 rounded-lg px-6 py-4">
                  <p className="text-red-700 font-semibold">✕ Couldn't send your message</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-ink mb-2">Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-[#ded2c4] bg-white px-4 py-3 text-ink placeholder-ink/45 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-ink mb-2">Email *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-[#ded2c4] bg-white px-4 py-3 text-ink placeholder-ink/45 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-ink mb-2">Phone</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+977 98X-XXX-XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#ded2c4] bg-white px-4 py-3 text-ink placeholder-ink/45 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-ink mb-2">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-[#ded2c4] bg-white px-4 py-3 text-ink placeholder-ink/45 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark transition-all duration-300 shadow-[0_2px_16px_rgba(61,5,12,0.18)] hover:shadow-[0_8px_24px_rgba(61,5,12,0.24)] disabled:bg-ink/30 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-ink text-center mb-4">Frequently Asked Questions</h2>
        <div className="mx-auto mb-12 h-px w-16 bg-brand/40" />
        
        <div className="space-y-4">
          {[
            {
              q: "What are your business hours?",
              a: "We operate 24/7. Our support team responds to inquiries within 24 hours.",
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
            <details key={i} className="glass rounded-xl p-6 transition-all duration-300 cursor-pointer group hover:shadow-[0_8px_24px_rgba(61,5,12,0.10)]">
              <summary className="font-semibold text-ink flex items-center justify-between">
                {item.q}
                <span className="text-brand group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-ink/70 mt-4 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;

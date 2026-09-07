import { useState, type FormEvent } from "react";

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // NOTE: no backend endpoint exists for contact submissions yet — this just
    // confirms receipt in the UI. Wire this up to a real API once one exists.
    setSubmitted(true);
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest accent-text font-medium mb-2">Contact</p>
        <h1 className="text-4xl font-bold">Get in Touch</h1>
        <p className="text-gray-600 mt-3">We're here to help!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-gray-600 leading-relaxed mb-8">
            Whether you have a question about an order, a product, or anything else, feel free to reach
            out using the information below or the form on the right.
          </p>

          <div className="flex gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#0e7c85] flex items-center justify-center shrink-0">
              <PinIcon />
            </div>
            <div>
              <p className="font-semibold">Our Address</p>
              <p className="text-gray-600 text-sm mt-1">Kathmandu</p>
              <p className="text-gray-600 text-sm">Bagmati Province, Nepal</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#0e7c85] flex items-center justify-center shrink-0">
              <PhoneIcon />
            </div>
            <div>
              <p className="font-semibold">Contact</p>
              <p className="text-gray-600 text-sm mt-1">Phone: +977 980-000-0000</p>
              <p className="text-gray-600 text-sm">Mail: support@elysianecommerce.com</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Ready to Get Started?</h2>

          {submitted && (
            <div className="mb-4 rounded-lg bg-[#eafcfd] text-[#0e7c85] px-3 py-2 text-sm">
              Thanks — we've received your message and will get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#0e7c85]"
            />
            <input
              type="tel"
              placeholder="Your mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#0e7c85]"
            />
            <input
              type="email"
              placeholder="Your email address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#0e7c85]"
            />
            <textarea
              placeholder="Write your message..."
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#0e7c85]"
            />

            <button
              type="submit"
              className="w-full bg-[#0e7c85] text-white py-2.5 rounded-lg text-sm hover:bg-[#0b6169] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
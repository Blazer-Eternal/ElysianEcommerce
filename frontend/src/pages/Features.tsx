const features = [
  {
    title: "Worldwide Delivery",
    description: "Fast and reliable shipping to your doorstep, wherever you are.",
  },
  {
    title: "24/7 Customer Support",
    description: "Our team is here to help with any question, any time.",
  },
  {
    title: "Premium Quality",
    description: "Every product is checked for quality before it reaches you.",
  },
  {
    title: "Best Prices",
    description: "Competitive pricing with regular deals and discounts.",
  },
  {
    title: "Secure Checkout",
    description: "Your data and payment information are always protected.",
  },
  {
    title: "Easy Returns",
    description: "A straightforward 30-day return policy on eligible items.",
  },
];

const Features = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Why Shop With Us</h1>
      <p className="text-gray-600 mb-10">Everything we do is built around getting this right.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="border rounded-lg p-5">
            <h2 className="font-semibold mb-1">{feature.title}</h2>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
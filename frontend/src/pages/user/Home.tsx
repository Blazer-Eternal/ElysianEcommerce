import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/product/ProductGrid";
import { ROUTES } from "../../constants/routes";

const whyChooseUs = [
  { title: "Worldwide Delivery", description: "Fast and reliable shipping, wherever you are." },
  { title: "24/7 Customer Support", description: "Our team is here to help, any time." },
  { title: "Premium Quality", description: "Every product checked before it reaches you." },
  { title: "Best Prices", description: "Competitive pricing with regular deals." },
];

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productService.getAll({ status: "active", limit: 8, sortBy: "created_at", sortOrder: "asc" }),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-20">
      {/* Hero */}
      <section className="glass rounded-3xl px-8 py-16 text-center sm:text-left relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full accent-bg opacity-40 blur-2xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-[#0e7c85] font-medium mb-3">New season</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-lg">
            Welcome to ElysianEcommerce
          </h1>
          <p className="text-gray-600 mt-3 max-w-md">
            Discover thoughtfully curated products across every category, delivered right to your door.
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-block mt-6 bg-[#0e7c85] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#0b6169] transition-colors"
          >
            Shop All Products
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Why Choose Us</h2>
          <Link to={ROUTES.FEATURES} className="text-sm accent-text hover:underline">
            See all features →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="glass rounded-2xl p-5">
              <h3 className="font-medium text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Latest Products</h2>
          <Link to={ROUTES.PRODUCTS} className="text-sm accent-text hover:underline">
            View all products →
          </Link>
        </div>
        <ProductGrid products={data?.data || []} isLoading={isLoading} />
      </section>

      {/* About preview */}
      <section className="glass rounded-3xl px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-3">About ElysianEcommerce</h2>
          <p className="text-gray-600 leading-relaxed">
            ElysianEcommerce is a full-stack ecommerce platform built with the MERN stack and
            TypeScript, designed around a clean, considered shopping experience — from browsing to
            checkout to order tracking.
          </p>
          <Link to={ROUTES.ABOUT} className="inline-block mt-4 text-sm accent-text hover:underline">
            Learn more about us →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="glass-strong rounded-2xl py-6">
            <p className="text-2xl font-semibold accent-text">36+</p>
            <p className="text-xs text-gray-500 mt-1">Products</p>
          </div>
          <div className="glass-strong rounded-2xl py-6">
            <p className="text-2xl font-semibold accent-text">10+</p>
            <p className="text-xs text-gray-500 mt-1">Categories</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-6">
        <h2 className="text-xl font-semibold mb-2">Ready to start shopping?</h2>
        <p className="text-gray-600 mb-6 text-sm">Browse our full catalog and find something you'll love.</p>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-block bg-[#0e7c85] text-white px-8 py-3 rounded-full text-sm hover:bg-[#0b6169] transition-colors"
        >
          Explore Products
        </Link>
      </section>
    </div>
  );
};

export default Home;
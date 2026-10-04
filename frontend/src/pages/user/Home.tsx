import HeroSection from "../../components/sections/HeroSection";
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection";
import ProductsSection from "../../components/sections/ProductsSection";
import PlansSection from "../../components/sections/PlansSection";
import CTASection from "../../components/sections/CTASection";

const Home = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <WhyChooseUsSection />
      <ProductsSection />
      <PlansSection />
      <CTASection />
    </div>
  );
};

export default Home;

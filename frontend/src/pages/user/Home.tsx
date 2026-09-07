import HeroSection from "../../components/sections/HeroSection";
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection";
import ProductsSection from "../../components/sections/ProductsSection";
import AboutSection from "../../components/sections/AboutSection";
import CTASection from "../../components/sections/CTASection";

const Home = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <WhyChooseUsSection />
      <ProductsSection />
      <AboutSection />
      <CTASection />
    </div>
  );
};

export default Home;
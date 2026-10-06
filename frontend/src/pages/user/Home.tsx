import HeroSection from "../../components/sections/HeroSection";
import MarqueeTicker from "../../components/sections/MarqueeTicker";
import StorySection from "../../components/sections/StorySection";
import SignatureSection from "../../components/sections/SignatureSection";
import ProductsSection from "../../components/sections/ProductsSection";
import PlansSection from "../../components/sections/PlansSection";
import AppSection from "../../components/sections/AppSection";
import CTASection from "../../components/sections/CTASection";

const Home = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <MarqueeTicker />
      <StorySection />
      <SignatureSection />
      <ProductsSection />
      <PlansSection />
      <AppSection />
      <CTASection />
    </div>
  );
};

export default Home;

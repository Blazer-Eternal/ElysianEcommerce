import { memo, useMemo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import heroImage from "../../assets/images/HeroSection.png";
import { GhostFibers } from "../GhostFibers";

const ArrowIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
));

ArrowIcon.displayName = "ArrowIcon";

const HeroSection = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Memoize Ghost Fibers props to prevent unnecessary re-renders
  const ghostFibersProps = useMemo(() => ({
    lineColor: "#140E35",
    glowColor: "#3437A0",
    speed: 0.2,
    scale: 2,
    rotation: 0,
    rotationSpeed: 0.25,
    layers: 4,
    waveAmplitude: 0.015,
    waveFrequency: 3,
    waveSpeed: 0.15,
    layerSpeed: 0.08,
    twist: 0.1,
    twistFrequency: 5,
    twistSpeed: 1.2,
    lineFrequency: 5,
    lineSpacing: 2,
    lineSharpness: 16,
    glowFalloff: 10,
    glowIntensity: 1.6,
    brightness: 2,
    blueBoost: 1.25,
    vignette: 0.8,
    grain: 0.05,
    dpr: 1,
  }), []);

  // Intersection Observer for animations on view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[60vh] sm:min-h-[70vh] overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-24 section-container"
    >
      {/* GhostFibers animated background - GPU accelerated */}
      <div className="absolute inset-0 -z-10 gpu-accelerate" style={{ width: "100%", height: "100%", contain: "strict" }}>
        {isInView && <GhostFibers {...ghostFibersProps} />}
      </div>

      {/* Animated background gradient overlay - Optimized */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none" style={{ contain: "layout style paint" }}>
        <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-blue-200/40 to-cyan-200/20 rounded-full blur-3xl animate-blob gpu-accelerate will-animate"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-linear-to-bl from-teal-200/40 to-cyan-200/20 rounded-full blur-3xl animate-blob animation-delay-2000 gpu-accelerate will-animate" style={{ contain: "layout style paint" }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Content */}
          <div className={`space-y-6 sm:space-y-8 order-2 lg:order-1 transition-smooth ${isInView ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="space-y-4">
              <div className="inline-block glass px-4 py-2 rounded-full text-sm font-medium text-[#0e7c85] animate-fade-in" style={{ animationDelay: isInView ? "0.1s" : "0s" }}>
                ✨ Welcome to Excellence
              </div>
              
              <h1 className="text-responsive-h1 font-bold leading-tight text-gray-900 animate-fade-in" style={{ animationDelay: isInView ? "0.2s" : "0s" }}>
                Discover <span className="bg-linear-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Premium</span> Products
              </h1>
              
              <p className="text-responsive-body text-gray-600 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: isInView ? "0.3s" : "0s" }}>
                Explore our curated collection of high-quality products delivered with elegance. Experience shopping like never before with our seamless platform.
              </p>
            </div>

            {/* CTA Buttons - Optimized */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to={ROUTES.PRODUCTS}
                className="glass-strong px-8 py-3 sm:py-4 rounded-xl font-semibold text-gray-900 hover:bg-white/90 hover-lift flex items-center justify-center sm:justify-start gap-2 group text-center transition-smooth"
              >
                Shop Now
                <ArrowIcon />
              </Link>
              
              <Link
                to={ROUTES.FEATURES}
                className="glass px-8 py-3 sm:py-4 rounded-xl font-semibold text-gray-700 hover:bg-white/70 transition-smooth text-center hover-lift"
              >
                Learn More
              </Link>
            </div>

            {/* Trust badges - Responsive */}
            <div className="flex items-center gap-responsive pt-4 flex-wrap">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-[#0e7c85]">50k+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-[#0e7c85]">100%</div>
                <div className="text-xs sm:text-sm text-gray-600">Authentic</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-[#0e7c85]">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right side - Image - Optimized */}
          <div className={`order-1 lg:order-2 flex justify-center lg:justify-end transition-smooth ${isInView ? "animate-slide-in-right" : "opacity-0"}`}>
            <div className="relative w-96 sm:w-full max-w-md card-container">
              {/* Decorative elements - GPU accelerated */}
              <div className="absolute -inset-8 bg-linear-to-br from-[#0e7c85]/10 to-cyan-300/10 rounded-3xl blur-2xl gpu-accelerate pointer-events-none"></div>
              
              {/* Image without border - Lazy loading optimization */}
              <div className="relative z-10 will-animate">
                <div className="aspect-square rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
                  <img 
                    src={heroImage} 
                    alt="Premium Products" 
                    className="w-full h-full object-cover gpu-accelerate"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;


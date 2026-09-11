/**
 * AnimatedSection Component
 * Reusable section component with staggered child animations
 */

import type { ReactNode } from "react";
import React from "react";
import { useStaggeredAnimation } from "../../hooks/useInViewAnimation";

interface AnimatedSectionProps {
  children: ReactNode[];
  className?: string;
  itemAnimation?: "fade" | "slide-left" | "slide-right" | "scale";
  staggerDelay?: number;
  threshold?: number;
  rootMargin?: string;
}

const animationClasses = {
  fade: "animate-fade-in",
  "slide-left": "animate-slide-in-left",
  "slide-right": "animate-slide-in-right",
  scale: "animate-scale-in",
};

/**
 * Section component with staggered child animations
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  itemAnimation = "fade",
  staggerDelay = 100,
  threshold = 0.1,
  rootMargin = "50px",
}) => {
  const childArray = React.Children.toArray(children);
  const { containerRef, shouldAnimate } = useStaggeredAnimation(
    childArray.length,
    { staggerDelay, threshold, rootMargin }
  );

  const animationClass = animationClasses[itemAnimation];

  return (
    <div ref={containerRef} className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className={`transition-smooth ${
            shouldAnimate(index) ? animationClass : "opacity-0"
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default AnimatedSection;

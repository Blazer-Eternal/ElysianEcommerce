/**
 * AnimatedCard Component
 * Reusable card component with smooth entrance animations
 */

import type { ReactNode } from "react";
import React from "react";
import { useInViewAnimation } from "../../hooks/useInViewAnimation";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  animation?: "fade" | "slide-left" | "slide-right" | "scale";
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  onClick?: () => void;
}

const animationClasses = {
  fade: "animate-fade-in",
  "slide-left": "animate-slide-in-left",
  "slide-right": "animate-slide-in-right",
  scale: "animate-scale-in",
};

/**
 * Card component that animates on view
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  animation = "fade",
  delay = 0,
  threshold = 0.1,
  rootMargin = "50px",
  onClick,
}) => {
  const { ref, isInView } = useInViewAnimation({
    threshold,
    rootMargin,
    triggerOnce: true,
    delay,
  });

  const animationClass = isInView ? animationClasses[animation] : "opacity-0";

  return (
    <div
      ref={ref}
      className={`transition-smooth ${animationClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;

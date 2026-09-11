/**
 * PageTransition Component
 * Provides smooth page transitions with fade-in/out animations
 */

import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
}

/**
 * Smooth page transition wrapper
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  duration = 300,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, children]);

  return (
    <div
      className={`transition-opacity ${duration === 300 ? "transition-smooth" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;

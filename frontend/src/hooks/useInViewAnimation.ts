/**
 * useInViewAnimation Hook
 * Triggers animations when element enters viewport
 * Improves performance by deferring animation until needed
 */

import { useEffect, useRef, useState, useCallback } from "react";

interface UseInViewAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * Hook to trigger animations when element enters viewport
 * Returns ref to attach to element and isInView state
 */
export const useInViewAnimation = (
  options: UseInViewAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "50px",
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(true);
              setHasBeenInView(true);
            }, delay);
          } else {
            setIsInView(true);
            setHasBeenInView(true);
          }

          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return {
    ref,
    isInView,
    hasBeenInView,
  };
};

/**
 * Hook for staggered animations on multiple elements
 */
export const useStaggeredAnimation = (
  itemCount: number,
  options: UseInViewAnimationOptions & { staggerDelay?: number } = {}
) => {
  const { staggerDelay = 100, ...restOptions } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [animateIndices, setAnimateIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animations
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setAnimateIndices((prev) => new Set(prev).add(i));
            }, i * staggerDelay);
          }

          if (restOptions.triggerOnce !== false && containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        threshold: restOptions.threshold || 0.1,
        rootMargin: restOptions.rootMargin || "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [itemCount, staggerDelay, restOptions]);

  const shouldAnimate = useCallback(
    (index: number) => animateIndices.has(index),
    [animateIndices]
  );

  return {
    containerRef,
    shouldAnimate,
    animateIndices,
  };
};

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const { top, height } = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when element is below viewport, 1 when above
      const elementCenter = top + height / 2;
      const progress = 1 - (elementCenter + windowHeight / 2) / windowHeight;

      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    ref,
    scrollProgress,
  };
};

/**
 * Hook for parallax scroll effect
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const { top } = ref.current.getBoundingClientRect();
      const newOffset = top * speed;

      setOffset(newOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return {
    ref,
    offset,
    style: {
      transform: `translateY(${offset}px)`,
    },
  };
};

/**
 * Hook for fade in animation on element visibility
 */
export const useFadeIn = (options: UseInViewAnimationOptions = {}) => {
  const { ref, isInView } = useInViewAnimation(options);

  return {
    ref,
    className: isInView ? "animate-fade-in" : "opacity-0",
    isInView,
  };
};

/**
 * Hook for slide in animation
 */
export const useSlideIn = (
  direction: "left" | "right" | "top" | "bottom" = "left",
  options: UseInViewAnimationOptions = {}
) => {
  const { ref, isInView } = useInViewAnimation(options);

  const animationClass = {
    left: "animate-slide-in-left",
    right: "animate-slide-in-right",
    top: "animate-slide-in-top",
    bottom: "animate-fade-in",
  }[direction];

  return {
    ref,
    className: isInView ? animationClass : "opacity-0",
    isInView,
  };
};

/**
 * Hook for scale in animation
 */
export const useScaleIn = (options: UseInViewAnimationOptions = {}) => {
  const { ref, isInView } = useInViewAnimation(options);

  return {
    ref,
    className: isInView ? "animate-scale-in" : "opacity-0 scale-95",
    isInView,
  };
};

/**
 * Hook for debounced resize detection
 */
export const useDebounceResize = (callback: () => void, delay = 300) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [callback, delay]);
};

/**
 * Hook for detecting viewport size changes
 */
export const useViewportSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

/**
 * Hook for detecting reduced motion preference
 */
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

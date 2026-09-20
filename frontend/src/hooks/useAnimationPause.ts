/**
 * useAnimationPause Hook
 * Pauses CSS animations and transitions when element is off-screen
 * Dramatically reduces CPU/GPU load on pages with many animated elements
 * 
 * Features:
 * - IntersectionObserver-based visibility tracking
 * - Applies animation-play-state: paused to all children when off-screen
 * - Supports nested animations and Framer Motion components
 * - Configurable threshold and rootMargin
 * - Optional scroll pause (pauses when scrolling fast)
 * - Respects prefers-reduced-motion preference
 */

import { useEffect, useRef, useState, useCallback } from "react";

interface UseAnimationPauseOptions {
  /**
   * Intersection observer threshold (0-1)
   * @default 0.05
   */
  threshold?: number | number[];

  /**
   * Margin around viewport to start/stop animations
   * @default "100px"
   */
  rootMargin?: string;

  /**
   * Pause animations while scrolling (resume after scroll ends)
   * @default true
   */
  pauseOnScroll?: boolean;

  /**
   * Scroll pause timeout in ms (when to resume after scroll ends)
   * @default 300
   */
  scrollPauseTimeout?: number;

  /**
   * Also apply to direct child elements (not just container)
   * @default true
   */
  pauseChildren?: boolean;

  /**
   * Respect prefers-reduced-motion user preference
   * @default true
   */
  respectReducedMotion?: boolean;

  /**
   * Custom pause class name (applied to element)
   * @default "animation-paused-by-visibility"
   */
  pauseClassName?: string;
}

/**
 * Hook to pause/resume animations based on element visibility
 * Returns ref to attach to animated container
 */
export const useAnimationPause = (
  options: UseAnimationPauseOptions = {}
) => {
  const {
    threshold = 0.05,
    rootMargin = "100px",
    pauseOnScroll = true,
    scrollPauseTimeout = 300,
    pauseChildren = true,
    respectReducedMotion = true,
    pauseClassName = "animation-paused-by-visibility",
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotionRef = useRef(false);

  // Check prefers-reduced-motion preference
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [respectReducedMotion]);

  // Apply pause CSS classes to element and children
  const applyPauseClass = useCallback((element: HTMLElement | null, isPaused: boolean) => {
    if (!element) return;

    if (isPaused) {
      element.classList.add(pauseClassName);
      if (pauseChildren) {
        element.querySelectorAll("[class*='animate-'], [style*='animation']").forEach((child) => {
          (child as HTMLElement).classList.add(pauseClassName);
        });
      }
    } else {
      element.classList.remove(pauseClassName);
      if (pauseChildren) {
        element.querySelectorAll(`.${pauseClassName}`).forEach((child) => {
          (child as HTMLElement).classList.remove(pauseClassName);
        });
      }
    }
  }, [pauseClassName, pauseChildren]);

  // Update pause state based on visibility and scroll state
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Don't pause if user prefers reduced motion (already paused globally)
    if (prefersReducedMotionRef.current) {
      applyPauseClass(element, false);
      return;
    }

    // Pause if not visible OR currently scrolling
    const shouldBePaused = !isVisible || isScrolling;
    applyPauseClass(element, shouldBePaused);
  }, [isVisible, isScrolling, applyPauseClass]);

  // IntersectionObserver for visibility tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
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
  }, [threshold, rootMargin]);

  // Scroll pause handler
  useEffect(() => {
    if (!pauseOnScroll) return;

    const handleScroll = () => {
      setIsScrolling(true);

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Resume after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, scrollPauseTimeout);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pauseOnScroll, scrollPauseTimeout]);

  return {
    ref,
    isVisible,
    isScrolling,
  };
};

/**
 * Hook to pause animations in a grid/list of items
 * More efficient than applying to each item individually
 */
export const useGridAnimationPause = (
  options: Omit<UseAnimationPauseOptions, "pauseChildren"> = {}
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const {
    threshold = 0.05,
    rootMargin = "100px",
    respectReducedMotion = true,
    pauseClassName = "animation-paused-by-visibility",
  } = options;

  // Check prefers-reduced-motion preference
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && containerRef.current) {
        containerRef.current.classList.add("animation-reduced");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [respectReducedMotion]);

  // IntersectionObserver for container visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (containerRef.current) {
          if (entry.isIntersecting) {
            containerRef.current.classList.remove(pauseClassName);
            setIsVisible(true);
          } else {
            containerRef.current.classList.add(pauseClassName);
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin, pauseClassName]);

  return {
    containerRef,
    isVisible,
  };
};

/**
 * Hook for smooth animation resume on page focus
 * Resumes all paused animations when tab becomes active
 */
export const useAnimationResume = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible - trigger animation-play-state: running on all
        document.querySelectorAll(".animation-paused-by-visibility").forEach((el) => {
          (el as HTMLElement).classList.remove("animation-paused-by-visibility");
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

/**
 * Utility function to pause all animations on page
 * Useful for modals, overlays, or loading states
 */
export const pauseAllAnimations = () => {
  document.querySelectorAll("[class*='animate-'], [style*='animation']").forEach((el) => {
    (el as HTMLElement).classList.add("animation-paused-by-visibility");
  });
};

/**
 * Utility function to resume all animations on page
 */
export const resumeAllAnimations = () => {
  document.querySelectorAll(".animation-paused-by-visibility").forEach((el) => {
    (el as HTMLElement).classList.remove("animation-paused-by-visibility");
  });
};

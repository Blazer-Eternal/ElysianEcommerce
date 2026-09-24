/**
 * useAnimationPause Hook
 * Pauses CSS animations and transitions when element is off-screen
 * Dramatically reduces CPU/GPU load on pages with many animated elements
 *
 * Features:
 * - IntersectionObserver-based visibility tracking
 * - Applies the pause class to the container; descendants are covered by the
 *   `.animation-paused-by-visibility *` rule in index.css (no per-child DOM scans)
 * - Stateless/imperative class toggling — scrolling never re-renders host components
 * - One shared window scroll listener drives every subscribed element
 * - Respects prefers-reduced-motion preference
 *
 * Implementation notes:
 * - The class is only toggled when the paused state actually changes, so there is
 *   no querySelectorAll/class churn per frame.
 * - `pauseOnScroll` uses a module-level shared listener with a fixed 300ms resume
 *   delay (the previous default `scrollPauseTimeout`); no caller overrides it.
 * - `pauseChildren` remains accepted for API compatibility but is no longer needed
 *   because the CSS `*` rule pauses descendant animations automatically.
 */

import { useEffect, useRef, useCallback } from "react";

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
   * Scroll pause timeout in ms (when to resume after scroll ends).
   * Reserved for API compatibility — the shared scroll listener uses 300ms.
   */
  scrollPauseTimeout?: number;

  /**
   * Also apply to direct child elements (not just container).
   * Reserved for API compatibility — descendants are paused via the CSS
   * `.animation-paused-by-visibility *` rule.
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

const SCROLL_RESUME_DELAY = 300;

/** Shared scroll-pause state — one listener, zero React re-renders. */
let scrollResumeTimer: ReturnType<typeof setTimeout> | null = null;
let isScrollPaused = false;
const scrollSubscribers = new Set<() => void>();

const setScrollPaused = (paused: boolean) => {
  if (isScrollPaused === paused) return;
  isScrollPaused = paused;
  scrollSubscribers.forEach((notify) => notify());
};

const handleSharedScroll = () => {
  setScrollPaused(true);
  if (scrollResumeTimer) clearTimeout(scrollResumeTimer);
  scrollResumeTimer = setTimeout(() => {
    scrollResumeTimer = null;
    setScrollPaused(false);
  }, SCROLL_RESUME_DELAY);
};

const subscribeToScroll = (notify: () => void): (() => void) => {
  if (scrollSubscribers.size === 0) {
    window.addEventListener("scroll", handleSharedScroll, { passive: true });
  }
  scrollSubscribers.add(notify);
  return () => {
    scrollSubscribers.delete(notify);
    if (scrollSubscribers.size === 0 && scrollResumeTimer) {
      clearTimeout(scrollResumeTimer);
      scrollResumeTimer = null;
      isScrollPaused = false;
    }
  };
};

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
    respectReducedMotion = true,
    pauseClassName = "animation-paused-by-visibility",
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const pausedRef = useRef(false);

  // Imperative pause sync: toggles the class only on real state changes.
  const syncPauseState = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    // Reduced motion is handled globally by CSS; never force-pause here.
    const reducedActive = respectReducedMotion && reducedMotionRef.current;
    const shouldPause =
      !reducedActive && (!isVisibleRef.current || (pauseOnScroll && isScrollPaused));

    if (pausedRef.current === shouldPause) return;
    pausedRef.current = shouldPause;
    element.classList.toggle(pauseClassName, shouldPause);
  }, [pauseClassName, pauseOnScroll, respectReducedMotion]);

  // Check prefers-reduced-motion preference
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      syncPauseState();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [respectReducedMotion, syncPauseState]);

  // IntersectionObserver for visibility tracking (updates a ref — no re-render)
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        syncPauseState();
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, syncPauseState]);

  // Shared scroll pause subscription (one window listener across all instances)
  useEffect(() => {
    if (!pauseOnScroll) return;
    return subscribeToScroll(syncPauseState);
  }, [pauseOnScroll, syncPauseState]);

  // Sync once on mount in case the element starts off-screen or a scroll is active
  useEffect(() => {
    syncPauseState();
  }, [syncPauseState]);

  return { ref };
};

/**
 * Hook to pause animations in a grid/list of items
 * More efficient than applying to each item individually
 */
export const useGridAnimationPause = (
  options: Omit<UseAnimationPauseOptions, "pauseChildren"> = {}
) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  // IntersectionObserver for container visibility — classList only, no state
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (containerRef.current) {
          containerRef.current.classList.toggle(pauseClassName, !entry.isIntersecting);
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

  return { containerRef };
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

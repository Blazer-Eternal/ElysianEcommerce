/**
 * Custom React Hooks
 * Centralized exports for all custom hooks
 */

export {
  useInViewAnimation,
  useStaggeredAnimation,
  useScrollAnimation,
  useParallax,
  useFadeIn,
  useSlideIn,
  useScaleIn,
  useDebounceResize,
  useViewportSize,
  usePrefersReducedMotion,
} from "./useInViewAnimation";

export {
  useAnimationPause,
  useGridAnimationPause,
  useAnimationResume,
  pauseAllAnimations,
  resumeAllAnimations,
} from "./useAnimationPause";

export {
  useOptimizedLoading,
  useAspectRatioPreserver,
  useSmoothLoading,
} from "./useOptimizedLoading";

export type { } from "./useInViewAnimation";

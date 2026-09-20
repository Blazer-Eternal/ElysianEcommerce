/**
 * useOptimizedLoading Hook
 * Optimizes loading states to prevent empty gray boxes and flash of unstyled content
 * 
 * Strategy:
 * 1. Show styled skeleton matching final layout (no empty boxes)
 * 2. Use minimum delay before showing content (200ms+ for perception)
 * 3. Smooth fade-in transition when content loads
 * 4. Prevent layout shift during skeleton → content transition
 */

import { useEffect, useRef, useState } from "react";

interface UseOptimizedLoadingOptions {
  /**
   * Minimum time to show skeleton (prevents flickering)
   * @default 300
   */
  minShowTime?: number;

  /**
   * Delay before showing skeleton (prevents showing skeleton for fast loads)
   * @default 100
   */
  skeletonDelayTime?: number;

  /**
   * Enable animated skeleton pulse
   * @default true
   */
  animateSkeleton?: boolean;
}

interface UseOptimizedLoadingReturn {
  /**
   * Show skeleton instead of content
   */
  showSkeleton: boolean;

  /**
   * Content is loaded (but may still be showing skeleton if within minShowTime)
   */
  isLoaded: boolean;

  /**
   * Fade-in animation class for content
   */
  fadeInClass: string;
}

/**
 * Hook for optimized loading with skeleton placeholders
 * Prevents flash of unstyled content and empty boxes
 */
export const useOptimizedLoading = (
  isLoading: boolean,
  options: UseOptimizedLoadingOptions = {}
): UseOptimizedLoadingReturn => {
  const {
    minShowTime = 300,
    skeletonDelayTime = 100,
  } = options;

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isLoaded, setIsLoaded] = useState(!isLoading);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isLoading) {
      // Start loading: show skeleton after a short delay
      startTimeRef.current = Date.now();
      
      // Clear previous timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Show skeleton after skeletonDelayTime to avoid showing it for fast loads
      timeoutRef.current = setTimeout(() => {
        setShowSkeleton(true);
      }, skeletonDelayTime);

      setIsLoaded(false);
    } else {
      // Content loaded: ensure skeleton shown for at least minShowTime
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minShowTime - elapsedTime);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (remainingTime > 0) {
        // Still within minimum show time - keep skeleton visible
        timeoutRef.current = setTimeout(() => {
          setShowSkeleton(false);
          setIsLoaded(true);
        }, remainingTime);
      } else {
        // Minimum time elapsed - show content immediately
        setShowSkeleton(false);
        setIsLoaded(true);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, minShowTime, skeletonDelayTime]);

  return {
    showSkeleton,
    isLoaded,
    fadeInClass: isLoaded && !showSkeleton ? "animate-fade-in" : "",
  };
};

/**
 * Hook to prevent layout shift during content load
 * Returns aspect ratio padding style for skeleton
 */
export const useAspectRatioPreserver = (ratio: number = 16 / 9) => {
  return {
    style: {
      aspectRatio: `${ratio}`,
      overflow: "hidden",
    },
  };
};

/**
 * Hook for smooth loading state management
 * Coordinates skeleton visibility, min show time, and content fade-in
 */
export const useSmoothLoading = (
  isLoading: boolean,
  errorContent?: React.ReactNode
) => {
  const { showSkeleton, isLoaded, fadeInClass } = useOptimizedLoading(isLoading, {
    minShowTime: 400, // Show skeleton for at least 400ms
    skeletonDelayTime: 150, // Wait 150ms before showing skeleton
    animateSkeleton: true,
  });

  const isError = errorContent !== undefined;

  return {
    showSkeleton: showSkeleton && !isError,
    showContent: isLoaded && !showSkeleton && !isError,
    showError: isError,
    fadeInClass,
    isLoading: isLoading || showSkeleton,
  };
};

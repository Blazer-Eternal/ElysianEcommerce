/**
 * Responsive Design Utilities
 * Provides helper functions for responsive design patterns and media queries
 */

// Breakpoints aligned with Tailwind CSS
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Get current breakpoint based on window width
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === "undefined") return "xs";

  const width = window.innerWidth;

  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
};

/**
 * Check if current breakpoint is at least the specified breakpoint
 */
export const isBreakpointUp = (breakpoint: Breakpoint): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

/**
 * Check if current breakpoint is exactly the specified breakpoint
 */
export const isBreakpointOnly = (breakpoint: Breakpoint): boolean => {
  if (typeof window === "undefined") return false;

  const width = window.innerWidth;
  const breakpointValue = BREAKPOINTS[breakpoint];

  // Get next breakpoint
  const breakpointKeys = Object.keys(BREAKPOINTS) as Breakpoint[];
  const currentIndex = breakpointKeys.indexOf(breakpoint);
  const nextBreakpoint = currentIndex < breakpointKeys.length - 1 
    ? BREAKPOINTS[breakpointKeys[currentIndex + 1]] 
    : Infinity;

  return width >= breakpointValue && width < nextBreakpoint;
};

/**
 * Hook-friendly responsive value selector
 * Returns different values based on current breakpoint
 */
export const getResponsiveValue = <T,>(
  values: Partial<Record<Breakpoint, T>>,
  defaultValue: T
): T => {
  const currentBreakpoint = getCurrentBreakpoint();
  const breakpointKeys = Object.keys(BREAKPOINTS) as Breakpoint[];
  const currentIndex = breakpointKeys.indexOf(currentBreakpoint);

  // Search from current breakpoint down to xs for a defined value
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointKeys[i];
    if (values[bp] !== undefined) {
      return values[bp]!;
    }
  }

  return defaultValue;
};

/**
 * Generate responsive padding/margin class
 */
export const generateResponsiveSpacing = (
  property: "p" | "m" | "px" | "py" | "mx" | "my",
  spacing: Partial<Record<Breakpoint, string | number>>
): string => {
  return Object.entries(spacing)
    .map(([bp, value]) => {
      if (bp === "xs") return `${property}-${value}`;
      return `${bp}:${property}-${value}`;
    })
    .join(" ");
};

/**
 * Generate responsive text size class
 */
export const generateResponsiveText = (
  sizes: Partial<Record<Breakpoint, "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl">>
): string => {
  return Object.entries(sizes)
    .map(([bp, size]) => {
      if (bp === "xs") return `text-${size}`;
      return `${bp}:text-${size}`;
    })
    .join(" ");
};

/**
 * Generate responsive grid columns
 */
export const generateResponsiveGrid = (
  columns: Partial<Record<Breakpoint, number>>
): string => {
  return Object.entries(columns)
    .map(([bp, cols]) => {
      if (bp === "xs") return `grid-cols-${cols}`;
      return `${bp}:grid-cols-${cols}`;
    })
    .join(" ");
};

/**
 * Generate responsive width class
 */
export const generateResponsiveWidth = (
  widths: Partial<Record<Breakpoint, string>>
): string => {
  return Object.entries(widths)
    .map(([bp, width]) => {
      if (bp === "xs") return `w-${width}`;
      return `${bp}:w-${width}`;
    })
    .join(" ");
};

/**
 * Container size utilities for responsive layouts
 */
export const CONTAINER_WIDTHS = {
  xs: "100%",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * Generate media query string
 */
export const generateMediaQuery = (breakpoint: Breakpoint): string => {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
};

/**
 * Safe area utilities for mobile devices
 */
export const SAFE_AREA_CLASSES = {
  paddingTop: "pt-safe",
  paddingBottom: "pb-safe",
  paddingLeft: "pl-safe",
  paddingRight: "pr-safe",
} as const;

/**
 * Touch target size (minimum 44x44 for accessibility)
 */
export const TOUCH_TARGET_SIZE = "44px";

/**
 * Responsive image utilities
 */
export const generateResponsiveImage = (
  widths: Partial<Record<Breakpoint, string | number>>,
  defaultWidth = "100%"
): { sizes: string; srcSet?: string } => {
  const sizes = Object.entries(widths)
    .map(([bp, width]) => {
      if (bp === "xs") return `(min-width: 0px) ${width}`;
      return `(min-width: ${BREAKPOINTS[bp as Breakpoint]}px) ${width}`;
    })
    .join(", ");

  return {
    sizes: sizes || defaultWidth,
  };
};

/**
 * Aspect ratio utilities
 */
export const ASPECT_RATIOS = {
  square: "1/1",
  video: "16/9",
  thumbnail: "4/3",
  portrait: "3/4",
  landscape: "21/9",
} as const;

/**
 * Z-index utilities for consistent stacking
 */
export const Z_INDEX = {
  hide: -1,
  auto: 0,
  base: 10,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  notification: 700,
  debug: 999,
} as const;

/**
 * Spacing scale utilities
 */
export const SPACING_SCALE = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
} as const;

/**
 * Animation timing scale
 */
export const ANIMATION_TIMING = {
  fast: 150,
  base: 300,
  slow: 500,
  slower: 700,
} as const;

/**
 * Calculate readable line length (45-75 characters)
 */
export const READABLE_LINE_LENGTH = {
  sm: "25rem", // 400px - short
  md: "32rem", // 512px - medium
  lg: "45rem", // 720px - long
  full: "100%",
} as const;

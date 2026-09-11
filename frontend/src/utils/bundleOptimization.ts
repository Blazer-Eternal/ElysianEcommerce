/**
 * Bundle Optimization Utilities
 * Provides guidance and tools for optimizing bundle size and code splitting
 */

import React from "react";

/**
 * Dynamic import for code splitting
 * Reduces initial bundle size by splitting features into chunks
 */
export const lazyLoad = async (
  importStatement: () => Promise<{ default: React.ComponentType<any> }>
) => {
  return importStatement().then((module) => module.default);
};

/**
 * Prefetch resources for better performance
 */
export const prefetchResource = (url: string, as?: "script" | "style" | "image"): void => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  if (as) {
    link.as = as;
  }
  document.head.appendChild(link);
};

/**
 * Preload critical resources
 */
export const preloadResource = (
  url: string,
  as: "script" | "style" | "image" | "font",
  crossOrigin?: boolean
): void => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  link.as = as;
  if (crossOrigin) {
    link.crossOrigin = "anonymous";
  }
  document.head.appendChild(link);
};

/**
 * DNS prefetch for external domains
 */
export const dnsPrefetch = (domain: string): void => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "dns-prefetch";
  link.href = `//${domain}`;
  document.head.appendChild(link);
};

/**
 * Preconnect to external origins
 */
export const preconnect = (origin: string, crossOrigin?: boolean): void => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = origin;
  if (crossOrigin) {
    link.crossOrigin = "anonymous";
  }
  document.head.appendChild(link);
};

/**
 * Bundle analysis recommendations
 */
export const BUNDLE_OPTIMIZATION_TIPS = {
  codeSpitting: [
    "✅ Use React.lazy() for route-based code splitting",
    "✅ Lazy load heavy components (charts, editors, maps)",
    "✅ Implement route-based chunking for admin/user sections",
  ],

  dependencies: [
    "✅ Audit unused dependencies regularly",
    "✅ Prefer smaller alternatives (date-fns over moment.js)",
    "✅ Use tree-shaking for ES modules",
    "✅ Remove development-only packages from production",
  ],

  imageOptimization: [
    "✅ Use WebP format with fallbacks",
    "✅ Implement responsive images with srcset",
    "✅ Lazy load images below the fold",
    "✅ Optimize SVGs (remove metadata, compress)",
    "✅ Use CSS sprites for small icons",
  ],

  cssOptimization: [
    "✅ Remove unused CSS with PurgeCSS/Tailwind",
    "✅ Combine critical CSS inline in HTML",
    "✅ Defer non-critical CSS loading",
    "✅ Minimize specificity in selectors",
  ],

  jsOptimization: [
    "✅ Minify JavaScript (handled by build tool)",
    "✅ Remove console.log in production",
    "✅ Debounce and throttle event handlers",
    "✅ Use requestIdleCallback for non-critical work",
  ],

  performance: [
    "✅ Enable gzip/brotli compression on server",
    "✅ Use CDN for static assets",
    "✅ Enable HTTP/2 server push",
    "✅ Implement service workers for caching",
    "✅ Use HTTP caching headers effectively",
  ],

  monitoring: [
    "✅ Monitor Core Web Vitals",
    "✅ Track bundle size over time",
    "✅ Analyze resource loading patterns",
    "✅ Set performance budgets",
  ],
};

/**
 * Print optimization tips
 */
export const printOptimizationTips = (): void => {
  console.group("🚀 Bundle Optimization Tips");

  Object.entries(BUNDLE_OPTIMIZATION_TIPS).forEach(([category, tips]) => {
    console.group(`📋 ${category.replace(/([A-Z])/g, " $1").toLowerCase()}`);
    tips.forEach((tip) => console.log(tip));
    console.groupEnd();
  });

  console.groupEnd();
};

/**
 * Vite-specific optimization configuration
 * Use in vite.config.ts
 */
export const VITE_BUILD_OPTIMIZATION = {
  build: {
    // Chunk size warning threshold
    chunkSizeWarningLimit: 500,

    // Rollup output options
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          react: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query"],
          vendor: ["axios", "ogl"],

          // Feature chunks
          animations: ["./src/components/animations"],
          utils: ["./src/utils"],
          hooks: ["./src/hooks"],
        },
      },
    },

    // Compression
    reportCompressedSize: true,

    // Source maps for debugging
    sourcemap: false,

    // Minification
    minify: "terser",
  },
};

/**
 * Memory leak detection utility
 */
export class MemoryLeakDetector {
  private timestamps: Map<string, number[]> = new Map();

  /**
   * Record memory measurement
   */
  recordMeasurement(label: string): void {
    if (!("memory" in performance)) {
      console.warn("Memory API not available");
      return;
    }

    const memory = (performance as any).memory;
    const measurements = this.timestamps.get(label) || [];
    measurements.push(memory.usedJSHeapSize);
    this.timestamps.set(label, measurements);

    if (measurements.length > 100) {
      this.detectLeak(label);
    }
  }

  /**
   * Detect potential memory leaks
   */
  private detectLeak(label: string): void {
    const measurements = this.timestamps.get(label) || [];

    if (measurements.length < 10) return;

    const recent = measurements.slice(-10);
    const older = measurements.slice(-20, -10);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    const increase = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (increase > 20) {
      console.warn(
        `⚠️ Potential memory leak detected for "${label}": ${Math.round(increase)}% increase`
      );
    }
  }

  /**
   * Get report
   */
  getReport(): Record<string, any> {
    const report: Record<string, any> = {};

    for (const [label, measurements] of this.timestamps) {
      const min = Math.min(...measurements);
      const max = Math.max(...measurements);
      const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;

      report[label] = {
        min: Math.round(min / 1048576), // Convert to MB
        max: Math.round(max / 1048576),
        avg: Math.round(avg / 1048576),
        increase: Math.round(((max - min) / min) * 100),
      };
    }

    return report;
  }
}

/**
 * Request idle callback wrapper for non-critical work
 */
export const scheduleIdleTask = (callback: () => void, timeout = 2000): number | ReturnType<typeof setTimeout> => {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout }) as any;
  } else {
    return setTimeout(callback, timeout);
  }
};

/**
 * Cancel idle callback
 */
export const cancelIdleTask = (id: number | ReturnType<typeof setTimeout>): void => {
  if ("cancelIdleCallback" in window && typeof id === "number") {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id as any);
  }
};

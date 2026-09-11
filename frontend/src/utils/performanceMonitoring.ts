/**
 * Performance Monitoring Utilities
 * Track and monitor application performance metrics
 */

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  domContentLoaded?: number;
  windowLoad?: number;
  timeToInteractive?: number;
}

/**
 * Core Web Vitals monitoring
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private marks: Map<string, number> = new Map();

  /**
   * Initialize performance monitoring
   */
  public init(): void {
    if (typeof window === "undefined") return;

    // Monitor Web Vitals
    this.monitorWebVitals();

    // Monitor page timing
    this.monitorPageTiming();

    // Monitor long tasks
    this.monitorLongTasks();

    // Log metrics on page unload
    window.addEventListener("beforeunload", () => {
      this.logMetrics();
    });
  }

  /**
   * Measure Web Vitals
   */
  private monitorWebVitals(): void {
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint");
    if (fcp) {
      this.metrics.fcp = Math.round(fcp.startTime);
    }

    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = Math.round(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ["largest-contentful-paint"] });

        // Clean up observer after 10 seconds
        setTimeout(() => observer.disconnect(), 10000);
      } catch (e) {
        console.debug("LCP monitoring not supported", e);
      }
    }

    // Cumulative Layout Shift
    if ("PerformanceObserver" in window) {
      try {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
              this.metrics.cls = Math.round(cls * 1000) / 1000;
            }
          }
        });
        observer.observe({ entryTypes: ["layout-shift"] });

        // Clean up observer after 30 seconds
        setTimeout(() => observer.disconnect(), 30000);
      } catch (e) {
        console.debug("CLS monitoring not supported", e);
      }
    }

    // Time to First Byte
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      this.metrics.ttfb = Math.round(navigationTiming.responseStart - navigationTiming.requestStart);
    }
  }

  /**
   * Monitor page timing events
   */
  private monitorPageTiming(): void {
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

    if (navigationTiming) {
      this.metrics.domContentLoaded = Math.round(navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart);
      this.metrics.windowLoad = Math.round(navigationTiming.loadEventEnd - navigationTiming.loadEventStart);
    }

    // Time to Interactive (approximation)
    if (navigationTiming) {
      this.metrics.timeToInteractive = Math.round(navigationTiming.domInteractive - navigationTiming.fetchStart);
    }
  }

  /**
   * Monitor long tasks (if supported)
   */
  private monitorLongTasks(): void {
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
          }
        });
        observer.observe({ entryTypes: ["longtask"] });
      } catch (e) {
        console.debug("Long task monitoring not supported", e);
      }
    }
  }

  /**
   * Create a performance mark
   */
  public mark(name: string): void {
    if (typeof performance !== "undefined") {
      this.marks.set(name, performance.now());
      performance.mark(name);
    }
  }

  /**
   * Measure time between two marks
   */
  public measure(name: string, startMark: string, endMark: string): number {
    if (typeof performance !== "undefined") {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0] as PerformanceMeasure;
        return Math.round(measure.duration);
      } catch (e) {
        console.debug(`Measurement failed: ${e}`);
        return 0;
      }
    }
    return 0;
  }

  /**
   * Get all collected metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Log metrics to console
   */
  public logMetrics(): void {
    console.group("📊 Performance Metrics");
    console.table(this.metrics);
    console.groupEnd();
  }

  /**
   * Send metrics to analytics service
   */
  public async sendMetrics(endpoint: string): Promise<void> {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: this.metrics,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
        keepalive: true, // Ensure request completes even if page unloads
      });
    } catch (error) {
      console.error("Failed to send metrics:", error);
    }
  }
}

/**
 * Global performance monitor instance
 */
let performanceMonitor: PerformanceMonitor | null = null;

/**
 * Get or create performance monitor instance
 */
export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
    performanceMonitor.init();
  }
  return performanceMonitor;
};

/**
 * Hook for monitoring component rendering performance
 */
export const useComponentPerformance = (componentName: string) => {
  const monitor = getPerformanceMonitor();

  const markRender = (): void => {
    monitor.mark(`${componentName}-render-start`);
  };

  const markRenderEnd = (): void => {
    monitor.mark(`${componentName}-render-end`);
    const duration = monitor.measure(
      `${componentName}-render`,
      `${componentName}-render-start`,
      `${componentName}-render-end`
    );

    if (duration > 100) {
      console.warn(`⚠️ ${componentName} took ${duration}ms to render`);
    }
  };

  return { markRender, markRenderEnd };
};

/**
 * Resource timing utilities
 */
export const getResourceMetrics = (): PerformanceResourceTiming[] => {
  if (typeof performance === "undefined") return [];

  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];

  return resources.sort((a, b) => b.duration - a.duration);
};

/**
 * Identify slow resources
 */
export const getSlowResources = (threshold = 1000): PerformanceResourceTiming[] => {
  return getResourceMetrics().filter((resource) => resource.duration > threshold);
};

/**
 * Get resource statistics
 */
export const getResourceStats = () => {
  const resources = getResourceMetrics();

  return {
    total: resources.length,
    totalDuration: Math.round(resources.reduce((sum, r) => sum + r.duration, 0)),
    averageDuration: Math.round(resources.reduce((sum, r) => sum + r.duration, 0) / resources.length),
    slowest: resources[0]?.name || "N/A",
    slowestDuration: Math.round(resources[0]?.duration || 0),
  };
};

/**
 * Network information utilities (if available)
 */
export const getNetworkInfo = () => {
  if (!("connection" in navigator)) {
    return null;
  }

  const connection = (navigator as any).connection;

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
};

/**
 * Memory usage (if available)
 */
export const getMemoryUsage = () => {
  if (!("memory" in performance)) {
    return null;
  }

  const memory = (performance as any).memory;

  return {
    usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
    totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576),
    jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576),
    heapUsagePercent: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
  };
};

/**
 * FID-like metric using input delay
 */
export const monitorInputDelay = (callback?: (delay: number) => void): void => {
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          console.debug(`Input delay: ${Math.round(fid)}ms`);
          callback?.(fid);
        }
      });
      observer.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.debug("Input delay monitoring not supported", e);
    }
  }
};

/**
 * Initialize performance monitoring on app start
 */
export const initPerformanceMonitoring = (): void => {
  if (typeof window !== "undefined") {
    getPerformanceMonitor();

    // Log metrics after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        const monitor = getPerformanceMonitor();
        monitor.logMetrics();

        console.group("📊 Resource Statistics");
        console.table(getResourceStats());
        console.groupEnd();

        const networkInfo = getNetworkInfo();
        if (networkInfo) {
          console.group("📡 Network Information");
          console.table(networkInfo);
          console.groupEnd();
        }

        const memoryUsage = getMemoryUsage();
        if (memoryUsage) {
          console.group("💾 Memory Usage");
          console.table(memoryUsage);
          console.groupEnd();
        }
      }, 3000);
    });
  }
};

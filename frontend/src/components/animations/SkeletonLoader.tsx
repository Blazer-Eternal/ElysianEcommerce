/**
 * SkeletonLoader Component - Optimized for Performance
 * Displays styled placeholder skeleton screens while loading
 * Prevents empty gray box effect and improves perceived performance
 */

import React from "react";

export interface SkeletonLoaderProps {
  type?: "card" | "text" | "image" | "table" | "grid" | "stat" | "product";
  count?: number;
  className?: string;
  width?: string;
  height?: string;
}

/**
 * Skeleton stat card - Optimized for dashboard stat cards
 * Renders styled placeholder matching StatCard layout
 */
const SkeletonStatCard: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="glass rounded-2xl p-6 sm:p-8 border border-white/20 animation-container gpu-accelerate hover:bg-white/80 transition-all duration-300"
        style={{ contain: "layout style paint", transform: "translateZ(0)" }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {/* Label skeleton */}
            <div className="skeleton h-3 rounded w-24" />
            {/* Value skeleton - larger for stat number */}
            <div className="skeleton h-8 rounded w-20" />
          </div>
          {/* Icon placeholder */}
          <div 
            className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl skeleton"
            style={{ transform: "translateZ(0)" }}
          />
        </div>
      </div>
    ))}
  </>
);

/**
 * Skeleton text placeholder - Optimized
 */
const SkeletonText: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton h-4 rounded mb-3 last:mb-0 animation-container" style={{ transform: "translateZ(0)" }} />
    ))}
  </>
);

/**
 * Skeleton card placeholder - Optimized with styled content
 */
const SkeletonCard: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="glass rounded-xl p-6 border border-white/20 animation-container gpu-accelerate"
        style={{ contain: "layout style paint", transform: "translateZ(0)" }}
      >
        {/* Card header */}
        <div className="skeleton h-6 rounded mb-4 w-1/3" />
        {/* Card content */}
        <div className="space-y-2">
          <div className="skeleton h-4 rounded" />
          <div className="skeleton h-4 rounded w-5/6" />
          <div className="skeleton h-4 rounded w-4/6" />
        </div>
      </div>
    ))}
  </>
);

/**
 * Skeleton image placeholder - Optimized
 */
const SkeletonImage: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "200px",
}) => (
  <div 
    className="skeleton rounded-lg animation-container"
    style={{ width, height, transform: "translateZ(0)" }}
  />
);

/**
 * Skeleton product card - Optimized matching ProductCard layout
 */
const SkeletonProductCard: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 animation-container" style={{ contain: "layout style paint" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i}
        className="glass rounded-2xl overflow-hidden animation-container gpu-accelerate"
        style={{ contain: "layout style paint", transform: "translateZ(0)" }}
      >
        {/* Product image skeleton */}
        <div className="skeleton h-48 sm:h-56 rounded-t-2xl w-full" />
        
        {/* Product info skeleton */}
        <div className="p-4 space-y-3">
          {/* Product name */}
          <div className="skeleton h-4 rounded w-3/4" />
          {/* Rating */}
          <div className="skeleton h-3 rounded w-1/2" />
          {/* Price */}
          <div className="skeleton h-5 rounded w-1/3 mt-2" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton table placeholder - Optimized
 */
const SkeletonTable: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3 animation-container" style={{ contain: "layout style paint" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4 gpu-accelerate" style={{ transform: "translateZ(0)" }}>
        <div className="skeleton h-10 rounded flex-1" />
        <div className="skeleton h-10 rounded flex-1" />
        <div className="skeleton h-10 rounded flex-1" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton grid placeholder - Optimized
 */
const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animation-container" style={{ contain: "layout style paint" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animation-container" style={{ contain: "layout style paint" }}>
        <div className="skeleton h-48 rounded-lg mb-3" />
        <div className="skeleton h-4 rounded mb-2 w-3/4" />
        <div className="skeleton h-4 rounded w-1/2" />
      </div>
    ))}
  </div>
);

/**
 * Main SkeletonLoader component
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "card",
  count = 1,
  className = "",
  width,
  height,
}) => {
  const containerClass = `${className}`;

  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return <SkeletonText count={count} />;
      case "image":
        return <SkeletonImage width={width} height={height} />;
      case "table":
        return <SkeletonTable count={count} />;
      case "grid":
        return <SkeletonGrid count={count} />;
      case "stat":
        return <SkeletonStatCard count={count} />;
      case "product":
        return <SkeletonProductCard count={count} />;
      case "card":
      default:
        return <SkeletonCard count={count} />;
    }
  };

  return <div className={containerClass}>{renderSkeleton()}</div>;
};

export default SkeletonLoader;

/**
 * SkeletonLoader Component
 * Displays placeholder skeleton screens while loading
 */

import React from "react";

export interface SkeletonLoaderProps {
  type?: "card" | "text" | "image" | "table" | "grid";
  count?: number;
  className?: string;
  width?: string;
  height?: string;
}

/**
 * Skeleton text placeholder
 */
const SkeletonText: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton h-4 rounded mb-3 last:mb-0" />
    ))}
  </>
);

/**
 * Skeleton card placeholder
 */
const SkeletonCard: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass rounded-xl p-6 border border-white/20">
        <div className="skeleton h-6 rounded mb-4 w-1/3" />
        <div className="skeleton h-4 rounded mb-2" />
        <div className="skeleton h-4 rounded mb-2 w-5/6" />
        <div className="skeleton h-4 rounded w-4/6" />
      </div>
    ))}
  </>
);

/**
 * Skeleton image placeholder
 */
const SkeletonImage: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "200px",
}) => (
  <div className="skeleton rounded-lg" style={{ width, height }} />
);

/**
 * Skeleton table placeholder
 */
const SkeletonTable: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <div className="skeleton h-10 rounded flex-1" />
        <div className="skeleton h-10 rounded flex-1" />
        <div className="skeleton h-10 rounded flex-1" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton grid placeholder
 */
const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
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
      case "card":
      default:
        return <SkeletonCard count={count} />;
    }
  };

  return <div className={containerClass}>{renderSkeleton()}</div>;
};

export default SkeletonLoader;

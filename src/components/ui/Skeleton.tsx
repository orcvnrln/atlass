/**
 * 💀 SKELETON LOADING COMPONENTS
 * Professional loading states
 */

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// BASE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
}) => {
  return (
    <div
      className={`skeleton rounded-md ${className}`}
      style={{ width, height }}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON TEXT
// ─────────────────────────────────────────────────────────────────────────────

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-panel border border-default rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="40%" height="1.5rem" />
        <Skeleton width="60px" height="24px" className="rounded-full" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton height="2rem" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton height="3rem" />
          <Skeleton height="3rem" />
          <Skeleton height="3rem" />
        </div>
        <SkeletonText lines={2} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON TABLE
// ─────────────────────────────────────────────────────────────────────────────

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`bg-panel border border-default rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="grid gap-4 p-4 border-b border-default" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="1rem" width="80%" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-4 border-b border-default last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="1rem" width="90%" />
          ))}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CHART
// ─────────────────────────────────────────────────────────────────────────────

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-panel border border-default rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="30%" height="1.5rem" />
        <div className="flex gap-2">
          <Skeleton width="60px" height="32px" className="rounded-md" />
          <Skeleton width="60px" height="32px" className="rounded-md" />
          <Skeleton width="60px" height="32px" className="rounded-md" />
        </div>
      </div>

      {/* Chart area */}
      <div className="relative h-64 bg-elevated rounded-lg overflow-hidden">
        {/* Simulated chart bars */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-full p-4 gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton
              key={i}
              width="100%"
              height={`${Math.random() * 80 + 20}%`}
              className="rounded-t-sm"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton height="0.75rem" width="60%" className="mb-2" />
            <Skeleton height="1.5rem" width="80%" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON SIGNAL CARD
// ─────────────────────────────────────────────────────────────────────────────

export const SkeletonSignalCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-panel border-2 border-default border-l-4 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton width="60px" height="28px" className="rounded-lg" />
          <Skeleton width="80px" height="16px" />
        </div>
        <Skeleton width="40px" height="16px" />
      </div>

      {/* Levels */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton height="0.75rem" width="70%" className="mb-1" />
            <Skeleton height="1.25rem" width="90%" />
          </div>
        ))}
      </div>

      {/* Reasoning */}
      <div className="pt-3 border-t border-default">
        <SkeletonText lines={2} />
      </div>

      {/* Button */}
      <Skeleton height="40px" className="mt-3 rounded-lg" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

export const SkeletonStatCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-panel border border-default rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton height="0.75rem" width="50%" className="mb-2" />
          <Skeleton height="2.25rem" width="70%" className="mb-2" />
          <Skeleton height="1rem" width="40%" />
        </div>
        <Skeleton width="48px" height="48px" className="rounded-lg" />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON GRID (Multiple cards)
// ─────────────────────────────────────────────────────────────────────────────

interface SkeletonGridProps {
  count?: number;
  columns?: number;
  component?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  columns = 3,
  component: Component = SkeletonCard,
  className = '',
}) => {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SPINNER
// ─────────────────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeStyles[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOADING OVERLAY
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}>
      <Spinner size="lg" className="text-info" />
      <p className="text-secondary font-medium">{message}</p>
    </div>
  );
};

export default Skeleton;


import React from 'react';

interface SkeletonProps {
  className?: string;
  /** Render as a circle (for avatars) */
  circle?: boolean;
}

export function Skeleton({ className = '', circle = false }: SkeletonProps) {
  return (
    <div
      className={[
        'animate-pulse bg-white/5',
        circle ? 'rounded-full' : 'rounded-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  );
}

/** Pre-built skeleton for a product card */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-charcoal rounded-md overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

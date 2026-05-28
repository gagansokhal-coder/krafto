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
        'animate-pulse bg-gold/10',
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
    <div className="flex flex-col bg-charcoal rounded-sm overflow-hidden border border-transparent">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-5 w-3/4 bg-gold/15" />
        <Skeleton className="h-4 w-1/3 bg-gold/10" />
      </div>
    </div>
  );
}

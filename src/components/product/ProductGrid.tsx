import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import type { ProductListItem } from '@/types/product';

interface ProductGridProps {
  products: ProductListItem[];
  loading?: boolean;
  skeletonCount?: number;
  columns?: 2 | 3 | 4;
}

const COLUMN_CLASSES: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  columns = 3,
}: ProductGridProps) {
  const colClass = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[3];

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-6`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-16 h-16 text-gold/20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <h3 className="font-display text-2xl text-ivory/80 tracking-wide">No products found</h3>
        <p className="text-ivory/40 font-body text-[15px]">Try adjusting your filters to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-6`}>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          id={p.id}
          slug={p.slug}
          name={p.name}
          price={typeof p.price === 'string' ? parseFloat(p.price) : p.price}
          originalPrice={
            p.compareAtPrice
              ? typeof p.compareAtPrice === 'string'
                ? parseFloat(p.compareAtPrice)
                : p.compareAtPrice
              : undefined
          }
          imageUrl={p.imageUrl ?? ''}
          badges={p.badges}
        />
      ))}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, PRICE_RANGES, type FilterState } from '@/components/product/ProductFilters';
import type { ProductListItem } from '@/types/product';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
];

export interface ShopClientProps {
  products: ProductListItem[];
  categories: { name: string; slug: string }[];
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [mobileFilters, setMobileFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceRange: 0,
    sort: 'featured',
    inStock: false,
  });

  const filtered = useMemo(() => {
    let prods = [...products];

    // Category filter (match by category name)
    if (filters.category !== 'All') {
      prods = prods.filter(
        (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price filter
    const range = PRICE_RANGES[filters.priceRange];
    if (range.max !== Infinity || range.min > 0) {
      prods = prods.filter((p) => {
        const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
        return price >= range.min && price < range.max;
      });
    }

    // In stock filter
    if (filters.inStock) {
      prods = prods.filter((p) => p.inStock);
    }

    // Sort
    if (filters.sort === 'price-low') {
      prods.sort((a, b) => {
        const ap = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const bp = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return ap - bp;
      });
    } else if (filters.sort === 'price-high') {
      prods.sort((a, b) => {
        const ap = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const bp = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return bp - ap;
      });
    } else if (filters.sort === 'newest') {
      prods.sort((a, b) => a.id.localeCompare(b.id));
    }

    return prods;
  }, [products, filters]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Page Header */}
      <div className="bg-obsidian py-16 px-4 md:px-8 text-center border-b border-white/5">
        <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">
          Collections
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
          Shop All
        </h1>
        <p className="text-ivory/60 font-body max-w-2xl mx-auto">
          Explore our curated collection of luxury handcrafted goods, meticulously designed to
          elevate your everyday living.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <ProductFilters filters={filters} onChange={setFilters} categories={categories} />
        </aside>

        {/* Mobile Filter Button */}
        <div className="md:hidden flex items-center justify-between mb-2">
          <button
            onClick={() => setMobileFilters(true)}
            className="flex items-center gap-2 bg-charcoal border border-white/10 rounded-sm px-4 py-2.5 text-sm text-ivory font-body hover:border-gold transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Filters
            {(filters.category !== 'All' || filters.priceRange !== 0 || filters.inStock) && (
              <span className="w-5 h-5 bg-gold text-obsidian rounded-full text-xs flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        <div
          className={`fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
            mobileFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileFilters(false)}
        />
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-charcoal border-r border-white/10 z-[70] p-8 overflow-y-auto transition-transform duration-500 md:hidden ${
            mobileFilters ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-xl text-ivory">Filters</h2>
            <button
              onClick={() => setMobileFilters(false)}
              className="text-ivory/60 hover:text-gold transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ProductFilters filters={filters} onChange={setFilters} categories={categories} />
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
            <p className="text-sm text-ivory/60 font-body">
              {`${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
            </p>
            <div className="flex items-center gap-2 text-sm text-ivory font-body">
              <span className="hidden sm:inline text-ivory/60">Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="bg-transparent border border-white/20 rounded-sm px-3 py-1.5 text-ivory focus:outline-none focus:border-gold cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-obsidian">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid products={filtered} loading={false} columns={3} />
        </div>
      </div>
    </div>
  );
}

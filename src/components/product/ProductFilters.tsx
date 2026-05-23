'use client';

import React from 'react';

export interface FilterState {
  category: string;
  priceRange: number; // index into PRICE_RANGES
  sort: string;
  inStock: boolean;
}

export const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 – ₹30,000', min: 15000, max: 30000 },
  { label: 'Over ₹30,000', min: 30000, max: Infinity },
];

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: { name: string; slug: string }[];
}

export function ProductFilters({ filters, onChange, categories }: ProductFiltersProps) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  const hasActiveFilters =
    filters.category !== 'All' || filters.priceRange !== 0 || filters.inStock;

  const categoryList = [{ name: 'All', slug: 'All' }, ...categories];

  return (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <div>
        <h3 className="font-display text-lg text-gold mb-4 pb-2 border-b border-white/10">
          Categories
        </h3>
        <ul className="flex flex-col gap-3 font-body text-sm">
          {categoryList.map((c) => (
            <li key={c.name}>
              <button
                onClick={() => set('category', c.name)}
                className={`flex items-center gap-2.5 w-full text-left transition-colors ${
                  filters.category === c.name ? 'text-gold' : 'text-ivory/70 hover:text-gold'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                    filters.category === c.name ? 'bg-gold border-gold' : 'border-white/20'
                  }`}
                >
                  {filters.category === c.name && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3 h-3 text-obsidian"
                    >
                      <path d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.739a.75.75 0 011.04-.208z" />
                    </svg>
                  )}
                </span>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display text-lg text-gold mb-4 pb-2 border-b border-white/10">
          Price Range
        </h3>
        <ul className="flex flex-col gap-3 font-body text-sm">
          {PRICE_RANGES.map((r, i) => (
            <li key={r.label}>
              <button
                onClick={() => set('priceRange', i)}
                className={`flex items-center gap-2.5 w-full text-left transition-colors ${
                  filters.priceRange === i ? 'text-gold' : 'text-ivory/70 hover:text-gold'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border transition-colors ${
                    filters.priceRange === i ? 'bg-gold border-gold' : 'border-white/20'
                  }`}
                />
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* In Stock toggle */}
      <div>
        <h3 className="font-display text-lg text-gold mb-4 pb-2 border-b border-white/10">
          Availability
        </h3>
        <label className="flex items-center gap-3 cursor-pointer font-body text-sm text-ivory/70 hover:text-ivory transition-colors">
          <div
            onClick={() => set('inStock', !filters.inStock)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              filters.inStock ? 'bg-gold' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-ivory transition-transform ${
                filters.inStock ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          In Stock Only
        </label>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange({ category: 'All', priceRange: 0, sort: filters.sort, inStock: false })}
          className="text-sm text-ivory/40 hover:text-gold font-body underline underline-offset-4 transition-colors text-left"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

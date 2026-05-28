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
    <div className="flex flex-col gap-10">
      {/* Categories */}
      <div>
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gold/15">
          <h3 className="font-display text-lg text-gold tracking-wide">
            Categories
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/10" />
        </div>
        <ul className="flex flex-col gap-3.5 font-body text-[14px]">
          {categoryList.map((c) => (
            <li key={c.name}>
              <button
                onClick={() => set('category', c.name)}
                className={`flex items-center gap-3 w-full text-left transition-colors duration-300 ${
                  filters.category === c.name ? 'text-gold' : 'text-ivory/60 hover:text-gold'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-300 ${
                    filters.category === c.name ? 'bg-gold border-gold shadow-[0_0_10px_rgba(200,150,60,0.3)]' : 'border-gold/30'
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
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gold/15">
          <h3 className="font-display text-lg text-gold tracking-wide">
            Price Range
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/10" />
        </div>
        <ul className="flex flex-col gap-3.5 font-body text-[14px]">
          {PRICE_RANGES.map((r, i) => (
            <li key={r.label}>
              <button
                onClick={() => set('priceRange', i)}
                className={`flex items-center gap-3 w-full text-left transition-colors duration-300 ${
                  filters.priceRange === i ? 'text-gold' : 'text-ivory/60 hover:text-gold'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    filters.priceRange === i ? 'border-gold' : 'border-gold/30'
                  }`}
                >
                  {filters.priceRange === i && (
                    <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(200,150,60,0.5)]" />
                  )}
                </span>
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* In Stock toggle */}
      <div>
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gold/15">
          <h3 className="font-display text-lg text-gold tracking-wide">
            Availability
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/10" />
        </div>
        <label className="flex items-center gap-3.5 cursor-pointer font-body text-[14px] text-ivory/60 hover:text-ivory transition-colors duration-300">
          <div
            onClick={() => set('inStock', !filters.inStock)}
            className={`relative w-10 h-[22px] rounded-full transition-colors duration-400 border ${
              filters.inStock ? 'bg-gold border-gold' : 'bg-obsidian border-gold/30'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-[16px] h-[16px] rounded-full transition-transform duration-400 shadow-sm ${
                filters.inStock ? 'translate-x-[18px] bg-obsidian' : 'translate-x-0 bg-gold/50'
              }`}
            />
          </div>
          In Stock Only
        </label>
      </div>

      {/* Clear filters */}
      <div className="pt-2">
        {hasActiveFilters ? (
          <button
            onClick={() => onChange({ category: 'All', priceRange: 0, sort: filters.sort, inStock: false })}
            className="text-[13px] text-ivory/50 hover:text-gold font-body uppercase tracking-[0.15em] font-medium transition-colors duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        ) : (
          <div className="h-6" /> // Placeholder to maintain height
        )}
      </div>
    </div>
  );
}

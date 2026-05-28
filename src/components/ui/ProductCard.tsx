'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './Badge';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badges?: string[];
  /** Slug used for the product URL (falls back to id) */
  slug?: string;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  badges = [],
  slug,
}: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const isSale = originalPrice && originalPrice > price;
  const href = `/shop/${slug ?? id}`;

  // Show max 2 badges per card (priority: Limited Edition > Sale > Best Seller > Handcrafted)
  const PRIORITY = ['Limited Edition', 'Sale', 'Best Seller', 'Handcrafted', 'Eco-Friendly', 'New Arrival'];
  const displayBadges = [...badges]
    .sort((a, b) => {
      const ai = PRIORITY.indexOf(a);
      const bi = PRIORITY.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .slice(0, 2);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      title: name,
      price,
      quantity: 1,
      imageUrl,
    });
    openCart();
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  }

  return (
    <div className="group relative w-full flex flex-col bg-charcoal rounded-sm overflow-hidden transition-all duration-[400ms] hover:shadow-warm-lg border border-transparent hover:border-gold/10">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden">
        {/* Badges */}
        {displayBadges.length > 0 && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {displayBadges.map((badge) => (
              <Badge key={badge} label={badge} />
            ))}
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-[400ms] ${
            wishlisted 
              ? 'bg-obsidian/80 backdrop-blur-md border-terracotta/30 shadow-[0_0_15px_rgba(139,58,42,0.2)]' 
              : 'bg-obsidian/40 backdrop-blur-md border-white/10 hover:bg-obsidian/80 hover:border-gold/30'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-[18px] h-[18px] transition-all duration-[400ms] ${
              wishlisted ? 'fill-terracotta text-terracotta scale-110' : 'fill-none text-ivory hover:text-terracotta'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Image */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />

        {/* Quick Add button */}
        <div className="absolute bottom-5 left-5 right-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[400ms] z-20">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-ivory/95 backdrop-blur-sm text-obsidian py-3 uppercase tracking-wider font-body font-medium text-[13px] rounded-sm hover:bg-gold hover:text-obsidian transition-colors shadow-lg"
          >
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col gap-2 relative">
        <Link
          href={href}
          className="font-display text-[17px] text-ivory hover:text-gold transition-colors line-clamp-1 leading-snug tracking-wide"
        >
          {name}
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-body font-medium text-gold tracking-wide">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {isSale && (
            <span className="font-body text-[13px] text-ivory/40 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Premium border reveal on hover */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-gold to-brass group-hover:w-full transition-all duration-500 ease-out" />
      </div>
    </div>
  );
}

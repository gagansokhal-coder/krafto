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
    <div className="group relative w-full flex flex-col bg-charcoal rounded-sm overflow-hidden transition-all duration-[250ms] hover:shadow-lg hover:shadow-black/20">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden">
        {/* Badges */}
        {displayBadges.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {displayBadges.map((badge) => (
              <Badge key={badge} label={badge} />
            ))}
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-obsidian/40 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all duration-[250ms] hover:bg-obsidian/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 transition-all duration-[250ms] ${
              wishlisted ? 'fill-blush text-blush scale-110' : 'fill-none text-ivory hover:text-blush'
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
          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]" />

        {/* Quick Add button */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[250ms] z-20">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-ivory text-obsidian py-2.5 font-body font-medium text-sm rounded-sm hover:bg-gold transition-colors"
          >
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-1.5">
        <Link
          href={href}
          className="font-display text-base text-ivory hover:text-gold transition-colors line-clamp-1 leading-snug"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-body font-medium text-gold">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {isSale && (
            <span className="font-body text-sm text-smoke line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

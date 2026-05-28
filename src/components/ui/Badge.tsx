import React from 'react';

type BadgeVariant =
  | 'limited-edition'
  | 'best-seller'
  | 'handcrafted'
  | 'eco-friendly'
  | 'new-arrival'
  | 'sale'
  | 'premium'
  | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  'limited-edition': 'bg-terracotta text-ivory border-terracotta/80 shadow-[0_2px_8px_rgba(139,58,42,0.3)]',
  'best-seller': 'bg-gold text-obsidian border-gold/80 shadow-[0_2px_8px_rgba(200,150,60,0.3)]',
  'handcrafted': 'bg-charcoal/80 backdrop-blur-md text-gold border-gold/40',
  'eco-friendly': 'bg-sage/15 backdrop-blur-md text-sage border-sage/30',
  'new-arrival': 'bg-brass/15 backdrop-blur-md text-brass border-brass/30',
  'sale': 'bg-terracotta/15 backdrop-blur-md text-terracotta border-terracotta/30',
  'premium': 'bg-gradient-to-r from-gold to-brass text-obsidian border-transparent shadow-[0_0_15px_rgba(200,150,60,0.4)]',
  'default': 'bg-obsidian/60 backdrop-blur-md text-ivory/80 border-ivory/15',
};

function labelToVariant(label: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    'Limited Edition': 'limited-edition',
    'Best Seller': 'best-seller',
    'Handcrafted': 'handcrafted',
    'Eco-Friendly': 'eco-friendly',
    'New Arrival': 'new-arrival',
    'Sale': 'sale',
    'Premium': 'premium',
  };
  return map[label] ?? 'default';
}

export function Badge({ label, variant, className = '' }: BadgeProps) {
  const resolvedVariant = variant ?? labelToVariant(label);
  const styles = VARIANT_STYLES[resolvedVariant];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] border rounded-sm font-body ${styles} ${className}`}
    >
      {label}
    </span>
  );
}

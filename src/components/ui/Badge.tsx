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
  'limited-edition': 'bg-burgundy text-ivory border-burgundy',
  'best-seller': 'bg-gold text-obsidian border-gold',
  'handcrafted': 'bg-transparent text-gold border-gold',
  'eco-friendly': 'bg-sage/20 text-sage border-sage/40',
  'new-arrival': 'bg-sage/20 text-sage border-sage/40',
  'sale': 'bg-blush/20 text-blush border-blush/40',
  'premium': 'bg-gold/20 text-gold border-gold/40',
  'default': 'bg-white/10 text-ivory border-white/20',
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
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm font-body ${styles} ${className}`}
    >
      {label}
    </span>
  );
}

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  inventory: string;
  isHandcrafted: boolean;
  isLimitedEdition: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isEcoFriendly: boolean;
  status: 'DRAFT' | 'ACTIVE';
}

interface ProductFormProps {
  product?: any; // Existing product for editing
  onSuccess?: () => void;
  onCancel?: () => void;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const isEditing = !!product;
  
  const [form, setForm] = useState<ProductFormData>({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price ? String(product.price) : '',
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice) : '',
    inventory: product?.inventory !== undefined ? String(product.inventory) : '0',
    isHandcrafted: product?.isHandcrafted || false,
    isLimitedEdition: product?.isLimitedEdition || false,
    isBestSeller: product?.isBestSeller || false,
    isFeatured: product?.isFeatured || false,
    isEcoFriendly: product?.isEcoFriendly || false,
    status: product?.status || 'DRAFT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Auto-generate slug from name
      ...(name === 'name' ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        inventory: parseInt(form.inventory),
        isHandcrafted: form.isHandcrafted,
        isLimitedEdition: form.isLimitedEdition,
        isBestSeller: form.isBestSeller,
        isFeatured: form.isFeatured,
        isEcoFriendly: form.isEcoFriendly,
        status: form.status,
      };

      const url = isEditing 
        ? `/api/admin/products/${product.id}` 
        : '/api/admin/products';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} product`);
        setLoading(false);
        return;
      }

      onSuccess?.();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const BADGE_FIELDS: { key: keyof ProductFormData; label: string }[] = [
    { key: 'isFeatured', label: 'Featured' },
    { key: 'isHandcrafted', label: 'Handcrafted' },
    { key: 'isLimitedEdition', label: 'Limited Edition' },
    { key: 'isBestSeller', label: 'Best Seller' },
    { key: 'isEcoFriendly', label: 'Eco-Friendly' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Hand-blown Amber Vase"
        />
        <Input
          label="Slug (URL)"
          name="slug"
          required
          value={form.slug}
          onChange={handleChange}
          placeholder="hand-blown-amber-vase"
          hint="Auto-generated from name"
        />
      </div>

      <div>
        <label className="block text-sm text-ivory/70 mb-2 font-body">
          Description <span className="text-gold">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-body text-sm resize-none"
          placeholder="Describe the product..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Price (₹)"
          name="price"
          type="number"
          required
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="0.00"
        />
        <Input
          label="Compare-at Price (₹)"
          name="compareAtPrice"
          type="number"
          min="0"
          step="0.01"
          value={form.compareAtPrice}
          onChange={handleChange}
          placeholder="Optional"
          hint="Strike-through price"
        />
        <Input
          label="Inventory"
          name="inventory"
          type="number"
          required
          min="0"
          value={form.inventory}
          onChange={handleChange}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm text-ivory/70 mb-2 font-body">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="bg-obsidian border border-white/20 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body text-sm"
        >
          <option value="DRAFT" className="bg-obsidian">Draft</option>
          <option value="ACTIVE" className="bg-obsidian">Active</option>
        </select>
      </div>

      {/* Badges */}
      <div>
        <p className="text-sm text-ivory/70 mb-3 font-body">Product Badges</p>
        <div className="flex flex-wrap gap-4">
          {BADGE_FIELDS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer font-body text-sm text-ivory/70 hover:text-ivory transition-colors">
              <input
                type="checkbox"
                name={key}
                checked={form[key] as boolean}
                onChange={handleChange}
                className="w-4 h-4 accent-gold"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating…' : 'Creating…') : (isEditing ? 'Update Product' : 'Create Product')}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

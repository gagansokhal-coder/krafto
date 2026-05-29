'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { uploadProductImage, deleteProductImage } from '@/lib/supabase';

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

interface UploadedImage {
  url: string;
  alt: string;
  isMain: boolean;
  position: number;
  isUploading?: boolean;
  progress?: number;
  file?: File;
  previewUrl?: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const [images, setImages] = useState<UploadedImage[]>(() => {
    if (product?.images && Array.isArray(product.images)) {
      return product.images.map((img: any, idx: number) => ({
        url: img.url,
        alt: img.alt || '',
        isMain: img.isMain || idx === 0,
        position: img.position || idx,
      }));
    }
    // If editing and there's a single imageUrl (from list view)
    if (product?.imageUrl) {
      return [{
        url: product.imageUrl,
        alt: product.name || '',
        isMain: true,
        position: 0,
      }];
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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

  // ─── Image Upload Handlers ──────────────────────────────────────────────────

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create placeholder entries with previews
    const newImages: UploadedImage[] = validFiles.map((file, idx) => ({
      url: '',
      alt: file.name.replace(/\.[^.]+$/, ''),
      isMain: images.length === 0 && idx === 0,
      position: images.length + idx,
      isUploading: true,
      progress: 0,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setError('');

    // Upload each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const imageIndex = images.length + i;

      try {
        const publicUrl = await uploadProductImage(file, (percent) => {
          setImages((prev) =>
            prev.map((img, idx) =>
              idx === imageIndex ? { ...img, progress: percent } : img
            )
          );
        });

        setImages((prev) =>
          prev.map((img, idx) =>
            idx === imageIndex
              ? {
                  ...img,
                  url: publicUrl,
                  isUploading: false,
                  progress: 100,
                  file: undefined,
                }
              : img
          )
        );
      } catch (uploadError: any) {
        console.error('Upload failed:', uploadError);
        setError(`Failed to upload "${file.name}": ${uploadError.message}`);
        // Remove the failed upload
        setImages((prev) => prev.filter((_, idx) => idx !== imageIndex));
      }
    }
  }, [images.length]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  }

  function setMainImage(index: number) {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isMain: idx === index,
      }))
    );
  }

  async function removeImage(index: number) {
    const img = images[index];

    // Clean up object URL if it exists
    if (img.previewUrl) {
      URL.revokeObjectURL(img.previewUrl);
    }

    // Try to delete from Supabase storage
    if (img.url) {
      try {
        await deleteProductImage(img.url);
      } catch (e) {
        console.warn('Could not delete image from storage:', e);
      }
    }

    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      // If the removed image was main, set the first one as main
      if (img.isMain && updated.length > 0) {
        updated[0].isMain = true;
      }
      // Re-index positions
      return updated.map((img, idx) => ({ ...img, position: idx }));
    });
  }

  // ─── Form Submit ────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Check if any images are still uploading
    if (images.some((img) => img.isUploading)) {
      setError('Please wait for all images to finish uploading.');
      return;
    }

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
        images: images
          .filter((img) => img.url) // Only include successfully uploaded images
          .map((img) => ({
            url: img.url,
            alt: img.alt,
            isMain: img.isMain,
            position: img.position,
          })),
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

      {/* ─── Image Upload Section ───────────────────────────────────────────── */}
      <div>
        <label className="block text-[13px] text-ivory/60 font-body uppercase tracking-wider font-medium mb-2">
          Product Images
        </label>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-sm p-6 text-center cursor-pointer
            transition-all duration-300 group
            ${isDragging
              ? 'border-gold bg-gold/5 scale-[1.01]'
              : 'border-white/15 hover:border-gold/40 hover:bg-white/[0.02]'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-gold/20 text-gold scale-110' : 'bg-white/5 text-ivory/40 group-hover:bg-gold/10 group-hover:text-gold/70'}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-ivory/70 font-body">
                <span className="text-gold font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-ivory/40 font-body mt-1">
                JPEG, PNG, WebP, or AVIF — max 5MB per file
              </p>
            </div>
          </div>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {images.map((img, index) => (
              <div
                key={`${img.url || img.previewUrl}-${index}`}
                className={`
                  relative group rounded-sm overflow-hidden border transition-all duration-200
                  ${img.isMain
                    ? 'border-gold/60 ring-1 ring-gold/30'
                    : 'border-white/10 hover:border-white/20'
                  }
                `}
              >
                {/* Image */}
                <div className="aspect-square relative bg-obsidian">
                  {(img.url || img.previewUrl) && (
                    <Image
                      src={img.url || img.previewUrl || ''}
                      alt={img.alt || 'Product image'}
                      fill
                      className={`object-cover transition-all duration-300 ${
                        img.isUploading ? 'opacity-50 blur-[1px]' : ''
                      }`}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  )}

                  {/* Upload Progress Overlay */}
                  {img.isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/60 backdrop-blur-sm">
                      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-2" />
                      <span className="text-xs text-gold font-body font-medium">
                        {img.progress ?? 0}%
                      </span>
                    </div>
                  )}

                  {/* Main Badge */}
                  {img.isMain && !img.isUploading && (
                    <div className="absolute top-1.5 left-1.5 bg-gold/90 text-obsidian text-[10px] font-body font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                      Main
                    </div>
                  )}

                  {/* Hover Actions */}
                  {!img.isUploading && (
                    <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2">
                      {!img.isMain && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMainImage(index); }}
                          className="p-1.5 bg-gold/20 hover:bg-gold/40 rounded-sm text-gold transition-colors"
                          title="Set as main image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-sm text-red-400 transition-colors"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Progress Bar */}
                {img.isUploading && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-gold/80 to-gold transition-all duration-300 ease-out"
                      style={{ width: `${img.progress ?? 0}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <p className="text-xs text-ivory/40 font-body mt-2">
            {images.length} image{images.length !== 1 ? 's' : ''} — hover to set main or remove. The main image appears in product listings.
          </p>
        )}
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

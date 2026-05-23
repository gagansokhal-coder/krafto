'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { getEstimatedDelivery, formatDateRange } from '@/lib/utils';

const GIFT_WRAP_OPTIONS = [
  { id: 'CLASSIC_GOLD', label: 'Classic Gold', price: 99 },
  { id: 'BOTANICAL', label: 'Botanical', price: 149 },
  { id: 'LUXURY_BOX', label: 'Luxury Box', price: 249 },
  { id: 'ECO_WRAP', label: 'Eco Wrap', price: 0 },
];

export interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'reviews' | 'shipping'>('story');
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftWrap, setGiftWrap] = useState('ECO_WRAP');
  const [giftMessage, setGiftMessage] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!product) return;
    try {
      const key = 'kraafto_recently_viewed';
      const existing: string[] = JSON.parse(localStorage.getItem(key) ?? '[]');
      const updated = [product.id, ...existing.filter((id) => id !== product.id)].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id as string,
      title: product.name as string,
      price: parseFloat(product.price as string),
      quantity,
      imageUrl: (product.images as { url: string }[])?.[0]?.url ?? '',
    });
    openCart();
  };


  const price = parseFloat(product.price as string) || 0;
  const compareAtPrice = product.compareAtPrice ? parseFloat(product.compareAtPrice as string) : null;
  const isSale = compareAtPrice && compareAtPrice > price;
  const inventory = (product.inventory as number) ?? 0;
  const lowStockThreshold = (product.lowStockThreshold as number) ?? 5;
  const images = (product.images as { url: string; alt?: string }[])?.length > 0
    ? (product.images as { url: string; alt?: string }[])
    : [{ url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80' }];
  const materials = (product.materials as string[]) ?? [];
  const badges = (product.badges as string[]) ?? [];
  const reviews = (product.reviews as Record<string, unknown>[]) ?? [];
  const avgRating = (product.averageRating as number) ?? 0;
  const reviewCount = (product.reviewCount as number) ?? 0;
  const categories = (product.categories as { name: string; slug: string }[]) ?? [];
  const story = product.story as string | null;

  const delivery = getEstimatedDelivery((product.processingDays as number) ?? 2, false, giftOpen);
  const deliveryRange = formatDateRange(delivery.from, delivery.to);

  let stockLabel = 'In Stock';
  let stockColor = 'text-sage';
  if (inventory === 0) { stockLabel = 'Out of Stock'; stockColor = 'text-smoke'; }
  else if (inventory <= lowStockThreshold) { stockLabel = `Only ${inventory} left!`; stockColor = 'text-gold'; }

  const TABS = [
    { id: 'story' as const, label: 'The Story' },
    { id: 'specs' as const, label: 'Specifications' },
    { id: 'reviews' as const, label: `Reviews (${reviewCount})` },
    { id: 'shipping' as const, label: 'Shipping & Returns' },
  ];

  return (
    <div className="pt-24 pb-20 bg-obsidian min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-ivory/50 font-body mb-8 flex-wrap">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
          {categories[0] && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${categories[0].slug}`} className="hover:text-gold transition-colors capitalize">
                {categories[0].name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-ivory truncate max-w-[200px]">{product.name as string}</span>
        </nav>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">

          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <button
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-square w-full rounded-sm overflow-hidden bg-charcoal group cursor-zoom-in"
              aria-label="Open full image"
            >
              <Image
                src={images[activeImage].url}
                alt={(images[activeImage].alt ?? product.name) as string}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute bottom-3 right-3 bg-obsidian/60 backdrop-blur-sm text-ivory/50 text-xs font-body px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Click to enlarge
              </div>
            </button>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative shrink-0 w-20 h-20 border-2 rounded-sm overflow-hidden bg-charcoal transition-colors ${activeImage === idx ? 'border-gold' : 'border-transparent hover:border-gold/40'}`}
                  >
                    <Image src={img.url} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 flex flex-col">
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {badges.map((b) => <Badge key={b} label={b} />)}
              </div>
            )}

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ivory leading-tight mb-4">
              {product.name as string}
            </h1>

            {reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill={star <= Math.round(avgRating) ? '#C9A96E' : 'none'}
                      stroke="#C9A96E" strokeWidth={1} className="w-4 h-4">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-ivory/60 font-body">{avgRating.toFixed(1)} ({reviewCount} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-body text-3xl font-semibold text-gold">₹{price.toLocaleString('en-IN')}</span>
              {isSale && (
                <>
                  <span className="font-body text-lg text-smoke line-through">₹{compareAtPrice!.toLocaleString('en-IN')}</span>
                  <span className="text-sm font-body text-blush bg-blush/10 px-2 py-0.5 rounded-sm">
                    {Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <p className="font-body text-ivory/80 leading-relaxed mb-6 text-balance">{product.description as string}</p>

            <div className={`flex items-center gap-2 text-sm font-body mb-6 ${stockColor}`}>
              <span className={`w-2 h-2 rounded-full ${inventory > 0 ? 'bg-current' : 'bg-smoke'}`} />
              {stockLabel}
            </div>

            <div className="mb-6">
              <label className="block text-xs text-ivory/60 uppercase tracking-widest font-body mb-3">Quantity</label>
              <div className="flex items-center border border-white/20 rounded-sm w-32">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-ivory hover:text-gold hover:bg-white/5 transition-colors">−</button>
                <span className="w-12 text-center text-ivory font-body">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(inventory || 99, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-ivory hover:text-gold hover:bg-white/5 transition-colors">+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button onClick={handleAddToCart} disabled={inventory === 0} className="flex-1" size="lg">
                {inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setGiftOpen((p) => !p)} className="flex-1 flex items-center justify-center gap-2">
                🎁 Send as Gift
              </Button>
            </div>

            {giftOpen && (
              <div className="bg-gold/5 border border-gold/20 rounded-sm p-5 mb-6 space-y-4">
                <h3 className="font-display text-lg text-gold">Gift Options</h3>
                <div>
                  <p className="text-xs text-ivory/60 uppercase tracking-wider font-body mb-2">Wrapping Style</p>
                  <div className="grid grid-cols-2 gap-2">
                    {GIFT_WRAP_OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => setGiftWrap(opt.id)}
                        className={`p-3 rounded-sm border text-left transition-all ${giftWrap === opt.id ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'}`}>
                        <p className="font-body text-sm font-medium text-ivory">{opt.label}</p>
                        <p className="font-body text-xs text-gold mt-0.5">{opt.price === 0 ? 'Free' : `+₹${opt.price}`}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-ivory/60 uppercase tracking-wider font-body mb-2">Gift Message</p>
                  <textarea value={giftMessage} onChange={(e) => setGiftMessage(e.target.value.slice(0, 200))} rows={3}
                    placeholder="Write a personal message…"
                    className="w-full bg-obsidian border border-white/20 rounded-sm px-3 py-2 text-ivory text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none placeholder-ivory/30" />
                  <p className="text-xs text-ivory/30 font-body text-right">{giftMessage.length}/200</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm font-body text-ivory/70 mb-4 bg-charcoal/50 rounded-sm px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sage shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              Estimated delivery: <span className="text-sage font-medium ml-1">{deliveryRange}</span>
            </div>

            <button className="flex items-center gap-2 text-sm font-body text-ivory/50 hover:text-blush transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Save to Wishlist
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-white/10 pt-12 mb-20">
          <div className="flex gap-0 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-display text-base whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-ivory/60 hover:text-ivory'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'story' && (
            <div className="max-w-3xl font-accent text-ivory/80 leading-relaxed space-y-6 text-lg">
              {story ? <p>{story}</p> : (
                <>
                  <p>Every piece in the Kraafto collection carries within it the memory of the hands that shaped it. Born from a tradition of meticulous craftsmanship that spans generations, this piece is no exception.</p>
                  <p>Our artisans work without haste, guided by the belief that true luxury cannot be rushed. Each detail is considered, each finish refined until it meets the exacting standards that define the Kraafto name.</p>
                  {materials.length > 0 && (
                    <div>
                      <h3 className="font-display text-xl text-gold mb-3">Materials</h3>
                      <ul className="space-y-2">
                        {materials.map((m) => (
                          <li key={m} className="flex items-center gap-2 text-base">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full font-body text-sm">
                <tbody className="divide-y divide-white/5">
                  {[
                    { label: 'SKU', value: (product.sku as string) ?? 'N/A' },
                    { label: 'Materials', value: materials.join(', ') || 'N/A' },
                    { label: 'Processing Time', value: `${(product.processingDays as number) ?? 2} business days` },
                    { label: 'Made to Order', value: product.madeToOrder ? 'Yes (7–10 days)' : 'No' },
                    { label: 'Handcrafted', value: product.isHandcrafted ? 'Yes' : 'No' },
                    { label: 'Eco-Friendly', value: product.isEcoFriendly ? 'Yes' : 'No' },
                    ...(product.editionNumber ? [{ label: 'Edition', value: `${product.editionNumber} of ${product.editionTotal}` }] : []),
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="py-3 pr-8 text-ivory/50 w-40">{row.label}</td>
                      <td className="py-3 text-ivory">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-display text-xl text-ivory/40 mb-2">No reviews yet</p>
                  <p className="font-body text-sm text-ivory/30">Be the first to share your experience.</p>
                </div>
              ) : reviews.map((review) => (
                <div key={review.id as string} className="bg-charcoal border border-white/5 rounded-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-body font-medium text-ivory text-sm">{(review.user as { name?: string }).name ?? 'Anonymous'}</p>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill={s <= (review.rating as number) ? '#C9A96E' : 'none'}
                            stroke="#C9A96E" strokeWidth={1} className="w-3.5 h-3.5">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(review.isVerified as boolean) && <span className="text-xs text-sage font-body bg-sage/10 px-2 py-0.5 rounded-sm">Verified</span>}
                      <span className="text-xs text-ivory/30 font-body">
                        {new Date(review.createdAt as string).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {review.title != null && <p className="font-display text-base text-ivory mb-2">{String(review.title)}</p>}
                  <p className="font-body text-sm text-ivory/70 leading-relaxed">{String(review.body)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-2xl font-body text-sm text-ivory/70 leading-relaxed space-y-6">
              <div>
                <h3 className="font-display text-lg text-gold mb-3">Delivery</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span className="text-sage mt-0.5">✓</span> Standard delivery (5–7 days) — Free over ₹2,000</li>
                  <li className="flex items-start gap-2"><span className="text-gold mt-0.5">⚡</span> Express delivery (2–3 days) — ₹199</li>
                  <li className="flex items-start gap-2"><span className="text-ivory/40 mt-0.5">📦</span> Gift wrapping adds 1 business day</li>
                </ul>
              </div>
              <div>
                <h3 className="font-display text-lg text-gold mb-3">Returns</h3>
                <p>We accept returns within 14 days of delivery for a full refund or exchange. Items must be unused and in original packaging. Custom or bespoke items are final sale.</p>
              </div>
              <div>
                <h3 className="font-display text-lg text-gold mb-3">Need Help?</h3>
                <p>Contact our concierge at <a href="mailto:concierge@kraafto.com" className="text-gold hover:underline">concierge@kraafto.com</a> or visit our <Link href="/contact" className="text-gold hover:underline">Contact page</Link>.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-obsidian/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-6 right-6 text-ivory/60 hover:text-gold transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-3xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image src={images[activeImage].url} alt={(images[activeImage].alt ?? product.name) as string} fill className="object-contain" />
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-6 flex gap-3">
              {images.map((_, idx) => (
                <button key={idx} onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                  className={`h-2.5 rounded-full transition-all ${activeImage === idx ? 'bg-gold w-6' : 'bg-ivory/30 w-2.5'}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

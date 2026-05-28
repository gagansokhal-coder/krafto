'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface Occasion {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  user: { name: string | null; email: string };
  product: { name: string };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string | null;
  imageAlt?: string;
  badges: string[];
  inStock?: boolean;
  editionNumber?: number;
  editionTotal?: number;
}

interface HomeClientProps {
  initialFeaturedProducts: Product[];
  initialBestSellerProducts: Product[];
  initialLimitedEditions: Product[];
  categories: Category[];
  occasions: Occasion[];
  reviews: Review[];
}

/* ── Diamond ornament SVG ── */
function DiamondOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 20" className={`w-16 h-5 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <polygon points="30,4 36,10 30,16 24,10" fill="currentColor" opacity="0.6" />
      <line x1="40" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

/* ── Section heading with diamond divider ── */
function SectionHeading({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center text-center mb-16 gap-5">
      {label && (
        <span className="text-gold font-accent tracking-[0.3em] uppercase text-sm font-medium">{label}</span>
      )}
      <h2 className="text-3xl md:text-5xl font-display text-ivory leading-tight">{title}</h2>
      <DiamondOrnament className="text-gold" />
      {subtitle && (
        <p className="text-ivory/50 font-body max-w-xl text-balance leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export default function HomeClient({
  initialFeaturedProducts,
  initialBestSellerProducts,
  initialLimitedEditions,
  categories,
  occasions,
  reviews,
}: HomeClientProps) {
  const [activeOccasion, setActiveOccasion] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Auto-rotate testimonials
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      setNewsletterStatus(res.ok ? 'success' : 'error');
    } catch {
      setNewsletterStatus('error');
    }
  }

  return (
    <main className="min-h-screen bg-obsidian flex flex-col">

      {/* ═══════════════════════════════════════════════════════════
          1.1 HERO BANNER — Immersive Luxury
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2560&auto=format&fit=crop"
            alt="Luxury Gifting"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/20 to-obsidian" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/30 via-transparent to-obsidian/30" />
        </div>

        {/* Decorative corner ornaments */}
        <div className="absolute top-20 left-8 md:left-16 w-20 h-20 border-t border-l border-gold/15 rounded-tl-sm" />
        <div className="absolute top-20 right-8 md:right-16 w-20 h-20 border-t border-r border-gold/15 rounded-tr-sm" />
        <div className="absolute bottom-20 left-8 md:left-16 w-20 h-20 border-b border-l border-gold/15 rounded-bl-sm" />
        <div className="absolute bottom-20 right-8 md:right-16 w-20 h-20 border-b border-r border-gold/15 rounded-br-sm" />

        {/* Hero Content */}
        <div className="relative z-10 text-center flex flex-col items-center gap-6 px-4 max-w-4xl mx-auto mt-10">
          {/* Diamond ornament */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <DiamondOrnament className="text-gold/60" />
          </div>

          <span
            className="text-gold-light font-accent tracking-[0.4em] uppercase text-xs md:text-sm animate-fade-in-up font-medium"
            style={{ animationDelay: '0.2s' }}
          >
            Discover Kraafto
          </span>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-display text-ivory leading-[1.1] text-balance animate-fade-in-up font-light"
            style={{ animationDelay: '0.4s' }}
          >
            The Art of Gifting,
            <br />
            <span className="text-gold-gradient font-semibold">Reimagined</span>
          </h1>

          <p
            className="text-base md:text-lg text-ivory/60 font-body max-w-2xl text-balance leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            Curated luxury gifts and handcrafted metal artifacts — forged in tradition, crafted for today.
          </p>

          <div className="pt-4 animate-fade-in-up flex gap-4" style={{ animationDelay: '0.8s' }}>
            <Link href="/shop"><Button size="lg">Explore Collections</Button></Link>
            <Link href="/about"><Button size="lg" variant="secondary">Our Heritage</Button></Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <span className="text-[10px] text-ivory/30 tracking-[0.3em] uppercase font-body">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-gold/50 to-transparent animate-bounce-gentle" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          1.2 FEATURED COLLECTIONS
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 px-4 md:px-8 max-w-7xl mx-auto">
        <SectionHeading title="Featured Collections" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.name.toLowerCase().replace(' ', '-')}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-charcoal border border-gold/5 hover:border-gold/20 transition-all duration-700"
            >
              <Image
                src={c.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop'}
                alt={c.name}
                fill
                className="object-cover opacity-60 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-90" />

              {/* Gold corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12">
                <h3 className="text-2xl md:text-3xl font-display text-ivory tracking-wide mb-3 group-hover:text-gold-light transition-colors duration-500">{c.name}</h3>
                <div className="flex items-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-xs text-gold font-body uppercase tracking-[0.3em]">Explore</span>
                  <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          1.3 GIFTING BY OCCASION
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 px-4 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          title="Gifting by Occasion"
          subtitle="Find the perfect artisan gift for every milestone and celebration."
        />
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {occasions.map((o, i) => (
            <button
              key={o.slug}
              onClick={() => setActiveOccasion(i)}
              className={`px-6 py-2.5 rounded-full text-sm font-body transition-all duration-500 flex items-center gap-2 ${
                activeOccasion === i
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-obsidian shadow-gold font-medium'
                  : 'bg-charcoal text-ivory/50 border border-gold/10 hover:border-gold/30 hover:text-ivory/80'
              }`}
            >
              <span>{o.icon}</span> {o.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialFeaturedProducts.length > 0 ? (
            initialFeaturedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                originalPrice={p.compareAtPrice}
                imageUrl={p.imageUrl || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop'}
                badges={p.badges}
              />
            ))
          ) : (
            <p className="col-span-4 text-center text-ivory/40 font-body py-12">No products available</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          1.4 BEST FOR GIFTING
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 px-4 md:px-8 relative">
        <div className="absolute inset-0 bg-charcoal/40 jaali-pattern" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-14 px-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-gradient-to-b from-gold to-gold-dark rounded-full" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-display text-ivory">Best for Gifting</h2>
                  <p className="text-ivory/45 font-body text-sm mt-1">Our most loved pieces, perfect for any occasion.</p>
                </div>
              </div>
            </div>
            <Link href="/shop" className="hidden md:block"><Button variant="ghost">View All Gifts →</Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {initialBestSellerProducts.length > 0 ? (
              initialBestSellerProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  originalPrice={p.compareAtPrice}
                  imageUrl={p.imageUrl || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop'}
                  badges={p.badges}
                />
              ))
            ) : (
              <p className="col-span-4 text-center text-ivory/40 font-body py-12">No products available</p>
            )}
          </div>
          <div className="mt-10 flex justify-center md:hidden">
            <Link href="/shop"><Button variant="secondary" fullWidth>View All Gifts</Button></Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          1.5 CRAFTSMANSHIP STORY
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          {/* Image with decorative frame */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-charcoal">
              <Image
                src="https://images.unsplash.com/photo-1517409249764-16d77cffbc1f?q=80&w=1200&auto=format&fit=crop"
                alt="Master artisan at work"
                fill
                className="object-cover opacity-75"
              />
            </div>
            {/* Decorative gold frame offset */}
            <div className="absolute -top-3 -left-3 w-full h-full border border-gold/15 rounded-sm pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-b border-r border-gold/20 pointer-events-none" />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="text-gold font-accent tracking-[0.3em] uppercase text-sm mb-5 block font-medium">The Process</span>
            <h2 className="text-3xl md:text-5xl font-display text-ivory mb-6 leading-[1.15]">
              Where Tradition Meets
              <br />
              <span className="text-gold-gradient">Excellence</span>
            </h2>
            <DiamondOrnament className="text-gold/50 mb-6 !w-12" />
            <p className="text-ivory/60 font-body leading-relaxed mb-5 text-[15px]">
              Each piece in our collection passes through the hands of master artisans who have refined their craft over generations. From hand-blown glass in Murano to hammered brass in Rajasthan, we source directly from ateliers where tradition is a living art.
            </p>
            <p className="text-ivory/40 font-body leading-relaxed mb-10 text-[15px]">
              We never rush. Every object is created at the pace of the artisan — ensuring the soul of craftsmanship remains intact.
            </p>
            <div className="flex gap-4">
              <Link href="/about"><Button variant="secondary">Our Story</Button></Link>
              <Link href="/artisans"><Button variant="ghost">Meet the Artisans →</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          1.6 LIMITED EDITIONS
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 px-4 md:px-8 bg-gradient-to-b from-charcoal/30 via-charcoal/20 to-obsidian">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-14">
            <div className="flex flex-col gap-3">
              <span className="text-terracotta font-accent tracking-[0.3em] uppercase text-sm font-medium">Exclusive</span>
              <h2 className="text-3xl md:text-4xl font-display text-ivory">Limited Editions</h2>
            </div>
            <Link href="/shop?tag=limited-edition" className="hidden md:block"><Button variant="ghost">View All →</Button></Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
            {initialLimitedEditions.length > 0 ? (
              initialLimitedEditions.map((p) => (
                <div
                  key={p.id}
                  className="group min-w-[300px] snap-start flex flex-col bg-charcoal rounded-sm overflow-hidden border border-gold/5 hover:border-gold/20 transition-all duration-500 hover:shadow-warm"
                >
                  <Link href={`/shop/${p.slug}`} className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1612152605347-f93296cb657d?q=80&w=600&auto=format&fit=crop'}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    {p.editionNumber && p.editionTotal && (
                      <>
                        <div className="absolute top-3 left-3 bg-terracotta text-ivory text-[10px] px-3 py-1 uppercase tracking-wider font-medium rounded-sm">
                          Edition {p.editionNumber}/{p.editionTotal}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-obsidian/80 backdrop-blur-sm text-brass text-[10px] px-3 py-1 rounded-sm font-body tracking-wide">
                          Only {p.editionTotal - p.editionNumber} left
                        </div>
                      </>
                    )}
                  </Link>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-ivory mb-1.5 group-hover:text-gold transition-colors duration-300">{p.name}</h3>
                    <span className="font-body font-medium text-gold">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-ivory/40 w-full font-body py-12">No limited edition products available</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          1.7 TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <span className="text-gold font-accent tracking-[0.3em] uppercase text-sm mb-4 block font-medium">Loved By Our Patrons</span>
        <h2 className="text-3xl md:text-4xl font-display text-ivory mb-4">Words of Appreciation</h2>
        <DiamondOrnament className="text-gold/50 mx-auto mb-16" />

        <div className="relative min-h-[220px]">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              className={`transition-all duration-700 ease-out ${
                activeTestimonial === i
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 absolute inset-0 translate-y-4 pointer-events-none'
              }`}
            >
              {/* Gold quotation mark */}
              <svg className="w-12 h-12 mx-auto text-gold/20 mb-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl md:text-2xl text-ivory/80 font-body leading-relaxed italic mb-8 max-w-2xl mx-auto">
                {r.body}
              </p>
              <p className="text-gold font-display text-lg tracking-wide">{r.user.name || r.user.email}</p>
              <p className="text-ivory/30 font-body text-sm mt-1.5">Purchased: {r.product.name}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2.5 mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                activeTestimonial === i
                  ? 'bg-gold w-8 shadow-[0_0_10px_rgba(200,150,60,0.3)]'
                  : 'bg-ivory/15 w-2 hover:bg-ivory/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          1.8 NEWSLETTER — Inner Circle
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center relative">
          {/* Premium glass card */}
          <div className="glass-gold rounded-sm p-12 md:p-16 relative overflow-hidden">
            {/* Subtle corner ornaments */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-gold/20" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-gold/20" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-gold/20" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-gold/20" />

            <span className="text-gold font-accent tracking-[0.3em] uppercase text-sm mb-4 block font-medium">Stay Connected</span>
            <h2 className="text-3xl md:text-4xl font-display text-ivory mb-4">Join the Inner Circle</h2>
            <DiamondOrnament className="text-gold/40 mx-auto mb-6" />
            <p className="text-ivory/50 font-body mb-10 leading-relaxed">
              Get exclusive access to new collections, gift guides, and member-only offers.
            </p>

            {newsletterStatus === 'success' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-gold font-display text-lg">Welcome to the Inner Circle</p>
                <p className="text-ivory/40 font-body text-sm">You&apos;ll hear from us soon.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-obsidian/60 border border-gold/15 rounded-sm px-5 py-3.5 text-ivory focus:outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(200,150,60,0.1)] transition-all duration-300 font-body placeholder:text-ivory/25"
                />
                <Button type="submit" disabled={newsletterStatus === 'loading'}>
                  {newsletterStatus === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </form>
            )}

            {newsletterStatus === 'error' && (
              <p className="text-red-400/80 text-sm font-body mt-3">Something went wrong. Please try again.</p>
            )}
            <p className="text-ivory/20 text-xs font-body mt-6">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

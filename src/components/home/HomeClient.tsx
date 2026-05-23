'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
      {/* ── 1.1 Hero Banner ── */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2560&auto=format&fit=crop" alt="Luxury Gifting" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/20 to-obsidian" />
        </div>
        <div className="relative z-10 text-center flex flex-col items-center gap-8 px-4 max-w-4xl mx-auto mt-20">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Discover Kraafto</span>
          <h1 className="text-5xl md:text-7xl font-display text-ivory leading-tight text-balance animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            The Art of Gifting,<br />Reimagined
          </h1>
          <p className="text-lg md:text-xl text-ivory/80 font-body max-w-2xl text-balance animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Curated luxury gifts and handcrafted artifacts for life\'s most precious moments.
          </p>
          <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Link href="/shop"><Button size="lg">Explore Collections</Button></Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-ivory/50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </div>
      </section>

      {/* ── 1.2 Featured Collections ── */}
      <section className="w-full py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <h2 className="text-3xl md:text-5xl font-display text-ivory">Featured Collections</h2>
          <div className="w-16 h-1 bg-gold rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.name.toLowerCase().replace(' ', '-')}`} className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-charcoal">
              <Image src={c.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop'} alt={c.name} fill className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
                <h3 className="text-2xl font-display text-ivory tracking-wide mb-3">{c.name}</h3>
                <span className="text-sm text-gold font-body uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 1.3 Gifting by Occasion ── */}
      <section className="w-full py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 gap-4">
          <h2 className="text-3xl md:text-5xl font-display text-ivory">Gifting by Occasion</h2>
          <div className="w-16 h-1 bg-gold rounded-full" />
          <p className="text-ivory/60 font-body max-w-xl">Find the perfect gift for every milestone.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {occasions.map((o, i) => (
            <button key={o.slug} onClick={() => setActiveOccasion(i)} className={`px-5 py-2.5 rounded-full text-sm font-body transition-all duration-300 flex items-center gap-2 ${activeOccasion === i ? 'bg-gold text-obsidian shadow-gold' : 'bg-charcoal text-ivory/70 border border-white/10 hover:border-gold/50 hover:text-ivory'}`}>
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
            <p className="col-span-4 text-center text-ivory/60">No products available</p>
          )}
        </div>
      </section>

      {/* ── 1.4 Best for Gifting ── */}
      <section className="w-full py-24 px-4 md:px-8 max-w-7xl mx-auto bg-charcoal/30 rounded-3xl mb-8">
        <div className="flex justify-between items-end mb-12 px-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-display text-ivory">Best for Gifting</h2>
            <p className="text-ivory/60 font-body">Our most loved pieces, perfect for any occasion.</p>
          </div>
          <Link href="/shop" className="hidden md:block"><Button variant="ghost">View All Gifts</Button></Link>
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
            <p className="col-span-4 text-center text-ivory/60">No products available</p>
          )}
        </div>
        <div className="mt-8 flex justify-center md:hidden"><Link href="/shop"><Button variant="secondary" fullWidth>View All Gifts</Button></Link></div>
      </section>

      {/* ── 1.5 Craftsmanship Story ── */}
      <section className="w-full py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 relative aspect-[4/5] rounded-sm overflow-hidden bg-charcoal">
            <Image src="https://images.unsplash.com/photo-1517409249764-16d77cffbc1f?q=80&w=1200&auto=format&fit=crop" alt="Master artisan at work" fill className="object-cover opacity-80" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">The Process</span>
            <h2 className="text-3xl md:text-4xl font-display text-ivory mb-6 leading-snug">Where Tradition Meets Excellence</h2>
            <div className="w-12 h-1 bg-gold mb-6" />
            <p className="text-ivory/80 font-body leading-relaxed mb-6">Each piece in our collection passes through the hands of master artisans who have refined their craft over generations. From hand-blown glass in Murano to hammered brass in Rajasthan, we source directly from ateliers where tradition is a living art.</p>
            <p className="text-ivory/60 font-body leading-relaxed mb-8">We never rush. Every object is created at the pace of the artisan — ensuring the soul of craftsmanship remains intact.</p>
            <Link href="/about"><Button variant="secondary">Our Story</Button></Link>
          </div>
        </div>
      </section>

      {/* ── 1.6 Limited Editions ── */}
      <section className="w-full py-24 px-4 md:px-8 bg-charcoal/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div className="flex flex-col gap-4">
              <span className="text-burgundy font-accent tracking-[0.2em] uppercase text-sm">Exclusive</span>
              <h2 className="text-3xl md:text-4xl font-display text-ivory">Limited Editions</h2>
            </div>
            <Link href="/shop?tag=limited-edition" className="hidden md:block"><Button variant="ghost">View All</Button></Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {initialLimitedEditions.length > 0 ? (
              initialLimitedEditions.map((p) => (
                <div key={p.id} className="group min-w-[280px] snap-start flex flex-col bg-charcoal rounded-sm overflow-hidden border border-white/5 hover:border-burgundy/30 transition-colors">
                  <Link href={`/shop/${p.slug}`} className="relative aspect-[4/5] overflow-hidden">
                    <Image 
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1612152605347-f93296cb657d?q=80&w=600&auto=format&fit=crop'} 
                      alt={p.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    {p.editionNumber && p.editionTotal && (
                      <>
                        <div className="absolute top-3 left-3 bg-burgundy text-ivory text-xs px-2.5 py-1 uppercase tracking-wider font-medium rounded-sm">
                          Edition {p.editionNumber}/{p.editionTotal}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-obsidian/80 backdrop-blur-sm text-blush text-xs px-2.5 py-1 rounded-sm font-body">
                          Only {p.editionTotal - p.editionNumber} left
                        </div>
                      </>
                    )}
                  </Link>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-ivory mb-1 group-hover:text-gold transition-colors">{p.name}</h3>
                    <span className="font-body font-medium text-gold">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-ivory/60 w-full">No limited edition products available</p>
            )}
          </div>
        </div>
      </section>

      {/* ── 1.7 Testimonials ── */}
      <section className="w-full py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">Loved By Our Patrons</span>
        <h2 className="text-3xl md:text-4xl font-display text-ivory mb-16">Words of Appreciation</h2>
        <div className="relative min-h-[200px]">
          {reviews.map((r, i) => (
            <div key={r.id} className={`transition-all duration-500 ${activeTestimonial === i ? 'opacity-100 translate-y-0' : 'opacity-0 absolute inset-0 translate-y-4 pointer-events-none'}`}>
              <svg className="w-10 h-10 mx-auto text-gold/30 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
              <p className="text-xl md:text-2xl text-ivory/90 font-body leading-relaxed italic mb-8 max-w-2xl mx-auto">{r.body}</p>
              <p className="text-gold font-display text-lg">{r.user.name || r.user.email}</p>
              <p className="text-ivory/40 font-body text-sm mt-1">Purchased: {r.product.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setActiveTestimonial(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'bg-gold w-8' : 'bg-ivory/20 hover:bg-ivory/40'}`} />
          ))}
        </div>
      </section>

      {/* ── 1.8 Newsletter ── */}
      <section className="w-full py-24 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center bg-charcoal/40 rounded-lg border border-white/5 p-12 md:p-16">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">Stay Connected</span>
          <h2 className="text-3xl md:text-4xl font-display text-ivory mb-4">Join the Inner Circle</h2>
          <p className="text-ivory/60 font-body mb-8">Get exclusive access to new collections, gift guides, and member-only offers.</p>
          {newsletterStatus === 'success' ? (
            <p className="text-sage font-body">🎉 You&apos;re subscribed! Welcome to the inner circle.</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-obsidian border border-white/10 rounded-sm px-4 py-3 text-ivory focus:outline-none focus:border-gold transition-colors font-body"
              />
              <Button type="submit" disabled={newsletterStatus === 'loading'}>
                {newsletterStatus === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </Button>
            </form>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-red-400 text-sm font-body mt-2">Something went wrong. Please try again.</p>
          )}
          <p className="text-ivory/30 text-xs font-body mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </main>
  );
}

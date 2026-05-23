import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisansPage() {
  return (
    <div className="pt-32 pb-20 bg-obsidian min-h-screen text-ivory">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center mb-20">
        <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-6 block">The Makers</span>
        <h1 className="text-4xl md:text-6xl font-display text-ivory mb-6">The Masters Behind Kraafto</h1>
        <p className="font-body text-ivory/80 text-lg leading-relaxed text-balance">
          Discover the stories, traditions, and meticulous techniques of the world's most exceptional craftsmen and craftswomen.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Placeholder Artisan 1 */}
        <div className="group cursor-pointer">
          <div className="relative aspect-[3/4] bg-charcoal mb-6 overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?q=80&w=800&auto=format&fit=crop" alt="Artisan working" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
          </div>
          <h3 className="text-2xl font-display text-gold mb-2">Hiroshi Tanaka</h3>
          <p className="font-body text-ivory/60 text-sm tracking-widest uppercase mb-4">Woodworking • Kyoto, Japan</p>
          <p className="font-body text-ivory/80 line-clamp-3">A third-generation master carpenter specializing in joinery techniques that require no nails or glue, creating pieces that last for centuries.</p>
        </div>

        {/* Placeholder Artisan 2 */}
        <div className="group cursor-pointer">
          <div className="relative aspect-[3/4] bg-charcoal mb-6 overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1605814041130-9b6f84988771?q=80&w=800&auto=format&fit=crop" alt="Ceramics Artisan" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
          </div>
          <h3 className="text-2xl font-display text-gold mb-2">Elena Rossi</h3>
          <p className="font-body text-ivory/60 text-sm tracking-widest uppercase mb-4">Ceramics • Florence, Italy</p>
          <p className="font-body text-ivory/80 line-clamp-3">Known for her delicate porcelain work and unique glazing methods that create ethereal, almost translucent textures on functional objects.</p>
        </div>

        {/* Placeholder Artisan 3 */}
        <div className="group cursor-pointer">
          <div className="relative aspect-[3/4] bg-charcoal mb-6 overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop" alt="Textile Artisan" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
          </div>
          <h3 className="text-2xl font-display text-gold mb-2">Amara Diallo</h3>
          <p className="font-body text-ivory/60 text-sm tracking-widest uppercase mb-4">Textiles • Dakar, Senegal</p>
          <p className="font-body text-ivory/80 line-clamp-3">Reviving ancient weaving patterns using modern, sustainable materials to create striking tapestries and home textiles.</p>
        </div>
      </div>
      
      <div className="text-center mt-20">
        <Link href="/shop" className="inline-block border border-gold text-gold px-8 py-4 font-display uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-colors">
          Explore Their Work
        </Link>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function GiftsIndexPage() {
  const occasions = await prisma.occasion.findMany();

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-3 block">Curated</span>
          <h1 className="font-display text-4xl md:text-6xl text-ivory mb-4">Gifts by Occasion</h1>
          <p className="text-ivory/70 font-body max-w-xl mx-auto">Find the perfect handcrafted piece for life's most meaningful moments.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {occasions.map((occasion) => (
            <Link key={occasion.slug} href={`/gifts/${occasion.slug}`} className="group block bg-charcoal/50 border border-white/5 hover:border-gold/30 p-8 text-center rounded-sm transition-all duration-300">
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">{occasion.icon || '🎁'}</span>
              <h2 className="font-display text-xl text-ivory mb-3 group-hover:text-gold transition-colors">{occasion.name}</h2>
              <p className="text-ivory/60 font-body text-sm line-clamp-3">{occasion.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

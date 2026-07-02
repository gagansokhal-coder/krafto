export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function CollectionsIndexPage() {
  const categories = await prisma.category.findMany();


  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-3 block">Discover</span>
          <h1 className="font-display text-4xl md:text-6xl text-ivory mb-4">Our Collections</h1>
          <p className="text-ivory/70 font-body max-w-xl mx-auto">Explore our thoughtfully curated collections of handcrafted luxury pieces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/collections/${category.slug}`} className="group block relative overflow-hidden aspect-[4/3] md:aspect-[3/2] bg-charcoal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {category.image && (
                <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="font-display text-3xl text-gold mb-2 group-hover:text-gold-light transition-colors">{category.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

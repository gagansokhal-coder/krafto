import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function GiftGuidesPage() {
  const guides = [
    {
      title: 'The Wedding Collection: Gifts for the Happy Couple',
      description: 'Discover heirloom-quality pieces that will be cherished for generations, from crystal decanters to hand-woven throws.',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
      tag: 'Wedding'
    },
    {
      title: 'Corporate Gifting: Leave a Lasting Impression',
      description: 'Elevate your business relationships with our curated selection of sophisticated desk accessories and premium gift sets.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80',
      tag: 'Corporate'
    },
    {
      title: 'Anniversary Milestones: Gifts by Year',
      description: 'From paper to gold, find the perfect handcrafted piece to celebrate every milestone of your journey together.',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80',
      tag: 'Anniversary'
    }
  ];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-16">
        <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-4 block">Editorial</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-ivory mb-6">Gift Guides</h1>
        <p className="text-lg text-ivory/70 font-body max-w-2xl mx-auto">
          Curated inspiration for every occasion. Let our experts guide you to the perfect expression of your sentiment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide, idx) => (
          <article key={idx} className="group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-6 bg-charcoal">
              <Image 
                src={guide.imageUrl} 
                alt={guide.title}
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur-md px-3 py-1 text-xs text-gold uppercase tracking-widest font-body">
                {guide.tag}
              </div>
            </div>
            <h2 className="text-2xl font-display text-ivory mb-3 group-hover:text-gold transition-colors">{guide.title}</h2>
            <p className="text-ivory/60 font-body mb-6 line-clamp-3">{guide.description}</p>
            <span className="text-sm text-gold font-body uppercase tracking-wider border-b border-gold/30 pb-1 group-hover:border-gold transition-colors">
              Read Guide
            </span>
          </article>
        ))}
      </div>

      <div className="mt-24 bg-charcoal p-12 text-center rounded-sm border border-white/5">
        <h2 className="text-3xl font-display text-ivory mb-4">Need Personalized Advice?</h2>
        <p className="text-ivory/70 font-body mb-8 max-w-xl mx-auto">
          Our gifting concierges are available to help you find the perfect piece for your special occasion.
        </p>
        <Link href="/contact">
          <Button variant="secondary">Contact Concierge</Button>
        </Link>
      </div>
    </div>
  );
}

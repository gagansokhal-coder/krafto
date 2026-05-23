import React from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/ProductGrid';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function GiftsByOccasionPage({ params }: { params: { occasion: string } }) {
  const { occasion: slug } = params;

  const [occasion, allOccasions, products] = await Promise.all([
    prisma.occasion.findUnique({ where: { slug } }),
    prisma.occasion.findMany(),
    prisma.product.findMany({
      where: { occasions: { some: { slug } }, status: 'ACTIVE', deletedAt: null },
      take: 12,
      include: { images: { where: { isMain: true }, take: 1 } }
    })
  ]);

  if (!occasion) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-3xl text-ivory">Occasion Not Found</h1>
        <Link href="/shop" className="text-gold hover:underline font-body">Browse all gifts</Link>
      </div>
    );
  }

  const formattedProducts = products.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
    imageUrl: p.images[0]?.url || null,
    imageAlt: p.images[0]?.alt || p.name,
    badges: [
      p.isLimitedEdition && 'Limited Edition',
      p.isBestSeller && 'Best Seller',
      p.isHandcrafted && 'Handcrafted'
    ].filter(Boolean),
    inStock: p.inventory > 0,
    editionNumber: p.editionNumber,
    editionTotal: p.editionTotal
  }));

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Hero */}
      <div className="bg-charcoal/30 py-20 px-4 md:px-8 text-center border-b border-white/5 mb-12">
        <span className="text-5xl mb-4 block">{occasion.icon || '🎁'}</span>
        <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-3 block">Gifts for</span>
        <h1 className="font-display text-4xl md:text-6xl text-ivory mb-4">{occasion.name}</h1>
        <p className="text-ivory/60 font-body max-w-xl mx-auto">{occasion.description}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Other occasions */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allOccasions.filter((o) => o.slug !== slug).map((o) => (
            <Link key={o.slug} href={`/gifts/${o.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-charcoal border border-white/10 rounded-full text-sm font-body text-ivory/70 hover:border-gold/50 hover:text-gold transition-colors">
              <span>{o.icon || '🎁'}</span> {o.name}
            </Link>
          ))}
        </div>

        <ProductGrid products={formattedProducts} loading={false} columns={3} />

        {formattedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-ivory/50 font-body mb-4">No products tagged for this occasion yet.</p>
            <Link href="/shop" className="text-gold hover:underline font-body">Browse all products</Link>
          </div>
        )}
      </div>
    </div>
  );
}

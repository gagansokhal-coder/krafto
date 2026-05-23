import React from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/ProductGrid';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [category, allCategories, products] = await Promise.all([
    prisma.category.findUnique({ where: { slug } }),
    prisma.category.findMany({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { categories: { some: { slug } }, status: 'ACTIVE', deletedAt: null },
      take: 24,
      include: { images: { where: { isMain: true }, take: 1 } }
    })
  ]);

  if (!category) {
    return notFound();
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

  const label = category.name;
  const description = category.description || 'Explore our curated collection of handcrafted luxury pieces.';

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Collection header */}
      <div className="relative h-64 md:h-80 overflow-hidden mb-12">
        {category.imageUrl && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={category.imageUrl} alt={label} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 to-obsidian" />
          </div>
        )}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <span className="text-gold font-accent tracking-[0.2em] uppercase text-sm mb-3 block">Collection</span>
          <h1 className="font-display text-4xl md:text-6xl text-ivory mb-4">{label}</h1>
          <p className="text-ivory/70 font-body max-w-xl">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Other collections */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allCategories
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`}
                className="px-4 py-2 bg-charcoal border border-white/10 rounded-full text-sm font-body text-ivory/70 hover:border-gold/50 hover:text-gold transition-colors">
                {c.name}
              </Link>
            ))}
        </div>

        <ProductGrid products={formattedProducts} loading={false} columns={3} />

        {formattedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-ivory/50 font-body mb-4">No products in this collection yet.</p>
            <Link href="/shop" className="text-gold hover:underline font-body">Browse all products</Link>
          </div>
        )}
      </div>
    </div>
  );
}

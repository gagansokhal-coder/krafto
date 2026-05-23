export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Kraafto — Premium Handcrafted Gifts & Luxury Decor',
  description: 'Discover handcrafted luxury gifts and artisan-made decor for life\'s most precious moments.',
};

export default async function Home() {
  const [
    featuredProducts,
    bestSellerProducts,
    limitedEditions,
    categories,
    occasions,
    reviews
  ] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, status: 'ACTIVE', deletedAt: null },
      take: 4,
      include: { images: { where: { isMain: true }, take: 1 } }
    }),
    prisma.product.findMany({
      where: { isBestSeller: true, status: 'ACTIVE', deletedAt: null },
      take: 4,
      include: { images: { where: { isMain: true }, take: 1 } }
    }),
    prisma.product.findMany({
      where: { isLimitedEdition: true, status: 'ACTIVE', deletedAt: null },
      take: 4,
      include: { images: { where: { isMain: true }, take: 1 } }
    }),
    prisma.category.findMany({
      take: 3,
      orderBy: { position: 'asc' }
    }),
    prisma.occasion.findMany({
      take: 6
    }),
    prisma.review.findMany({
      where: { isApproved: true },
      take: 3,
      include: { user: true, product: true }
    })
  ]);

  const formatProduct = (p: any) => ({
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
  });

  const formattedFeatured = featuredProducts.map(formatProduct);
  const formattedBestSellers = bestSellerProducts.map(formatProduct);
  const formattedLimited = limitedEditions.map(formatProduct);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Kraafto",
            "url": "https://kraafto.com", // Assuming production URL
            "logo": "https://kraafto.com/favicon.ico",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-1234567890",
              "contactType": "Customer Service"
            },
            "sameAs": [
              "https://www.instagram.com/kraafto",
              "https://www.facebook.com/kraafto"
            ]
          }),
        }}
      />
      <HomeClient 
        initialFeaturedProducts={formattedFeatured}
        initialBestSellerProducts={formattedBestSellers}
        initialLimitedEditions={formattedLimited}
        categories={categories}
        occasions={occasions}
        reviews={reviews}
      />
    </>
  );
}

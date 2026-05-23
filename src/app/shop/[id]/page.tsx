export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';

interface PageProps {
  params: { id: string };
}

async function getProduct(slugOrId: string) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: slugOrId },
        { id: slugOrId }
      ],
      status: 'ACTIVE',
      deletedAt: null,
    },
    include: {
      images: {
        orderBy: { position: 'asc' },
      },
      variants: {
        orderBy: { createdAt: 'asc' },
      },
      categories: {
        select: { id: true, name: true, slug: true },
      },
      tags: {
        select: { id: true, name: true, slug: true },
      },
      occasions: {
        select: { id: true, name: true, slug: true, icon: true },
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      },
      _count: {
        select: {
          reviews: { where: { isApproved: true } },
        },
      },
    },
  });

  if (!product) return null;

  // Compute average rating
  const ratingAgg = await prisma.review.aggregate({
    where: { productId: product.id, isApproved: true },
    _avg: { rating: true },
  });

  return {
    ...product,
    averageRating: ratingAgg._avg.rating ?? 0,
    reviewCount: product._count.reviews,
    badges: [
      ...(product.isBestSeller ? ['Best Seller'] : []),
      ...(product.isHandcrafted ? ['Handcrafted'] : []),
      ...(product.isLimitedEdition ? ['Limited Edition'] : []),
      ...(product.isEcoFriendly ? ['Eco-Friendly'] : []),
    ],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Kraafto`,
    description: product.description,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

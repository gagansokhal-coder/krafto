export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: params.slug,
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
          select: {
            id: true,
            rating: true,
            title: true,
            body: true,
            images: true,
            isVerified: true,
            helpfulCount: true,
            createdAt: true,
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

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Compute average rating
    const ratingAgg = await prisma.review.aggregate({
      where: { productId: product.id, isApproved: true },
      _avg: { rating: true },
    });

    return NextResponse.json({
      product: {
        ...product,
        averageRating: ratingAgg._avg.rating ?? 0,
        reviewCount: product._count.reviews,
        badges: [
          ...(product.isBestSeller ? ['Best Seller'] : []),
          ...(product.isHandcrafted ? ['Handcrafted'] : []),
          ...(product.isLimitedEdition ? ['Limited Edition'] : []),
          ...(product.isEcoFriendly ? ['Eco-Friendly'] : []),
        ],
      },
    });
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', code: 'PRODUCT_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

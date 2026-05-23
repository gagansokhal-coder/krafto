export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const featured = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        isFeatured: true,
        deletedAt: null,
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        isBestSeller: true,
        isHandcrafted: true,
        isLimitedEdition: true,
        isEcoFriendly: true,
        editionNumber: true,
        editionTotal: true,
        images: {
          where: { isMain: true },
          select: { url: true, alt: true },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      products: featured.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        imageUrl: p.images[0]?.url ?? null,
        editionNumber: p.editionNumber,
        editionTotal: p.editionTotal,
        badges: [
          ...(p.isBestSeller ? ['Best Seller'] : []),
          ...(p.isHandcrafted ? ['Handcrafted'] : []),
          ...(p.isLimitedEdition ? ['Limited Edition'] : []),
          ...(p.isEcoFriendly ? ['Eco-Friendly'] : []),
        ],
      })),
    });
  } catch (error) {
    console.error('GET /api/products/featured error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products', code: 'FEATURED_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

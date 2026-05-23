export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE', deletedAt: null },
            },
          },
        },
      },
    });

    return NextResponse.json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
        productCount: c._count.products,
      })),
    });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', code: 'CATEGORIES_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

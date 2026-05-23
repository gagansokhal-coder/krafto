export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters', code: 'INVALID_QUERY' },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { materials: { hasSome: [q] } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          where: { isMain: true },
          select: { url: true, alt: true },
          take: 1,
        },
      },
      take: 20,
      orderBy: { isFeatured: 'desc' },
    });

    return NextResponse.json({
      query: q,
      results: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        imageUrl: p.images[0]?.url ?? null,
        imageAlt: p.images[0]?.alt ?? p.name,
      })),
      total: products.length,
    });
  } catch (error) {
    console.error('GET /api/search error:', error);
    return NextResponse.json(
      { error: 'Search failed', code: 'SEARCH_ERROR' },
      { status: 500 }
    );
  }
}

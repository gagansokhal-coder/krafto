export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '12')));
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const occasion = searchParams.get('occasion');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const inStock = searchParams.get('inStock');

    // Sort
    const sort = searchParams.get('sort') ?? 'featured';

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      deletedAt: null,
    };

    if (category) {
      where.categories = { some: { slug: category } };
    }
    if (occasion) {
      where.occasions = { some: { slug: occasion } };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (tag) {
      where.tags = { some: { slug: tag } };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (inStock === 'true') {
      where.inventory = { gt: 0 };
    }

    // Build orderBy
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = { isFeatured: 'desc' };
        break;
    }

    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          compareAtPrice: true,
          isFeatured: true,
          isBestSeller: true,
          isHandcrafted: true,
          isLimitedEdition: true,
          isEcoFriendly: true,
          inventory: true,
          editionNumber: true,
          editionTotal: true,
          images: {
            where: { isMain: true },
            select: { url: true, alt: true },
            take: 1,
          },
          categories: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        imageUrl: p.images[0]?.url ?? null,
        imageAlt: p.images[0]?.alt ?? p.name,
        category: p.categories[0]?.name ?? null,
        inStock: p.inventory > 0,
        editionNumber: p.editionNumber,
        editionTotal: p.editionTotal,
        badges: [
          ...(p.isBestSeller ? ['Best Seller'] : []),
          ...(p.isHandcrafted ? ['Handcrafted'] : []),
          ...(p.isLimitedEdition ? ['Limited Edition'] : []),
          ...(p.isEcoFriendly ? ['Eco-Friendly'] : []),
        ],
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', code: 'PRODUCTS_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

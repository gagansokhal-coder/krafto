export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/products — list all products including drafts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));
    const status = searchParams.get('status');

    const where: Prisma.ProductWhereInput = { deletedAt: null };
    if (status) where.status = status as Prisma.EnumProductStatusFilter;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          images: { where: { isMain: true }, take: 1 },
          categories: { select: { name: true } },
          _count: { select: { orderItems: true, reviews: true } },
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
        status: p.status,
        inventory: p.inventory,
        lowStockThreshold: p.lowStockThreshold,
        isLowStock: p.inventory <= p.lowStockThreshold,
        imageUrl: p.images[0]?.url ?? null,
        category: p.categories[0]?.name ?? 'Uncategorized',
        totalOrders: p._count.orderItems,
        totalReviews: p._count.reviews,
        updatedAt: p.updatedAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/admin/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin products', code: 'ADMIN_PRODUCTS_ERROR' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products — create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, price, categoryIds, ...rest } = body;

    if (!name || !slug || !description || !price) {
      return NextResponse.json(
        { error: 'Name, slug, description, and price are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Check for slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        ...rest,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id: string) => ({ id })) }
          : undefined,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/products error:', error);
    return NextResponse.json(
      { error: 'Failed to create product', code: 'PRODUCT_CREATE_ERROR' },
      { status: 500 }
    );
  }
}

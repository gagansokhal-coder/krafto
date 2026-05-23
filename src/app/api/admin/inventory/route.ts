export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    let where: Prisma.ProductWhereInput = { deletedAt: null };

    if (filter === 'low') {
      // Products with inventory <= lowStockThreshold but > 0
      // Prisma doesn't support field-to-field comparison in where clause directly,
      // so we fetch all and filter in JS
      where = { ...where, inventory: { gt: 0 } };
    } else if (filter === 'out') {
      where = { ...where, inventory: 0 };
    }

    const items = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        inventory: true,
        stock: true,
        lowStockThreshold: true,
        price: true,
        status: true,
        categories: {
          select: {
            name: true,
          },
          take: 1,
        },
      },
      orderBy: [
        { inventory: 'asc' },
        { name: 'asc' },
      ],
    });

    // Post-filter for "low" stock (inventory > 0 AND inventory <= lowStockThreshold)
    const filtered = filter === 'low'
      ? items.filter(i => i.inventory > 0 && i.inventory <= i.lowStockThreshold)
      : items;

    // Map to the shape the frontend expects
    const result = filtered.map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      stock: item.inventory, // frontend uses "stock" but schema has "inventory"
      lowStockThreshold: item.lowStockThreshold,
      price: Number(item.price),
      category: item.categories[0] ?? null,
      isActive: item.status === 'ACTIVE',
    }));

    return NextResponse.json({ items: result });
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

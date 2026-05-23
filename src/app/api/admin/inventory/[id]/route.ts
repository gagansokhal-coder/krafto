export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stock, lowStockThreshold } = body;

    // Validate stock is a non-negative number
    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return NextResponse.json(
        { error: 'Stock must be a non-negative number' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update inventory — frontend sends "stock" but schema field is "inventory"
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(stock !== undefined && { inventory: stock }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold }),
      },
      select: {
        id: true,
        name: true,
        inventory: true,
        lowStockThreshold: true,
      },
    });

    return NextResponse.json({
      product: {
        ...updated,
        stock: updated.inventory,
      },
    });
  } catch (error) {
    console.error('Failed to update inventory:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}

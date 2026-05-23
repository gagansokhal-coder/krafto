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
    const {
      name,
      description,
      discountPercentage,
      startDate,
      endDate,
      isActive,
      productIds,
    } = body;

    // Check if sale exists
    const existing = await prisma.sale.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        );
      }
    }

    // Update sale
    const sale = await prisma.sale.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(discountPercentage && { discountPercentage: parseFloat(discountPercentage) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(isActive !== undefined && { isActive }),
        ...(productIds && {
          products: {
            set: productIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ 
      sale: {
        ...sale,
        productCount: sale._count.products,
      }
    });
  } catch (error) {
    console.error('Failed to update sale:', error);
    return NextResponse.json(
      { error: 'Failed to update sale' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if sale exists
    const existing = await prisma.sale.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Delete sale
    await prisma.sale.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete sale:', error);
    return NextResponse.json(
      { error: 'Failed to delete sale' },
      { status: 500 }
    );
  }
}

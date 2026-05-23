import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sales = await prisma.sale.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedSales = sales.map(sale => ({
      ...sale,
      productCount: sale._count.products,
      _count: undefined,
    }));

    return NextResponse.json({ sales: formattedSales });
  } catch (error) {
    console.error('Failed to fetch sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!name || !discountPercentage || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, discount percentage, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        name,
        description,
        discountPercentage: parseFloat(discountPercentage),
        startDate: start,
        endDate: end,
        isActive: isActive ?? true,
        ...(productIds && productIds.length > 0 && {
          products: {
            connect: productIds.map((id: string) => ({ id })),
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
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create sale:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}

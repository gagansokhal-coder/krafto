export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/orders/[id] — get order details
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        // Admins can view any order; customers only their own
        ...(user.role === 'CUSTOMER' ? { userId: user.id } : {}),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: { where: { isMain: true }, take: 1, select: { url: true, alt: true } },
              },
            },
            giftOption: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found', code: 'ORDER_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order', code: 'ORDER_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

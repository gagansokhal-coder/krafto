export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

// PATCH /api/admin/orders/[id]/status — update order status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, paymentStatus, trackingNumber, trackingUrl } = body;

    // Validate status values
    const validOrderStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const validPaymentStatuses: PaymentStatus[] = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

    if (status && !validOrderStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true } },
            giftOption: true,
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('PATCH /api/admin/orders/[id]/status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

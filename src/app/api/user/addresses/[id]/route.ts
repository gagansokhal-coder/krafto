export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/user/addresses/[id]
export async function PATCH(
  request: Request,
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

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Address not found', code: 'ADDRESS_NOT_FOUND' }, { status: 404 });
    }

    const body = await request.json();
    const { fullName, phone, line1, line2, city, state, pincode, country, isDefault, label } = body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, id: { not: params.id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(line1 !== undefined && { line1 }),
        ...(line2 !== undefined && { line2 }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
        ...(country !== undefined && { country }),
        ...(isDefault !== undefined && { isDefault }),
        ...(label !== undefined && { label }),
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error('PATCH /api/user/addresses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update address', code: 'ADDRESS_UPDATE_ERROR' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/addresses/[id]
export async function DELETE(
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

    const existing = await prisma.address.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Address not found', code: 'ADDRESS_NOT_FOUND' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/user/addresses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete address', code: 'ADDRESS_DELETE_ERROR' },
      { status: 500 }
    );
  }
}

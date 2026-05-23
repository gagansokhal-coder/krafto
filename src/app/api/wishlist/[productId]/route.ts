export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/wishlist/[productId] — remove from wishlist
export async function DELETE(
  _request: Request,
  { params }: { params: { productId: string } }
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

    await prisma.wishlistItem.deleteMany({
      where: { userId: user.id, productId: params.productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/wishlist/[productId] error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist', code: 'WISHLIST_REMOVE_ERROR' },
      { status: 500 }
    );
  }
}

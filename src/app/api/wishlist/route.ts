export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/wishlist — get user's wishlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            compareAtPrice: true,
            inventory: true,
            isHandcrafted: true,
            isLimitedEdition: true,
            isBestSeller: true,
            images: { where: { isMain: true }, take: 1, select: { url: true, alt: true } },
          },
        },
      },
    });

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        addedAt: item.createdAt,
        product: {
          ...item.product,
          imageUrl: item.product.images[0]?.url ?? null,
          inStock: item.product.inventory > 0,
          badges: [
            ...(item.product.isBestSeller ? ['Best Seller'] : []),
            ...(item.product.isHandcrafted ? ['Handcrafted'] : []),
            ...(item.product.isLimitedEdition ? ['Limited Edition'] : []),
          ],
        },
      })),
    });
  } catch (error) {
    console.error('GET /api/wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist', code: 'WISHLIST_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist — add product to wishlist
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 });
    }

    // Upsert to avoid duplicates
    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: {},
      create: { userId: user.id, productId },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist', code: 'WISHLIST_ADD_ERROR' },
      { status: 500 }
    );
  }
}

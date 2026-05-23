export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required', code: 'INVALID_CART' },
        { status: 400 }
      );
    }

    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        price: true,
        inventory: true,
        images: {
          where: { isMain: true },
          select: { url: true },
          take: 1,
        },
      },
    });

    const adjustments: Array<{ productId: string; reason: string; detail?: string }> = [];
    const validatedItems = items.map((item: { productId: string; quantity: number; variantId?: string }) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        adjustments.push({
          productId: item.productId,
          reason: 'PRODUCT_NOT_FOUND',
        });
        return null;
      }

      if (product.inventory < item.quantity) {
        adjustments.push({
          productId: item.productId,
          reason: 'INSUFFICIENT_STOCK',
          detail: `Only ${product.inventory} available`,
        });
      }

      return {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: Math.min(item.quantity, product.inventory),
        imageUrl: product.images[0]?.url ?? null,
        inStock: product.inventory >= item.quantity,
      };
    }).filter(Boolean);

    return NextResponse.json({
      valid: adjustments.length === 0,
      items: validatedItems,
      adjustments,
    });
  } catch (error) {
    console.error('POST /api/cart/validate error:', error);
    return NextResponse.json(
      { error: 'Cart validation failed', code: 'CART_VALIDATION_ERROR' },
      { status: 500 }
    );
  }
}

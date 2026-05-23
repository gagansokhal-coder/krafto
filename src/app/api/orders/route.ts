export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/orders — list authenticated user's orders
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '10')));

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 });
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                  images: { where: { isMain: true }, take: 1, select: { url: true } },
                },
              },
              giftOption: true,
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', code: 'ORDERS_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

// POST /api/orders — create a new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      items,
      shippingAddressId,
      shippingMethod = 'STANDARD',
      promoCode,
      email,
      phone,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email and phone are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate and price items from DB
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE', deletedAt: null },
      select: { id: true, name: true, price: true, inventory: true, stock: true },
    });

    // Check inventory availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found or unavailable`, code: 'PRODUCT_NOT_FOUND' },
          { status: 400 }
        );
      }
      if (product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.inventory} available.`, code: 'INSUFFICIENT_STOCK' },
          { status: 400 }
        );
      }
    }

    let subtotal = 0;
    let giftWrapTotal = 0;

    const WRAP_PRICES: Record<string, number> = {
      CLASSIC_GOLD: 99,
      BOTANICAL: 149,
      LUXURY_BOX: 249,
      ECO_WRAP: 0,
    };

    const orderItemsData = items.map((item: {
      productId: string;
      variantId?: string;
      quantity: number;
      isGift?: boolean;
      giftOption?: {
        wrapStyle: string;
        message?: string;
        recipientName?: string;
        hidePricing?: boolean;
      };
    }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      const wrapPrice = item.isGift && item.giftOption
        ? (WRAP_PRICES[item.giftOption.wrapStyle] ?? 0)
        : 0;
      giftWrapTotal += wrapPrice;

      return {
        productId: item.productId,
        variantId: item.variantId ?? null,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        isGift: item.isGift ?? false,
        giftOption: item.isGift && item.giftOption
          ? {
              create: {
                wrapStyle: item.giftOption.wrapStyle as 'CLASSIC_GOLD' | 'BOTANICAL' | 'LUXURY_BOX' | 'ECO_WRAP',
                wrapPrice,
                message: item.giftOption.message ?? null,
                recipientName: item.giftOption.recipientName ?? null,
                hidePricing: item.giftOption.hidePricing ?? true,
              },
            }
          : undefined,
      };
    });

    // Shipping cost
    const shippingCost = shippingMethod === 'EXPRESS' ? 199 : subtotal >= 2000 ? 0 : 99;

    // Promo discount (validate and track usage)
    let discountTotal = 0;
    let validatedPromoCode = null;
    
    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: { 
          code: promoCode.toUpperCase(), 
          isActive: true,
          OR: [
            { validFrom: null },
            { validFrom: { lte: new Date() } }
          ],
          AND: [
            {
              OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } }
              ]
            }
          ]
        },
      });
      
      if (!promo) {
        return NextResponse.json(
          { error: 'Invalid or expired promo code', code: 'INVALID_PROMO_CODE' },
          { status: 400 }
        );
      }

      // Check usage limits
      if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
        return NextResponse.json(
          { error: 'Promo code usage limit reached', code: 'PROMO_LIMIT_REACHED' },
          { status: 400 }
        );
      }

      // Check minimum order value
      if (promo.minOrderValue && subtotal < Number(promo.minOrderValue)) {
        return NextResponse.json(
          { error: `Minimum order value of ₹${promo.minOrderValue} required for this promo code`, code: 'MIN_ORDER_NOT_MET' },
          { status: 400 }
        );
      }

      // Calculate discount
      if (promo.discountType === 'PERCENTAGE') {
        discountTotal = Math.min(
          (subtotal * Number(promo.discountValue)) / 100,
          promo.maxDiscount ? Number(promo.maxDiscount) : Infinity
        );
      } else if (promo.discountType === 'FLAT') {
        discountTotal = Number(promo.discountValue);
      } else if (promo.discountType === 'FREE_SHIPPING') {
        discountTotal = shippingCost;
      }

      validatedPromoCode = promo;
    }

    const grandTotal = subtotal + giftWrapTotal + shippingCost - discountTotal;

    // Generate order number
    const orderNumber = `KRF-${Date.now().toString().slice(-8)}`;

    const userId = session?.user?.email
      ? (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id ?? null
      : null;

    // Create order and update inventory in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          email,
          phone,
          shippingMethod: shippingMethod as 'STANDARD' | 'EXPRESS',
          shippingCost,
          subtotal,
          giftWrapTotal,
          discountTotal,
          grandTotal,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      // Decrement inventory for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventory: { decrement: item.quantity },
            stock: { decrement: item.quantity },
          },
        });
      }

      // Increment promo code usage count
      if (validatedPromoCode) {
        await tx.promoCode.update({
          where: { id: validatedPromoCode.id },
          data: {
            usageCount: { increment: 1 },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          grandTotal: order.grandTotal,
        },
        // In production, create a Stripe PaymentIntent here and return clientSecret
        paymentIntent: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', code: 'ORDER_CREATE_ERROR' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/promo-codes/validate — validate a promo code
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const promo = await prisma.promoCode.findFirst({
      where: { 
        code: code.toUpperCase(), 
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
        { 
          valid: false, 
          error: 'Invalid or expired promo code',
          code: 'INVALID_PROMO_CODE' 
        },
        { status: 400 }
      );
    }

    // Check usage limits
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Promo code usage limit reached',
          code: 'PROMO_LIMIT_REACHED' 
        },
        { status: 400 }
      );
    }

    // Check minimum order value
    if (promo.minOrderValue && subtotal < Number(promo.minOrderValue)) {
      return NextResponse.json(
        { 
          valid: false, 
          error: `Minimum order value of ₹${promo.minOrderValue} required`,
          code: 'MIN_ORDER_NOT_MET',
          minOrderValue: Number(promo.minOrderValue)
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    const shippingCost = subtotal >= 2000 ? 0 : 99;

    if (promo.discountType === 'PERCENTAGE') {
      discountAmount = Math.min(
        (subtotal * Number(promo.discountValue)) / 100,
        promo.maxDiscount ? Number(promo.maxDiscount) : Infinity
      );
    } else if (promo.discountType === 'FLAT') {
      discountAmount = Number(promo.discountValue);
    } else if (promo.discountType === 'FREE_SHIPPING') {
      discountAmount = shippingCost;
    }

    return NextResponse.json({
      valid: true,
      promoCode: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: Number(promo.discountValue),
        discountAmount,
        maxDiscount: promo.maxDiscount ? Number(promo.maxDiscount) : null,
      },
    });
  } catch (error) {
    console.error('POST /api/promo-codes/validate error:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code', code: 'VALIDATION_ERROR' },
      { status: 500 }
    );
  }
}

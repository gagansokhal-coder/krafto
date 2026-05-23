export const dynamic = 'force-dynamic';

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

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ promoCodes });
  } catch (error) {
    console.error('Failed to fetch promo codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
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
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      perUserLimit,
      validFrom,
      validUntil,
      isActive,
    } = body;

    // Validate required fields
    if (!code || !discountType) {
      return NextResponse.json(
        { error: 'Code and discount type are required' },
        { status: 400 }
      );
    }

    if (discountType !== 'FREE_SHIPPING' && !discountValue) {
      return NextResponse.json(
        { error: 'Discount value is required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Promo code already exists' },
        { status: 409 }
      );
    }

    // Create promo code
    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: discountType === 'FREE_SHIPPING' ? 0 : discountValue,
        minOrderValue,
        maxDiscount,
        usageLimit,
        perUserLimit,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (error) {
    console.error('Failed to create promo code:', error);
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    );
  }
}

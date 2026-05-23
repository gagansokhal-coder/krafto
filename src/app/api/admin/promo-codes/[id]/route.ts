import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if promo code exists
    const existing = await prisma.promoCode.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // If code is being changed, check for duplicates
    if (code && code.toUpperCase() !== existing.code) {
      const duplicate = await prisma.promoCode.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Promo code already exists' },
          { status: 409 }
        );
      }
    }

    // Update promo code
    const promoCode = await prisma.promoCode.update({
      where: { id: params.id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue }),
        ...(minOrderValue !== undefined && { minOrderValue }),
        ...(maxDiscount !== undefined && { maxDiscount }),
        ...(usageLimit !== undefined && { usageLimit }),
        ...(perUserLimit !== undefined && { perUserLimit }),
        ...(validFrom !== undefined && {
          validFrom: validFrom ? new Date(validFrom) : null,
        }),
        ...(validUntil !== undefined && {
          validUntil: validUntil ? new Date(validUntil) : null,
        }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ promoCode });
  } catch (error) {
    console.error('Failed to update promo code:', error);
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if promo code exists
    const existing = await prisma.promoCode.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Delete promo code
    await prisma.promoCode.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete promo code:', error);
    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    );
  }
}

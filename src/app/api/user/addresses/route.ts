export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/addresses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { user: { email: session.user.email } },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('GET /api/user/addresses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses', code: 'ADDRESSES_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

// POST /api/user/addresses
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, line1, line2, city, state, pincode, country, isDefault, label } = body;

    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Required address fields are missing', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName,
        phone,
        line1,
        line2: line2 ?? null,
        city,
        state,
        pincode,
        country: country ?? 'India',
        isDefault: isDefault ?? false,
        label: label ?? null,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error('POST /api/user/addresses error:', error);
    return NextResponse.json(
      { error: 'Failed to create address', code: 'ADDRESS_CREATE_ERROR' },
      { status: 500 }
    );
  }
}

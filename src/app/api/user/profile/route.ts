export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/profile — get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', code: 'PROFILE_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

// PATCH /api/user/profile — update name, phone, image
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, image } = body;

    // Sanitize: only allow specific fields
    const updateData: { name?: string; phone?: string; image?: string } = {};
    if (name !== undefined) updateData.name = String(name).trim().slice(0, 100);
    if (phone !== undefined) updateData.phone = String(phone).trim().slice(0, 20);
    if (image !== undefined) updateData.image = String(image).trim();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: { id: true, email: true, name: true, phone: true, image: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('PATCH /api/user/profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', code: 'PROFILE_UPDATE_ERROR' },
      { status: 500 }
    );
  }
}

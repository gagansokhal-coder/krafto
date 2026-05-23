import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/user/change-password
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current and new password are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters', code: 'WEAK_PASSWORD' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Cannot change password for OAuth accounts', code: 'OAUTH_ACCOUNT' },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect', code: 'INVALID_PASSWORD' },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('POST /api/user/change-password error:', error);
    return NextResponse.json(
      { error: 'Failed to change password', code: 'PASSWORD_CHANGE_ERROR' },
      { status: 500 }
    );
  }
}

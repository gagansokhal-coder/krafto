export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const occasions = await prisma.occasion.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ occasions });
  } catch (error) {
    console.error('GET /api/occasions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch occasions', code: 'OCCASIONS_FETCH_ERROR' },
      { status: 500 }
    );
  }
}

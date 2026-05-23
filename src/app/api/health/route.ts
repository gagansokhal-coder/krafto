export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let dbHealthy = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbHealthy = true;
  } catch {
    dbHealthy = false;
  }

  const status = dbHealthy ? 'healthy' : 'degraded';

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
      },
    },
    { status: dbHealthy ? 200 : 503 }
  );
}

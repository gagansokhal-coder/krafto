import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Create pool with conservative limits for Supabase session-mode pooler (max 15)
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,                    // Keep well under Supabase's 15 session-mode limit
    idleTimeoutMillis: 30000,  // Close idle connections after 30s
    connectionTimeoutMillis: 10000, // Fail fast if can't connect in 10s
  });
}

// Create Prisma client with adapter
if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma;

// Default export for convenience
export default prisma;


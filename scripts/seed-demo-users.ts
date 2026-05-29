/**
 * Seed demo login credentials into the Supabase/PostgreSQL database.
 * 
 * Admin:    admin@kraafto.com / Admin@Kraafto2026  → /admin page (SUPER_ADMIN role)
 * Customer: demo@kraafto.com  / Customer@123       → /account page (CUSTOMER role)
 * 
 * Usage:  npx tsx scripts/seed-demo-users.ts
 */
import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🔐 Seeding demo login credentials into Supabase...\n');

  // ── 1. Admin user (SUPER_ADMIN → /admin) ───────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('Admin@Kraafto2026', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kraafto.com' },
    update: { passwordHash: adminPasswordHash, role: Role.SUPER_ADMIN },
    create: {
      email: 'admin@kraafto.com',
      name: 'Kraafto Admin',
      role: Role.SUPER_ADMIN,
      passwordHash: adminPasswordHash,
    },
  });
  console.log(`  ✅ Admin user ready`);
  console.log(`     Email:     ${admin.email}`);
  console.log(`     Password:  Admin@Kraafto2026`);
  console.log(`     Role:      ${admin.role}`);
  console.log(`     Page:      /admin\n`);

  // ── 2. Demo customer (CUSTOMER → /account) ────────────────────────────────
  const customerPasswordHash = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'demo@kraafto.com' },
    update: { passwordHash: customerPasswordHash, role: Role.CUSTOMER },
    create: {
      email: 'demo@kraafto.com',
      name: 'Demo Customer',
      role: Role.CUSTOMER,
      passwordHash: customerPasswordHash,
    },
  });
  console.log(`  ✅ Customer user ready`);
  console.log(`     Email:     ${customer.email}`);
  console.log(`     Password:  Customer@123`);
  console.log(`     Role:      ${customer.role}`);
  console.log(`     Page:      /account\n`);

  // ── Verify ─────────────────────────────────────────────────────────────────
  const users = await prisma.user.findMany({
    where: { email: { in: ['admin@kraafto.com', 'demo@kraafto.com'] } },
    select: { email: true, name: true, role: true, createdAt: true },
  });
  console.log('📋 Verification — demo users in database:');
  console.table(users);

  await prisma.$disconnect();
  await pool.end();
  console.log('\n🎉 Demo credentials seeded successfully!');
}

main().catch(async (err) => {
  console.error('❌ Failed to seed demo users:', err);
  process.exit(1);
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const cats = await prisma.category.findMany();
  const occs = await prisma.occasion.findMany();
  console.log(cats);
  console.log(occs);
}
main().catch(console.error).finally(() => prisma.$disconnect());

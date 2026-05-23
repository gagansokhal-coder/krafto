import { prisma } from '@/lib/prisma';
import ShopClient from './ShopClient';
import type { ProductListItem } from '@/types/product';

export const metadata = {
  title: 'Shop All | Kraafto',
  description: 'Explore our curated collection of luxury handcrafted goods.',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [categories, rawProducts] = await Promise.all([
    prisma.category.findMany({
      select: {
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        categories: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  const products: ProductListItem[] = rawProducts.map((p) => {
    return {
      id: p.id,
      name: p.name,
      price: p.price.toString(),
      image: p.images[0]?.url || 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=2000&auto=format&fit=crop',
      category: p.categories[0]?.name || 'Uncategorized',
      isNew: (new Date().getTime() - p.createdAt.getTime()) < 1000 * 60 * 60 * 24 * 30, // 30 days
      inStock: p.inventory > 0,
    };
  });


  return <ShopClient products={products} categories={categories} />;
}

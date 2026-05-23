import { PrismaClient, ProductStatus, Role, DiscountType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Kraafto database...');

  // ---------------------------------------------------------------------------
  // 1. Categories
  // ---------------------------------------------------------------------------
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'home-decor' },
      update: {},
      create: { name: 'Home Décor', slug: 'home-decor', position: 0, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop' },
    }),
    prisma.category.upsert({
      where: { slug: 'dining' },
      update: {},
      create: { name: 'Dining', slug: 'dining', position: 1, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800&auto=format&fit=crop' },
    }),
    prisma.category.upsert({
      where: { slug: 'apparel' },
      update: {},
      create: { name: 'Apparel', slug: 'apparel', position: 2, image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop' },
    }),
    prisma.category.upsert({
      where: { slug: 'vases' },
      update: {},
      create: { name: 'Vases', slug: 'vases', position: 3, image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=800&auto=format&fit=crop' },
    }),
    prisma.category.upsert({
      where: { slug: 'gift-sets' },
      update: {},
      create: { name: 'Gift Sets', slug: 'gift-sets', position: 4, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop' },
    }),
    prisma.category.upsert({
      where: { slug: 'lighting' },
      update: {},
      create: { name: 'Lighting', slug: 'lighting', position: 5, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop' },
    }),
  ]);
  console.log(`  ✅ ${categories.length} categories seeded`);

  // ---------------------------------------------------------------------------
  // 2. Occasions
  // ---------------------------------------------------------------------------
  const occasions = await Promise.all([
    prisma.occasion.upsert({
      where: { slug: 'birthday' },
      update: {},
      create: { name: 'Birthday', slug: 'birthday', icon: '🎂', description: 'Perfect birthday gifts for every taste' },
    }),
    prisma.occasion.upsert({
      where: { slug: 'wedding' },
      update: {},
      create: { name: 'Wedding', slug: 'wedding', icon: '💒', description: 'Elegant wedding gifts and registry favourites' },
    }),
    prisma.occasion.upsert({
      where: { slug: 'housewarming' },
      update: {},
      create: { name: 'Housewarming', slug: 'housewarming', icon: '🏠', description: 'Welcome them to their new home' },
    }),
    prisma.occasion.upsert({
      where: { slug: 'anniversary' },
      update: {},
      create: { name: 'Anniversary', slug: 'anniversary', icon: '💍', description: 'Celebrate years of togetherness' },
    }),
    prisma.occasion.upsert({
      where: { slug: 'corporate' },
      update: {},
      create: { name: 'Corporate', slug: 'corporate', icon: '🏢', description: 'Premium corporate gifting solutions' },
    }),
    prisma.occasion.upsert({
      where: { slug: 'thank-you' },
      update: {},
      create: { name: 'Thank You', slug: 'thank-you', icon: '🙏', description: 'Express your gratitude with a heartfelt gift' },
    }),
    prisma.occasion.upsert({
      where: { slug: 'festive' },
      update: {},
      create: { name: 'Festive', slug: 'festive', icon: '🎄', description: 'Celebrate Diwali, Christmas, New Year and every festive moment' },
    }),
    prisma.occasion.upsert({
      where: { slug: 'new-baby' },
      update: {},
      create: { name: 'New Baby', slug: 'new-baby', icon: '👶', description: 'Welcome the newest arrival with a gift they will treasure' },
    }),
  ]);
  console.log(`  ✅ ${occasions.length} occasions seeded`);

  // ---------------------------------------------------------------------------
  // 3. Tags
  // ---------------------------------------------------------------------------
  await Promise.all([
    prisma.tag.upsert({ where: { slug: 'limited-edition' }, update: {}, create: { name: 'Limited Edition', slug: 'limited-edition' } }),
    prisma.tag.upsert({ where: { slug: 'eco-friendly' }, update: {}, create: { name: 'Eco-Friendly', slug: 'eco-friendly' } }),
    prisma.tag.upsert({ where: { slug: 'handcrafted' }, update: {}, create: { name: 'Handcrafted', slug: 'handcrafted' } }),
    prisma.tag.upsert({ where: { slug: 'best-seller' }, update: {}, create: { name: 'Best Seller', slug: 'best-seller' } }),
    prisma.tag.upsert({ where: { slug: 'premium' }, update: {}, create: { name: 'Premium', slug: 'premium' } }),
  ]);
  console.log('  ✅ Tags seeded');

  // ---------------------------------------------------------------------------
  // 4. Products
  // ---------------------------------------------------------------------------
  const productData = [
    {
      name: 'Obsidian Table Lamp',
      slug: 'obsidian-table-lamp',
      description: 'A sculptural table lamp with a hand-polished obsidian base and a hand-stitched linen shade. Brings warm ambient light to any space.',
      story: 'Sourced from volcanic obsidian quarries in Rajasthan, each base is hand-polished over three days by master craftsmen. The linen shade is hand-stitched using traditional techniques passed down through generations.',
      price: 12500,
      compareAtPrice: 15000,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isBestSeller: true,
      isHandcrafted: true,
      materials: ['Natural Obsidian', 'Hand-stitched Linen', 'Brass Fittings'],
      inventory: 15,
      processingDays: 3,
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'lighting',
      occasionSlugs: ['housewarming', 'anniversary', 'corporate'],
    },
    {
      name: 'Crystal Whiskey Decanter',
      slug: 'crystal-whiskey-decanter',
      description: 'A masterwork of crystal cutting — this lead-free decanter features a diamond-pattern body and an airtight stopper. Perfect for the discerning collector.',
      story: 'Each decanter is hand-cut by master glassmakers in Bohemia, a region with over 400 years of crystal-cutting heritage. The diamond pattern requires over 200 individual cuts.',
      price: 8900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isLimitedEdition: true,
      editionNumber: 18,
      editionTotal: 50,
      materials: ['Lead-free Crystal', 'Hand-cut Diamond Pattern'],
      inventory: 22,
      processingDays: 2,
      imageUrl: 'https://images.unsplash.com/photo-1582227146059-86927d3550e5?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'dining',
      occasionSlugs: ['corporate', 'anniversary', 'birthday'],
    },
    {
      name: 'Aromatic Sandalwood Gift Set',
      slug: 'aromatic-sandalwood-gift-set',
      description: 'A curated collection of premium sandalwood products — incense sticks, a carved holder, and a small sandalwood sculpture. Presented in a signature Kraafto obsidian box.',
      price: 4200,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isHandcrafted: true,
      isEcoFriendly: true,
      materials: ['Mysore Sandalwood', 'Recycled Packaging'],
      inventory: 40,
      processingDays: 1,
      imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'gift-sets',
      occasionSlugs: ['birthday', 'thank-you', 'festive', 'housewarming'],
    },
    {
      name: 'Gold Leaf Serving Tray',
      slug: 'gold-leaf-serving-tray',
      description: 'Elevate your entertaining with our gilded brass serving tray. Features hand-engraved botanical motifs and a hammered texture that catches the light beautifully.',
      price: 18500,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isBestSeller: true,
      isHandcrafted: true,
      materials: ['Brass', '24K Gold Leaf', 'Hand-engraved'],
      inventory: 12,
      processingDays: 3,
      imageUrl: 'https://images.unsplash.com/photo-1585237885744-88abebaf2e02?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'dining',
      occasionSlugs: ['wedding', 'housewarming', 'anniversary'],
    },
    {
      name: 'Hand-blown Amber Vase',
      slug: 'hand-blown-amber-vase',
      description: 'A stunning statement piece for any room. This hand-blown amber glass vase features organic curves and warm, sun-kissed tones that glow in natural light.',
      story: 'Blown by master glassmakers in Murano, Italy — a tradition dating back to the 13th century. Each vase is unique; no two are ever exactly alike.',
      price: 24000,
      compareAtPrice: 28000,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isHandcrafted: true,
      isLimitedEdition: true,
      editionNumber: 42,
      editionTotal: 100,
      materials: ['Murano Glass', 'Hand-blown'],
      inventory: 8,
      lowStockThreshold: 10,
      processingDays: 5,
      imageUrl: 'https://images.unsplash.com/photo-1612152605347-f93296cb657d?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'vases',
      occasionSlugs: ['wedding', 'anniversary', 'housewarming'],
    },
    {
      name: 'Bronze Lotus Sculpture',
      slug: 'bronze-lotus-sculpture',
      description: 'A hand-cast bronze lotus sculpture, finished with a patinated surface that deepens with age. A symbol of purity and enlightenment for any space.',
      price: 38500,
      status: ProductStatus.ACTIVE,
      isHandcrafted: true,
      isLimitedEdition: true,
      editionNumber: 18,
      editionTotal: 50,
      materials: ['Bronze', 'Natural Patina'],
      inventory: 5,
      lowStockThreshold: 5,
      processingDays: 7,
      imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'home-decor',
      occasionSlugs: ['housewarming', 'anniversary', 'corporate'],
    },
    {
      name: 'Ceramic Moon Jar',
      slug: 'ceramic-moon-jar',
      description: 'Inspired by the Korean moon jars of the Joseon dynasty, this hand-thrown ceramic jar features a milky white glaze with subtle variations that make each piece unique.',
      price: 16800,
      status: ProductStatus.ACTIVE,
      isHandcrafted: true,
      isLimitedEdition: true,
      editionNumber: 7,
      editionTotal: 25,
      materials: ['Stoneware Clay', 'Ash Glaze'],
      inventory: 3,
      lowStockThreshold: 5,
      processingDays: 5,
      imageUrl: 'https://images.unsplash.com/photo-1610706249156-f643e2448408?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'vases',
      occasionSlugs: ['housewarming', 'birthday', 'anniversary'],
    },
    {
      name: 'Ivory Silk Kimono Robe',
      slug: 'ivory-silk-kimono-robe',
      description: 'Wrap yourself in pure luxury. Our mulberry silk kimono robe is lightweight, breathable, and finished with hand-embroidered cherry blossom motifs.',
      price: 52000,
      status: ProductStatus.ACTIVE,
      isHandcrafted: true,
      isLimitedEdition: true,
      editionNumber: 3,
      editionTotal: 12,
      materials: ['100% Mulberry Silk', 'Hand-embroidered'],
      inventory: 4,
      lowStockThreshold: 5,
      processingDays: 7,
      imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop',
      categorySlug: 'apparel',
      occasionSlugs: ['anniversary', 'birthday', 'wedding'],
    },
  ];

  for (const p of productData) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    const productOccasions = occasions.filter((o) =>
      (p.occasionSlugs ?? []).includes(o.slug)
    );

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        story: p.story ?? null,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        status: p.status,
        isFeatured: p.isFeatured ?? false,
        isBestSeller: p.isBestSeller ?? false,
        isHandcrafted: p.isHandcrafted ?? false,
        isLimitedEdition: p.isLimitedEdition ?? false,
        isEcoFriendly: p.isEcoFriendly ?? false,
        editionNumber: p.editionNumber ?? null,
        editionTotal: p.editionTotal ?? null,
        materials: p.materials,
        inventory: p.inventory,
        lowStockThreshold: p.lowStockThreshold ?? 5,
        processingDays: p.processingDays ?? 2,
        categories: category ? { connect: { id: category.id } } : undefined,
        occasions: productOccasions.length > 0
          ? { connect: productOccasions.map((o) => ({ id: o.id })) }
          : undefined,
        images: {
          create: {
            url: p.imageUrl,
            alt: p.name,
            position: 0,
            isMain: true,
          },
        },
      },
    });
    console.log(`  ✅ Product: ${product.name}`);
  }

  // ---------------------------------------------------------------------------
  // 5. Admin user (with properly hashed password)
  // ---------------------------------------------------------------------------
  const adminPasswordHash = await bcrypt.hash('Admin@Kraafto2026', 12);
  await prisma.user.upsert({
    where: { email: 'admin@kraafto.com' },
    update: {},
    create: {
      email: 'admin@kraafto.com',
      name: 'Kraafto Admin',
      role: Role.SUPER_ADMIN,
      passwordHash: adminPasswordHash,
    },
  });
  console.log('  ✅ Admin user: admin@kraafto.com / Admin@Kraafto2026');

  // ---------------------------------------------------------------------------
  // 6. Demo customer
  // ---------------------------------------------------------------------------
  const customerPasswordHash = await bcrypt.hash('Customer@123', 12);
  await prisma.user.upsert({
    where: { email: 'demo@kraafto.com' },
    update: {},
    create: {
      email: 'demo@kraafto.com',
      name: 'Demo Customer',
      role: Role.CUSTOMER,
      passwordHash: customerPasswordHash,
    },
  });
  console.log('  ✅ Demo customer: demo@kraafto.com / Customer@123');

  // ---------------------------------------------------------------------------
  // 7. Promo codes
  // ---------------------------------------------------------------------------
  await prisma.promoCode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderValue: 500,
      maxDiscount: 1000,
      usageLimit: 1000,
      perUserLimit: 1,
      isActive: true,
    },
  });

  await prisma.promoCode.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      discountType: DiscountType.FREE_SHIPPING,
      discountValue: 0,
      minOrderValue: 1000,
      usageLimit: 500,
      perUserLimit: 2,
      isActive: true,
    },
  });
  console.log('  ✅ Promo codes seeded');

  // ---------------------------------------------------------------------------
  // 8. Reviews / Testimonials
  // ---------------------------------------------------------------------------
  const demoUser = await prisma.user.findUnique({ where: { email: 'demo@kraafto.com' } });
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@kraafto.com' } });
  
  if (demoUser && adminUser) {
    const amberVase = await prisma.product.findUnique({ where: { slug: 'hand-blown-amber-vase' } });
    const goldTray = await prisma.product.findUnique({ where: { slug: 'gold-leaf-serving-tray' } });
    const obsidianLamp = await prisma.product.findUnique({ where: { slug: 'obsidian-table-lamp' } });

    if (amberVase && goldTray && obsidianLamp) {
      await prisma.review.upsert({
        where: { productId_userId: { productId: amberVase.id, userId: demoUser.id } },
        update: {},
        create: {
          product: { connect: { id: amberVase.id } },
          user: { connect: { id: demoUser.id } },
          rating: 5,
          title: 'Stunning Craftsmanship',
          body: 'The amber vase I gifted for my sister\'s wedding left everyone speechless. The craftsmanship is unparalleled.',
          isApproved: true,
          isVerified: true,
        }
      });
      
      await prisma.review.upsert({
        where: { productId_userId: { productId: goldTray.id, userId: adminUser.id } },
        update: {},
        create: {
          product: { connect: { id: goldTray.id } },
          user: { connect: { id: adminUser.id } },
          rating: 5,
          title: 'Premium Quality',
          body: 'Kraafto has completely transformed how I think about corporate gifting. The presentation is beyond premium.',
          isApproved: true,
          isVerified: true,
        }
      });

      // Create a 3rd user for the 3rd review
      let thirdUser = await prisma.user.findUnique({ where: { email: 'ananya@kraafto.com' } });
      if (!thirdUser) {
        thirdUser = await prisma.user.create({
          data: {
            email: 'ananya@kraafto.com',
            name: 'Ananya S.',
            role: Role.CUSTOMER,
            passwordHash: await bcrypt.hash('Customer@123', 12),
          }
        });
      }

      await prisma.review.upsert({
        where: { productId_userId: { productId: obsidianLamp.id, userId: thirdUser.id } },
        update: {},
        create: {
          product: { connect: { id: obsidianLamp.id } },
          user: { connect: { id: thirdUser.id } },
          rating: 5,
          title: 'A Conversation Starter',
          body: 'Every piece tells a story. The obsidian lamp is not just decor — it is a conversation starter in our living room.',
          isApproved: true,
          isVerified: true,
        }
      });

      console.log('  ✅ Reviews seeded');
    }
  }

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Credentials:');
  console.log('   Admin:    admin@kraafto.com / Admin@Kraafto2026');
  console.log('   Customer: demo@kraafto.com / Customer@123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

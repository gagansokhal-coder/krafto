# 🎁 Kraafto — Premium Gifting & Luxury Crafts

> **The Art of Gifting, Reimagined**

Kraafto is a premium eCommerce platform for handcrafted luxury gifts — designer lamps, glass decor, and artistic handmade items. Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Stripe/Razorpay account for payments

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed the database with sample data
npx prisma db seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📁 Project Structure

```
kraafto/
├── docs/                    # Project documentation
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth pages (login, register)
│   │   ├── account/         # User account pages
│   │   ├── admin/           # Admin panel
│   │   ├── api/             # API routes
│   │   ├── checkout/        # Checkout flow
│   │   ├── shop/            # Product listing & detail
│   │   └── ...
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components
│   │   ├── layout/          # Layout components
│   │   ├── cart/            # Cart components
│   │   └── ...
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & configs
│   └── types/               # TypeScript types
└── ...
```

---

## 🎨 Design System

Kraafto follows a luxury-focused design system with:

- **Colors:** Obsidian, Gold, Ivory, Sage, Burgundy
- **Typography:** Playfair Display (headings), Inter (body), Cormorant Garamond (accents)
- **Spacing:** 8px grid system
- **Animations:** Subtle, purposeful motion (200-800ms)

See [`docs/design.md`](./docs/design.md) for full design specifications.

---

## 🗄️ Database

Kraafto uses PostgreSQL with Prisma ORM. Key models:

- **User** — Customer accounts with roles (CUSTOMER, ADMIN, SUPER_ADMIN)
- **Product** — Products with images, variants, categories, occasions
- **Order** — Orders with items, gift options, payment status
- **Review** — Product reviews with ratings and images
- **GiftCard** — Digital gift cards
- **PromoCode** — Discount codes

Run migrations:
```bash
npx prisma migrate dev
```

View database in Prisma Studio:
```bash
npx prisma studio
```

---

## 🔐 Authentication

NextAuth.js with credentials provider. Admin routes require `ADMIN` or `SUPER_ADMIN` role.

**Default admin credentials (from seed):**
- Email: `admin@kraafto.com`
- Password: (set your own in `prisma/seed.ts`)

---

## 🛒 Key Features

- ✅ Product catalog with filtering, sorting, search
- ✅ Shopping cart with localStorage persistence
- ✅ Gift wrapping options with custom messages
- ✅ Occasion-based product recommendations
- ✅ User accounts with order history & wishlist
- ✅ Admin panel for products, orders, customers
- ✅ Responsive design (mobile-first)
- ✅ SEO-optimized with structured data
- ⏳ Payment integration (Stripe/Razorpay) — in progress
- ⏳ Email notifications — in progress

---

## 📚 Documentation

Comprehensive docs are in the [`docs/`](./docs/) folder:

- [Overview](./docs/overview.md) — Project vision & scope
- [Architecture](./docs/architecture.md) — Tech stack & system design
- [Database](./docs/database.md) — Schema & models
- [API](./docs/api.md) — API routes & endpoints
- [Design](./docs/design.md) — UI/UX specifications
- [Features](./docs/features.md) — Gifting-specific features
- [Pages](./docs/pages.md) — Page layouts & components

---

## 🧪 Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format with Prettier (if configured)
npm run format
```

---

## 🚢 Deployment

Recommended: **Vercel** (frontend) + **AWS RDS** or **Supabase** (database)

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

See [`docs/deployment.md`](./docs/deployment.md) for detailed instructions.

---

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the team.

---

## 📄 License

Proprietary. All rights reserved.

---

## 🎁 About Kraafto

Kraafto is a sanctuary for those who seek meaning in material — a bridge between the world's most exceptional artisans and the homes that will cherish their work for generations.

**Curating the Rare, Celebrating the Crafted.**

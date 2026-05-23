# 🏗️ Kraafto — Architecture & Tech Stack

---

## 1. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | Next.js 14+ (App Router) | SSR/SSG for SEO, React Server Components, Image optimization |
| **Styling** | Tailwind CSS v3 | Utility-first with custom design tokens, responsive, fast |
| **State Management** | Zustand | Lightweight, minimal boilerplate for cart/auth state |
| **Backend** | Node.js (Next.js API Routes) | Co-located with frontend, serverless-ready |
| **Database** | PostgreSQL | Relational data (products, orders, users), ACID compliance |
| **ORM** | Prisma | Type-safe queries, migrations, schema management |
| **Auth** | NextAuth.js | OAuth + credentials, session management |
| **Payments** | Stripe / Razorpay | Secure checkout, webhooks for order confirmation |
| **Image Storage** | Cloudinary / AWS S3 | Optimized delivery, transformations, CDN |
| **Email** | Resend / SendGrid | Transactional emails (order confirmation, shipping) |
| **Analytics** | Google Analytics 4 + Vercel Analytics | Traffic, conversion tracking |
| **Deployment** | Vercel (frontend) + AWS RDS (database) | Edge network, auto-scaling |

---

## 2. Project Structure

```
kraafto/
├── docs/                        # Project documentation
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # DB migrations
│   └── seed.ts                  # Seed data
├── public/
│   ├── images/                  # Static images
│   ├── fonts/                   # Self-hosted fonts
│   └── icons/                   # Favicon, PWA icons
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (store)/             # Public store routes
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx     # Product listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx # Product detail
│   │   │   ├── cart/
│   │   │   │   └── page.tsx     # Cart page
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx     # Checkout flow
│   │   │   ├── collections/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx # Collection page
│   │   │   └── gift-guides/
│   │   │       └── page.tsx     # Gift guide content
│   │   ├── (auth)/              # Auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── account/             # User account (protected)
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   └── settings/
│   │   ├── admin/               # Admin panel (protected)
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── inventory/
│   │   │   └── customers/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── cart/
│   │   │   ├── payments/
│   │   │   └── admin/
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── product/             # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   └── ProductFilters.tsx
│   │   ├── cart/                # Cart components
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── GiftOptions.tsx
│   │   ├── home/                # Homepage sections
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── FeaturedCollections.tsx
│   │   │   ├── GiftingSection.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Newsletter.tsx
│   │   └── admin/               # Admin components
│   │       ├── DataTable.tsx
│   │       ├── ProductForm.tsx
│   │       └── OrderDetails.tsx
│   ├── lib/                     # Utilities & configs
│   │   ├── db.ts                # Prisma client
│   │   ├── auth.ts              # Auth config
│   │   ├── stripe.ts            # Payment config
│   │   ├── email.ts             # Email service
│   │   ├── utils.ts             # Helpers
│   │   └── constants.ts         # App constants
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   ├── useIntersection.ts
│   │   └── useDebounce.ts
│   ├── store/                   # Zustand stores
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   ├── types/                   # TypeScript types
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── cart.ts
│   └── middleware.ts            # Auth middleware
├── .env.local                   # Environment variables
├── .env.example                 # Env template
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── package.json
└── README.md
```

---

## 3. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js Frontend (Vercel)                │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │    │
│  │  │ SSR/SSG  │ │  React   │ │  Tailwind CSS     │   │    │
│  │  │  Pages   │ │Components│ │  Design System    │   │    │
│  │  └──────────┘ └──────────┘ └───────────────────┘   │    │
│  │  ┌──────────┐ ┌──────────┐                          │    │
│  │  │ Zustand  │ │NextAuth  │                          │    │
│  │  │  Store   │ │ Session  │                          │    │
│  │  └──────────┘ └──────────┘                          │    │
│  └─────────────────────┬───────────────────────────────┘    │
└────────────────────────┼────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────┼────────────────────────────────────┐
│                    SERVER                                     │
│  ┌─────────────────────┴───────────────────────────────┐    │
│  │           Next.js API Routes (Serverless)            │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │    │
│  │  │ Product  │ │  Order   │ │   Payment         │   │    │
│  │  │  APIs    │ │  APIs    │ │   Webhooks        │   │    │
│  │  └────┬─────┘ └────┬─────┘ └─────────┬─────────┘   │    │
│  │       │             │                  │              │    │
│  │  ┌────┴─────────────┴──────────────────┴──────┐      │    │
│  │  │              Prisma ORM                     │      │    │
│  │  └────────────────────┬───────────────────────┘      │    │
│  └───────────────────────┼──────────────────────────────┘    │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    SERVICES                                   │
│  ┌───────────┐  ┌────────┴──────┐  ┌─────────────────────┐  │
│  │ PostgreSQL│  │  Cloudinary   │  │   Stripe/Razorpay   │  │
│  │  (AWS RDS)│  │  (Images)     │  │   (Payments)        │  │
│  └───────────┘  └───────────────┘  └─────────────────────┘  │
│  ┌───────────┐  ┌───────────────┐  ┌─────────────────────┐  │
│  │  Resend   │  │   GA4         │  │   Redis (optional)  │  │
│  │  (Email)  │  │  (Analytics)  │  │   (Cache/Sessions)  │  │
│  └───────────┘  └───────────────┘  └─────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow

### Product Browse Flow
```
User → Homepage (SSG) → Collection Page (SSG) → Product Page (SSR)
                                                       ↓
                                                 Add to Cart
                                                       ↓
                                              Zustand Store (client)
                                                       ↓
                                                 Cart Page
                                                       ↓
                                              Checkout Page
                                                       ↓
                                        API Route → Stripe → Webhook
                                                       ↓
                                              Order in PostgreSQL
                                                       ↓
                                           Email Confirmation (Resend)
```

### Image Delivery Flow
```
Admin uploads image → Cloudinary (transforms + CDN)
                          ↓
                    Next.js <Image> component
                          ↓
                    Auto WebP/AVIF + blur placeholder
                          ↓
                    Lazy loaded, responsive srcSet
```

---

## 5. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/kraafto

# Auth
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=https://kraafto.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Image Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=
```

---

## 6. Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "zustand": "^4.4.0",
    "stripe": "^14.0.0",
    "resend": "^2.0.0",
    "lucide-react": "^0.300.0",
    "framer-motion": "^10.0.0",
    "clsx": "^2.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 7. Rendering Strategy

| Page | Strategy | Reason |
|------|----------|--------|
| Homepage | SSG + ISR (60s) | Fast load, content updates periodically |
| Product Listing | SSG + ISR (60s) | SEO, filters handled client-side |
| Product Detail | SSR | Dynamic stock status, personalized recommendations |
| Cart | CSR | Fully client-side, no SEO needed |
| Checkout | CSR | Secure, dynamic, no indexing |
| Account | CSR (Protected) | User-specific data |
| Admin | CSR (Protected) | Internal tool |
| Gift Guides | SSG | Content pages, maximum SEO |

> **Architecture Goal:** Keep the frontend serverless-ready, leverage edge caching for static pages, and use server-side rendering only where real-time data is essential.

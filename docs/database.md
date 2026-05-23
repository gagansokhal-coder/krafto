# 🗄️ Kraafto — Database Schema & Models

---

## 1. Database Overview

| Property | Value |
|----------|-------|
| **Engine** | PostgreSQL 15+ |
| **ORM** | Prisma |
| **Hosting** | AWS RDS (prod), Docker (local) |
| **IDs** | UUID (cuid) for all primary keys |
| **Timestamps** | `created_at`, `updated_at` on all tables |
| **Soft Delete** | `deleted_at` nullable timestamp where applicable |

---

## 2. Entity Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│   User   │──1:N──│    Order     │──1:N──│  OrderItem   │
└──────────┘       └──────────────┘       └──────────────┘
     │                                           │N:1
     │1:N                                        ▼
     ▼                                    ┌──────────────┐
┌──────────┐                              │   Product    │
│ Address  │                              └──────────────┘
└──────────┘                                │         │
                                            │1:N      │N:M
                                            ▼         ▼
                                     ┌──────────┐ ┌──────────┐
                                     │ Variant  │ │ Category │
                                     └──────────┘ └──────────┘
```

---

## 3. Core Models

### 3.1 User

| Column | Type | Notes |
|--------|------|-------|
| `id` | String (cuid) | Primary key |
| `email` | String | Unique |
| `name` | String? | Display name |
| `phone` | String? | Contact |
| `passwordHash` | String? | Nullable for OAuth users |
| `emailVerified` | DateTime? | Verification timestamp |
| `image` | String? | Avatar URL |
| `role` | Enum | `CUSTOMER`, `ADMIN`, `SUPER_ADMIN` |

**Relations:** `addresses[]`, `orders[]`, `wishlist[]`, `reviews[]`, `giftCards[]`, `accounts[]`, `sessions[]`

### 3.2 Address

| Column | Type | Notes |
|--------|------|-------|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK → User |
| `fullName` | String | Recipient name |
| `phone` | String | Contact |
| `line1`, `line2` | String | Address lines |
| `city`, `state`, `pincode` | String | Location |
| `country` | String | Default: "India" |
| `isDefault` | Boolean | Default address flag |
| `label` | String? | "Home", "Office" |

### 3.3 Product

| Column | Type | Notes |
|--------|------|-------|
| `id` | String (cuid) | Primary key |
| `name` | String | Product name |
| `slug` | String | Unique, URL-friendly |
| `description` | Text | Full description |
| `story` | Text? | Craftsmanship narrative |
| `price` | Decimal(10,2) | Current price |
| `compareAtPrice` | Decimal? | Strike-through price |
| `costPrice` | Decimal? | For margin tracking |
| `sku` | String? | Unique SKU |
| `status` | Enum | `DRAFT`, `ACTIVE`, `ARCHIVED`, `OUT_OF_STOCK` |
| `isFeatured` | Boolean | Homepage featured |
| `isHandcrafted` | Boolean | Handcrafted badge |
| `isLimitedEdition` | Boolean | Limited edition badge |
| `isBestSeller` | Boolean | Best seller badge |
| `isEcoFriendly` | Boolean | Eco badge |
| `editionNumber` / `editionTotal` | Int? | "Edition 42 of 100" |
| `materials` | String[] | Material list |
| `inventory` | Int | Stock count |
| `lowStockThreshold` | Int | Default: 5 |
| `processingDays` | Int | Default: 2 |
| `madeToOrder` | Boolean | Made-to-order flag |
| `metaTitle` / `metaDescription` | String? | SEO fields |

**Relations:** `categories[]`, `tags[]`, `occasions[]`, `images[]`, `variants[]`, `reviews[]`, `orderItems[]`

**Indexes:** `(status, isFeatured)`, `(slug)`, `(price)`, `(createdAt)`

### 3.4 ProductImage

| Column | Type | Notes |
|--------|------|-------|
| `url` | String | Cloudinary/S3 URL |
| `alt` | String? | Alt text |
| `position` | Int | Sort order |
| `isMain` | Boolean | Primary display image |
| `width` / `height` | Int? | Dimensions |

### 3.5 ProductVariant

| Column | Type | Notes |
|--------|------|-------|
| `name` | String | e.g., "Large / Blue" |
| `sku` | String? | Unique variant SKU |
| `price` | Decimal? | Override product price |
| `inventory` | Int | Variant-level stock |
| `attributes` | Json | `{ "size": "Large", "color": "Blue" }` |

### 3.6 Category (Self-referential tree)

| Column | Type | Notes |
|--------|------|-------|
| `name` | String | Category name |
| `slug` | String | Unique, URL-friendly |
| `parentId` | String? | FK → Category (self) |
| `image` | String? | Category image |
| `position` | Int | Sort order |

### 3.7 Tag & Occasion

- **Tag:** Simple `name` + `slug` with many-to-many product relation
- **Occasion:** `name`, `slug`, `icon` (emoji), `description` with many-to-many product relation
- Join tables: `categories_on_products`, `tags_on_products`, `occasions_on_products`

---

## 4. Order Models

### 4.1 Order

| Column | Type | Notes |
|--------|------|-------|
| `orderNumber` | String | Unique, e.g., `KRF-20260501-001` |
| `userId` | String? | FK → User (nullable for guest) |
| `status` | Enum | `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED` |
| `paymentStatus` | Enum | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| `email` / `phone` | String | Contact info |
| `shippingMethod` | Enum | `STANDARD` (5-7 days), `EXPRESS` (2-3 days) |
| `shippingCost` | Decimal | Shipping fee |
| `subtotal` | Decimal | Before fees |
| `giftWrapTotal` | Decimal | Gift wrapping fees |
| `discountTotal` | Decimal | Promo discounts |
| `grandTotal` | Decimal | Final amount |
| `paymentIntentId` | String? | Stripe/Razorpay reference |
| `trackingNumber` / `trackingUrl` | String? | Shipment tracking |

### 4.2 OrderItem

| Column | Type | Notes |
|--------|------|-------|
| `orderId` | String | FK → Order |
| `productId` | String | FK → Product |
| `variantId` | String? | FK → ProductVariant |
| `name` | String | Snapshot at purchase time |
| `quantity` | Int | Item count |
| `unitPrice` / `totalPrice` | Decimal | Price snapshot |
| `isGift` | Boolean | Gift toggle |

### 4.3 GiftOption (1:1 with OrderItem)

| Column | Type | Notes |
|--------|------|-------|
| `orderItemId` | String | Unique FK → OrderItem |
| `wrapStyle` | Enum | `CLASSIC_GOLD`, `BOTANICAL`, `LUXURY_BOX`, `ECO_WRAP` |
| `wrapPrice` | Decimal | Wrapping fee |
| `message` | VarChar(200) | Custom gift message |
| `recipientName` | String? | Name on gift tag |
| `hidePricing` | Boolean | Hide price from package |

---

## 5. Supporting Models

### Review
- `productId` + `userId` (unique combo — one review per user per product)
- `rating` (1-5), `title`, `body`, `images[]`
- `isVerified` (purchase verified), `isApproved` (admin moderated)
- `helpfulCount` for upvotes

### GiftCard
- `code` (unique redeemable), `initialBalance`, `balance`
- `recipientEmail`, `recipientName`, `message`
- `deliverAt` (scheduled delivery), `expiresAt`

### PromoCode
- `code`, `discountType` (`PERCENTAGE`, `FLAT`, `FREE_SHIPPING`)
- `discountValue`, `minOrderValue`, `maxDiscount`
- `usageLimit`, `usageCount`, `perUserLimit`
- `startsAt`, `expiresAt`

### WishlistItem
- `userId` + `productId` (unique combo)

---

## 6. Auth Models (NextAuth.js)

Standard NextAuth models: `Account`, `Session`, `VerificationToken` — mapped to `accounts`, `sessions`, `verification_tokens` tables.

---

## 7. Indexes & Performance

| Table | Index | Purpose |
|-------|-------|---------|
| `products` | `(status, isFeatured)` | Featured product queries |
| `products` | `(slug)` | URL-based lookups |
| `products` | `(price)` | Price range filtering |
| `orders` | `(userId, status)` | User order history |
| `orders` | `(orderNumber)` | Order lookup |
| `reviews` | `(productId, isApproved)` | Approved reviews |
| `product_images` | `(productId, position)` | Ordered gallery |

**Full-text search:** GIN index on `products` for `name || description`.

---

## 8. Migration Strategy

| Phase | Command |
|-------|---------|
| **Development** | `prisma migrate dev` |
| **Staging/Production** | `prisma migrate deploy` via CI/CD |
| **Seeding** | `prisma db seed` for test data |

> **Database Rule:** Every query must use an index. New query patterns require a corresponding index in the same migration.

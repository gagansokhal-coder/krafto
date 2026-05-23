# 🔌 Kraafto — API Routes & Endpoints

---

## 1. API Overview

| Property | Value |
|----------|-------|
| **Framework** | Next.js API Routes (App Router) |
| **Base URL** | `/api` |
| **Format** | JSON (request & response) |
| **Auth** | NextAuth.js session tokens + JWT |
| **Validation** | Zod schemas |
| **Error Format** | `{ error: string, code: string, details?: any }` |

### HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Success |
| `201` | Resource created |
| `400` | Validation error |
| `401` | Unauthorized |
| `403` | Forbidden (role mismatch) |
| `404` | Not found |
| `409` | Conflict (duplicate) |
| `500` | Server error |

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
Create a new customer account.

| Field | Type | Required |
|-------|------|----------|
| `name` | string | ✅ |
| `email` | string | ✅ |
| `password` | string (8+ chars) | ✅ |
| `phone` | string | ❌ |

**Response:** `201` — `{ user: { id, name, email } }`

### `POST /api/auth/login`
Handled by NextAuth.js credentials provider.

### `GET /api/auth/session`
Returns current session (NextAuth built-in).

### `POST /api/auth/forgot-password`
Send password reset email.

### `POST /api/auth/reset-password`
Reset password with token.

---

## 3. Product Endpoints

### `GET /api/products`
List products with filtering, sorting, and pagination.

**Query Parameters:**

| Param | Type | Example |
|-------|------|---------|
| `page` | number | `1` |
| `limit` | number | `12` |
| `category` | string | `designer-lamps` |
| `occasion` | string | `birthday` |
| `minPrice` | number | `500` |
| `maxPrice` | number | `5000` |
| `material` | string (csv) | `glass,metal` |
| `tag` | string | `limited-edition` |
| `sort` | string | `price_asc`, `price_desc`, `newest`, `featured` |
| `search` | string | `blue lamp` |
| `inStock` | boolean | `true` |

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

### `GET /api/products/[slug]`
Get single product with full details, images, variants, reviews.

### `GET /api/products/featured`
Get featured products for homepage sections.

### `GET /api/products/[slug]/reviews`
Get paginated reviews for a product.

### `POST /api/products/[slug]/reviews` 🔒
Submit a review (authenticated users only).

| Field | Type | Required |
|-------|------|----------|
| `rating` | number (1-5) | ✅ |
| `title` | string | ❌ |
| `body` | string | ❌ |
| `images` | string[] | ❌ |

---

## 4. Category & Collection Endpoints

### `GET /api/categories`
List all active categories with product counts.

### `GET /api/categories/[slug]`
Get category details + products.

### `GET /api/occasions`
List all occasions with icons.

### `GET /api/collections/[slug]`
Get curated collection page data.

---

## 5. Cart Endpoints

> Cart is primarily managed client-side via Zustand. These endpoints sync server-side for checkout.

### `POST /api/cart/validate`
Validate cart items (stock check, price verification) before checkout.

```json
// Request
{
  "items": [
    { "productId": "...", "variantId": "...", "quantity": 2 }
  ]
}
// Response
{
  "valid": true,
  "items": [...],  // With current prices & stock status
  "adjustments": [] // Any price/stock changes
}
```

---

## 6. Order Endpoints

### `POST /api/orders` 🔒
Create a new order from checkout.

```json
{
  "items": [
    {
      "productId": "...",
      "variantId": "...",
      "quantity": 1,
      "isGift": true,
      "giftOption": {
        "wrapStyle": "CLASSIC_GOLD",
        "message": "Happy Birthday!",
        "recipientName": "Jane",
        "hidePricing": true
      }
    }
  ],
  "shippingAddressId": "...",
  "shippingMethod": "STANDARD",
  "promoCode": "GIFT10",
  "email": "customer@email.com",
  "phone": "+91-9876543210"
}
```

**Response:** `201` — `{ order: { id, orderNumber, grandTotal }, paymentIntent: { clientSecret } }`

### `GET /api/orders` 🔒
List user's orders (paginated).

### `GET /api/orders/[id]` 🔒
Get order details with items, gift options, tracking.

### `POST /api/orders/[id]/cancel` 🔒
Cancel a pending/confirmed order.

---

## 7. Payment Endpoints

### `POST /api/payments/create-intent`
Create Stripe PaymentIntent or Razorpay order.

### `POST /api/payments/webhook`
Handle payment provider webhooks (Stripe/Razorpay).

**Events handled:**
- `payment_intent.succeeded` → Update order to CONFIRMED
- `payment_intent.payment_failed` → Update order to FAILED
- `charge.refunded` → Update order to REFUNDED

### `POST /api/payments/verify`
Verify payment on client-side return (Razorpay signature verification).

---

## 8. User Account Endpoints

### `GET /api/user/profile` 🔒
Get current user profile.

### `PATCH /api/user/profile` 🔒
Update name, phone, image.

### `POST /api/user/change-password` 🔒
Change password (requires current password).

### `GET /api/user/addresses` 🔒
List saved addresses.

### `POST /api/user/addresses` 🔒
Add new address.

### `PATCH /api/user/addresses/[id]` 🔒
Update address.

### `DELETE /api/user/addresses/[id]` 🔒
Delete address.

---

## 9. Wishlist Endpoints

### `GET /api/wishlist` 🔒
Get user's wishlist items.

### `POST /api/wishlist` 🔒
Add product to wishlist: `{ productId: "..." }`

### `DELETE /api/wishlist/[productId]` 🔒
Remove from wishlist.

---

## 10. Gift Card Endpoints

### `POST /api/gift-cards/purchase` 🔒
Purchase a gift card.

| Field | Type | Required |
|-------|------|----------|
| `amount` | number | ✅ |
| `recipientEmail` | string | ✅ |
| `recipientName` | string | ❌ |
| `message` | string | ❌ |
| `deliverAt` | datetime | ✅ |

### `POST /api/gift-cards/redeem`
Redeem gift card code at checkout: `{ code: "..." }`

### `GET /api/gift-cards/balance`
Check gift card balance: `?code=XXXX`

---

## 11. Admin Endpoints 🔒🛡️

> All admin endpoints require `role: ADMIN` or `SUPER_ADMIN`.

### Products
| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/api/admin/products` | List all products (inc. drafts) |
| `POST` | `/api/admin/products` | Create product |
| `PATCH` | `/api/admin/products/[id]` | Update product |
| `DELETE` | `/api/admin/products/[id]` | Soft-delete product |
| `POST` | `/api/admin/products/[id]/images` | Upload images |
| `PATCH` | `/api/admin/products/[id]/inventory` | Update stock |

### Orders
| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/api/admin/orders` | List orders (filterable) |
| `GET` | `/api/admin/orders/[id]` | Order details |
| `PATCH` | `/api/admin/orders/[id]/status` | Update status |
| `POST` | `/api/admin/orders/[id]/tracking` | Add tracking info |

### Dashboard
| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/api/admin/dashboard/stats` | Revenue, order counts |
| `GET` | `/api/admin/dashboard/chart` | Sales trend data |
| `GET` | `/api/admin/dashboard/alerts` | Low stock, pending orders |

### Customers
| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/api/admin/customers` | Customer list |
| `GET` | `/api/admin/customers/[id]` | Customer detail + orders |

### Reviews
| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/api/admin/reviews` | Pending reviews |
| `PATCH` | `/api/admin/reviews/[id]` | Approve/reject review |

---

## 12. Search & Misc

### `GET /api/search?q=...`
Full-text search across products: returns matching products with highlighted snippets.

### `GET /api/newsletter/subscribe`
Subscribe to newsletter: `{ email: "..." }`

### `POST /api/contact`
Submit contact form: `{ name, email, subject, message }`

### `GET /api/corporate-inquiry`
Submit corporate gifting inquiry form.

---

## 13. Rate Limiting

| Endpoint Group | Limit |
|----------------|-------|
| Auth endpoints | 5 req/min per IP |
| Public API | 60 req/min per IP |
| Authenticated API | 120 req/min per user |
| Admin API | 300 req/min per user |
| Webhooks | No limit (verified) |

> **API Principle:** Every endpoint returns consistent error shapes, uses Zod validation, and logs requests for debugging. Public product data is aggressively cached via ISR.

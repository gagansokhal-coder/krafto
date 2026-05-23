# 🏗️ Kraafto System Architecture - Complete Integration

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Homepage   │  │  Shop Page   │  │ Product Page │         │
│  │              │  │              │  │              │         │
│  │ • Featured   │  │ • All        │  │ • Details    │         │
│  │ • Best       │  │   Products   │  │ • Reviews    │         │
│  │   Sellers    │  │ • Filters    │  │ • Add to     │         │
│  │ • Limited    │  │ • Search     │  │   Cart       │         │
│  │   Editions   │  │              │  │              │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
│                            ▼                                     │
│         ┌──────────────────────────────────────┐                │
│         │         Cart (Zustand Store)          │                │
│         │  • Add/Remove Items                   │                │
│         │  • Update Quantities                  │                │
│         │  • Apply Promo Code                   │                │
│         └──────────────┬───────────────────────┘                │
│                        │                                         │
│                        ▼                                         │
│         ┌──────────────────────────────────────┐                │
│         │         Checkout Page                 │                │
│         │  • Validate Cart                      │                │
│         │  • Validate Promo Code                │                │
│         │  • Create Order                       │                │
│         └──────────────┬───────────────────────┘                │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ API Calls
                         │
┌────────────────────────┼─────────────────────────────────────────┐
│                        ▼          API ROUTES                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PUBLIC ENDPOINTS                                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ GET  /api/products              → List products            │ │
│  │ GET  /api/products/featured     → Featured products        │ │
│  │ GET  /api/products/{slug}       → Single product           │ │
│  │ POST /api/promo-codes/validate  → Validate promo code ✨   │ │
│  │ POST /api/cart/validate         → Validate cart items      │ │
│  │ POST /api/orders                → Create order ✨          │ │
│  │                                   • Validate stock          │ │
│  │                                   • Validate promo          │ │
│  │                                   • Decrement inventory     │ │
│  │                                   • Increment promo usage   │ │
│  │ GET  /api/orders                → User's orders            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ADMIN ENDPOINTS (Require ADMIN/SUPER_ADMIN role)               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Products Management                                         │ │
│  │ ├─ GET    /api/admin/products           → List all         │ │
│  │ ├─ POST   /api/admin/products           → Create           │ │
│  │ ├─ GET    /api/admin/products/{id}      → Get one ✨       │ │
│  │ ├─ PATCH  /api/admin/products/{id}      → Update ✨        │ │
│  │ └─ DELETE /api/admin/products/{id}      → Soft delete ✨   │ │
│  │                                                              │ │
│  │ Orders Management                                            │ │
│  │ ├─ GET   /api/admin/orders              → List all         │ │
│  │ ├─ GET   /api/admin/orders/{id}         → Get one          │ │
│  │ └─ PATCH /api/admin/orders/{id}/status  → Update status ✨ │ │
│  │                                                              │ │
│  │ Promo Codes                                                  │ │
│  │ ├─ GET   /api/admin/promo-codes         → List all         │ │
│  │ └─ POST  /api/admin/promo-codes         → Create           │ │
│  │                                                              │ │
│  │ Sales & Promotions                                           │ │
│  │ ├─ GET   /api/admin/sales               → List all         │ │
│  │ └─ POST  /api/admin/sales               → Create           │ │
│  │                                                              │ │
│  │ Inventory                                                    │ │
│  │ ├─ GET   /api/admin/inventory           → Stock levels     │ │
│  │ └─ PATCH /api/admin/inventory/{id}      → Update stock     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│                        │                                         │
│                        ▼                                         │
│         ┌──────────────────────────────────────┐                │
│         │      Prisma ORM (Type-safe)          │                │
│         │  • Query builder                      │                │
│         │  • Migrations                         │                │
│         │  • Transactions                       │                │
│         └──────────────┬───────────────────────┘                │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ SQL Queries
                         │
┌────────────────────────┼─────────────────────────────────────────┐
│                        ▼         DATABASE                         │
├─────────────────────────────────────────────────────────────────┤
│                   PostgreSQL Database                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Products   │  │    Orders    │  │    Users     │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ • id         │  │ • id         │  │ • id         │         │
│  │ • name       │  │ • orderNumber│  │ • email      │         │
│  │ • price      │  │ • userId     │  │ • name       │         │
│  │ • inventory ✨│  │ • status     │  │ • role       │         │
│  │ • stock     ✨│  │ • grandTotal │  │ • orders     │         │
│  │ • status     │  │ • items      │  │              │         │
│  │ • isFeatured │  │              │  │              │         │
│  │ • badges     │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ OrderItems   │  │ PromoCodes   │  │   Reviews    │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ • orderId    │  │ • code       │  │ • productId  │         │
│  │ • productId  │  │ • discount   │  │ • userId     │         │
│  │ • quantity   │  │ • usageCount✨│  │ • rating     │         │
│  │ • unitPrice  │  │ • usageLimit │  │ • isApproved │         │
│  │ • isGift     │  │ • validUntil │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Customer Places Order

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Browse & Add to Cart                                    │
└─────────────────────────────────────────────────────────────────┘
   Customer visits homepage
   ↓
   GET /api/products/featured
   ↓
   Database returns: [Product A, Product B, Product C]
   ↓
   Customer clicks "Add to Cart" on Product A
   ↓
   Zustand store updates (client-side)
   cart = [{ productId: "A", quantity: 2 }]

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Apply Promo Code                                        │
└─────────────────────────────────────────────────────────────────┘
   Customer enters "GIFT10"
   ↓
   POST /api/promo-codes/validate
   Body: { code: "GIFT10", subtotal: 5000 }
   ↓
   Database checks:
   • Code exists? ✓
   • Is active? ✓
   • Not expired? ✓
   • Usage limit not reached? ✓ (5/100)
   • Min order met? ✓ (₹5000 >= ₹2000)
   ↓
   Returns: { valid: true, discountAmount: 500 }
   ↓
   UI shows: "Promo code applied! You save ₹500"

┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Checkout & Create Order                                 │
└─────────────────────────────────────────────────────────────────┘
   Customer clicks "Place Order"
   ↓
   POST /api/orders
   Body: {
     items: [{ productId: "A", quantity: 2 }],
     promoCode: "GIFT10",
     email: "customer@example.com",
     phone: "+91-9876543210"
   }
   ↓
   ┌─────────────────────────────────────────────────────────────┐
   │ API VALIDATION                                               │
   ├─────────────────────────────────────────────────────────────┤
   │ 1. Fetch product from database                              │
   │    Product A: price=₹2500, inventory=50                     │
   │                                                              │
   │ 2. Check stock availability                                 │
   │    50 >= 2? ✓ OK                                            │
   │                                                              │
   │ 3. Validate promo code again (security)                     │
   │    GIFT10: active, not expired, usage 5/100 ✓ OK           │
   │                                                              │
   │ 4. Calculate totals                                         │
   │    Subtotal: ₹2500 × 2 = ₹5000                             │
   │    Shipping: ₹0 (free over ₹2000)                          │
   │    Discount: ₹500 (10% off)                                │
   │    Grand Total: ₹4500                                       │
   └─────────────────────────────────────────────────────────────┘
   ↓
   ┌─────────────────────────────────────────────────────────────┐
   │ DATABASE TRANSACTION (Atomic)                                │
   ├─────────────────────────────────────────────────────────────┤
   │ BEGIN TRANSACTION                                            │
   │                                                              │
   │ 1. Create Order                                              │
   │    INSERT INTO orders (                                      │
   │      orderNumber: "KRF-12345678",                           │
   │      userId: "user_abc",                                     │
   │      subtotal: 5000,                                         │
   │      discountTotal: 500,                                     │
   │      grandTotal: 4500,                                       │
   │      status: "PENDING"                                       │
   │    )                                                         │
   │                                                              │
   │ 2. Create Order Items                                        │
   │    INSERT INTO order_items (                                 │
   │      orderId: "order_789",                                   │
   │      productId: "A",                                         │
   │      quantity: 2,                                            │
   │      unitPrice: 2500,                                        │
   │      totalPrice: 5000                                        │
   │    )                                                         │
   │                                                              │
   │ 3. Decrement Inventory ✨                                    │
   │    UPDATE products                                           │
   │    SET inventory = inventory - 2,                            │
   │        stock = stock - 2                                     │
   │    WHERE id = "A"                                            │
   │    Result: 50 → 48                                           │
   │                                                              │
   │ 4. Increment Promo Usage ✨                                  │
   │    UPDATE promo_codes                                        │
   │    SET usageCount = usageCount + 1                           │
   │    WHERE code = "GIFT10"                                     │
   │    Result: 5 → 6                                             │
   │                                                              │
   │ COMMIT TRANSACTION                                           │
   └─────────────────────────────────────────────────────────────┘
   ↓
   Returns: {
     order: {
       id: "order_789",
       orderNumber: "KRF-12345678",
       grandTotal: 4500
     }
   }
   ↓
   Customer sees: "Order placed successfully! Order #KRF-12345678"

┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Order Visibility                                        │
└─────────────────────────────────────────────────────────────────┘
   Customer visits /account/orders
   ↓
   GET /api/orders (authenticated)
   ↓
   Database returns all orders for user
   ↓
   Customer sees: Order #KRF-12345678, Status: PENDING, Total: ₹4500

   Admin visits /admin/orders
   ↓
   Fetches all orders from database
   ↓
   Admin sees: All customer orders including this one
```

---

## Data Flow: Admin Edits Product

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: View Products                                           │
└─────────────────────────────────────────────────────────────────┘
   Admin visits /admin/products
   ↓
   GET /api/admin/products
   ↓
   Database returns all products (including drafts)
   ↓
   Admin sees table with all products

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Click Edit Button                                       │
└─────────────────────────────────────────────────────────────────┘
   Admin clicks edit icon (pencil) on Product A
   ↓
   GET /api/admin/products/A
   ↓
   Database returns complete product:
   {
     id: "A",
     name: "Amber Vase",
     price: 12500,
     inventory: 48,
     status: "ACTIVE",
     isFeatured: false,
     isHandcrafted: true,
     ...
   }
   ↓
   Modal opens with form pre-filled

┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Make Changes                                            │
└─────────────────────────────────────────────────────────────────┘
   Admin changes:
   • Price: ₹12,500 → ₹10,000
   • Inventory: 48 → 100
   • Status: ACTIVE (no change)
   • isFeatured: false → true ✓
   • isBestSeller: false → true ✓

┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Save Changes                                            │
└─────────────────────────────────────────────────────────────────┘
   Admin clicks "Update Product"
   ↓
   PATCH /api/admin/products/A
   Body: {
     price: 10000,
     inventory: 100,
     isFeatured: true,
     isBestSeller: true
   }
   ↓
   ┌─────────────────────────────────────────────────────────────┐
   │ API VALIDATION                                               │
   ├─────────────────────────────────────────────────────────────┤
   │ 1. Check admin role ✓                                       │
   │ 2. Check product exists ✓                                   │
   │ 3. Validate data types ✓                                    │
   └─────────────────────────────────────────────────────────────┘
   ↓
   UPDATE products
   SET 
     price = 10000,
     inventory = 100,
     stock = 100,
     isFeatured = true,
     isBestSeller = true,
     updatedAt = NOW()
   WHERE id = "A"
   ↓
   Returns: { product: { ...updated data } }
   ↓
   Modal closes, product list refreshes

┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Changes Visible Everywhere                              │
└─────────────────────────────────────────────────────────────────┘
   Admin panel:
   • Product list shows new price ₹10,000
   • Inventory shows 100
   • Featured badge visible

   Frontend (customer view):
   • Homepage featured section shows Product A
   • Price displays ₹10,000
   • "Best Seller" badge visible
   • "Featured" badge visible

   All changes propagate immediately (no cache)
```

---

## Database State Changes

### Before Order:
```sql
-- products table
id: "A"
name: "Amber Vase"
price: 2500
inventory: 50
stock: 50

-- promo_codes table
id: "promo_1"
code: "GIFT10"
usageCount: 5
usageLimit: 100

-- orders table
(no order yet)
```

### After Order:
```sql
-- products table
id: "A"
name: "Amber Vase"
price: 2500
inventory: 48  ← DECREMENTED
stock: 48      ← DECREMENTED

-- promo_codes table
id: "promo_1"
code: "GIFT10"
usageCount: 6  ← INCREMENTED
usageLimit: 100

-- orders table (NEW)
id: "order_789"
orderNumber: "KRF-12345678"
userId: "user_abc"
subtotal: 5000
discountTotal: 500
grandTotal: 4500
status: "PENDING"
paymentStatus: "PENDING"

-- order_items table (NEW)
id: "item_xyz"
orderId: "order_789"
productId: "A"
quantity: 2
unitPrice: 2500
totalPrice: 5000
```

### After Admin Edit:
```sql
-- products table
id: "A"
name: "Amber Vase"
price: 10000      ← UPDATED
inventory: 100    ← UPDATED
stock: 100        ← UPDATED
isFeatured: true  ← UPDATED
isBestSeller: true ← UPDATED
updatedAt: "2026-05-07T..." ← UPDATED
```

---

## Key Features

### ✅ Transaction Safety
- All order operations in single transaction
- If any step fails, entire operation rolls back
- Prevents partial updates

### ✅ Stock Validation
- Checks availability before order creation
- Prevents overselling
- Returns clear error messages

### ✅ Promo Code Security
- Validates on both client and server
- Checks expiry, limits, minimum order
- Tracks usage count
- Prevents abuse

### ✅ Real-time Updates
- No caching on API routes
- Changes visible immediately
- Admin and customer see same data

### ✅ Soft Deletes
- Products never hard-deleted
- Preserves order history
- Can be restored if needed

### ✅ Role-based Access
- Admin endpoints require authentication
- Role checked on every request
- Customers can't access admin APIs

---

## Summary

**The system is now a complete, working e-commerce platform with:**

✅ Product catalog management  
✅ Shopping cart functionality  
✅ Promo code system  
✅ Order processing  
✅ Inventory management  
✅ Admin panel  
✅ Customer accounts  
✅ Real-time data synchronization  

**All components are properly connected and working together!** 🎉

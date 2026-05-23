# 🛡️ Kraafto — Admin Panel Documentation

---

## Overview

The Kraafto admin panel is a comprehensive management system for the entire e-commerce platform. It provides administrators with full control over products, orders, customers, inventory, promotions, and more.

**Access:** `/admin` (requires ADMIN or SUPER_ADMIN role)

---

## Admin Panel Features

### 1. Dashboard (`/admin`)

The main dashboard provides a comprehensive overview of store performance:

#### Key Metrics
- **Total Revenue:** Aggregate revenue from all paid orders
- **Total Orders:** Count of all orders with average order value
- **Customers:** Total registered customer count
- **Products:** Active products vs total products

#### Visual Analytics
- **Revenue Trend Chart:** Last 6 months revenue visualization
- **Low Stock Alerts:** Real-time inventory warnings
- **Recent Orders:** Latest 5 orders with status
- **Top Selling Products:** Best performers by revenue

#### Quick Actions
- Add new product
- Create promo codes
- Manage sales & offers
- View analytics

---

### 2. Products Management (`/admin/products`)

Complete product catalog management with CRUD operations.

#### Features
- **Product Listing:** Searchable, sortable, paginated table
- **Add/Edit Products:**
  - Basic info (name, slug, description, story)
  - Pricing (price, compare-at price, cost)
  - Category & tags
  - Images (drag-and-drop upload)
  - Inventory quantity
  - Variants (size, color, etc.)
  - SEO fields (meta title, description)
  - Status (ACTIVE, DRAFT, ARCHIVED)
- **Bulk Actions:** Export, import, bulk edit
- **Product Preview:** View product as customers see it

#### API Endpoints
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Soft delete product
- `POST /api/admin/products/[id]/images` - Upload images

---

### 3. Inventory Management (`/admin/inventory`)

Real-time stock level monitoring and management.

#### Features
- **Stock Overview:** All products with current stock levels
- **Filters:**
  - All products
  - Low stock (stock ≤ threshold)
  - Out of stock (stock = 0)
- **Quick Update:** Inline stock editing
- **Threshold Management:** Set low stock alerts per product
- **Summary Stats:**
  - Total products
  - Low stock count
  - Out of stock count

#### API Endpoints
- `GET /api/admin/inventory?filter=all|low|out` - Get inventory
- `PATCH /api/admin/inventory/[id]` - Update stock levels

---

### 4. Orders Management (`/admin/orders`)

Complete order lifecycle management.

#### Features
- **Order Listing:** All orders with filters
  - By status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
  - By payment status (PENDING, PAID, FAILED, REFUNDED)
  - By date range
- **Order Details:**
  - Customer information
  - Order items with gift options
  - Shipping address
  - Payment details
  - Order timeline
- **Order Actions:**
  - Update order status
  - Add tracking information
  - Send shipping notifications
  - Process refunds
  - Print invoice/packing slip
- **Gift Order Handling:**
  - View gift wrapping selections
  - See custom gift messages
  - Recipient details

#### API Endpoints
- `GET /api/admin/orders` - List orders with filters
- `GET /api/admin/orders/[id]` - Order details
- `PATCH /api/admin/orders/[id]/status` - Update status
- `POST /api/admin/orders/[id]/tracking` - Add tracking

---

### 5. Customers Management (`/admin/customers`)

Customer relationship and data management.

#### Features
- **Customer List:** All registered customers
- **Customer Details:**
  - Profile information
  - Order history
  - Total spent
  - Wishlist items
  - Saved addresses
- **Customer Segments:**
  - VIP customers (high spenders)
  - New customers
  - Inactive customers
- **Actions:**
  - View customer orders
  - Send targeted emails
  - Export customer data

#### API Endpoints
- `GET /api/admin/customers` - List customers
- `GET /api/admin/customers/[id]` - Customer details

---

### 6. Reviews Management (`/admin/reviews`)

Moderate customer reviews before publication.

#### Features
- **Review Queue:**
  - Pending approval
  - Approved reviews
  - All reviews
- **Review Details:**
  - Star rating
  - Review title & body
  - Customer name
  - Product name
  - Submission date
- **Actions:**
  - Approve review (publish to site)
  - Reject review (delete)
- **Summary Stats:**
  - Total reviews
  - Pending count
  - Average rating

#### API Endpoints
- `GET /api/admin/reviews?filter=pending|approved|all` - List reviews
- `PATCH /api/admin/reviews/[id]` - Approve review
- `DELETE /api/admin/reviews/[id]` - Reject/delete review

---

### 7. Sales & Promotions (`/admin/sales`)

Create and manage site-wide sales campaigns.

#### Features
- **Sale Creation:**
  - Sale name & description
  - Discount percentage
  - Start & end dates
  - Active/inactive toggle
  - Product selection (apply to specific products)
- **Sale Status:**
  - Scheduled (not started yet)
  - Active (currently running)
  - Ended (past end date)
  - Inactive (manually disabled)
- **Sale Management:**
  - Edit sale details
  - Activate/deactivate
  - Delete sale
  - View product count

#### API Endpoints
- `GET /api/admin/sales` - List all sales
- `POST /api/admin/sales` - Create sale
- `PATCH /api/admin/sales/[id]` - Update sale
- `DELETE /api/admin/sales/[id]` - Delete sale

---

### 8. Promo Codes (`/admin/promo-codes`)

Generate and manage discount codes for customers.

#### Features
- **Promo Code Creation:**
  - Unique code (auto-uppercase)
  - Discount type:
    - Percentage off
    - Flat amount off
    - Free shipping
  - Discount value
  - Minimum order value
  - Maximum discount (for percentage)
  - Usage limits:
    - Total usage limit
    - Per-user limit
  - Validity period (start & end dates)
  - Active/inactive status
- **Promo Code Management:**
  - View all codes
  - Edit code details
  - Activate/deactivate
  - Delete code
  - Track usage count

#### API Endpoints
- `GET /api/admin/promo-codes` - List all promo codes
- `POST /api/admin/promo-codes` - Create promo code
- `PATCH /api/admin/promo-codes/[id]` - Update promo code
- `DELETE /api/admin/promo-codes/[id]` - Delete promo code

---

## Admin Panel Design

### Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Sidebar (Navigation)  │  Main Content Area     │
│                        │                        │
│  - Dashboard           │  [Page Header]         │
│  - Products            │                        │
│  - Inventory           │  [Content]             │
│  - Orders              │                        │
│  - Customers           │                        │
│  - Reviews             │                        │
│  - Sales & Promotions  │                        │
│  - Promo Codes         │                        │
│                        │                        │
│  [Back to Store]       │                        │
└─────────────────────────────────────────────────┘
```

### Design System

#### Colors
- **Background:** Obsidian (#0A0A0A)
- **Cards:** Charcoal (#1A1A1A)
- **Primary:** Gold (#D4AF37)
- **Text:** Ivory (#F5F5F0)
- **Borders:** White/5 (rgba(255,255,255,0.05))

#### Typography
- **Display:** Playfair Display (headings)
- **Body:** Inter (content)

#### Components
- **Tables:** Sortable, searchable, paginated
- **Forms:** Inline validation, clear error messages
- **Buttons:** Primary (gold), secondary (outlined)
- **Status Badges:** Color-coded by state
- **Charts:** Simple bar charts for trends

---

## Security & Permissions

### Role-Based Access Control

| Role | Access Level |
|------|-------------|
| **SUPER_ADMIN** | Full access to all features |
| **ADMIN** | Full access to all features |
| **CUSTOMER** | No admin access (redirected) |
| **GUEST** | No admin access (redirected to login) |

### Authentication Flow
1. User attempts to access `/admin`
2. System checks for valid session
3. If no session → redirect to `/api/auth/signin?callbackUrl=/admin`
4. If session exists → check user role
5. If role is ADMIN or SUPER_ADMIN → grant access
6. Otherwise → redirect to homepage

### API Security
- All admin API routes require authentication
- Role verification on every request
- Input validation using Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection via React's built-in escaping

---

## Future Enhancements

### Planned Features
1. **Analytics Dashboard:**
   - Conversion rate tracking
   - Customer lifetime value
   - Product performance metrics
   - Traffic sources

2. **Gift Cards Management:**
   - Create gift cards
   - Track redemptions
   - Balance management

3. **Email Marketing:**
   - Newsletter campaigns
   - Abandoned cart emails
   - Order notifications

4. **Content Management:**
   - Blog posts
   - Gift guides
   - Landing pages

5. **Advanced Reporting:**
   - Custom date ranges
   - Export reports (CSV, PDF)
   - Scheduled reports

6. **Bulk Operations:**
   - Bulk product import/export
   - Bulk price updates
   - Bulk inventory adjustments

7. **Multi-Admin Support:**
   - Activity logs
   - Permission granularity
   - Admin user management

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks + Server Components

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** NextAuth.js
- **Validation:** Zod

### Deployment
- **Platform:** Vercel (recommended)
- **Database:** Supabase, Railway, or Neon
- **Storage:** Cloudinary or AWS S3 (for images)

---

## Best Practices

### Performance
- Server-side rendering for initial load
- Pagination for large datasets
- Lazy loading for images
- Debounced search inputs

### UX
- Loading states for all async operations
- Confirmation dialogs for destructive actions
- Toast notifications for success/error
- Keyboard shortcuts for power users

### Data Integrity
- Soft deletes for products (preserve order history)
- Audit logs for critical changes
- Backup before bulk operations
- Validation at both client and server

---

## Support & Maintenance

### Monitoring
- Error tracking (Sentry recommended)
- Performance monitoring
- Database query optimization
- Regular security audits

### Updates
- Keep dependencies up to date
- Regular database backups
- Test in staging before production
- Document all custom changes

---

> **Admin Panel Philosophy:** The admin panel should be powerful yet intuitive. Every action should be reversible, every change should be logged, and every error should be helpful. The goal is to empower administrators to manage the store efficiently without technical expertise.

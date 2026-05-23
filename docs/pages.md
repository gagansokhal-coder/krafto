# 📄 Kraafto — Core Pages & Components

---

## 1. Homepage

> The first impression — immersive, emotional, luxury.

### Sections (top to bottom)

#### 1.1 Hero Banner
- **Layout:** Full-width, full-viewport height (100vh)
- **Content:** Large lifestyle image with dark gradient overlay
- **Typography:** Display heading (Playfair Display) — e.g., *"The Art of Gifting, Reimagined"*
- **CTA:** Gold primary button — "Explore Collections"
- **Animation:** Text reveal on load, subtle parallax on scroll
- **Scroll indicator:** Animated chevron at bottom

#### 1.2 Featured Collections
- **Layout:** 3-column grid (desktop), scroll horizontally (mobile)
- **Cards:** Large image with collection name overlay
- **Collections:** "Luxury Lamps", "Handcrafted Glass", "Gift Sets"
- **Animation:** Fade-in-up on scroll with staggered delay
- **Link:** Each card leads to collection page

#### 1.3 Gifting by Occasion
- **Layout:** Horizontal pill/tab navigation with icon badges
- **Occasions:** Birthday, Anniversary, Wedding, Housewarming, Corporate, Thank You
- **Content:** Shows curated product carousel for selected occasion
- **Animation:** Smooth tab transition with content swap

#### 1.4 Best for Gifting
- **Layout:** Large featured product card + 4 smaller product cards
- **Badge:** "Best for Gifting" gold tag
- **Content:** Product name, price, "Add to Cart" quick action
- **Animation:** Hover zoom on images, elevation shadow

#### 1.5 Craftsmanship Story
- **Layout:** Split — image left, text right (alternates)
- **Content:** Brand story about artisans, materials, process
- **Visual:** High-quality behind-the-scenes photography
- **CTA:** "Our Story" link

#### 1.6 Limited Editions
- **Layout:** Horizontal scroll carousel
- **Badge:** "Limited Edition" burgundy badge with edition number
- **Urgency:** "Only X left" stock indicator
- **Animation:** Auto-scroll with pause on hover

#### 1.7 Testimonials
- **Layout:** Carousel with customer photo, quote, and product purchased
- **Style:** Elegant quote marks, subtle card with gold border
- **Auto-play:** 5-second intervals

#### 1.8 Newsletter Signup
- **Layout:** Centered text block with email input
- **Copy:** "Get exclusive access to new collections & gift guides"
- **Input:** Email field + gold submit button
- **Privacy:** "No spam. Unsubscribe anytime." small text

#### 1.9 Footer
- **Columns:** About | Quick Links | Customer Service | Follow Us
- **Newsletter:** Duplicate subscription input
- **Payment icons:** Visa, Mastercard, Stripe, Razorpay
- **Social:** Instagram, Pinterest, Facebook

---

## 2. Product Listing Page (PLP)

### Layout
- **Header:** Collection title + description (if collection page)
- **Filters:** Left sidebar (desktop) or bottom sheet (mobile)
- **Grid:** 3-4 columns of product cards
- **Pagination:** Infinite scroll with "Load More" button

### Filters

| Filter | Type | Options |
|--------|------|---------|
| **Category** | Checkbox | Lamps, Glass Decor, Art, Gift Sets |
| **Price Range** | Range slider | ₹500 — ₹50,000 |
| **Material** | Checkbox | Glass, Ceramic, Metal, Wood, Fabric |
| **Occasion** | Checkbox | Birthday, Anniversary, Wedding, Corporate |
| **Availability** | Toggle | In Stock Only |
| **Sort** | Dropdown | Featured, Price Low→High, Price High→Low, Newest |
| **Tags** | Pills | Handcrafted, Limited Edition, Best Seller |

### Product Card (in grid)
- Product image (4:5 ratio)
- Product name (Playfair Display)
- Price (with strike-through if on sale)
- Badges: Limited Edition, Handcrafted, Best for Gifting
- Quick "Add to Cart" on hover
- Wishlist heart icon

---

## 3. Product Detail Page (PDP)

### Layout: Two-column (desktop), stacked (mobile)

#### Left Column — Image Gallery
- **Main image:** Large, zoomable on hover/click
- **Thumbnails:** Row below main image (scroll if >4)
- **Lightbox:** Full-screen gallery on click
- **Format:** WebP, multiple angles + lifestyle shots

#### Right Column — Product Info
1. **Breadcrumbs:** Home > Category > Product
2. **Product Name:** H1, Playfair Display
3. **Price:** Large, gold color. Strike-through if discounted
4. **Badges:** Handcrafted, Limited Edition, eco-friendly
5. **Short Description:** 2-3 lines about the product
6. **Variant Selection:** (if applicable) Size, color, style
7. **Quantity Selector:** +/- buttons
8. **Add to Cart Button:** Primary gold CTA, full-width
9. **Send as Gift Button:** Secondary CTA, opens gift options modal
10. **Stock Status:** "In Stock", "Only 3 left", "Out of Stock"
11. **Estimated Delivery:** "Delivered by May 15, 2026"
12. **Wishlist:** "Save to Wishlist" link

#### Below Fold
- **Product Story Tab:** Craftsmanship narrative, materials, artisan info
- **Specifications Tab:** Dimensions, weight, materials, care instructions
- **Reviews Tab:** Customer reviews with star ratings + photos
- **Related Products:** "You May Also Like" carousel
- **Recently Viewed:** Persistent across pages

---

## 4. Cart Page

### Layout
- **Left:** Cart items list (image, name, variant, quantity, price, remove)
- **Right:** Order summary sidebar (sticky)

### Cart Item Row
- Product thumbnail (80x100px)
- Product name + variant
- Quantity adjuster (+/-)
- Unit price + line total
- Remove button (trash icon)
- "Send as Gift" toggle per item

### Order Summary
- Subtotal
- Gift wrapping fee (if selected)
- Estimated shipping
- Promo code input
- **Total**
- "Proceed to Checkout" gold CTA

### Gift Options (expandable per item)
- Gift wrap selection (3 styles with preview images)
- Custom gift message textarea (max 200 chars)
- Recipient's name

---

## 5. Checkout Page

### Layout: Clean, distraction-free (no main nav, minimal footer)

### Steps (single-page or accordion)

1. **Contact Information**
   - Email, phone
   - Login link for existing users

2. **Shipping Address**
   - Full name, address, city, state, pincode
   - Address autocomplete (Google Places API)
   - "Save address for next time" checkbox

3. **Shipping Method**
   - Standard (5-7 days) — Free over ₹2000
   - Express (2-3 days) — ₹199
   - Estimated delivery date shown

4. **Gift Options Summary**
   - Review gift wrapping + message for each gift item
   - Edit option

5. **Payment**
   - Stripe/Razorpay embedded payment form
   - Card, UPI, Net Banking, Wallet
   - Order summary sidebar (sticky right)

6. **Order Confirmation**
   - Success animation (gold confetti)
   - Order number + details
   - Estimated delivery date
   - "Continue Shopping" CTA
   - Email confirmation sent

---

## 6. User Account Pages

### Account Dashboard
- Welcome message with user name
- Quick stats: Total orders, Wishlist items
- Recent orders list

### Orders Page
- Order history list (order #, date, status, total)
- Order detail view (items, tracking, invoice)
- Status badges: Processing, Shipped, Delivered, Returned

### Wishlist Page
- Grid of saved products (same card as PLP)
- "Move to Cart" button on each
- Share wishlist link

### Settings Page
- Edit profile (name, email, phone)
- Manage addresses
- Change password
- Email notification preferences
- Delete account option

---

## 7. Admin Panel

### Dashboard
- Revenue overview (today, week, month, year)
- Chart: Sales trend (line chart)
- Recent orders list
- Low stock alerts
- Top selling products

### Products Management
- Product table (sortable, searchable, paginated)
- Add/Edit product form:
  - Name, slug, description, story
  - Category, tags, badges
  - Price, compare-at price
  - Images (drag-and-drop upload)
  - Inventory quantity
  - Variants
  - SEO fields (meta title, description)
  - Publish/Draft toggle

### Orders Management
- Orders table with status filters
- Order detail with customer info, items, payment status
- Update order status
- Send shipping notification
- Print invoice / packing slip

### Inventory
- Stock levels overview
- Low stock alerts
- Bulk update quantities
- Import/Export CSV

### Customers
- Customer list
- Order history per customer
- Customer segments

---

## 8. Additional Pages

### Gift Guides (Content/Blog)
- **Layout:** Magazine-style editorial pages
- **Content:** Curated gift guides by occasion, budget, recipient
- **SEO:** Long-form content with product embeds
- **Examples:** "Top 10 Anniversary Gifts Under ₹5000"

### About Us
- Brand story, mission, vision
- Meet the artisans section
- Sustainability commitment

### Contact
- Contact form
- Email, phone, WhatsApp link
- Business hours
- FAQ accordion

### Policies
- Shipping & Returns
- Privacy Policy
- Terms & Conditions

> **Page Design Rule:** Every page should feel like it belongs to the same luxury brand. Consistency in spacing, typography, and animation language is non-negotiable.

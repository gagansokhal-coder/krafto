# 🎁 Kraafto — Special Features (Gifting Niche)

---

## 1. "Send as Gift" System

### Overview
The core differentiator — transform any product into a gift experience with a single toggle.

### Feature Details

#### Gift Toggle (Product & Cart)
- Toggle switch on product page and cart items: "Send as Gift"
- When enabled, expands gift options panel
- Visually distinct: gold border, gift icon, warm background

#### Gift Wrapping Selection
- 3-4 premium wrapping styles with preview thumbnails:
  | Style | Description | Price |
  |-------|-------------|-------|
  | **Classic Gold** | Gold foil paper with satin ribbon | ₹99 |
  | **Botanical** | Kraft paper with dried flower accent | ₹149 |
  | **Luxury Box** | Magnetic closure box with tissue paper | ₹249 |
  | **Eco Wrap** | Recycled handmade paper (free) | Free |
- Preview image shows wrapping style applied to product

#### Custom Gift Message
- Textarea: max 200 characters
- Font preview in script/handwritten style
- Message printed on premium card included in package
- Emoji support
- Pre-written message templates:
  - "Happy Birthday! Wishing you a wonderful day 🎂"
  - "Congratulations on your special day! ✨"
  - "With love and warm wishes 💕"
  - "Thank you for everything 🙏"

#### Recipient Details
- Recipient's name (printed on gift tag)
- Option to ship to different address
- Hide pricing from package (checkbox)

---

## 2. Occasion-Based Recommendations

### Occasion Categories
| Occasion | Icon | Description |
|----------|------|-------------|
| 🎂 Birthday | Cake | Curated birthday gift collections |
| 💍 Anniversary | Ring | Romantic and meaningful gifts |
| 💒 Wedding | Church | Wedding & housewarming gifts |
| 🏢 Corporate | Building | Professional gifting solutions |
| 🙏 Thank You | Heart | Gratitude gifts |
| 🏠 Housewarming | House | Home decor focused |
| 🎄 Festive | Star | Diwali, Christmas, New Year |
| 👶 New Baby | Baby | Celebrating new arrivals |

### Implementation
- **Homepage section:** Horizontal scrollable occasion pills
- **Filter on PLP:** Occasion filter in sidebar
- **Product tagging:** Each product tagged with suitable occasions (many-to-many)
- **Smart recommendations:** "Perfect for [Occasion]" section on PDP
- **URL routing:** `/gifts/birthday`, `/gifts/anniversary`, etc.

---

## 3. Product Badges & Tags

### Badge Types

| Badge | Color | Usage |
|-------|-------|-------|
| **Handcrafted** | Gold outline | Products made by artisans |
| **Limited Edition** | Burgundy (`#8B2252`) | Numbered, limited stock items |
| **Best for Gifting** | Rose blush (`#E8B4B8`) | Top-rated gift items |
| **Best Seller** | Gold filled | Most purchased products |
| **New Arrival** | Sage green (`#A8B5A0`) | Products added in last 30 days |
| **Eco-Friendly** | Green | Sustainable materials/process |
| **Sale** | Red accent | Discounted items |

### Badge Display Rules
- Max 2 badges per product card
- Priority order: Limited Edition > Sale > Best Seller > Handcrafted > New
- Badges positioned at top-left of product image
- On PDP: All applicable badges shown below product name

---

## 4. Estimated Delivery Date

### Display Locations
- **Product Detail Page:** Below "Add to Cart"
- **Cart Page:** Per item
- **Checkout:** In shipping method selection

### Calculation Logic
```
Base processing time: 2 business days
Standard shipping: 5-7 business days
Express shipping: 2-3 business days
Gift wrapping: +1 business day
Custom/Made-to-order: +5-7 business days

Display: "Estimated delivery: May 15 - May 18, 2026"
```

### Visual
- Calendar icon + green text for standard
- Lightning icon + gold text for express
- "Order within X hours for delivery by [date]" urgency message

---

## 5. Product Storytelling

### Product Story Section (PDP)
Each product has a rich story tab with:

1. **The Craft:** How the product is made (process description)
2. **Materials:** Detailed material sourcing and quality info
3. **The Artisan:** Brief profile of the craftsperson/studio
4. **Inspiration:** Design inspiration behind the piece
5. **Care Guide:** How to maintain the product

### Content Format
- Mix of text paragraphs and inline images
- Markdown/Rich text editor in admin panel
- Styled with accent typography (Cormorant Garamond)
- Subtle background texture for storytelling section

---

## 6. Wishlist & Saved Items

### Features
- Heart icon on product cards and PDP
- Animated fill on click (outline → filled, with scale bounce)
- Wishlist page in user account
- Share wishlist via link
- "Move to Cart" action
- Low stock notification for wishlist items
- Guest wishlist (stored in localStorage, merged on login)

---

## 7. Quick View Modal

### Trigger
- "Quick View" button appears on product card hover

### Content
- Product image (main only)
- Product name, price, badges
- Short description
- Variant selection
- Add to Cart button
- "View Full Details" link to PDP

### Design
- Centered modal with backdrop blur
- Slide-up animation on open
- Close on backdrop click or X button

---

## 8. Recently Viewed Products

### Behavior
- Tracks last 10 viewed products
- Stored in localStorage (no auth required)
- Displayed as horizontal carousel on:
  - Product detail pages (bottom)
  - Cart page (below cart items)
- Persists across sessions

---

## 9. Stock & Urgency Indicators

| Stock Level | Display | Color |
|-------------|---------|-------|
| In Stock (>10) | "In Stock" | Sage green |
| Low Stock (1-10) | "Only X left!" | Warm gold with pulse |
| Out of Stock | "Out of Stock" | Smoke gray, dimmed card |
| Pre-order | "Pre-order — Ships by [date]" | Blue accent |
| Made to Order | "Made to Order — 7-10 days" | Gold |

---

## 10. Corporate Gifting Section

### Dedicated Page: `/corporate-gifts`
- **Hero:** Professional imagery, corporate messaging
- **Bulk ordering:** Quantity discounts, custom packaging
- **Custom branding:** Company logo on packaging
- **Inquiry form:** Name, company, quantity, budget, occasion
- **Past clients:** Logos or testimonials (with permission)
- **Dedicated account manager** contact

---

## 11. Gift Card System

### Features
- Digital gift cards: ₹500, ₹1000, ₹2000, ₹5000, Custom
- Custom message with card
- Delivered via email on chosen date
- Unique redeemable code
- Balance tracking in account
- Partial usage with remaining balance

---

## 12. Social Proof & Reviews

### Product Reviews
- Star rating (1-5)
- Written review with optional photo upload
- Verified purchase badge
- Helpful vote system
- Filter by rating
- Admin moderation before publish

### Social Proof Elements
- "X people are viewing this" (real-time or simulated)
- "Bought X times this week" badge
- Customer photos carousel on PDP

> **Feature Priority:** Gift wrapping, occasion recommendations, and product storytelling are the MVP features that define the brand experience. Everything else can be phased.

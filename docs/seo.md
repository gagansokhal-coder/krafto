# 🔍 Kraafto — SEO & Marketing Strategy

---

## 1. SEO Foundation

### Technical SEO Checklist

| Item | Implementation |
|------|---------------|
| **SSR/SSG** | Homepage, PLP, PDP, Gift Guides — all server-rendered for crawlability |
| **Sitemap** | Auto-generated `sitemap.xml` via Next.js (`next-sitemap` package) |
| **Robots.txt** | Allow all public pages, block admin/checkout/cart |
| **Canonical URLs** | Set on every page to prevent duplicate content |
| **Structured Data** | JSON-LD for Products, Reviews, Breadcrumbs, Organization |
| **Open Graph** | Title, description, image for every page |
| **Twitter Cards** | Summary with large image |
| **Hreflang** | Not needed initially (India-only), future multi-language support |
| **HTTPS** | Enforced everywhere |

### URL Structure

```
/                               → Homepage
/products                       → All products
/products/[slug]                → Product detail
/collections/[slug]             → Collection page
/gifts/[occasion]               → Occasion-based browsing
/gift-guides                    → All guides
/gift-guides/[slug]             → Individual guide
/about                          → About us
/contact                        → Contact page
/corporate-gifts                → Corporate gifting
```

**Rules:**
- Lowercase, hyphenated slugs
- No trailing slashes
- No query params for indexed pages (filters use client-side state)
- 301 redirects for any slug changes

---

## 2. On-Page SEO

### Meta Tags Per Page

| Page | Title Template | Description Template |
|------|---------------|---------------------|
| **Homepage** | Kraafto — Premium Handcrafted Gifts & Luxury Decor | Discover handcrafted luxury gifts... |
| **PLP** | [Category] — Kraafto | Shop premium [category]... |
| **PDP** | [Product Name] — Kraafto | [Short desc]. Handcrafted with [materials]... |
| **Gift Guide** | [Guide Title] — Kraafto Gift Guides | [Guide description]... |
| **Collection** | [Collection Name] — Kraafto Collections | Explore our [collection]... |

### Heading Hierarchy
- **H1:** One per page — page/product title
- **H2:** Section headings
- **H3:** Sub-sections
- Never skip heading levels

### Image SEO
- Descriptive `alt` text for every product image
- WebP format with AVIF fallback
- Lazy loading with blur placeholder
- `width` and `height` attributes for CLS prevention
- Descriptive filenames: `blue-glass-table-lamp-front.webp`

---

## 3. Structured Data (JSON-LD)

### Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Azure Glass Table Lamp",
  "image": ["https://kraafto.com/images/..."],
  "description": "Handcrafted blue glass table lamp...",
  "sku": "KRF-LAMP-001",
  "brand": { "@type": "Brand", "name": "Kraafto" },
  "offers": {
    "@type": "Offer",
    "price": "2499",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Kraafto" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "23"
  }
}
```

### Breadcrumb Schema
Applied on all PDP and collection pages.

### Organization Schema
On homepage — name, logo, social links, contact info.

### FAQ Schema
On contact/FAQ page for rich results.

---

## 4. Content Strategy

### Gift Guides (Blog/Content Hub)

**Purpose:** Drive organic traffic via long-tail keywords.

| Guide Type | Example | Target Keyword |
|-----------|---------|----------------|
| Occasion | "Top 10 Anniversary Gifts Under ₹5000" | anniversary gifts under 5000 |
| Recipient | "Best Gifts for Mom — 2026 Guide" | gifts for mom india |
| Budget | "Luxury Gifts Under ₹2000" | luxury gifts under 2000 |
| Trending | "Diwali Gift Ideas 2026" | diwali gift ideas |
| Product | "How Glass Lamps Are Made" | handcrafted glass lamps |

**Publishing Schedule:** 2-3 guides per month

**Content Format:**
- 1500-2500 words per guide
- Embedded product cards (shoppable)
- Internal links to products and collections
- High-quality editorial images
- Author byline (brand credibility)

### Product Descriptions
- Unique, compelling copy per product (no duplicates)
- Natural keyword integration
- Storytelling format — craft process, materials, inspiration
- 150-300 words per product

---

## 5. Performance & Core Web Vitals

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** | < 2.5s | SSG for key pages, optimized hero images, CDN |
| **FID** | < 100ms | Minimal JS on initial load, code splitting |
| **CLS** | < 0.1 | Image dimensions set, font loading optimized |
| **TTFB** | < 200ms | Edge caching via Vercel, ISR |

---

## 6. Local & Regional SEO

- **Google Business Profile:** Set up with store info, images, reviews
- **Schema:** LocalBusiness markup if physical store exists
- **Location keywords:** "handcrafted gifts India", "luxury decor online India"
- **Google Merchant Center:** Product feed for Google Shopping

---

## 7. Marketing Integrations

### Email Marketing
| Trigger | Email | Timing |
|---------|-------|--------|
| Sign up | Welcome + 10% off code | Immediate |
| Abandoned cart | "You left something beautiful" | 1 hour |
| Post-purchase | Order confirmation | Immediate |
| Shipped | Tracking details | On shipment |
| Delivered | Review request | 3 days after |
| Inactive | "We miss you" + curated picks | 30 days |
| Birthday | Birthday discount code | On birthday |

### Social Media
- **Instagram:** Product photography, behind-the-scenes, artisan stories
- **Pinterest:** Gift guides, product pins (high purchase intent)
- **Facebook:** Community, customer stories, ads

### Analytics Setup
- **Google Analytics 4:** Full e-commerce tracking (view_item, add_to_cart, purchase)
- **Vercel Analytics:** Performance monitoring
- **Conversion tracking:** Google Ads, Facebook Pixel
- **UTM parameters:** Tracked across all campaigns

---

## 8. Conversion Optimization

### Key Strategies
- **Trust badges:** Secure checkout, handcrafted guarantee, easy returns
- **Urgency:** "Only X left", limited edition indicators
- **Social proof:** Reviews, "X people viewing", "Bought Y times this week"
- **Exit intent:** Newsletter popup with discount code
- **Abandoned cart:** Email + optional browser notification
- **Gift suggestion:** "Send as Gift" prominently featured
- **Free shipping threshold:** "Add ₹X more for free shipping" progress bar

> **SEO Goal:** Rank on page 1 for "luxury handcrafted gifts India", "premium gift shop online", and all occasion-based gift keywords within 6 months of launch.

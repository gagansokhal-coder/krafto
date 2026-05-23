# ⚡ Kraafto — Performance Optimization

---

## 1. Performance Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| **First Contentful Paint (FCP)** | < 1.2s | 1.8s |
| **Largest Contentful Paint (LCP)** | < 2.0s | 2.5s |
| **First Input Delay (FID)** | < 50ms | 100ms |
| **Cumulative Layout Shift (CLS)** | < 0.05 | 0.1 |
| **Time to Interactive (TTI)** | < 3.0s | 4.0s |
| **Total Bundle Size (JS)** | < 150KB | 200KB (gzipped) |
| **Total Page Weight** | < 1MB | 1.5MB |
| **Lighthouse Score** | 95+ | 90 minimum |

---

## 2. Image Optimization

### Strategy

| Technique | Implementation |
|-----------|---------------|
| **Format** | WebP primary, AVIF where supported, JPEG fallback |
| **Responsive** | `srcSet` with 640w, 768w, 1024w, 1280w, 1536w |
| **Lazy Loading** | Native `loading="lazy"` + Intersection Observer |
| **Blur Placeholder** | Low-quality base64 placeholder via Next.js `<Image>` |
| **CDN** | Cloudinary with auto-format and auto-quality |
| **Compression** | 80% quality for product images, 60% for thumbnails |

### Size Budgets

| Image Type | Max Size | Dimensions |
|-----------|----------|------------|
| Hero Banner | 200KB | 1920x1080 |
| Product Grid | 80KB | 600x750 (4:5) |
| Product Detail | 150KB | 1200x1200 |
| Thumbnail | 30KB | 200x200 |
| Category Banner | 120KB | 1200x400 |

### Implementation
```jsx
// Next.js Image component with blur placeholder
<Image
  src={product.image}
  alt={product.name}
  width={600}
  height={750}
  placeholder="blur"
  blurDataURL={product.blurHash}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
  quality={80}
/>
```

---

## 3. JavaScript Optimization

### Code Splitting
- **Route-based:** Automatic via Next.js App Router
- **Component-level:** `dynamic()` imports for heavy components
- **Third-party:** Defer non-critical scripts (analytics, chat widgets)

### Lazy-Loaded Components
| Component | Trigger |
|-----------|---------|
| Product Reviews | Scroll into view |
| Image Lightbox | User clicks image |
| Gift Options Modal | User clicks "Send as Gift" |
| Quick View Modal | Hover on product card |
| Admin Charts | On admin page mount |
| Newsletter Popup | After 30s on page |

### Tree Shaking
- Import only needed icons from `lucide-react`
- Use barrel exports sparingly
- Avoid full library imports: `import { motion } from 'framer-motion'` ✅

---

## 4. Caching Strategy

### Next.js ISR (Incremental Static Regeneration)

| Page | Revalidation | Reason |
|------|-------------|--------|
| Homepage | 60 seconds | Featured products change |
| Product Listing | 60 seconds | Stock/price updates |
| Product Detail | On-demand | Triggered by admin edit |
| Gift Guides | 3600 seconds | Rarely changes |
| Static Pages | Build-time | About, Contact, Policies |

### API Response Caching

| Endpoint | Cache Duration | Strategy |
|----------|---------------|----------|
| `/api/products` | 60s | `stale-while-revalidate` |
| `/api/categories` | 300s | `stale-while-revalidate` |
| `/api/products/[slug]` | 60s | Cache-Control + CDN |
| `/api/cart/*` | No cache | Dynamic, user-specific |
| `/api/orders/*` | No cache | Dynamic, user-specific |

### Client-Side Caching
- **Zustand persist:** Cart state in `localStorage`
- **Recently viewed:** `localStorage` (last 10 products)
- **Wishlist (guest):** `localStorage` until login
- **SWR/React Query:** Stale-while-revalidate for API calls

---

## 5. Font Optimization

### Strategy
- **Self-host** Google Fonts (Playfair Display, Inter, Cormorant Garamond)
- **Subset:** Latin + Latin Extended only
- **Format:** WOFF2 (smallest size)
- **Display:** `font-display: swap` to prevent FOIT
- **Preload:** Critical fonts in `<head>`

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/playfair-display-var.woff2" as="font" type="font/woff2" crossorigin>
```

### Font Size Budget
| Font | Weight | Size |
|------|--------|------|
| Inter (variable) | 300-600 | ~95KB |
| Playfair Display (variable) | 400-700 | ~120KB |
| Cormorant Garamond | 400-600 | ~80KB |

---

## 6. Animation Performance

### Rules
- Use `transform` and `opacity` only for animations (GPU-accelerated)
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `will-change` sparingly and only on elements about to animate
- Respect `prefers-reduced-motion` — disable or simplify animations
- Use `requestAnimationFrame` for scroll-based effects

### Framer Motion Best Practices
```jsx
// Use layout animations carefully
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}  // Animate only once
  transition={{ duration: 0.5 }}
/>
```

---

## 7. Database Query Optimization

| Optimization | Implementation |
|-------------|---------------|
| **Select only needed fields** | Prisma `select` to avoid over-fetching |
| **Pagination** | Cursor-based for large datasets, offset for admin |
| **Indexes** | Compound indexes on frequently filtered columns |
| **N+1 Prevention** | Prisma `include` for eager loading relations |
| **Connection Pooling** | PgBouncer or Prisma Data Proxy |
| **Query Logging** | Log slow queries (>100ms) in development |

---

## 8. Monitoring & Alerts

| Tool | Purpose |
|------|---------|
| **Vercel Analytics** | Core Web Vitals, real user monitoring |
| **Sentry** | Error tracking, performance traces |
| **Lighthouse CI** | Automated performance checks in CI/CD |
| **AWS CloudWatch** | Database performance, RDS monitoring |
| **Uptime Robot** | Uptime monitoring, downtime alerts |

### Performance Alert Thresholds
| Metric | Alert If |
|--------|----------|
| LCP | > 3.0s (p75) |
| API Response Time | > 500ms (p95) |
| Error Rate | > 1% |
| Database CPU | > 80% |
| Memory Usage | > 85% |

---

## 9. Build Optimization

| Technique | Details |
|-----------|---------|
| **Bundle Analyzer** | `@next/bundle-analyzer` — run monthly |
| **Unused Dependencies** | Audit with `depcheck` quarterly |
| **TypeScript Strict** | Catch errors at build time, not runtime |
| **ESLint Rules** | Enforce import best practices |
| **Turbopack** | Use for faster dev server (Next.js 14+) |

> **Performance Rule:** Every PR that adds a new dependency must include a bundle size impact analysis. No dependency over 50KB (gzipped) without team discussion.

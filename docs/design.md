# 🎨 Kraafto — Design System & UI/UX Requirements

---

## 1. Design Philosophy

> **"Luxury is in each detail."** — Hubert de Givenchy

### Design Pillars

| Pillar | Description |
|--------|-------------|
| **Minimal Luxury** | Clean layouts with generous whitespace, letting products breathe |
| **Warm & Inviting** | Soft lighting effects, warm color palette, cozy feel |
| **Immersive Visuals** | Large, full-bleed product photography as the hero |
| **Storytelling** | Every section tells a story, not just displays products |
| **Tactile Feel** | Subtle textures, shadows, and depth create a tangible experience |

---

## 2. Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Obsidian** | `#1A1A2E` | Primary dark / backgrounds |
| **Deep Charcoal** | `#16213E` | Secondary dark / cards |
| **Warm Gold** | `#C9A96E` | Primary accent / CTAs / highlights |
| **Champagne** | `#E8D5B7` | Secondary accent / hover states |
| **Ivory Cream** | `#FAF6F0` | Light backgrounds / text on dark |

### Supporting Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Rose Blush** | `#E8B4B8` | Gift-related accents / sale tags |
| **Sage Green** | `#A8B5A0` | Success states / eco badges |
| **Soft Burgundy** | `#8B2252` | Limited edition badges |
| **Pearl White** | `#F5F5F0` | Card backgrounds / light mode |
| **Smoke Gray** | `#6B6B7B` | Secondary text / labels |

### Gradients

```css
--gradient-hero: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
--gradient-gold: linear-gradient(135deg, #C9A96E 0%, #E8D5B7 50%, #C9A96E 100%);
--gradient-overlay: linear-gradient(180deg, rgba(26,26,46,0) 0%, rgba(26,26,46,0.85) 100%);
--gradient-cta: linear-gradient(135deg, #C9A96E 0%, #B8956A 100%);
```

---

## 3. Typography

### Font Stack

| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| **Display / Headings** | Playfair Display | 400, 600, 700 | Georgia, serif |
| **Body / UI** | Inter | 300, 400, 500, 600 | system-ui, sans-serif |
| **Accent / Labels** | Cormorant Garamond | 400, 500, 600 | Georgia, serif |

### Type Scale

```
--text-display:   clamp(3rem, 5vw, 5rem)      /* Hero headlines */
--text-h1:        clamp(2.25rem, 4vw, 3.5rem)  /* Page titles */
--text-h2:        clamp(1.75rem, 3vw, 2.5rem)  /* Section headings */
--text-h3:        clamp(1.25rem, 2vw, 1.75rem) /* Sub-section headings */
--text-body:      1rem (16px)                   /* Body text */
--text-small:     0.875rem (14px)               /* Captions */
--text-xs:        0.75rem (12px)                /* Badges, tags */
```

---

## 4. Spacing System (8px Grid)

```
--space-1: 0.25rem (4px)   --space-6:  2rem (32px)
--space-2: 0.5rem (8px)    --space-8:  3rem (48px)
--space-3: 0.75rem (12px)  --space-10: 4rem (64px)
--space-4: 1rem (16px)     --space-12: 5rem (80px)
--space-5: 1.5rem (24px)   --space-16: 6rem (96px)
```

---

## 5. Shadows & Elevation

```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
--shadow-lg: 0 10px 25px rgba(0,0,0,0.1), 0 6px 10px rgba(0,0,0,0.08);
--shadow-xl: 0 20px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1);
--shadow-gold: 0 4px 20px rgba(201, 169, 110, 0.3);
```

---

## 6. Animation & Motion

### Principles
- **Purposeful** — Every animation serves a function
- **Subtle** — Never distracting; feels like natural flow
- **Smooth** — Use `ease-out` or custom bezier curves
- **Fast** — 200ms-500ms for UI interactions

### Timing

```css
--duration-fast: 150ms;    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--duration-normal: 250ms;  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--duration-slow: 400ms;    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-entrance: 800ms;
```

### Animation Catalog

| Animation | Usage | Duration |
|-----------|-------|----------|
| **Fade In Up** | Page sections on scroll | 800ms |
| **Scale In** | Product cards on hover | 250ms |
| **Slide In** | Side drawers, cart panel | 400ms |
| **Shimmer** | Skeleton loading screens | 1500ms loop |
| **Gold Pulse** | CTA buttons idle state | 2000ms loop |
| **Image Zoom** | Product image on hover | 400ms |

---

## 7. Component Specs

### Buttons

| Variant | Style |
|---------|-------|
| **Primary** | Gold gradient bg, dark text, gold glow hover |
| **Secondary** | Transparent + gold border, fill on hover |
| **Ghost** | No border, underline on hover |

### Product Cards
- Aspect ratio: 4:5 (portrait) for product image
- Image zoom (scale 1.05) on hover
- Gradient overlay showing title + price
- Badges top-left (Limited Edition, Handcrafted)
- Wishlist heart icon top-right

### Navigation Bar
- Transparent on hero → solid with blur on scroll
- Height: 72px desktop, 60px mobile
- Logo left, nav center, cart + user right
- Mobile: hamburger → slide-in drawer

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Products/Row | Container |
|------------|-------|-------------|-----------|
| Mobile | <640px | 1-2 | 100% - 32px |
| Tablet | 768px | 2-3 | 720px |
| Desktop | 1024px | 3 | 960px |
| Large | 1280px | 4 | 1200px |
| XL | 1536px | 4 | 1400px |

---

## 9. Image Guidelines

| Type | Format | Ratio | Max Size |
|------|--------|-------|----------|
| Hero Banner | WebP/AVIF | 16:9 | 200KB |
| Product Grid | WebP | 4:5 | 80KB |
| Product Detail | WebP | 1:1 | 150KB |
| Thumbnail | WebP | 1:1 | 30KB |

---

## 10. Accessibility

- WCAG 2.1 AA minimum
- Contrast ≥ 4.5:1 body text, ≥ 3:1 large text
- Keyboard-focusable interactive elements
- Focus ring: 2px gold outline
- Respect `prefers-reduced-motion`
- Semantic HTML (nav, main, article, section)

---

## 11. Dark / Light Mode

Default: **Dark Mode** (primary luxury experience)

| Element | Dark Mode | Light Mode |
|---------|-----------|------------|
| Background | `#1A1A2E` | `#FAF6F0` |
| Surface | `#16213E` | `#FFFFFF` |
| Text Primary | `#FAF6F0` | `#1A1A2E` |
| Accent | `#C9A96E` | `#B8956A` |

---

## 12. Tailwind CSS Custom Config

```js
// tailwind.config.js highlights
module.exports = {
  theme: {
    extend: {
      colors: {
        obsidian: '#1A1A2E',
        charcoal: '#16213E',
        gold: { DEFAULT: '#C9A96E', light: '#E8D5B7', dark: '#B8956A' },
        ivory: '#FAF6F0',
        blush: '#E8B4B8',
        sage: '#A8B5A0',
        burgundy: '#8B2252',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
};
```

> **Design Principle:** When in doubt, choose more luxurious, more spacious, more intentional. White space is our most powerful design tool.

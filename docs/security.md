# 🔒 Kraafto — Security & Data Protection

---

## 1. Security Overview

| Principle | Implementation |
|-----------|---------------|
| **Defense in Depth** | Multiple security layers — auth, validation, encryption, monitoring |
| **Least Privilege** | Minimal permissions per role; admin features gated behind role checks |
| **Secure by Default** | HTTPS enforced, secure cookies, CSRF protection out of the box |
| **Data Minimization** | Collect only what's needed; no unnecessary PII storage |

---

## 2. Authentication Security

### Password Policy

| Rule | Requirement |
|------|-------------|
| Minimum length | 8 characters |
| Complexity | At least 1 uppercase, 1 lowercase, 1 number |
| Hashing | bcrypt with 12 salt rounds |
| Storage | Only hash stored — never plaintext |
| Reset | Time-limited token (1 hour expiry) sent via email |
| Brute force | Account lockout after 5 failed attempts (15 min cooldown) |

### Session Management (NextAuth.js)

| Property | Value |
|----------|-------|
| Session strategy | JWT (stateless) |
| Token expiry | 24 hours |
| Refresh | Sliding window — refresh on activity |
| Cookie flags | `HttpOnly`, `Secure`, `SameSite=Lax` |
| CSRF | Built-in NextAuth CSRF token |

### OAuth Security
- Only trusted providers: Google, Facebook
- Validate `state` parameter to prevent CSRF
- Link OAuth accounts to existing email-matched users
- Never store access tokens longer than session

---

## 3. Authorization & Access Control

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|------------|
| **Guest** | Browse products, add to cart, view gift guides |
| **Customer** | All guest + checkout, orders, wishlist, reviews, profile |
| **Admin** | All customer + product/order/inventory management |
| **Super Admin** | All admin + user management, promo codes, system settings |

### Middleware Protection
```typescript
// Next.js middleware.ts
export function middleware(request: NextRequest) {
  // Protect /account/* — require authenticated
  // Protect /admin/* — require ADMIN or SUPER_ADMIN role
  // Protect /api/admin/* — require ADMIN role + valid session
}
```

### API Route Protection
- Every protected endpoint checks session via `getServerSession()`
- Admin endpoints additionally verify `user.role`
- Return `401` for unauthenticated, `403` for unauthorized

---

## 4. Input Validation & Sanitization

### Validation (Zod)

| Layer | Tool | Purpose |
|-------|------|---------|
| **API Input** | Zod schemas | Validate all request bodies and query params |
| **Forms** | React Hook Form + Zod | Client-side validation before submission |
| **Database** | Prisma types | Type-safe queries prevent malformed data |

### Sanitization Rules
- **HTML:** Strip all HTML tags from user inputs (reviews, messages)
- **SQL:** Prisma parameterized queries (no raw SQL unless escaped)
- **XSS:** React's default JSX escaping + Content Security Policy headers
- **File uploads:** Validate MIME type, file size, extension whitelist (images only)

### File Upload Security
| Rule | Value |
|------|-------|
| Max file size | 5MB per image |
| Allowed types | `.jpg`, `.jpeg`, `.png`, `.webp` |
| MIME validation | Server-side check (don't trust client) |
| Storage | Upload to Cloudinary — never store on app server |
| Filename | Generate UUID filename, strip original name |

---

## 5. Payment Security

### PCI DSS Compliance

| Requirement | Implementation |
|-------------|---------------|
| **Card data** | Never touches our server — Stripe Elements / Razorpay checkout handles all card input |
| **Token-based** | We only receive payment tokens/intents, never raw card numbers |
| **Webhooks** | Verified via Stripe signature or Razorpay HMAC |
| **HTTPS** | Enforced on all payment-related pages |
| **Logging** | Never log payment tokens, card details, or CVV |

### Webhook Verification
```typescript
// Stripe webhook handler
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
// Razorpay webhook
const isValid = razorpay.validateWebhookSignature(body, signature, secret);
```

### Order Security
- Validate cart prices server-side before creating PaymentIntent
- Re-check stock availability at payment time
- Idempotency keys to prevent duplicate charges
- Refund processing only via admin panel with audit log

---

## 6. Data Protection & Privacy

### Personal Data Handling

| Data Type | Storage | Encryption | Retention |
|-----------|---------|------------|-----------|
| Email | PostgreSQL | At rest (RDS) | Until account deletion |
| Password hash | PostgreSQL | bcrypt hash | Until account deletion |
| Addresses | PostgreSQL | At rest (RDS) | Until user deletes |
| Order history | PostgreSQL | At rest (RDS) | 7 years (legal) |
| Payment tokens | Not stored | N/A | N/A (Stripe handles) |
| IP addresses | Order records | At rest | 90 days |
| Cookies | Browser | Secure flag | Session / 24h |

### GDPR-Style Compliance
- **Right to access:** User can view all their data in account settings
- **Right to delete:** "Delete Account" option removes PII (anonymizes orders)
- **Consent:** Cookie consent banner for non-essential cookies
- **Data portability:** Export user data as JSON (future feature)
- **Privacy policy:** Clear, accessible privacy policy page

### Cookie Policy
| Cookie | Type | Purpose | Duration |
|--------|------|---------|----------|
| `next-auth.session` | Essential | Authentication | Session |
| `next-auth.csrf` | Essential | CSRF protection | Session |
| `cart` | Functional | Cart persistence | 30 days |
| `_ga` | Analytics | Google Analytics | 2 years |
| `recently_viewed` | Functional | Product history | 30 days |

---

## 7. Infrastructure Security

### Environment Variables
- **Never commit** `.env` files — `.gitignore` enforced
- Use Vercel environment variables for production
- Separate secrets per environment (dev / staging / prod)
- Rotate secrets quarterly

### HTTP Security Headers
```typescript
// next.config.js headers
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' https://res.cloudinary.com; ..."
}
```

### Database Security
- **Network:** RDS in private subnet, not publicly accessible
- **Access:** IAM-based authentication, no shared passwords
- **Backups:** Automated daily backups, 7-day retention
- **Encryption:** AES-256 at rest, TLS in transit
- **Connection:** SSL required for all database connections

---

## 8. Rate Limiting & DDoS Protection

| Protection | Implementation |
|-----------|---------------|
| **API Rate Limiting** | Custom middleware or `rate-limiter-flexible` |
| **Auth Endpoints** | 5 requests/min per IP |
| **Checkout** | 10 requests/min per user |
| **DDoS** | Vercel Edge Network + Cloudflare (if needed) |
| **Bot Protection** | reCAPTCHA v3 on forms (contact, register) |

---

## 9. Monitoring & Incident Response

### Security Monitoring
| Event | Action |
|-------|--------|
| Failed login attempts (>5) | Log + temp lock account |
| Admin action | Audit log with user ID, action, timestamp |
| Payment webhook failure | Alert + retry queue |
| Unusual traffic spike | Auto-alert via Vercel/Cloudflare |
| Dependency vulnerability | Dependabot alerts on GitHub |

### Incident Response Plan
1. **Detect:** Automated alerts or user report
2. **Contain:** Disable affected feature/endpoint
3. **Assess:** Determine scope and data impact
4. **Fix:** Deploy patch
5. **Notify:** Inform affected users if data breach
6. **Review:** Post-incident review and prevention measures

---

## 10. Dependency Security

| Practice | Tool |
|----------|------|
| Vulnerability scanning | `npm audit` on every CI build |
| Automated updates | Dependabot / Renovate Bot |
| License compliance | Check for copyleft licenses |
| Supply chain | Lock file (`package-lock.json`) committed |
| Review | Manual review for new dependencies |

> **Security Principle:** Security is not a feature — it's a requirement. Every PR is reviewed for security implications. No shortcuts on authentication, authorization, or data handling.

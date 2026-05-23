# 🚀 Kraafto — Deployment & Infrastructure

---

## 1. Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     PRODUCTION                            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │              Vercel (Frontend + API)              │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │     │
│  │  │ Edge CDN │  │ Serverless│  │  ISR Cache   │  │     │
│  │  │ (Static) │  │ Functions │  │  (Products)  │  │     │
│  │  └──────────┘  └──────────┘  └──────────────┘  │     │
│  └──────────────────────┬───────────────────────────┘     │
│                          │                                 │
│  ┌───────────┐  ┌───────┴───────┐  ┌─────────────────┐  │
│  │Cloudinary │  │  AWS RDS      │  │ Stripe/Razorpay │  │
│  │ (Images)  │  │ (PostgreSQL)  │  │  (Payments)     │  │
│  └───────────┘  └───────────────┘  └─────────────────┘  │
│  ┌───────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  Resend   │  │   Sentry      │  │    GA4          │  │
│  │ (Email)   │  │  (Errors)     │  │  (Analytics)    │  │
│  └───────────┘  └───────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Environments

| Environment | URL | Purpose | Database |
|-------------|-----|---------|----------|
| **Local Dev** | `localhost:3000` | Development & debugging | Docker PostgreSQL |
| **Preview** | `*.vercel.app` | PR previews (auto-deploy) | Staging DB (shared) |
| **Staging** | `staging.kraafto.com` | Pre-production testing | Staging DB |
| **Production** | `kraafto.com` | Live site | Production DB (AWS RDS) |

### Environment Variable Management

| Environment | Source |
|------------|--------|
| Local | `.env.local` (gitignored) |
| Preview | Vercel Environment Variables (Preview scope) |
| Staging | Vercel Environment Variables (Preview scope, `staging` branch) |
| Production | Vercel Environment Variables (Production scope) |

---

## 3. CI/CD Pipeline

### GitHub Actions Workflow

```
Push/PR to main
      │
      ├── 🔍 Lint (ESLint + Prettier check)
      │
      ├── 🧪 Type Check (tsc --noEmit)
      │
      ├── 🧪 Unit Tests (Vitest)
      │
      ├── 📦 Build (next build)
      │
      ├── 🔒 Security Audit (npm audit)
      │
      ├── 📊 Bundle Size Check
      │
      └── ✅ All pass → Vercel auto-deploys
```

### Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|-----------|
| `main` | Production-ready code | Production |
| `staging` | Pre-release testing | Staging |
| `feature/*` | Feature development | Preview (auto) |
| `fix/*` | Bug fixes | Preview (auto) |
| `hotfix/*` | Emergency fixes | Production (fast-track) |

### PR Requirements
- All CI checks must pass
- At least 1 code review approval
- No merge conflicts
- Bundle size increase < 10KB (warning if exceeded)

---

## 4. Vercel Configuration

### `vercel.json`
```json
{
  "framework": "nextjs",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000" }
      ]
    }
  ],
  "redirects": [
    { "source": "/shop", "destination": "/products", "permanent": true }
  ]
}
```

### Vercel Settings
| Setting | Value |
|---------|-------|
| Framework | Next.js (auto-detected) |
| Node.js Version | 20.x |
| Build Command | `next build` |
| Output Directory | `.next` |
| Install Command | `npm ci` |
| Region | Mumbai (bom1) — closest to Indian users |

---

## 5. Database Deployment

### AWS RDS Configuration

| Setting | Value |
|---------|-------|
| Engine | PostgreSQL 15 |
| Instance | `db.t3.medium` (staging), `db.r6g.large` (prod) |
| Storage | 50GB GP3 SSD (auto-scaling) |
| Multi-AZ | Yes (production only) |
| Backup | Daily automated, 7-day retention |
| Encryption | AES-256 at rest |
| Network | Private subnet, VPC peering with Vercel |

### Migration Deployment
```bash
# Staging
npx prisma migrate deploy  # Apply pending migrations

# Production (via CI/CD)
# 1. Backup database
# 2. Run migrations
# 3. Verify application health
# 4. Rollback plan ready
```

---

## 6. Domain & DNS

### DNS Configuration (Cloudflare or Route 53)

| Record | Type | Value |
|--------|------|-------|
| `kraafto.com` | A | Vercel IP |
| `www.kraafto.com` | CNAME | `cname.vercel-dns.com` |
| `staging.kraafto.com` | CNAME | `cname.vercel-dns.com` |

### SSL/TLS
- Auto-provisioned by Vercel (Let's Encrypt)
- HSTS enabled with 1-year max-age
- TLS 1.2 minimum

---

## 7. Image CDN (Cloudinary)

### Configuration
| Setting | Value |
|---------|-------|
| Cloud Name | `kraafto` |
| Upload Preset | Auto-format, auto-quality |
| Transformations | Resize, crop, WebP/AVIF conversion |
| Delivery | Global CDN |
| Storage | Organized by folder: `/products/`, `/banners/`, `/guides/` |

### Upload Flow
```
Admin uploads image → API route → Cloudinary Upload API
                                        │
                                  Returns: public URL
                                        │
                                  Stored in ProductImage.url
```

---

## 8. Monitoring & Observability

### Production Monitoring Stack

| Tool | Purpose | Alert Channel |
|------|---------|---------------|
| **Vercel Analytics** | Core Web Vitals, traffic | Dashboard |
| **Sentry** | Error tracking, performance | Slack + Email |
| **Uptime Robot** | Uptime monitoring (1 min) | SMS + Email |
| **AWS CloudWatch** | RDS metrics, CPU, connections | Email |
| **Google Analytics 4** | User behavior, conversions | Dashboard |

### Health Check Endpoint

```typescript
// /api/health
export async function GET() {
  const dbHealthy = await checkDatabase();
  const cacheHealthy = await checkCache();

  return Response.json({
    status: dbHealthy && cacheHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealthy ? 'up' : 'down',
      cache: cacheHealthy ? 'up' : 'down',
    }
  });
}
```

### Uptime Targets
| Service | SLA Target |
|---------|-----------|
| Website | 99.9% uptime |
| API | 99.9% uptime |
| Database | 99.95% uptime (Multi-AZ) |
| Payments | Dependent on Stripe/Razorpay SLA |

---

## 9. Backup & Disaster Recovery

### Backup Strategy

| Data | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| PostgreSQL | Daily automated | 7 days | AWS S3 |
| PostgreSQL | Weekly manual | 30 days | AWS S3 |
| Cloudinary images | Real-time (Cloudinary manages) | Indefinite | Cloudinary |
| Application code | Git history | Indefinite | GitHub |
| Environment variables | Manual export | Per change | Encrypted vault |

### Recovery Procedures

| Scenario | RTO | RPO | Action |
|----------|-----|-----|--------|
| App deployment failure | 2 min | 0 | Vercel instant rollback |
| Database corruption | 30 min | 24 hours | Restore from RDS snapshot |
| Region outage | 1 hour | 24 hours | Failover to secondary region |
| Complete disaster | 4 hours | 24 hours | Full rebuild from backups |

---

## 10. Scaling Strategy

### Phase 1: Launch (0-1K orders/month)
- Vercel free/pro plan
- AWS RDS `db.t3.medium`
- Single region (Mumbai)

### Phase 2: Growth (1K-10K orders/month)
- Vercel Pro plan
- RDS `db.r6g.large` with read replica
- Redis cache for sessions/popular queries
- Cloudflare CDN layer

### Phase 3: Scale (10K+ orders/month)
- Vercel Enterprise
- RDS Multi-AZ `db.r6g.xlarge`
- Multiple read replicas
- Dedicated search (Meilisearch/Algolia)
- Queue system (BullMQ) for background jobs

---

## 11. Launch Checklist

- [ ] All environment variables set in Vercel (production scope)
- [ ] Database migrations deployed to production
- [ ] Seed data loaded (categories, occasions)
- [ ] DNS records configured and propagated
- [ ] SSL certificate active
- [ ] Security headers verified (securityheaders.com)
- [ ] Lighthouse score > 90 on all key pages
- [ ] Sentry error tracking connected
- [ ] Uptime monitoring configured
- [ ] Google Analytics 4 + Search Console verified
- [ ] Sitemap submitted to Google
- [ ] Robots.txt verified
- [ ] Payment webhooks configured (Stripe/Razorpay)
- [ ] Email delivery tested (order confirmation, welcome)
- [ ] Admin account created
- [ ] Backup verified (restore test)
- [ ] Load test passed (50 concurrent users)

> **Deployment Principle:** Every deployment should be reversible within 2 minutes. If something breaks in production, roll back first, investigate second.

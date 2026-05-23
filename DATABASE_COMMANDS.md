# 🗄️ Database Commands Cheat Sheet

Quick reference for all database-related commands.

---

## 🚀 Quick Setup

### Using Docker (Recommended)
```bash
# Start PostgreSQL container
docker run --name kraafto-postgres \
  -e POSTGRES_USER=kraafto \
  -e POSTGRES_PASSWORD=kraafto123 \
  -e POSTGRES_DB=kraafto \
  -p 5432:5432 \
  -d postgres:15

# Verify it's running
docker ps | grep kraafto-postgres
```

### Using Local PostgreSQL
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE kraafto;
CREATE USER kraafto WITH PASSWORD 'kraafto123';
GRANT ALL PRIVILEGES ON DATABASE kraafto TO kraafto;
\q
```

---

## 📦 NPM Scripts

```bash
# Setup database (automated)
npm run db:setup

# Open Prisma Studio (database GUI)
npm run db:studio

# Create and apply migration
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Reset database (WARNING: deletes all data)
npm run db:reset

# Generate Prisma Client
npm run db:generate

# Push schema changes without migration
npm run db:push
```

---

## 🔧 Prisma Commands

### Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database and apply all migrations
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve --applied migration_name
```

### Database Operations
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes (no migration)
npx prisma db push

# Pull schema from database
npx prisma db pull

# Seed database
npx prisma db seed

# Execute SQL
npx prisma db execute --file script.sql
npx prisma db execute --stdin <<< "SELECT * FROM users;"
```

### Development Tools
```bash
# Open Prisma Studio
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# View Prisma version
npx prisma version
```

---

## 🐳 Docker Commands

### Container Management
```bash
# Start container
docker start kraafto-postgres

# Stop container
docker stop kraafto-postgres

# Restart container
docker restart kraafto-postgres

# Remove container (WARNING: deletes data)
docker rm -f kraafto-postgres

# View container logs
docker logs kraafto-postgres

# Follow logs in real-time
docker logs -f kraafto-postgres
```

### Database Access
```bash
# Access PostgreSQL shell
docker exec -it kraafto-postgres psql -U kraafto -d kraafto

# Run SQL command
docker exec kraafto-postgres psql -U kraafto -d kraafto -c "SELECT COUNT(*) FROM products;"

# Backup database
docker exec kraafto-postgres pg_dump -U kraafto kraafto > backup.sql

# Restore database
docker exec -i kraafto-postgres psql -U kraafto kraafto < backup.sql
```

---

## 🗃️ PostgreSQL Commands

### Inside psql shell
```sql
-- List all databases
\l

-- Connect to database
\c kraafto

-- List all tables
\dt

-- Describe table structure
\d products

-- List all users
\du

-- Show current database
SELECT current_database();

-- Show table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Count records in all tables
SELECT 
  schemaname,
  tablename,
  n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Exit psql
\q
```

### Common SQL Queries
```sql
-- Count products
SELECT COUNT(*) FROM products;

-- Count orders
SELECT COUNT(*) FROM orders;

-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Recent orders
SELECT * FROM orders ORDER BY "createdAt" DESC LIMIT 10;

-- Products with low stock
SELECT name, inventory FROM products WHERE inventory <= "lowStockThreshold";

-- Total revenue
SELECT SUM("grandTotal") FROM orders WHERE "paymentStatus" = 'PAID';
```

---

## 🔍 Troubleshooting Commands

### Check Database Connection
```bash
# Test connection
npx prisma db execute --stdin <<< "SELECT 1;"

# Check if PostgreSQL is running (Docker)
docker ps | grep kraafto-postgres

# Check if PostgreSQL is running (Linux)
sudo systemctl status postgresql

# Check PostgreSQL port
sudo lsof -i :5432
```

### Fix Common Issues
```bash
# Prisma Client out of sync
npx prisma generate

# Migration conflicts
npx prisma migrate reset
npx prisma migrate dev --name init

# Database connection issues
# 1. Check DATABASE_URL in .env
# 2. Verify PostgreSQL is running
# 3. Check firewall/port settings

# Port already in use
# Find process using port 5432
lsof -ti:5432
# Kill the process
lsof -ti:5432 | xargs kill -9
```

---

## 📊 Useful Queries

### Analytics
```sql
-- Revenue by month
SELECT 
  DATE_TRUNC('month', "createdAt") as month,
  SUM("grandTotal") as revenue,
  COUNT(*) as order_count
FROM orders
WHERE "paymentStatus" = 'PAID'
GROUP BY month
ORDER BY month DESC;

-- Top selling products
SELECT 
  p.name,
  SUM(oi.quantity) as units_sold,
  SUM(oi."totalPrice") as revenue
FROM order_items oi
JOIN products p ON oi."productId" = p.id
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 10;

-- Customer lifetime value
SELECT 
  u.email,
  u.name,
  COUNT(o.id) as order_count,
  SUM(o."grandTotal") as total_spent
FROM users u
JOIN orders o ON u.id = o."userId"
WHERE o."paymentStatus" = 'PAID'
GROUP BY u.id, u.email, u.name
ORDER BY total_spent DESC
LIMIT 20;
```

### Data Cleanup
```sql
-- Delete old sessions (older than 30 days)
DELETE FROM sessions WHERE expires < NOW() - INTERVAL '30 days';

-- Remove unverified users (older than 7 days)
DELETE FROM users 
WHERE "emailVerified" IS NULL 
AND "createdAt" < NOW() - INTERVAL '7 days';

-- Archive old orders (soft delete)
UPDATE orders 
SET "deletedAt" = NOW() 
WHERE "createdAt" < NOW() - INTERVAL '2 years';
```

---

## 🔐 Security Commands

### Backup & Restore
```bash
# Full backup
pg_dump -U kraafto -d kraafto -F c -f backup_$(date +%Y%m%d).dump

# Restore from backup
pg_restore -U kraafto -d kraafto -c backup_20240101.dump

# Backup specific tables
pg_dump -U kraafto -d kraafto -t products -t categories > products_backup.sql

# Backup with Docker
docker exec kraafto-postgres pg_dump -U kraafto kraafto > backup.sql
```

### User Management
```sql
-- Create read-only user
CREATE USER readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE kraafto TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- Revoke permissions
REVOKE ALL ON DATABASE kraafto FROM readonly;

-- Change password
ALTER USER kraafto WITH PASSWORD 'new_password';
```

---

## 📈 Performance Monitoring

### Check Query Performance
```sql
-- Slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Table statistics
SELECT * FROM pg_stat_user_tables;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Optimize Database
```sql
-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE kraafto;
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Open database GUI | `npm run db:studio` |
| Create migration | `npm run db:migrate` |
| Seed database | `npm run db:seed` |
| Reset database | `npm run db:reset` |
| Generate client | `npm run db:generate` |
| Start PostgreSQL | `docker start kraafto-postgres` |
| Stop PostgreSQL | `docker stop kraafto-postgres` |
| View logs | `docker logs kraafto-postgres` |
| Access DB shell | `docker exec -it kraafto-postgres psql -U kraafto -d kraafto` |
| Backup database | `docker exec kraafto-postgres pg_dump -U kraafto kraafto > backup.sql` |

---

## 📚 Resources

- **Prisma Docs:** https://www.prisma.io/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Docker Docs:** https://docs.docker.com/
- **Next.js Docs:** https://nextjs.org/docs

---

**Pro Tip:** Bookmark this file for quick access to database commands! 🔖

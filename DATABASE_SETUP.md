# 🗄️ Kraafto Database Setup Guide

This guide will help you set up a local PostgreSQL database for the Kraafto project.

---

## Prerequisites

You need PostgreSQL installed on your system. Choose one method:

### Option 1: Install PostgreSQL Directly

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### On Windows:
Download and install from: https://www.postgresql.org/download/windows/

### Option 2: Use Docker (Recommended for Development)

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name kraafto-postgres \
  -e POSTGRES_USER=kraafto \
  -e POSTGRES_PASSWORD=kraafto123 \
  -e POSTGRES_DB=kraafto \
  -p 5432:5432 \
  -d postgres:15

# Verify it's running
docker ps
```

---

## Step 1: Create Database

### If using direct PostgreSQL installation:

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE kraafto;
CREATE USER kraafto WITH PASSWORD 'kraafto123';
GRANT ALL PRIVILEGES ON DATABASE kraafto TO kraafto;
\q
```

### If using Docker:
The database is already created when you ran the container!

---

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and update the database URL:

**For local PostgreSQL:**
```env
DATABASE_URL="postgresql://kraafto:kraafto123@localhost:5432/kraafto"
```

**For Docker:**
```env
DATABASE_URL="postgresql://kraafto:kraafto123@localhost:5432/kraafto"
```

3. Generate a secure NextAuth secret:
```bash
openssl rand -base64 32
```

Copy the output and update `NEXTAUTH_SECRET` in `.env`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Run Database Migrations

This will create all the tables in your database:

```bash
npx prisma migrate dev --name init
```

You should see output like:
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied migration: 20240101000000_init
```

---

## Step 5: Seed the Database (Optional)

Populate your database with sample data:

```bash
npx prisma db seed
```

This will create:
- Sample categories (Lamps, Glass Decor, Art, etc.)
- Sample occasions (Birthday, Anniversary, Wedding, etc.)
- Sample tags (Handcrafted, Limited Edition, etc.)
- Sample products with images
- Admin user account
- Sample customer accounts

**Default Admin Credentials:**
- Email: `admin@kraafto.com`
- Password: `admin123`

**Sample Customer:**
- Email: `customer@example.com`
- Password: `customer123`

---

## Step 6: Verify Database Setup

### Check database connection:
```bash
npx prisma db pull
```

### Open Prisma Studio (Database GUI):
```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555` where you can:
- View all tables
- Browse data
- Edit records
- Test queries

---

## Step 7: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

---

## Common Commands

### Database Management

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push

# View database in browser
npx prisma studio

# Format schema file
npx prisma format
```

### Docker Commands (if using Docker)

```bash
# Start PostgreSQL container
docker start kraafto-postgres

# Stop PostgreSQL container
docker stop kraafto-postgres

# View logs
docker logs kraafto-postgres

# Access PostgreSQL shell
docker exec -it kraafto-postgres psql -U kraafto -d kraafto

# Remove container (WARNING: deletes all data)
docker rm -f kraafto-postgres
```

---

## Troubleshooting

### Error: "Can't reach database server"

**Solution 1:** Check if PostgreSQL is running
```bash
# For direct installation
sudo systemctl status postgresql

# For Docker
docker ps | grep kraafto-postgres
```

**Solution 2:** Check your DATABASE_URL in `.env`
- Make sure the username, password, and database name match
- Verify the port (default is 5432)

### Error: "Database does not exist"

```bash
# Create the database manually
sudo -u postgres psql -c "CREATE DATABASE kraafto;"

# Or with Docker
docker exec -it kraafto-postgres psql -U kraafto -c "CREATE DATABASE kraafto;"
```

### Error: "Migration failed"

```bash
# Reset and try again
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Error: "Port 5432 already in use"

Another PostgreSQL instance is running. Either:
1. Stop the other instance
2. Use a different port in your DATABASE_URL:
   ```env
   DATABASE_URL="postgresql://kraafto:kraafto123@localhost:5433/kraafto"
   ```
   And update your Docker run command:
   ```bash
   docker run ... -p 5433:5432 ...
   ```

### Error: "Prisma Client not generated"

```bash
npx prisma generate
```

---

## Database Schema Overview

The Kraafto database includes:

### Core Tables
- **users** - Customer and admin accounts
- **products** - Product catalog
- **product_images** - Product photos
- **product_variants** - Size/color variations
- **categories** - Product categories
- **tags** - Product tags
- **occasions** - Gift occasions

### Orders & Checkout
- **orders** - Customer orders
- **order_items** - Items in each order
- **gift_options** - Gift wrapping & messages
- **addresses** - Shipping addresses

### Marketing & Engagement
- **reviews** - Product reviews
- **wishlist_items** - Saved products
- **promo_codes** - Discount codes
- **gift_cards** - Gift card balances

### Authentication
- **accounts** - OAuth accounts (NextAuth)
- **sessions** - User sessions (NextAuth)
- **verification_tokens** - Email verification

---

## Production Deployment

For production, use a managed PostgreSQL service:

### Recommended Services:
1. **Supabase** (Free tier available)
   - https://supabase.com
   - Includes database, auth, and storage

2. **Railway** (Free tier available)
   - https://railway.app
   - Easy PostgreSQL deployment

3. **Neon** (Free tier available)
   - https://neon.tech
   - Serverless PostgreSQL

4. **AWS RDS**
   - Production-grade
   - Requires AWS account

### Steps for Production:
1. Create database on chosen service
2. Copy the connection string
3. Update `DATABASE_URL` in production environment
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

---

## Backup & Restore

### Backup Database

```bash
# Direct PostgreSQL
pg_dump -U kraafto -d kraafto > backup.sql

# Docker
docker exec kraafto-postgres pg_dump -U kraafto kraafto > backup.sql
```

### Restore Database

```bash
# Direct PostgreSQL
psql -U kraafto -d kraafto < backup.sql

# Docker
docker exec -i kraafto-postgres psql -U kraafto kraafto < backup.sql
```

---

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong passwords** in production
3. **Enable SSL** for production databases
4. **Regular backups** - Automate daily backups
5. **Limit database access** - Use firewall rules
6. **Monitor queries** - Use Prisma logging in development

---

## Next Steps

1. ✅ Database is set up
2. ✅ Tables are created
3. ✅ Sample data is loaded
4. 🚀 Start building features!

Visit the admin panel at `http://localhost:3000/admin` and log in with the admin credentials to start managing your store.

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Prisma docs: https://www.prisma.io/docs
3. Check PostgreSQL logs
4. Verify your `.env` configuration

Happy coding! 🎉

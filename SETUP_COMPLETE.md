# ✅ Kraafto Database Setup - Complete Guide

Your Kraafto project is ready for database setup! Follow the steps below.

---

## 📋 What's Been Prepared

✅ **Database Schema** - Complete Prisma schema with all models  
✅ **Seed Data** - Sample products, categories, users, and promo codes  
✅ **Setup Scripts** - Automated setup for Linux/macOS and Windows  
✅ **Environment Config** - `.env` file with secure credentials  
✅ **Documentation** - Comprehensive guides and references  
✅ **Admin Panel** - Full-featured admin interface  

---

## 🚀 Quick Setup (Choose One Method)

### Method 1: Automated Setup (Easiest) ⭐

#### On Linux/macOS:
```bash
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

#### On Windows:
```cmd
scripts\setup-db.bat
```

The script will:
1. Set up PostgreSQL (Docker or local)
2. Install dependencies
3. Run migrations
4. Seed sample data
5. Open Prisma Studio

### Method 2: Docker (Recommended)

```bash
# 1. Start PostgreSQL with Docker
docker run --name kraafto-postgres \
  -e POSTGRES_USER=kraafto \
  -e POSTGRES_PASSWORD=kraafto123 \
  -e POSTGRES_DB=kraafto \
  -p 5432:5432 \
  -d postgres:15

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Seed database
npx prisma db seed

# 6. Start development server
npm run dev
```

### Method 3: Local PostgreSQL

```bash
# 1. Create database
sudo -u postgres psql
CREATE DATABASE kraafto;
CREATE USER kraafto WITH PASSWORD 'kraafto123';
GRANT ALL PRIVILEGES ON DATABASE kraafto TO kraafto;
\q

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Seed database
npx prisma db seed

# 6. Start development server
npm run dev
```

---

## 🔑 Default Credentials

After seeding, you can log in with:

### Admin Account
- **URL:** http://localhost:3000/admin
- **Email:** `admin@kraafto.com`
- **Password:** `Admin@Kraafto2026`

### Demo Customer
- **Email:** `demo@kraafto.com`
- **Password:** `Customer@123`

---

## 📊 What Gets Created

### Database Tables (20+)
- **users** - Customer and admin accounts
- **products** - Product catalog (8 sample products)
- **product_images** - Product photos
- **categories** - 6 categories (Lighting, Dining, etc.)
- **occasions** - 8 occasions (Birthday, Wedding, etc.)
- **tags** - 5 tags (Handcrafted, Limited Edition, etc.)
- **orders** - Customer orders
- **order_items** - Order line items
- **gift_options** - Gift wrapping & messages
- **reviews** - Product reviews
- **promo_codes** - 2 sample codes (WELCOME10, FREESHIP)
- **wishlist_items** - Saved products
- **addresses** - Shipping addresses
- **sessions** - User sessions
- **accounts** - OAuth accounts

### Sample Data
- ✅ 8 Premium Products (with images)
- ✅ 6 Categories
- ✅ 8 Gift Occasions
- ✅ 5 Product Tags
- ✅ 2 Promo Codes
- ✅ 1 Admin User
- ✅ 1 Demo Customer

---

## 🎯 Next Steps

### 1. Verify Setup
```bash
# Open Prisma Studio to view data
npx prisma studio
```
Visit http://localhost:5555 to browse your database

### 2. Start Development
```bash
# Start the dev server
npm run dev
```
Visit http://localhost:3000

### 3. Explore Admin Panel
1. Go to http://localhost:3000/admin
2. Log in with admin credentials
3. Explore:
   - Dashboard with analytics
   - Product management
   - Inventory tracking
   - Order management
   - Customer management
   - Review moderation
   - Promo codes
   - Sales & promotions

### 4. Test Customer Experience
1. Go to http://localhost:3000
2. Browse products
3. Add items to cart
4. Try gift wrapping options
5. Create a customer account
6. Add products to wishlist

---

## 📚 Documentation

Your project includes comprehensive documentation:

| Document | Description |
|----------|-------------|
| **[QUICK_START.md](./QUICK_START.md)** | 5-minute quick start guide |
| **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** | Detailed database setup |
| **[DATABASE_COMMANDS.md](./DATABASE_COMMANDS.md)** | Command reference |
| **[docs/admin-panel.md](./docs/admin-panel.md)** | Admin panel guide |
| **[docs/api.md](./docs/api.md)** | API documentation |
| **[docs/database.md](./docs/database.md)** | Database schema |
| **[docs/features.md](./docs/features.md)** | Feature specifications |

---

## 🛠️ Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
```

### Database
```bash
npm run db:studio        # Open Prisma Studio
npm run db:migrate       # Create migration
npm run db:seed          # Seed database
npm run db:reset         # Reset database
npm run db:generate      # Generate Prisma Client
```

### Docker
```bash
docker start kraafto-postgres   # Start database
docker stop kraafto-postgres    # Stop database
docker logs kraafto-postgres    # View logs
```

---

## 🔍 Verify Your Setup

### Check Database Connection
```bash
npx prisma db execute --stdin <<< "SELECT 1;"
```
✅ Should return: `1`

### Check Tables
```bash
npx prisma studio
```
✅ Should show 20+ tables with data

### Check Products
```bash
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM products;"
```
✅ Should return: `8`

### Check Admin User
```bash
npx prisma db execute --stdin <<< "SELECT email, role FROM users WHERE role = 'SUPER_ADMIN';"
```
✅ Should return: `admin@kraafto.com | SUPER_ADMIN`

---

## ⚠️ Troubleshooting

### "Can't reach database server"
**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep kraafto-postgres
# OR
sudo systemctl status postgresql

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### "Prisma Client not generated"
**Solution:**
```bash
npx prisma generate
```

### "Migration failed"
**Solution:**
```bash
# Reset and try again
npx prisma migrate reset
npx prisma migrate dev --name init
```

### "Port 5432 already in use"
**Solution:**
```bash
# Find what's using the port
sudo lsof -i :5432

# Kill the process or use a different port
```

### "Seed failed"
**Solution:**
```bash
# Check if bcryptjs is installed
npm install bcryptjs @types/bcryptjs

# Try seeding again
npx prisma db seed
```

---

## 🎨 Customize Your Store

### 1. Update Branding
- Edit `src/app/globals.css` for colors
- Update `tailwind.config.js` for theme
- Replace logo in `public/`

### 2. Add Products
- Use admin panel: http://localhost:3000/admin/products
- Or edit `prisma/seed.ts` and run `npm run db:seed`

### 3. Configure Payments
- Get Stripe keys: https://stripe.com
- Or Razorpay keys: https://razorpay.com
- Add to `.env`

### 4. Set Up Email
- Sign up for Resend: https://resend.com
- Add API key to `.env`

---

## 🚢 Deploy to Production

### Recommended Stack
- **Frontend:** Vercel
- **Database:** Supabase / Railway / Neon
- **Storage:** Cloudinary
- **Email:** Resend

### Quick Deploy
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See [docs/deployment.md](./docs/deployment.md) for details.

---

## 📊 Database Statistics

After setup, your database will have:

| Metric | Count |
|--------|-------|
| Tables | 20+ |
| Products | 8 |
| Categories | 6 |
| Occasions | 8 |
| Tags | 5 |
| Promo Codes | 2 |
| Users | 2 |
| Images | 8 |

---

## 🎉 You're All Set!

Your Kraafto e-commerce platform is ready for development!

### What You Can Do Now:
1. ✅ Browse products at http://localhost:3000
2. ✅ Manage store at http://localhost:3000/admin
3. ✅ View database at http://localhost:5555 (Prisma Studio)
4. ✅ Start customizing and building features
5. ✅ Deploy to production when ready

---

## 💡 Pro Tips

1. **Use Prisma Studio** - Best way to view and edit data
2. **Check Seed File** - See `prisma/seed.ts` for data structure
3. **Read the Docs** - Comprehensive guides in `docs/` folder
4. **Test Locally** - Always test before deploying
5. **Backup Data** - Use `pg_dump` for backups

---

## 🆘 Need Help?

1. Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup
2. Review [DATABASE_COMMANDS.md](./DATABASE_COMMANDS.md) for commands
3. Read [QUICK_START.md](./QUICK_START.md) for quick reference
4. Check troubleshooting section above

---

## 📞 Support

For issues or questions:
- Check documentation in `docs/` folder
- Review error messages carefully
- Verify `.env` configuration
- Check PostgreSQL logs

---

**Happy Building! 🚀**

Your luxury gifting platform awaits!

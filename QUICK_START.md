# 🚀 Kraafto Quick Start Guide

Get your Kraafto development environment up and running in minutes!

---

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ OR **Docker** ([Download Docker](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

---

## Quick Setup (5 minutes)

### Option 1: Automated Setup (Recommended)

#### On Linux/macOS:
```bash
# Run the setup script
./scripts/setup-db.sh
```

#### On Windows:
```cmd
# Run the setup script
scripts\setup-db.bat
```

The script will:
1. ✅ Create `.env` file
2. ✅ Set up PostgreSQL (Docker or local)
3. ✅ Install dependencies
4. ✅ Run database migrations
5. ✅ Seed sample data
6. ✅ Open Prisma Studio

### Option 2: Manual Setup

#### Step 1: Clone & Install
```bash
git clone <your-repo-url>
cd kraafto
npm install
```

#### Step 2: Database Setup

**Using Docker (Easiest):**
```bash
docker run --name kraafto-postgres \
  -e POSTGRES_USER=kraafto \
  -e POSTGRES_PASSWORD=kraafto123 \
  -e POSTGRES_DB=kraafto \
  -p 5432:5432 \
  -d postgres:15
```

**Using Local PostgreSQL:**
```bash
sudo -u postgres psql
CREATE DATABASE kraafto;
CREATE USER kraafto WITH PASSWORD 'kraafto123';
GRANT ALL PRIVILEGES ON DATABASE kraafto TO kraafto;
\q
```

#### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL="postgresql://kraafto:kraafto123@localhost:5432/kraafto"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
```

#### Step 4: Initialize Database
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

#### Step 5: Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## Default Credentials

### Admin Panel
- **URL:** http://localhost:3000/admin
- **Email:** admin@kraafto.com
- **Password:** Admin@Kraafto2026

### Demo Customer
- **Email:** demo@kraafto.com
- **Password:** Customer@123

---

## Essential Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create & apply migration
npx prisma migrate reset       # Reset database (deletes all data!)
npx prisma db seed             # Seed sample data
npx prisma generate            # Generate Prisma Client
npx prisma format              # Format schema file
```

### Docker (if using)
```bash
docker start kraafto-postgres  # Start database
docker stop kraafto-postgres   # Stop database
docker logs kraafto-postgres   # View logs
docker exec -it kraafto-postgres psql -U kraafto -d kraafto  # Access DB shell
```

---

## Project Structure

```
kraafto/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Auth pages (login, register)
│   │   ├── admin/          # Admin panel
│   │   ├── api/            # API routes
│   │   └── ...             # Public pages
│   ├── components/         # React components
│   ├── lib/                # Utilities & configs
│   └── styles/             # Global styles
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── docs/                   # Documentation
├── scripts/                # Setup scripts
└── public/                 # Static assets
```

---

## Key Features

### Customer Features
- 🛍️ Product browsing & search
- 🎁 Gift wrapping & custom messages
- 💳 Secure checkout (Stripe/Razorpay)
- ❤️ Wishlist
- ⭐ Product reviews
- 📦 Order tracking
- 👤 User account management

### Admin Features
- 📊 Dashboard with analytics
- 📦 Product management
- 📋 Inventory tracking
- 🛒 Order management
- 👥 Customer management
- ⭐ Review moderation
- 🏷️ Promo codes
- 💰 Sales & promotions

---

## Troubleshooting

### "Can't reach database server"
```bash
# Check if PostgreSQL is running
docker ps | grep kraafto-postgres
# OR
sudo systemctl status postgresql

# Verify DATABASE_URL in .env
```

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Port 3000 already in use"
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# OR use a different port
PORT=3001 npm run dev
```

### "Migration failed"
```bash
# Reset and try again
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Database connection issues
```bash
# Test connection
npx prisma db execute --stdin <<< "SELECT 1;"

# Check PostgreSQL logs (Docker)
docker logs kraafto-postgres
```

---

## Development Workflow

### Adding a New Feature
1. Create database changes in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name feature_name`
3. Update API routes in `src/app/api/`
4. Create UI components in `src/components/`
5. Add pages in `src/app/`
6. Test thoroughly
7. Commit changes

### Database Changes
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name change_description`
3. Update seed file if needed
4. Test with `npx prisma db seed`

---

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret key
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)

### Optional (for full functionality)
- `STRIPE_SECRET_KEY` - Stripe payment integration
- `RAZORPAY_KEY_ID` - Razorpay payment integration
- `CLOUDINARY_CLOUD_NAME` - Image storage
- `RESEND_API_KEY` - Email notifications
- `GOOGLE_CLIENT_ID` - Google OAuth login

---

## Next Steps

1. ✅ **Explore the Admin Panel**
   - Visit http://localhost:3000/admin
   - Add products, create promo codes, manage orders

2. ✅ **Customize the Design**
   - Edit `src/app/globals.css` for global styles
   - Update colors in `tailwind.config.js`
   - Modify components in `src/components/`

3. ✅ **Set Up Payments**
   - Get Stripe API keys from https://stripe.com
   - Or use Razorpay for Indian payments
   - Add keys to `.env`

4. ✅ **Configure Email**
   - Sign up for Resend at https://resend.com
   - Add API key to `.env`
   - Test order confirmation emails

5. ✅ **Deploy to Production**
   - See `docs/deployment.md` for deployment guide
   - Use Vercel for easy deployment
   - Set up production database (Supabase/Railway/Neon)

---

## Resources

- **Documentation:** See `docs/` folder
- **Database Schema:** `prisma/schema.prisma`
- **API Routes:** `docs/api.md`
- **Admin Panel:** `docs/admin-panel.md`
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## Support

### Common Issues
- Check `DATABASE_SETUP.md` for detailed database setup
- Review `docs/` folder for feature documentation
- Ensure all environment variables are set

### Getting Help
1. Check the troubleshooting section above
2. Review error messages carefully
3. Check PostgreSQL logs
4. Verify `.env` configuration

---

## Tips for Success

1. **Use Prisma Studio** - Great for viewing and editing data
2. **Check the Seed File** - See `prisma/seed.ts` for sample data structure
3. **Read the Docs** - The `docs/` folder has detailed guides
4. **Test Locally First** - Always test changes before deploying
5. **Backup Your Data** - Use `pg_dump` for backups

---

Happy coding! 🎉

If you encounter any issues, refer to `DATABASE_SETUP.md` for detailed troubleshooting steps.

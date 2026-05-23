#!/bin/bash

# Kraafto Database Setup Script
# This script automates the local PostgreSQL database setup

set -e

echo "🗄️  Kraafto Database Setup"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Please update the following in .env:${NC}"
    echo "   1. DATABASE_URL (if not using default)"
    echo "   2. NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo ""
    read -p "Press Enter to continue after updating .env..."
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    
    # Ask if user wants to use Docker
    read -p "Do you want to use Docker for PostgreSQL? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "🐳 Setting up PostgreSQL with Docker..."
        
        # Check if container already exists
        if docker ps -a | grep -q kraafto-postgres; then
            echo -e "${YELLOW}⚠️  Container 'kraafto-postgres' already exists${NC}"
            read -p "Do you want to remove it and create a new one? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker rm -f kraafto-postgres
                echo -e "${GREEN}✅ Removed existing container${NC}"
            else
                echo "Using existing container..."
                docker start kraafto-postgres 2>/dev/null || true
            fi
        fi
        
        # Create new container if it doesn't exist
        if ! docker ps -a | grep -q kraafto-postgres; then
            docker run --name kraafto-postgres \
              -e POSTGRES_USER=kraafto \
              -e POSTGRES_PASSWORD=kraafto123 \
              -e POSTGRES_DB=kraafto \
              -p 5432:5432 \
              -d postgres:15
            
            echo -e "${GREEN}✅ PostgreSQL container created and started${NC}"
            echo "   Container name: kraafto-postgres"
            echo "   Port: 5432"
            echo "   Database: kraafto"
            echo "   User: kraafto"
            echo "   Password: kraafto123"
            echo ""
            echo "   DATABASE_URL: postgresql://kraafto:kraafto123@localhost:5432/kraafto"
            echo ""
            
            # Wait for PostgreSQL to be ready
            echo "⏳ Waiting for PostgreSQL to be ready..."
            sleep 5
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Docker not found. Make sure PostgreSQL is installed and running.${NC}"
    echo ""
fi

# Check if PostgreSQL is accessible
echo "🔍 Checking database connection..."
if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Cannot connect to database${NC}"
    echo ""
    echo "Please ensure:"
    echo "  1. PostgreSQL is running"
    echo "  2. DATABASE_URL in .env is correct"
    echo "  3. Database 'kraafto' exists"
    echo ""
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"

# Run migrations
echo ""
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init
echo -e "${GREEN}✅ Migrations completed${NC}"

# Seed database
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
    echo -e "${GREEN}✅ Database seeded${NC}"
    echo ""
    echo "📋 Default Credentials:"
    echo "   Admin:    admin@kraafto.com / Admin@Kraafto2026"
    echo "   Customer: demo@kraafto.com / Customer@123"
fi

# Success message
echo ""
echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start the development server: npm run dev"
echo "  2. Visit http://localhost:3000"
echo "  3. Access admin panel: http://localhost:3000/admin"
echo "  4. Open Prisma Studio: npx prisma studio"
echo ""
echo "Useful commands:"
echo "  - View database: npx prisma studio"
echo "  - Reset database: npx prisma migrate reset"
echo "  - Generate client: npx prisma generate"
echo ""

# Ask if user wants to open Prisma Studio
read -p "Do you want to open Prisma Studio now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Opening Prisma Studio..."
    npx prisma studio
fi

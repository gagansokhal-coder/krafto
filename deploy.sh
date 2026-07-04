#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /home/ubuntu/krafto

# Force-sync with remote
echo "📥 Fetching latest code..."
git fetch origin main
git reset --hard origin/main
git clean -fd

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Remove old build and rebuild
echo "🗑️ Removing old build..."
rm -rf .next

echo "🔨 Building Next.js application..."
npm run build

# Verify build
if [ ! -d ".next/static" ]; then
  echo "❌ Build failed - .next/static not found!"
  exit 1
fi
echo "✅ Build successful"

# Restart PM2 (delete + start fresh)
echo "♻️ Restarting application..."
pm2 delete krafto 2>/dev/null || true
pm2 start npm --name "krafto" -- start
pm2 save

echo "✅ Deployment complete!"

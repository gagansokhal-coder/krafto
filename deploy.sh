#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/ubuntu/krafto

# Pull latest code
echo "📥 Pulling latest code from main..."
git pull origin main

# Install dependencies (in case new packages were added)
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the Next.js app (this generates .next/ with static files)
echo "🔨 Building Next.js application..."
npm run build

# Copy static assets and public folder into standalone output
# (standalone mode requires these to be copied manually)
echo "📂 Copying static assets..."
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
cp -r public .next/standalone/public 2>/dev/null || true

# Restart the app using PM2
echo "♻️ Restarting application..."
if pm2 describe krafto > /dev/null 2>&1; then
  pm2 restart krafto
else
  # First time: start the standalone server with PM2
  # The standalone server runs on port 3000 by default
  pm2 start .next/standalone/server.js --name "krafto"
  pm2 save
fi

echo "✅ Deployment complete!"

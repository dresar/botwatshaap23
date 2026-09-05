#!/bin/bash

# WhatsApp Super Bot Startup Script
echo "🤖 Starting WhatsApp Super Bot..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the bot directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "🚀 Starting with PM2..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo "✅ Bot started with PM2!"
    echo "📊 Check status: pm2 status"
    echo "📋 View logs: pm2 logs whatsapp-super-bot"
else
    echo "🚀 Starting with Node.js..."
    node app.js
fi 
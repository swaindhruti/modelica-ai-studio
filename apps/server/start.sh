#!/bin/sh
set -e

echo "🚀 Starting Modelia AI Studio Server..."

# Wait a bit for database to be fully ready
echo "⏳ Waiting for database to be ready..."
sleep 2

# Run database migrations
echo "📦 Running database migrations..."
pnpm db:push

echo "✅ Migrations completed successfully!"

# Start the server
echo "🌟 Starting the server..."
exec pnpm start

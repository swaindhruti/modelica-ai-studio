# Server Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/server ./apps/server

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the server
WORKDIR /app/apps/server
RUN pnpm build

# Copy startup script
COPY apps/server/start.sh /app/apps/server/start.sh
RUN chmod +x /app/apps/server/start.sh

# Expose port
EXPOSE 3000

# Start the server with migrations
CMD ["/app/apps/server/start.sh"]

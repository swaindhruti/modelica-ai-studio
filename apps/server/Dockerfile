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

# Expose port
EXPOSE 3000

# Start the server
CMD ["pnpm", "start"]

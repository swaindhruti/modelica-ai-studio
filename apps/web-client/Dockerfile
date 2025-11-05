# Web Client Dockerfile
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/web-client ./apps/web-client

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the web client
WORKDIR /app/apps/web-client
RUN pnpm build

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/apps/web-client/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web-client/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

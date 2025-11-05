# Docker Setup Guide

This guide will help you run the entire Modelia AI Studio stack using Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Create environment file**

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file and set your values:**
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset

3. **Build and start all services**

   ```bash
   docker-compose up --build
   ```

   Or run in detached mode:

   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - Web Client: http://localhost:8080
   - Backend API: http://localhost:3000
   - Database: localhost:5432

## Services

### PostgreSQL Database (`db`)

- **Port:** 5432
- **Database:** modelia
- **User:** postgres
- **Password:** postgres (change in production!)
- **Data:** Persisted in Docker volume `postgres_data`

### Backend Server (`server`)

- **Port:** 3000
- **Health Check:** http://localhost:3000/health
- **Environment:** Production mode

### Web Client (`web`)

- **Port:** 8080
- **Server:** Nginx
- **Built with:** Vite

## Common Commands

### Start services

```bash
docker-compose up
```

### Stop services

```bash
docker-compose down
```

### Stop services and remove volumes (⚠️ deletes database data)

```bash
docker-compose down -v
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f web
docker-compose logs -f db
```

### Rebuild services

```bash
docker-compose up --build
```

### Run database migrations

```bash
docker-compose exec server pnpm db:push
```

### Access database shell

```bash
docker-compose exec db psql -U postgres -d modelia
```

### Execute commands in containers

```bash
# Server shell
docker-compose exec server sh

# Database shell
docker-compose exec db sh
```

## Development vs Production

### For Development

The current setup is optimized for local development. For production:

1. Change database credentials in `.env`
2. Use a strong `JWT_SECRET`
3. Set up proper SSL/TLS certificates
4. Configure proper CORS origins in `apps/server/src/server.ts`
5. Use environment-specific configurations

### Production Considerations

- Use Docker secrets for sensitive data
- Set up a reverse proxy (Traefik, Nginx) with SSL
- Configure proper backup strategies for the database
- Use health checks and restart policies
- Monitor container logs and metrics

## Troubleshooting

### Port already in use

If you get "port already in use" errors:

```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :8080
sudo lsof -i :5432

# Change ports in docker-compose.yml if needed
```

### Database connection issues

```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Clear everything and start fresh

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Environment Variables Reference

| Variable                        | Required | Description                | Default  |
| ------------------------------- | -------- | -------------------------- | -------- |
| `JWT_SECRET`                    | Yes      | Secret key for JWT signing | -        |
| `VITE_CLOUDINARY_CLOUD_NAME`    | Yes      | Cloudinary cloud name      | -        |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Yes      | Cloudinary upload preset   | -        |
| `POSTGRES_USER`                 | No       | Database user              | postgres |
| `POSTGRES_PASSWORD`             | No       | Database password          | postgres |
| `POSTGRES_DB`                   | No       | Database name              | modelia  |

## Network

All services are connected via a custom network called `modelia-network`. This allows services to communicate with each other using service names (e.g., `http://server:3000`).

## Volumes

- `postgres_data`: Persists PostgreSQL database data across container restarts

To backup the database:

```bash
docker-compose exec db pg_dump -U postgres modelia > backup.sql
```

To restore from backup:

```bash
docker-compose exec -T db psql -U postgres modelia < backup.sql
```

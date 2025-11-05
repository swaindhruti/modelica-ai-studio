# Docker Setup Complete! 🐳

## What Was Created

I've set up a complete Docker environment for your Modelia AI Studio project:

### Files Created:

1. **`docker-compose.yml`** - Main orchestration file for all services
2. **`apps/server/Dockerfile`** - Backend server container
3. **`apps/web-client/Dockerfile`** - Frontend web client container
4. **`apps/web-client/nginx.conf`** - Nginx configuration for serving the frontend
5. **`.dockerignore`** - Files to exclude from Docker builds
6. **`.env.example`** - Template for environment variables
7. **`.env`** - Your actual environment file (edit this!)
8. **`docker.sh`** - Helper script for common Docker commands
9. **`README.docker.md`** - Comprehensive Docker documentation

## Architecture

```
┌─────────────────┐
│   Web Client    │  nginx:alpine serving React app
│   Port: 8080    │  Built with Vite
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Backend API   │  Node.js + Fastify
│   Port: 3000    │  Running with ES modules
└────────┬────────┘
         │
         │ SQL Queries
         ▼
┌─────────────────┐
│   PostgreSQL    │  postgres:16-alpine
│   Port: 5432    │  Data persisted in volume
└─────────────────┘
```

## Quick Start

### 1. Edit Environment Variables

```bash
nano .env
```

Set these required variables:

- `JWT_SECRET=your-secret-key-change-this` (generate a random string)
- `VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name` (if using Cloudinary)
- `VITE_CLOUDINARY_UPLOAD_PRESET=your-preset` (if using Cloudinary)

### 2. Start Everything

```bash
# Make script executable (already done)
chmod +x docker.sh

# Start all services
./docker.sh start
```

### 3. Access Your Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/health
- **Database**: localhost:5432

### 4. Run Database Migrations

```bash
./docker.sh migrate
```

## Common Commands

```bash
# View logs in real-time
./docker.sh logs

# Check service status
./docker.sh status

# Stop services
./docker.sh stop

# Restart services
./docker.sh restart

# Reset everything (deletes database!)
./docker.sh reset
```

## What Each Service Does

### Database (PostgreSQL)

- Runs on port 5432
- Data persists in Docker volume `postgres_data`
- Credentials: postgres/postgres (change in production!)
- Health checks ensure it's ready before other services start

### Backend Server

- Builds from source using pnpm
- Compiles TypeScript to JavaScript
- Runs in production mode
- Auto-restarts on failure
- Waits for database to be healthy

### Web Client

- Two-stage build (builder + nginx)
- Vite builds optimized production bundle
- Nginx serves static files
- Includes caching and security headers
- Environment variables baked into build

## Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :8080
sudo lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

### Services Won't Start

```bash
# Check Docker is running
docker info

# View service logs
docker-compose logs server
docker-compose logs web
docker-compose logs db

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Database Connection Issues

```bash
# Check database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Connect to database directly
docker-compose exec db psql -U postgres -d modelia
```

### Frontend Can't Connect to Backend

Make sure the CORS origins in `apps/server/src/server.ts` include `http://localhost:8080`.

## Production Deployment

For production:

1. **Change Database Credentials**: Don't use postgres/postgres!
2. **Set Strong JWT_SECRET**: Use a cryptographically secure random string
3. **Configure CORS**: Restrict to your actual domain
4. **Use Environment-Specific .env**: Don't commit .env to git
5. **Set Up SSL/TLS**: Use a reverse proxy (Traefik, Caddy, or nginx)
6. **Enable Backups**: Regular database backups
7. **Monitor Services**: Set up logging and alerting

## Next Steps

1. Edit `.env` with your actual values
2. Run `./docker.sh start`
3. Wait for services to start (check with `./docker.sh status`)
4. Run migrations: `./docker.sh migrate`
5. Open http://localhost:8080 in your browser
6. Create an account and start generating!

## Files to Commit

These files should be committed to git:

- `docker-compose.yml`
- `apps/server/Dockerfile`
- `apps/web-client/Dockerfile`
- `apps/web-client/nginx.conf`
- `.dockerignore`
- `.env.example`
- `docker.sh`
- `README.docker.md`

**DO NOT commit `.env`** - it's already in `.gitignore`!

## Need Help?

- Full Docker docs: `README.docker.md`
- Main README: `README.md`
- Server docs: `apps/server/README.md`
- Client docs: `apps/web-client/README.md`

Happy coding! 🚀

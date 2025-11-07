# Docker Setup Complete! 🐳

## 🚀 Zero-Config Quick Start for Testing

Want to test immediately without any setup? Just run:

```bash
docker-compose up --build
```

That's it! Everything will work automatically:

- ✅ Database starts and becomes ready
- ✅ Migrations run automatically
- ✅ Server starts on port 3000
- ✅ Frontend starts on port 8080
- ✅ No `.env` file needed for testing!

**Access the application:**

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/health
- **Database**: localhost:5432

## What Was Created

I've set up a complete Docker environment for your Modelia AI Studio project with zero-configuration testing support:

### Files Created:

1. **`docker-compose.yml`** - Main orchestration file with sensible defaults
2. **`apps/server/Dockerfile`** - Backend server container
3. **`apps/server/start.sh`** - Startup script that runs migrations automatically
4. **`apps/web-client/Dockerfile`** - Frontend web client container
5. **`apps/web-client/nginx.conf`** - Nginx configuration for serving the frontend
6. **`.dockerignore`** - Files to exclude from Docker builds
7. **`.env.example`** - Template for optional environment variables
8. **`docker.sh`** - Helper script for common Docker commands
9. **`README.docker.md`** - Comprehensive Docker documentation

### Key Features:

- 🎯 **Zero Configuration**: Works out of the box without any `.env` file
- 🔄 **Auto Migrations**: Database migrations run automatically on startup
- 🔧 **Sensible Defaults**: Pre-configured with test-ready values
- 📦 **Self-Contained**: Everything runs in Docker - no local dependencies
- 🌐 **Optional Cloudinary**: Falls back to local image preview if not configured

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

### Testing (No Configuration Required)

```bash
# Just run this - everything works automatically!
docker-compose up --build
```

### Production (Custom Configuration)

### 1. Edit Environment Variables (Optional for Testing)

For production or to enable Cloudinary uploads, create a `.env` file:

```bash
cp .env.example .env
nano .env
```

Set these variables for production:

- `JWT_SECRET=your-secret-key-change-this` (generate a secure random string)
- `VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name` (optional - for image uploads)
- `VITE_CLOUDINARY_UPLOAD_PRESET=your-preset` (optional - for image uploads)

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

### 4. Migrations

**Migrations run automatically on server startup!** You don't need to do anything.

If you need to run them manually for some reason:

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

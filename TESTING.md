# Testing with Docker - Zero Configuration Guide

This guide is for testers who want to quickly spin up and test the Modelia AI Studio application without any configuration.

## 🚀 Quick Start (30 seconds!)

1. **Clone the repository** (if you haven't already)

   ```bash
   git clone <repository-url>
   cd modelia-ai-studio
   ```

2. **Start everything with Docker**

   ```bash
   docker-compose up --build
   ```

3. **Wait for startup** (about 1-2 minutes for first build)

   You'll see messages like:

   ```
   ✅ Migrations completed successfully!
   🌟 Starting the server...
   ```

4. **Open your browser**
   - Go to: http://localhost:8080

That's it! No environment files, no configuration, no manual database setup needed.

## What You Get

### ✅ Fully Working Features

- **User Registration & Login**: Create accounts and sign in
- **JWT Authentication**: Secure token-based auth
- **Generation Management**: Create, view, update, delete generations
- **Database Persistence**: All data persisted in PostgreSQL
- **Image Preview**: Upload and preview images locally

### ⚠️ Limited Features (without additional config)

- **Cloudinary Uploads**: Images work in local preview mode only
  - To enable cloud uploads, you'll need to configure Cloudinary (see Production Setup below)

## Testing Workflow

### 1. Create an Account

- Navigate to http://localhost:8080
- Click "Sign Up" or "Register"
- Enter your details
- Submit

### 2. Log In

- Use your credentials to log in
- You'll receive a JWT token automatically

### 3. Test Generations

- Create new generations
- Upload images (local preview mode)
- View your generations
- Edit and delete

### 4. Test API Directly

- API Health Check: http://localhost:3000/health
- API Base URL: http://localhost:3000
- Check logs: `docker-compose logs -f server`

## Common Testing Scenarios

### Scenario 1: Fresh Start

```bash
# Stop everything and remove data
docker-compose down -v

# Start fresh
docker-compose up --build
```

### Scenario 2: Check Logs

```bash
# All services
docker-compose logs -f

# Just the server
docker-compose logs -f server

# Just the database
docker-compose logs -f db
```

### Scenario 3: Database Access

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U postgres -d modelia

# Check tables
\dt

# View users
SELECT * FROM users;

# Exit
\q
```

### Scenario 4: Run Commands in Server

```bash
# Open shell in server container
docker-compose exec server sh

# Run commands
pnpm db:push
pnpm test

# Exit
exit
```

## Troubleshooting

### Port Already in Use

If ports 3000, 5432, or 8080 are already in use:

```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :8080
sudo lsof -i :5432

# Kill the process or edit docker-compose.yml to use different ports
```

### Services Won't Start

```bash
# Check Docker is running
docker info

# View detailed logs
docker-compose logs

# Reset everything
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Database Connection Issues

```bash
# Check if database is healthy
docker-compose ps

# Should show db as "healthy"
# If not, check db logs
docker-compose logs db
```

### Frontend Can't Reach Backend

1. Check if server is running: http://localhost:3000/health
2. Check server logs: `docker-compose logs -f server`
3. Verify CORS settings allow localhost:8080

### Image Upload Issues

Without Cloudinary configured:

- ✅ Local preview works
- ❌ Cloud storage doesn't work
- ℹ️ You'll see: "Image loaded (local preview only - Cloudinary not configured)"

This is normal for testing! Images are still displayed in the UI.

## Production Setup (Optional)

To enable all features including Cloudinary uploads:

1. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

2. **Add your Cloudinary credentials**

   ```bash
   # Edit .env
   JWT_SECRET=your-secure-random-string
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
   ```

3. **Restart**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

## Architecture Overview

```
┌─────────────────────┐
│   Browser           │
│   localhost:8080    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Nginx             │
│   (Web Client)      │
│   Port: 80          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Fastify Server    │
│   (Backend API)     │
│   Port: 3000        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   PostgreSQL        │
│   (Database)        │
│   Port: 5432        │
└─────────────────────┘
```

## Test Credentials

For testing, you can use any credentials you want. The system will:

- Hash passwords securely with bcrypt
- Generate JWT tokens automatically
- Store everything in the PostgreSQL database

Example:

- Email: `test@example.com`
- Password: `password123`

(Create this account through the UI when you first access the app)

## Stopping the Application

```bash
# Stop but keep data
docker-compose down

# Stop and remove all data (fresh start next time)
docker-compose down -v
```

## Performance Tips

First build takes longer (1-2 minutes) because it:

- Downloads Docker images
- Installs all dependencies
- Builds TypeScript
- Creates database

Subsequent starts are much faster (10-20 seconds).

## Need Help?

- Main README: `README.md`
- Docker Setup Details: `DOCKER_SETUP.md`
- Full Docker Guide: `README.docker.md`
- Server Docs: `apps/server/README.md`

## Automated Features

The following happen automatically on `docker-compose up`:

1. ✅ PostgreSQL starts with health checks
2. ✅ Server waits for database to be ready
3. ✅ Database migrations run automatically
4. ✅ Server starts and listens on port 3000
5. ✅ Frontend builds and serves on port 8080
6. ✅ All services are connected on a Docker network
7. ✅ Data persists in Docker volumes

Zero manual intervention required! 🎉

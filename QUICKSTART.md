# 🎯 Quick Reference - Zero-Config Docker Testing

## For Testers: One Command to Rule Them All

```bash
docker-compose up --build
```

Then open: **http://localhost:8080**

## What Happens Automatically

1. 🗄️ PostgreSQL starts (with health checks)
2. ⏳ Server waits for database to be ready
3. 📦 Migrations run automatically
4. 🚀 Backend API starts on port 3000
5. 🌐 Frontend starts on port 8080
6. ✅ Everything is ready to test!

## Quick Commands

```bash
# Start everything
docker-compose up --build

# Start in background (detached mode)
docker-compose up -d --build

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f server
docker-compose logs -f web
docker-compose logs -f db

# Stop everything (keep data)
docker-compose down

# Stop and delete all data (fresh start)
docker-compose down -v

# Check service status
docker-compose ps

# Access database
docker-compose exec db psql -U postgres -d modelia

# Open shell in server
docker-compose exec server sh
```

## Access Points

| Service  | URL                          | Description                    |
| -------- | ---------------------------- | ------------------------------ |
| Frontend | http://localhost:8080        | Main web application           |
| Backend  | http://localhost:3000        | REST API                       |
| Health   | http://localhost:3000/health | API health check               |
| Database | localhost:5432               | PostgreSQL (postgres/postgres) |

## Test Workflow

1. **Start**: `docker-compose up --build`
2. **Wait**: ~1-2 minutes for first build
3. **Test**: Open http://localhost:8080
4. **Register**: Create a test account
5. **Login**: Sign in with your credentials
6. **Create**: Try creating generations
7. **Upload**: Test image upload (local preview mode)
8. **Verify**: Check everything works
9. **Stop**: `docker-compose down`

## Troubleshooting

| Problem         | Solution                                                  |
| --------------- | --------------------------------------------------------- |
| Port in use     | `sudo lsof -i :8080` or change port in docker-compose.yml |
| Won't start     | `docker-compose down -v && docker-compose up --build`     |
| Database issues | Check logs: `docker-compose logs db`                      |
| Server errors   | Check logs: `docker-compose logs server`                  |
| Frontend blank  | Wait longer or check: `docker-compose logs web`           |

## What's Configured by Default

- ✅ Database: PostgreSQL 16
- ✅ Credentials: postgres/postgres
- ✅ Database name: modelia
- ✅ JWT Secret: Test default (change for production!)
- ✅ Migrations: Run automatically
- ✅ Image uploads: Local preview (Cloudinary optional)

## Files to Check

- `TESTING.md` - Comprehensive testing guide
- `README.docker.md` - Full Docker documentation
- `DOCKER_SETUP.md` - Setup details and architecture
- `CHANGES.md` - What was changed to enable zero-config
- `.env.example` - Optional environment variables

## Production Setup

For production, create `.env` file:

```bash
cp .env.example .env
# Edit .env with your values
docker-compose up --build
```

Required for production:

- Strong JWT_SECRET
- Cloudinary credentials (for image uploads)
- Secure database credentials

## Remember

- 🎯 Zero config needed for testing
- 🔄 Migrations are automatic
- 📦 First build takes 1-2 minutes
- ⚡ Subsequent starts are ~20 seconds
- 🗑️ Use `down -v` for complete reset
- 📝 Check logs if something seems wrong
- 🔒 Change defaults for production!

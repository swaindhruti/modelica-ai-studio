# Modelia AI Studio

A production-ready full-stack platform for AI-powered image generation. This project demonstrates modern web application architecture using a monorepo structure, implementing best practices for scalability, maintainability, and developer experience.

**Tech Stack:** Fastify · React 19 · PostgreSQL · Drizzle ORM · TanStack Query · TypeScript · Turborepo

[![CI Status](https://github.com/swaindhruti/modelica-ai-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/swaindhruti/modelica-ai-studio/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

---

## 🚀 Quick Start for Testing

Want to test the application immediately without any setup? Use Docker:

```bash
docker-compose up --build
```

Then open http://localhost:8080 in your browser. That's it!

- ✅ No environment files needed
- ✅ No manual configuration
- ✅ Migrations run automatically
- ✅ Everything works out of the box

**For detailed testing guide, see [TESTING.md](TESTING.md)**

**For Docker setup details, see [README.docker.md](README.docker.md)**

---

## Architecture Overview

This monorepo follows a **separation of concerns** architecture pattern with clear boundaries between presentation, business logic, and data layers.

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 19 + TypeScript + Vite + Tailwind CSS v4           │
│  ├─ Route Guards (Protected Routes)                        │
│  ├─ State Management (Zustand)                             │
│  ├─ Data Fetching (TanStack Query)                         │
│  └─ UI Components (Neobrutalist Design)                    │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST
                     │ JWT Bearer Token
┌────────────────────▼────────────────────────────────────────┐
│                      API Layer                              │
│  Fastify 5.6.1 + TypeScript + Zod Validation              │
│  ├─ JWT Authentication Middleware                          │
│  ├─ Multipart Form Data Parsing                            │
│  ├─ Structured Logging (Pino)                              │
│  └─ CORS & Security Headers                                │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL/Connection Pool
┌────────────────────▼────────────────────────────────────────┐
│                   Data Layer                                │
│  PostgreSQL 16 + Drizzle ORM                               │
│  ├─ Schema Migrations                                       │
│  ├─ Relational Data (users ← generations)                  │
│  └─ Type-Safe Queries                                       │
└─────────────────────────────────────────────────────────────┘
```

### Monorepo Structure

We use **Turborepo** for efficient builds, caching, and parallel task execution:

| Path                             | Description                   | Documentation                                                |
| -------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| **`apps/server`**                | Fastify REST API backend      | [→ Server README](./apps/server/README.md)                   |
| **`apps/web-client`**            | React SPA frontend            | [→ Frontend README](./apps/web-client/README.md)             |
| **`packages/types`**             | Shared TypeScript definitions | [→ Types README](./packages/types/README.md)                 |
| **`packages/eslint-config`**     | ESLint configurations         | [→ ESLint Config README](./packages/eslint-config/README.md) |
| **`packages/typescript-config`** | TypeScript configurations     | [→ TS Config README](./packages/typescript-config/README.md) |
| **`packages/ui`**                | Shared React components       | [→ UI Library README](./packages/ui/README.md)               |

---

## Core Features

### Authentication & Authorization

- **Stateless JWT Authentication**: RFC 7519 compliant tokens with HS256 signing
- **Password Security**: bcrypt hashing with 10 salt rounds (industry standard)
- **Token Lifecycle Management**: Automatic expiry handling and refresh logic
- **Protected Routes**: Client-side route guards with server-side verification

[→ Read authentication implementation details](./apps/server/README.md#authentication-architecture)

### AI Generation Pipeline

- **Multi-Style Support**: 5 distinct generation styles (photorealistic, cartoon, pixel art, anime, oil painting)
- **Concurrent Request Handling**: Queue management for model overload scenarios
- **Retry Mechanism**: Exponential backoff for transient failures (503 errors)
- **Real-time Status Updates**: WebSocket-ready architecture (currently polling-based)

[→ Read generation pipeline details](./apps/server/README.md#generation-architecture)

### Image Processing

- **Client-Side Preprocessing**: Canvas API resizing to 512×512 before upload
- **Server-Side Validation**: Sharp-based image validation and re-encoding
- **Format Normalization**: Automatic conversion to optimized JPEG/PNG
- **Cloud Storage Integration**: Cloudinary CDN with transformation URLs

[→ Read image processing details](./apps/web-client/README.md#image-upload-architecture)

### Data Management

- **Type-Safe ORM**: Drizzle ORM with compile-time SQL validation
- **Connection Pooling**: PostgreSQL connection pool with configurable limits
- **Schema Migrations**: Version-controlled database schema changes
- **Query Optimization**: Indexed columns for fast user-generation lookups

[→ Read database architecture details](./apps/server/README.md#database-schema)

---

## Technology Stack

### Backend Technologies

| Technology       | Version | Purpose                                               |
| ---------------- | ------- | ----------------------------------------------------- |
| **Fastify**      | 5.6.1   | High-performance HTTP server (3x faster than Express) |
| **TypeScript**   | 5.9.3   | Static type checking and enhanced IDE support         |
| **PostgreSQL**   | 16+     | ACID-compliant relational database                    |
| **Drizzle ORM**  | 0.44.7  | Type-safe SQL query builder with migrations           |
| **@fastify/jwt** | 10.0.0  | JWT authentication plugin                             |
| **bcryptjs**     | 3.0.3   | Password hashing with salting                         |
| **Sharp**        | 0.34.4  | High-performance image processing                     |
| **Zod**          | 4.1.12  | Runtime schema validation                             |
| **Pino**         | 10.1.0  | Low-overhead JSON logging                             |

[→ Full backend dependencies](./apps/server/package.json)

### Frontend Technologies

| Technology         | Version  | Purpose                               |
| ------------------ | -------- | ------------------------------------- |
| **React**          | 19.1.1   | UI library with concurrent rendering  |
| **TypeScript**     | 5.9.3    | Type-safe component development       |
| **Vite**           | 7.1.7    | Lightning-fast build tool with HMR    |
| **Tailwind CSS**   | 4.1.16   | Utility-first CSS framework           |
| **React Router**   | 7.9.5    | Client-side routing with data loaders |
| **TanStack Query** | 5.90.6   | Async state management and caching    |
| **Zustand**        | 5.0.8    | Lightweight global state management   |
| **Framer Motion**  | 12.23.24 | Production-ready animation library    |
| **Axios**          | 1.13.2   | Promise-based HTTP client             |

[→ Full frontend dependencies](./apps/web-client/package.json)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** 9.0.0+ (enforced by packageManager field)
- **PostgreSQL** 16+ (14+ supported)
- **Docker** & **Docker Compose** (optional, for containerized development)

### Quick Start (Docker - Recommended)

The fastest way to run the complete stack:

#### 1. Clone the Repository

```bash
git clone https://github.com/swaindhruti/modelica-ai-studio.git
cd modelia-ai-studio
```

#### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Backend
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/modelia_ai_dev
JWT_SECRET=your-secure-random-secret-minimum-32-characters
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name  # Optional
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset        # Optional
```

#### 3. Start Services

```bash
# Start all services (frontend + backend + database)
./docker.sh start

# Or use docker-compose directly
docker-compose up --build
```

#### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432 (user: postgres, password: postgres)

### Docker Management Commands

```bash
./docker.sh start      # Start all services with build
./docker.sh stop       # Gracefully stop services
./docker.sh restart    # Restart services
./docker.sh logs       # Tail service logs
./docker.sh status     # Check health status
./docker.sh migrate    # Run database migrations
./docker.sh reset      # ⚠️  Reset and clear all data
```

[→ Comprehensive Docker documentation](./README.docker.md)

---

### Manual Setup (Without Docker)

For local development without containerization:

#### 1. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

#### 2. Database Setup

```bash
# Create PostgreSQL database
createdb modelia_ai_dev

# Or using psql
psql -U postgres -c "CREATE DATABASE modelia_ai_dev;"
```

#### 3. Configure Environment

Create `.env` files in both apps:

**Backend** (`apps/server/.env`):

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/modelia_ai_dev
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
PORT=3000
NODE_ENV=development
```

**Frontend** (`apps/web-client/.env`):

```env
VITE_API_URL=http://localhost:3000
```

#### 4. Run Database Migrations

```bash
cd apps/server
pnpm run db:push
```

#### 5. Start Development Servers

**Option A: Run all from root (parallel execution)**

```bash
pnpm dev
```

**Option B: Run individually in separate terminals**

Terminal 1 - Backend:

```bash
cd apps/server
pnpm dev
```

Terminal 2 - Frontend:

```bash
cd apps/web-client
pnpm dev
```

**Access Points:**

- Backend API: http://localhost:3000
- Frontend App: http://localhost:5173

---

## Project Structure & Navigation

```
modelia-ai-studio/
├── apps/
│   ├── server/                          # Fastify Backend
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── env.ts               # Environment variable validation (Zod)
│   │   │   ├── db/
│   │   │   │   ├── schema.ts            # Database schema (Drizzle)
│   │   │   │   └── connection.ts        # PostgreSQL connection pool
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts              # JWT verification middleware
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts              # Authentication endpoints
│   │   │   │   └── generations.ts       # Generation CRUD endpoints
│   │   │   ├── __tests__/               # Jest integration tests
│   │   │   └── server.ts                # Fastify app initialization
│   │   ├── drizzle/                     # Migration files
│   │   ├── uploads/                     # Uploaded images (gitignored)
│   │   └── README.md                    # Backend documentation →
│   │
│   └── web-client/                      # React Frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── GenerationHistory.tsx
│       │   │   ├── ImageUpload.tsx
│       │   │   ├── Navbar.tsx
│       │   │   ├── FloatingThemeSwitcher.tsx
│       │   │   └── ProtectedRoute.tsx
│       │   ├── hooks/
│       │   │   ├── useGenerate.ts       # Generation mutation hook
│       │   │   ├── useImageUpload.ts    # Image upload hook
│       │   │   └── README.md            # Hooks documentation →
│       │   ├── lib/
│       │   │   ├── api.ts               # Axios instance with interceptors
│       │   │   └── imageUtils.ts        # Image processing utilities
│       │   ├── pages/
│       │   │   ├── LandingPage.tsx
│       │   │   ├── LoginPage.tsx
│       │   │   ├── SignupPage.tsx
│       │   │   └── StudioPage.tsx
│       │   ├── store/
│       │   │   ├── authStore.ts         # Zustand auth state
│       │   │   └── themeStore.ts        # Zustand theme state
│       │   ├── tests/                   # Vitest component tests
│       │   ├── App.tsx                  # Router configuration
│       │   └── main.tsx                 # React entry point
│       └── README.md                    # Frontend documentation →
│
├── packages/
│   ├── eslint-config/                   # Shared ESLint configs
│   │   ├── base.js                      # Base config for TypeScript
│   │   ├── react-internal.js            # React-specific rules
│   │   └── README.md                    # ESLint config docs →
│   ├── types/                           # Shared TypeScript types
│   │   ├── src/index.ts                 # User, Generation, API types
│   │   └── README.md                    # Types documentation →
│   ├── typescript-config/               # Shared TS compiler configs
│   │   ├── base.json                    # Base compiler options
│   │   ├── nextjs.json                  # Next.js-specific config
│   │   └── README.md                    # TS config docs →
│   └── ui/                              # Shared React components
│       ├── src/                         # Button, Card, Code components
│       └── README.md                    # UI library docs →
│
├── .github/
│   └── workflows/
│       └── ci.yml                       # GitHub Actions CI/CD pipeline
│
├── docker-compose.yml                   # Docker services orchestration
├── docker.sh                            # Docker management script
├── turbo.json                           # Turborepo pipeline configuration
├── pnpm-workspace.yaml                  # pnpm workspace definition
└── README.md                            # ← You are here
```

---

## Development Workflow

### Available Scripts

#### Root Level (Turborepo)

```bash
pnpm dev           # Start all apps in development mode (parallel)
pnpm build         # Build all apps for production
pnpm lint          # Lint all packages (ESLint)
pnpm test          # Run all test suites (Jest + Vitest)
pnpm format        # Format code with Prettier
```

#### Backend Specific

```bash
cd apps/server
pnpm dev           # Start with hot reload (tsx watch)
pnpm build         # Compile TypeScript to dist/
pnpm start         # Run production build
pnpm test          # Run Jest tests
pnpm test:coverage # Run tests with coverage report
pnpm db:push       # Push schema changes to database
pnpm db:studio     # Open Drizzle Studio (database GUI)
```

#### Frontend Specific

```bash
cd apps/web-client
pnpm dev           # Start Vite dev server with HMR
pnpm build         # Build optimized production bundle
pnpm preview       # Preview production build locally
pnpm test          # Run Vitest unit tests
pnpm test:coverage # Generate test coverage report
```

---

## API Endpoints

### Authentication

| Method | Endpoint       | Description                 | Auth Required |
| ------ | -------------- | --------------------------- | ------------- |
| `POST` | `/auth/signup` | Create new user account     | No            |
| `POST` | `/auth/login`  | Login and receive JWT token | No            |

### Generations

| Method | Endpoint       | Description                   | Auth Required |
| ------ | -------------- | ----------------------------- | ------------- |
| `POST` | `/generations` | Create new AI generation      | Yes           |
| `GET`  | `/generations` | Get user's last 5 generations | Yes           |

### Health Check

| Method | Endpoint  | Description       | Auth Required |
| ------ | --------- | ----------------- | ------------- |
| `GET`  | `/health` | API health status | No            |

[→ Complete API documentation with request/response examples](./apps/server/README.md#api-endpoints)

---

## Testing

This project includes comprehensive test suites for both backend and frontend.

### Backend Testing (Jest)

**Test Coverage:**

- Authentication routes (signup, login, validation)
- Generation routes (create, list, delete)
- Middleware (JWT verification)
- Error handling scenarios

```bash
cd apps/server
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Generate coverage report
```

[→ Backend testing details](./apps/server/README.md#testing)

### Frontend Testing (Vitest)

**Test Coverage:**

- Component rendering and interactions
- Custom hooks logic
- Form validation
- API integration mocks

```bash
cd apps/web-client
pnpm test              # Run all tests
pnpm test:ui           # Open Vitest UI
pnpm test:coverage     # Generate coverage report
```

[→ Frontend testing details](./apps/web-client/README.md#testing)

### Continuous Integration

GitHub Actions automatically runs:

- Linting (ESLint + Prettier)
- Type checking (TypeScript)
- Unit tests with coverage
- Build verification

See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) for pipeline configuration.

---

## Deployment

### Backend Deployment (Render / Railway / Fly.io)

**Recommended: Render**

1. Create a new Web Service
2. Connect your GitHub repository
3. Configure build settings:
   ```
   Build Command: cd apps/server && pnpm install && pnpm build
   Start Command: cd apps/server && pnpm start
   ```
4. Set environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   JWT_SECRET=your-production-secret-key
   PORT=3000
   NODE_ENV=production
   ```
5. Deploy!

[→ Detailed backend deployment guide](./apps/server/README.md#deployment)

### Frontend Deployment (Vercel / Netlify)

**Recommended: Vercel**

1. Import project from GitHub
2. Set root directory: `apps/web-client`
3. Framework preset: Vite
4. Build settings (auto-detected):
   ```
   Build Command: pnpm build
   Output Directory: dist
   ```
5. Environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
6. Deploy!

[→ Detailed frontend deployment guide](./apps/web-client/README.md#deployment)

---

## Security Considerations

This application implements industry-standard security practices:

### Authentication Security

- ✅ JWT tokens with configurable expiration
- ✅ HS256 signing algorithm (HMAC with SHA-256)
- ✅ bcrypt password hashing with 10 salt rounds
- ✅ No sensitive data in JWT payload

### API Security

- ✅ CORS configured with allowed origins
- ✅ Rate limiting (ready for implementation)
- ✅ SQL injection protection via Drizzle ORM
- ✅ Input validation with Zod schemas
- ✅ XSS protection via React's automatic escaping

### Image Upload Security

- ✅ File type validation (JPEG/PNG only)
- ✅ File size limits (10MB client, 50MB server)
- ✅ Server-side image validation with Sharp
- ✅ Cloud storage with signed URLs

### Environment Security

- ✅ Environment variable validation on startup
- ✅ No secrets in repository
- ✅ `.env.example` templates for reference

[→ Comprehensive security documentation](./apps/server/README.md#security)

---

## Performance Optimizations

### Backend Optimizations

- **Connection Pooling**: PostgreSQL connection pool (5-20 connections)
- **Structured Logging**: Low-overhead Pino logger
- **Async Operations**: Non-blocking I/O throughout
- **Query Optimization**: Indexed database columns

### Frontend Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Client-side resizing before upload
- **Request Caching**: TanStack Query automatic caching
- **Debounced Inputs**: Reduced API calls
- **Production Build**: Vite's Rollup optimization

[→ Frontend performance details](./apps/web-client/README.md#performance)

---

## Troubleshooting

### Common Issues

**Issue: `pnpm install` fails**

- Solution: Ensure Node.js 18+ and pnpm 9.0.0+ are installed
- Run: `corepack enable && corepack prepare pnpm@9.0.0 --activate`

**Issue: Database connection errors**

- Solution: Verify `DATABASE_URL` in `.env` is correct
- Check PostgreSQL is running: `pg_isready`

**Issue: Port 3000 or 5173 already in use**

- Solution: Kill existing process or change `PORT` in `.env`
- Find process: `lsof -i :3000`

**Issue: JWT token expires immediately**

- Solution: Ensure server and client time are synchronized
- Check JWT_SECRET is set correctly

**Issue: Images not uploading**

- Solution: Verify Cloudinary credentials
- Check file size limits (10MB)
- Ensure file is JPEG or PNG

[→ Complete troubleshooting guide](./DOCKER_SETUP.md)

---

## 📋 Evaluation Checklist

For candidates completing this as an assessment, please fill out the [EVAL.md](./EVAL.md) template:

### Required Deliverables

| Deliverable      | Description                       | Status                                        |
| ---------------- | --------------------------------- | --------------------------------------------- |
| **README.md**    | Setup, run, and test instructions | [✓] This file                                 |
| **EVAL.md**      | Completed feature checklist       | [→ See template](./EVAL.md)                   |
| **OPENAPI.yaml** | Backend API specification         | [→ View spec](./apps/server/OPENAPI.yaml)     |
| **AI_USAGE.md**  | Documentation of AI tool usage    | [→ View details](./AI_USAGE.md)               |
| **CI Workflow**  | GitHub Actions with tests         | [→ View workflow](./.github/workflows/ci.yml) |

### Feature Implementation Checklist

Candidates must complete the `EVAL.md` file with this structure:

| Feature/Test             | Status | File/Path                                       |
| ------------------------ | ------ | ----------------------------------------------- |
| JWT Auth (signup/login)  | ✅/❌  | `/apps/server/src/routes/auth.ts`               |
| Image upload preview     | ✅/❌  | `/apps/web-client/src/hooks/useImageUpload.ts`  |
| Abort in-flight requests | ✅/❌  | `/apps/web-client/src/pages/StudioPage.tsx`     |
| Exponential retry logic  | ✅/❌  | `/apps/web-client/src/hooks/useGenerations.ts`  |
| 20% simulated overload   | ✅/❌  | `/apps/server/src/routes/generations.ts`        |
| GET last 5 generations   | ✅/❌  | `/apps/server/src/routes/generations.ts`        |
| Unit tests backend       | ✅/❌  | `/apps/server/src/__tests__/*.test.ts`          |
| Unit tests frontend      | ✅/❌  | `/apps/web-client/src/tests/*.test.tsx`         |
| E2E flow                 | ✅/❌  | `/playwright-report/index.html`                 |
| ESLint + Prettier        | ✅/❌  | `/eslint.config.js`, `/packages/eslint-config/` |
| CI + Coverage            | ✅/❌  | `/.github/workflows/ci.yml`                     |

**📝 Note**: Copy the [EVAL.md template](./EVAL.md) and fill in your implementation details, test coverage, and any additional notes.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** existing code style (ESLint + Prettier)
4. **Write** tests for new features
5. **Commit** with descriptive messages
6. **Push** to your branch
7. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation for API changes
- Keep dependencies up to date

---

## License

This project is licensed under the **ISC License**.

---

## Acknowledgments

Built with modern web technologies:

- [Turborepo](https://turborepo.com/) - High-performance build system
- [Fastify](https://fastify.io/) - Fast web framework
- [React](https://react.dev/) - UI library
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [TanStack Query](https://tanstack.com/query) - Async state management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

## Contact & Support

- **Repository**: [github.com/swaindhruti/modelica-ai-studio](https://github.com/swaindhruti/modelica-ai-studio)
- **Issues**: [GitHub Issues](https://github.com/swaindhruti/modelica-ai-studio/issues)
- **Documentation**: See individual package READMEs linked throughout this document

---

**Made with ❤️ using TypeScript, React, and Fastify**

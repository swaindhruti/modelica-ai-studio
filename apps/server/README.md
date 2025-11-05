# Modelia AI Studio - Backend API

A professional-grade REST API built with Fastify, TypeScript, PostgreSQL, and Drizzle ORM.

## 🚀 Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **ImageKit Integration**: Cloud-based image storage with client-side upload
- **AI Generations**: Simulated AI model with realistic delays and failure rates
- **Database**: PostgreSQL with Drizzle ORM
- **Logging**: Structured logging with Pino
- **Type Safety**: Full TypeScript with shared types across monorepo
- **Security**: CORS, JWT secrets, environment validation
- **Testing**: Comprehensive Jest test suite for all routes

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (package manager)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root of the server directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/modelia_db
JWT_SECRET=your-secret-key-at-least-32-characters-long

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### 3. Database Setup

Run migrations to create tables:

```bash
pnpm run db:push
```

### 4. Run Development Server

```bash
pnpm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### POST /auth/signup

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "johndoe"
}
```

**Response:** `201 Created`

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### POST /auth/login

Authenticate and receive JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "tier": "free",
    "credits": 1000
  }
}
```

### Generation Endpoints (Protected)

All generation endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### POST /generations

Create a new AI generation with optional image URL.

**Request Body:**

```json
{
  "prompt": "A beautiful sunset over mountains",
  "style": "photorealistic",
  "imageUrl": "https://ik.imagekit.io/your-id/image.jpg" // Optional
}
```

**Response:** `201 Created`

```json
{
  "generation": {
    "id": 1,
    "userId": 1,
    "prompt": "A beautiful sunset over mountains",
    "style": "realistic",
    "status": "completed",
    "imageUrl": "/uploads/abc-123-def.jpg",
    "createdAt": "2025-11-05T10:30:00.000Z",
    "updatedAt": "2025-11-05T10:30:00.000Z"
  }
}
```

**Simulated Behaviors:**

- 1-2 second processing delay
- 20% chance of `503 Model overloaded` error

#### GET /generations

Fetch the user's last 5 generations.

**Response:** `200 OK`

```json
{
  "generations": [
    {
      "id": 5,
      "userId": 1,
      "prompt": "Latest generation",
      "style": "anime",
      "status": "completed",
      "imageUrl": "/uploads/xyz-789.png",
      "createdAt": "2025-11-05T12:00:00.000Z",
      "updatedAt": "2025-11-05T12:00:00.000Z"
    }
    // ... 4 more
  ]
}
```

### Health Check

#### GET /health

Check if the API is running.

**Response:** `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2025-11-05T10:30:00.000Z"
}
```

## 🧪 Testing

This project includes comprehensive Jest tests for all API routes.

### Running Tests

Run all tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run tests with coverage:

```bash
pnpm test -- --coverage
```

### Test Coverage

Tests cover:

- **Auth Routes**: Signup, login, validation, error handling
- **Generation Routes**: Create, list, delete operations with authentication
- **ImageKit Routes**: Authentication parameter generation

All tests use in-memory database connections and clean up after themselves.

## 📦 Scripts

```bash
pnpm run dev          # Start development server with watch mode
pnpm run build        # Build TypeScript to JavaScript
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript type checking
pnpm run db:push      # Push schema changes to database
pnpm run db:studio    # Open Drizzle Studio
```

## 🏗️ Project Structure

```
apps/server/
├── src/
│   ├── __tests__/
│   │   ├── auth.test.ts        # Authentication route tests
│   │   ├── generations.test.ts # Generation route tests
│   │   └── imagekit.test.ts    # ImageKit route tests
│   ├── config/
│   │   └── env.ts              # Environment variable validation
│   ├── db/
│   │   ├── connection.ts       # Database connection and Drizzle setup
│   │   └── schema.ts           # Database schema definitions
│   ├── middleware/
│   │   └── auth.ts             # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts             # Authentication routes
│   │   ├── generations.ts      # Generation routes
│   │   └── imagekit.ts         # ImageKit authentication routes
│   └── server.ts               # Main server entry point
├── uploads/                    # Uploaded images (deprecated, using ImageKit)
├── jest.config.js              # Jest configuration
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment template
├── package.json
└── tsconfig.json
```

## 🌟 Advanced Features

### ImageKit Integration

Images are uploaded directly from the client to ImageKit cloud storage. The server provides temporary authentication tokens via the `/auth/imagekit` endpoint.

**Benefits:**

- No server storage needed
- Fast global CDN delivery
- Automatic image optimization
- Secure client-side uploads

### Structured Logging

All logs use Pino for structured JSON logging with proper log levels:

- `info`: Normal operations
- `warn`: Warnings (e.g., simulated failures)
- `error`: Errors with full stack traces

### Type Safety

Shared types from `packages/types` ensure consistency between frontend and backend.

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with configurable secret
- CORS protection
- Environment variable validation on startup
- SQL injection protection via Drizzle ORM

## 🚀 Deployment

### Recommended Platforms

- **Render**: Easy PostgreSQL + Node.js deployment
- **Fly.io**: Fast global deployment
- **Railway**: Simple git-based deployment

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=<your-production-db-url>`
- `JWT_SECRET=<strong-random-secret>`

## 📝 License

ISC

## 👥 Contributing

This is a portfolio/assessment project. For improvements, please create an issue or pull request.

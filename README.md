# Modelia AI Studio

A full-stack AI image generation platform with authentication, file uploads, and real-time updates. Built with **Fastify** (backend), **React** (frontend), and **PostgreSQL** (database) in a **Turborepo** monorepo.

---

## 🚀 Features

### Backend

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Database**: PostgreSQL with Drizzle ORM, schema migrations
- **File Upload**: Multipart form data with Sharp image resizing (512x512)
- **AI Generation**: Simulated AI model with 5 style options, retry logic for 503 errors
- **API Documentation**: Comprehensive OpenAPI 3.0 spec
- **Logging**: Pino structured logging throughout
- **CORS**: Configured for local and production environments

### Frontend

- **Authentication**: Login/Signup with JWT token persistence
- **Protected Routes**: Route guards for authenticated pages
- **AI Studio**: Image generation interface with prompt input and style selection
- **File Upload**: Drag-and-drop with client-side resizing to 512x512
- **History**: Last 5 generations with click-to-restore functionality
- **Dark Mode**: System-aware theme toggle with localStorage
- **Animations**: Framer Motion transitions
- **Toast Notifications**: Real-time feedback
- **Retry Logic**: Auto-retry for 503 errors (up to 3 attempts)
- **Abort Control**: Cancel in-flight requests
- **Responsive Design**: Mobile-first Tailwind CSS

---

## 📋 Prerequisites

- **Node.js** 18+
- **pnpm** (package manager)
- **PostgreSQL** 14+ (local or remote)
- **Docker** & **Docker Compose** (optional, for containerized setup)

---

## 🐳 Quick Start with Docker (Recommended)

The easiest way to run the entire stack (frontend, backend, and database) is with Docker Compose:

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd modelia-ai-studio
```

### 2. Configure Environment Variables

```bash
# Edit .env file and set your values
nano .env
```

Required variables:

- `JWT_SECRET`: A secure random string
- `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name (optional)
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset (optional)

### 3. Start All Services

```bash
# Using the helper script (recommended)
./docker.sh start

# Or using docker-compose directly
docker-compose up --build
```

### 4. Access the Application

- **Web Client**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### Docker Commands

```bash
./docker.sh start      # Start all services
./docker.sh stop       # Stop all services
./docker.sh restart    # Restart all services
./docker.sh logs       # View logs
./docker.sh status     # Check service status
./docker.sh migrate    # Run database migrations
./docker.sh reset      # Reset everything (deletes data!)
```

For more details, see [README.docker.md](./README.docker.md)

---

## 🛠️ Quick Start (Manual Setup)

If you prefer to run services manually without Docker:

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd modelia-ai-studio
pnpm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb modelia_ai_dev
```

### 3. Environment Variables

#### Backend (`apps/server/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/modelia_ai_dev
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

#### Frontend (`apps/web-client/.env`)

```env
VITE_API_URL=http://localhost:3000
```

### 4. Database Migration

```bash
cd apps/server
pnpm drizzle-kit push
```

### 5. Run Development Servers

**Option A: Run both simultaneously (from root)**

```bash
pnpm dev
```

**Option B: Run separately**

Terminal 1 (Backend):

```bash
cd apps/server
pnpm dev
```

Terminal 2 (Frontend):

```bash
cd apps/web-client
pnpm dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

---

## 📁 Project Structure

```
modelia-ai-studio/
├── apps/
│   ├── server/                    # Fastify backend
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── env.ts         # Environment validation
│   │   │   ├── db/
│   │   │   │   ├── schema.ts      # Drizzle schema (users, generations)
│   │   │   │   └── connection.ts  # PostgreSQL connection pool
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts        # JWT verification middleware
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts        # POST /auth/signup, /auth/login
│   │   │   │   └── generations.ts # POST /generations, GET /generations
│   │   │   └── server.ts          # Fastify app entry point
│   │   ├── uploads/               # Uploaded images
│   │   ├── README.md              # Backend documentation
│   │   └── OPENAPI.yaml           # API specification
│   │
│   └── web-client/                # React frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── GenerationHistory.tsx
│       │   │   ├── ImageUpload.tsx
│       │   │   ├── Navbar.tsx
│       │   │   └── ProtectedRoute.tsx
│       │   ├── lib/
│       │   │   ├── api.ts         # Axios client with JWT interceptor
│       │   │   └── imageUtils.ts  # Image validation & resizing
│       │   ├── pages/
│       │   │   ├── LoginPage.tsx
│       │   │   ├── SignupPage.tsx
│       │   │   └── StudioPage.tsx
│       │   ├── store/
│       │   │   ├── authStore.ts   # Zustand auth state
│       │   │   └── themeStore.ts  # Zustand theme state
│       │   ├── types/
│       │   │   └── index.ts       # TypeScript types
│       │   ├── App.tsx            # Router & providers
│       │   └── main.tsx           # Entry point
│       └── README.md              # Frontend documentation
│
└── packages/
    ├── eslint-config/             # Shared ESLint configs
    ├── typescript-config/         # Shared TypeScript configs
    ├── types/                     # Shared TypeScript types
    └── ui/                        # Shared UI components
```

---

## 📚 Tech Stack

### Backend

- **Fastify** 5.6.1 - Fast web framework
- **Drizzle ORM** 0.44.7 - Type-safe SQL ORM
- **PostgreSQL** - Relational database
- **@fastify/jwt** 10.0.0 - JWT authentication
- **bcryptjs** 2.4.3 - Password hashing
- **Sharp** 0.34.4 - Image processing
- **Zod** 4.1.12 - Schema validation
- **Pino** - Structured logging

### Frontend

- **React** 18 + **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** 7.9.5 - Routing
- **TanStack Query** 5.90.6 - Data fetching
- **Axios** 1.13.2 - HTTP client
- **Zustand** 5.0.8 - State management
- **Framer Motion** 12.23.24 - Animations
- **react-hot-toast** 2.6.0 - Notifications

---

## 🎯 API Endpoints

### Authentication

- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login and get JWT token

### Generations (Protected)

- `POST /generations` - Create new generation (multipart/form-data)
- `GET /generations` - Get user's generations (last 5)

See `apps/server/OPENAPI.yaml` for full API documentation.

---

## 🧪 Testing

### Backend Tests

```bash
cd apps/server
pnpm test
```

### Frontend Tests

```bash
cd apps/web-client
pnpm test
```

---

## 🚀 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd apps/server && pnpm install && pnpm build`
4. Set start command: `cd apps/server && pnpm start`
5. Add environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET` (random secure string)
   - `PORT` (Render provides this automatically)
   - `NODE_ENV=production`

### Frontend (Vercel)

1. Import project in Vercel
2. Set root directory: `apps/web-client`
3. Framework preset: Vite
4. Add environment variable:
   - `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy!

---

## 🔒 Security Best Practices

- ✅ JWT tokens with expiration
- ✅ bcrypt password hashing (10 rounds)
- ✅ Environment variable validation
- ✅ CORS configuration
- ✅ SQL injection protection via Drizzle ORM
- ✅ XSS protection via React
- ✅ File type validation (JPEG/PNG only)
- ✅ File size limits (10MB client, 50MB server)
- ✅ Image resizing to prevent large uploads

---

## 📝 Development Scripts

### Root Level

```bash
pnpm dev           # Run all apps in development mode
pnpm build         # Build all apps
pnpm lint          # Lint all apps
pnpm format        # Format code with Prettier
```

### Backend

```bash
cd apps/server
pnpm dev           # Start development server with nodemon
pnpm build         # Build TypeScript to dist/
pnpm start         # Run production build
pnpm drizzle-kit push  # Push schema changes to database
pnpm drizzle-kit studio  # Open Drizzle Studio
```

### Frontend

```bash
cd apps/web-client
pnpm dev           # Start Vite dev server
pnpm build         # Build for production
pnpm preview       # Preview production build
pnpm lint          # Run ESLint
```

---

## 🌟 Key Features Explained

### Authentication Flow

1. User signs up → Password hashed with bcrypt → Saved to PostgreSQL
2. User logs in → Password verified → JWT token issued
3. Token stored in localStorage → Sent with every API request
4. Backend middleware verifies JWT → Grants access to protected routes

### Image Upload & Processing

1. **Client-side**: Canvas API resizes image to 512x512
2. **Upload**: Multipart form data sent to server
3. **Server-side**: Sharp library resizes again (double-check)
4. **Storage**: Saved to `uploads/` directory
5. **Database**: Image URL stored in `generations` table

### Generation Flow

1. User enters prompt, selects style, uploads image (optional)
2. Frontend creates FormData with all inputs
3. TanStack Query mutation sends POST request
4. Server simulates AI processing (1-2s delay)
5. 20% chance of 503 error (to test retry logic)
6. On success: Returns generation with imageUrl
7. Frontend invalidates cache → History auto-updates

### Retry Logic

- TanStack Query automatically retries 503 errors
- Up to 3 attempts with 1s delay between retries
- Toast notifications show retry progress
- User can abort at any time

---

## 🎨 UI/UX Features

- **Dark Mode**: Toggle in navbar, persists to localStorage
- **Toast Notifications**: Success (green), Error (red), Info (blue)
- **Loading States**: Spinners, skeleton screens, disabled buttons
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: Keyboard navigation, ARIA labels, focus states
- **Responsive Design**: Mobile-first, works on all screen sizes

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

Built with [Turborepo](https://turborepo.com/), [Fastify](https://fastify.io/), [React](https://react.dev/), and [Drizzle ORM](https://orm.drizzle.team/).

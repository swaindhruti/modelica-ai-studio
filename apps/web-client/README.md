# Modelia AI Studio - Frontend

A professional React + TypeScript frontend for AI image generation with authentication, file uploads, and real-time updates.

## 🚀 Features

- **Authentication**: Full auth flow with JWT tokens and protected routes
- **AI Studio**: Interactive image generation with prompt input and style selection
- **File Upload**: Drag-and-drop image upload with client-side resizing to 512x512
- **History**: Last 5 generations with click-to-restore functionality
- **Dark Mode**: System-aware theme toggle with localStorage persistence
- **Animations**: Smooth transitions using Framer Motion
- **Toast Notifications**: Real-time feedback with react-hot-toast
- **Retry Logic**: Automatic retry for 503 errors (up to 3 attempts)
- **Abort Control**: Cancel in-flight requests
- **Responsive Design**: Mobile-first Tailwind CSS design
- **Accessibility**: Full keyboard navigation, ARIA labels, focus states

## 📋 Prerequisites

- Node.js 18+
- pnpm (package manager)
- Backend API running on `http://localhost:3000`

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
pnpm dev
```

The app will start on `http://localhost:5173`

## 📚 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Notifications**: react-hot-toast

## 🎯 Key Features Explained

### Authentication Flow

1. **Login** (`/login`):
   - Email + Password form
   - JWT token saved to localStorage
   - Automatic redirect to studio
   - Error handling with toast notifications

2. **Signup** (`/signup`):
   - Email + Username + Password form
   - Validation (min 8 char password)
   - Success redirect to login

3. **Protected Routes**:
   - `ProtectedRoute` component wraps Studio page
   - Redirects to `/login` if not authenticated
   - JWT interceptor adds token to all API requests

### AI Studio Page

#### Image Upload

- **Drag-and-drop** zone with file input fallback
- **Client-side validation**: JPEG/PNG only, 10MB limit
- **Client-side resizing**: Canvas API resizes to 512x512
- Live preview thumbnail
- Toast feedback on success/error

#### Generation Form

- **Prompt** textarea (required)
- **Style** dropdown with 5 options:
  - Photorealistic
  - Cartoon
  - Pixel Art
  - Anime
  - Oil Painting
- **Generate** button with loading spinner
- **Abort** button (only during generation)

#### Generation Flow

```typescript
useMutation({
  mutationFn: createGeneration,
  retry: (failureCount, error) => {
    // Auto-retry for 503 errors up to 3 times
    if (error?.response?.status === 503 && failureCount < 3) {
      return true;
    }
    return false;
  },
  onSuccess: () => {
    // Invalidate history to auto-refresh
    queryClient.invalidateQueries(["generations"]);
  },
});
```

#### History List

- Fetches last 5 generations with `useQuery`
- Auto-updates after new generation
- Click any item to restore to form
- Animated list with Framer Motion
- Loading skeleton states

### Dark Mode

Toggle button in navbar:

```typescript
// Persists to localStorage
// Applies 'dark' class to <html>
// Tailwind dark: variants automatically apply
```

### Toast Notifications

- Success: Green toast for successful actions
- Error: Red toast with error messages
- Info: Blue toast for informational messages
- Auto-dismiss after 3 seconds

## 📁 Project Structure

```
src/
├── components/
│   ├── GenerationHistory.tsx    # History list with animations
│   ├── ImageUpload.tsx           # Drag-drop upload with resizing
│   ├── Navbar.tsx                # Top navbar with logout and theme toggle
│   └── ProtectedRoute.tsx        # Route guard for authentication
├── lib/
│   ├── api.ts                    # Axios instance with interceptors
│   └── imageUtils.ts             # Image validation and resizing
├── pages/
│   ├── LoginPage.tsx             # Login form
│   ├── SignupPage.tsx            # Signup form
│   └── StudioPage.tsx            # Main AI studio interface
├── store/
│   ├── authStore.ts              # Zustand auth state
│   └── themeStore.ts             # Zustand theme state
├── App.tsx                       # Root component with routing
├── main.tsx                      # App entry point
└── index.css                     # Tailwind imports
```

## 🧪 Testing (Recommended)

### Component Tests (React Testing Library)

```bash
pnpm test
```

Example tests to write:

- Login form renders and submits
- Signup validation works
- Image upload validates file types
- Generation form requires prompt
- History list renders items
- Click-to-restore populates form

### E2E Tests (Cypress/Playwright)

Full user flow:

1. Sign up new user
2. Login with credentials
3. Upload image
4. Enter prompt and select style
5. Click generate
6. Verify new item in history
7. Logout

## 🎨 Accessibility Features

- ✅ Semantic HTML (`<nav>`, `<main>`, `<label>`)
- ✅ All inputs have labels (visible or `sr-only`)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus states (`focus:ring-2`)
- ✅ ARIA labels for icon buttons
- ✅ Color contrast ratios meet WCAG AA
- ✅ Screen reader friendly

## 📱 Responsive Design

Breakpoints (Tailwind):

- `sm:` 640px - Small tablets
- `md:` 768px - Tablets
- `lg:` 1024px - Desktops
- `xl:` 1280px - Large desktops

The layout adapts:

- Mobile: Single column, full width
- Tablet: Sidebar appears
- Desktop: Two-column layout with history

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.render.com
   ```
4. Deploy!

Vercel auto-detects Vite and builds correctly.

### Build for Production

```bash
pnpm build
```

Output in `dist/` directory.

## 📝 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token expiry handling
- HTTPS in production
- XSS protection via React
- CSRF not needed (no cookies)

## 🌟 Bonus Features Implemented

- ✅ **Dark Mode**: System-aware with toggle
- ✅ **Client-Side Image Resizing**: Canvas API, 512x512
- ✅ **Animations**: Framer Motion transitions
- ✅ **Toast Notifications**: react-hot-toast
- ✅ **Retry Logic**: Auto-retry 503 errors
- ✅ **Abort Controller**: Cancel requests
- ✅ **Click-to-Restore**: History item restoration

## 📄 License

ISC

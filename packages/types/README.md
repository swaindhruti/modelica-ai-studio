# @modelia/types

Shared TypeScript type definitions for the Modelia AI Studio monorepo. This package provides type-safe contracts between frontend and backend applications, ensuring consistency across the entire stack.

**[← Back to Main README](../../README.md)**

---

## Purpose

This package serves as the single source of truth for all shared data structures, API contracts, and domain models used throughout the application. By centralizing type definitions, we achieve:

- **Type Safety**: Compile-time guarantees that frontend and backend communicate correctly
- **DRY Principle**: No duplicate type definitions across packages
- **Refactoring Safety**: Changing a type updates all consumers automatically
- **API Contract Enforcement**: Frontend and backend must agree on data structures

---

## Installation

This is an internal workspace package. Other packages in the monorepo reference it via workspace protocol:

```json
{
  "dependencies": {
    "@modelia/types": "workspace:*"
  }
}
```

---

## Available Types

### User Types

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  tier: string; // "free" | "pro" | "enterprise"
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Usage:**

- Backend: Drizzle schema definition and query results
- Frontend: User profile display, auth state management

---

### Generation Types

```typescript
export interface Generation {
  id: number;
  userId: number;
  prompt: string;
  style?: string | null; // Optional: "photorealistic" | "cartoon" | "pixel-art" | "anime" | "oil-painting"
  status: string; // "pending" | "processing" | "completed" | "failed"
  imageUrl?: string | null; // Optional: Cloudinary URL
  createdAt: Date;
  updatedAt: Date;
}
```

**Usage:**

- Backend: Database schema and API responses
- Frontend: Generation history, studio state

**Design Decision:**  
Optional fields (`style`, `imageUrl`) allow for flexible generation modes:

- Text-only prompts (no reference image)
- Image-to-image transformations
- Failed generations (no output URL)

---

### Authentication Request/Response Types

#### Signup

```typescript
export interface AuthSignupRequest {
  email: string;
  password: string;
  username: string;
}
```

**Validation:**

- Email: Must be valid email format
- Password: Minimum 8 characters (enforced server-side)
- Username: Unique, 3-20 characters

#### Login

```typescript
export interface AuthLoginRequest {
  email: string;
  password: string;
}
```

#### Auth Response

```typescript
export interface AuthResponse {
  token: string; // JWT token (HS256 signed)
  user: Omit<User, "passwordHash">; // User data without sensitive fields
}
```

**Security Note:**  
`Omit<User, "passwordHash">` ensures password hash is never sent to frontend.

---

### Generation Request/Response Types

#### Create Generation

```typescript
export interface CreateGenerationRequest {
  prompt: string;
  style?: string; // Optional style selection
}
```

**Note:** Image URL is not included in request body. Images are uploaded directly to Cloudinary from the client, and the resulting URL is then sent with the generation request.

#### Generation Response

```typescript
export interface GenerationResponse {
  generation: Generation;
}
```

---

## Type Safety Benefits

### Example: API Route Type Safety

**Backend (Fastify route):**

```typescript
import type { AuthLoginRequest, AuthResponse } from "@modelia/types";

app.post<{ Body: AuthLoginRequest; Reply: AuthResponse }>(
  "/auth/login",
  async (request, reply) => {
    const { email, password } = request.body; // ✅ TypeScript knows these exist
    // ...
    return reply.send({ token, user }); // ✅ Must match AuthResponse shape
  }
);
```

**Frontend (API client):**

```typescript
import type { AuthLoginRequest, AuthResponse } from "@modelia/types";

export const authApi = {
  login: (credentials: AuthLoginRequest) =>
    axios.post<AuthResponse>("/auth/login", credentials),
  // ✅ Response data is typed as AuthResponse
};
```

### Example: Refactoring Safety

If we rename `Generation.imageUrl` to `Generation.outputUrl`:

1. Update type definition in `packages/types/src/index.ts`
2. TypeScript compiler immediately flags **all** usages across codebase
3. Fix errors in:
   - Backend Drizzle schema
   - Backend API routes
   - Frontend components
   - Frontend hooks
4. Zero risk of missing a rename

---

## Adding New Types

When adding new types to this package:

### 1. Define the Type

```typescript
// packages/types/src/index.ts
export interface NewFeature {
  id: number;
  name: string;
  // ...
}
```

### 2. Document the Type

Add a section to this README explaining:

- Purpose of the type
- Field meanings
- Usage examples
- Validation rules

### 3. Use in Applications

**Backend:**

```typescript
import type { NewFeature } from "@modelia/types";
```

**Frontend:**

```typescript
import type { NewFeature } from "@modelia/types";
```

---

## Type Generation from Database Schema

Our types are manually defined rather than generated from the database schema. This is intentional:

**Pros:**

- Explicit control over API contracts
- Frontend doesn't need to know about database-specific fields
- Can transform data before sending to frontend
- Clear separation between internal DB schema and public API

**Cons:**

- Must keep types in sync with database schema manually
- Risk of types diverging from actual data

**Mitigation:**

- Integration tests verify type correctness
- TypeScript compiler catches most issues
- Regular reviews of type definitions

---

## Type Versioning Strategy

Currently, we use a **shared types** model where all apps use the same types. As the application grows, consider:

### Future: API Versioning

```typescript
// v1 types
export namespace V1 {
  export interface Generation {
    id: number;
    prompt: string;
    // ...
  }
}

// v2 types (breaking changes)
export namespace V2 {
  export interface Generation {
    id: string; // Changed from number
    prompt: string;
    // ...
  }
}
```

This allows gradual migration between API versions.

---

## Best Practices

### ✅ Do:

- Use descriptive field names
- Add JSDoc comments for complex types
- Use TypeScript utility types (`Omit`, `Pick`, `Partial`)
- Keep types in sync with database schema
- Use optional fields (`?`) for nullable columns

### ❌ Don't:

- Export types with `any`
- Include implementation details in types
- Duplicate types across packages
- Use enums (use union types instead for better type narrowing)

---

## Integration with Other Packages

### Backend Integration (Drizzle ORM)

```typescript
// apps/server/src/db/schema.ts
import type { User, Generation } from "@modelia/types";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  // ...
});

// Type inference from schema matches our shared types
export type SelectUser = typeof users.$inferSelect; // Should match User type
```

### Frontend Integration (TanStack Query)

```typescript
// apps/web-client/src/hooks/useGenerations.ts
import type { Generation } from "@modelia/types";

export const useGenerations = () => {
  return useQuery<Generation[]>({
    queryKey: ["generations"],
    queryFn: async () => {
      const { data } = await generationsApi.list();
      return data.generations; // ✅ Typed as Generation[]
    },
  });
};
```

---

## Testing Types

While types are compile-time constructs, we can test them using TypeScript's type system:

```typescript
// Type tests (not runtime tests)
import type { User, Generation } from "@modelia/types";

// Test that User has required fields
const testUser: User = {
  id: 1,
  username: "test",
  email: "test@example.com",
  tier: "free",
  credits: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Test that Omit works correctly
type PublicUser = Omit<User, "email">;
const publicUser: PublicUser = {
  id: 1,
  username: "test",
  // email: 'test@example.com',  // ❌ Should error
  tier: "free",
  credits: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

---

## Troubleshooting

**Issue: Types not updating in IDE**

Solution: Restart TypeScript server

- VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

**Issue: "Cannot find module '@modelia/types'"**

Solution: Ensure package is installed

```bash
pnpm install
```

**Issue: Type mismatch between frontend and backend**

Solution: Check that both apps are using the same version

```bash
# From repo root
pnpm list @modelia/types
```

---

## Related Documentation

- [Main README](../../README.md) - Project overview
- [Backend README](../../apps/server/README.md) - Backend architecture
- [Frontend README](../../apps/web-client/README.md) - Frontend architecture

---

**[← Back to Main README](../../README.md)**

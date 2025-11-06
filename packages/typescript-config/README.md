# @repo/typescript-config

Shared TypeScript compiler configurations for the Modelia AI Studio monorepo. Provides consistent compilation settings and type checking across all packages.

**[← Back to Main README](../../README.md)**

---

## Purpose

Centralized TypeScript configuration ensures:

- **Consistent Compilation**: All packages use the same compiler options
- **Type Safety**: Strict mode enabled across the board
- **Build Optimization**: Different configs for different targets
- **DRY Principle**: Define once, extend everywhere

---

## Available Configurations

### `base.json`

Base configuration for all TypeScript projects.

**Key Options:**

```json
{
  "compilerOptions": {
    "strict": true, // Enable all strict type checking
    "esModuleInterop": true, // Better CommonJS/ES module interop
    "skipLibCheck": true, // Skip type checking of .d.ts files
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false
  }
}
```

**Usage:**

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### `react-library.json`

Configuration for React component libraries.

**Additional Options:**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx", // New JSX transform (React 17+)
    "lib": ["ES2022", "DOM"] // Include DOM types
  }
}
```

### `nextjs.json`

Configuration for Next.js applications.

**Additional Options:**

```json
{
  "compilerOptions": {
    "jsx": "preserve", // Next.js handles JSX
    "incremental": true, // Faster rebuilds
    "plugins": [
      {
        "name": "next"
      }
    ]
  }
}
```

---

## Compiler Options Explained

### `strict: true`

Enables all strict type checking options:

- `strictNullChecks`: Null and undefined must be explicitly handled
- `strictFunctionTypes`: Function parameter types are checked contravariantly
- `strictBindCallApply`: Check arguments for bind, call, apply
- `strictPropertyInitialization`: Class properties must be initialized
- `noImplicitThis`: Error on `this` with implicit `any` type
- `alwaysStrict`: Emit "use strict" for all files

**Why:** Catch type errors at compile-time rather than runtime.

### `skipLibCheck: true`

Skip type checking of all `.d.ts` files.

**Why:** Faster compilation, avoids errors in third-party types.

**Tradeoff:** May miss type errors in dependencies.

### `moduleResolution: "bundler"`

Modern module resolution for bundlers (Vite, Webpack, etc.).

**Why:** Supports package exports, conditional imports, and modern ESM features.

---

## Usage in Backend (Node.js)

```json
// apps/server/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext",
    "target": "ES2022"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Usage in Frontend (React + Vite)

```json
// apps/web-client/tsconfig.json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Path Aliases

Configure path aliases for cleaner imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"]
    }
  }
}
```

**Usage:**

```typescript
// Before
import { Button } from "../../../components/Button";

// After
import { Button } from "@components/Button";
```

---

## Project References

For monorepos, use TypeScript project references:

```json
{
  "references": [{ "path": "../packages/types" }, { "path": "../packages/ui" }]
}
```

**Benefits:**

- Faster builds (only rebuild changed packages)
- Better IDE performance
- Enforced dependency graph

---

## Troubleshooting

**Issue: "Cannot find module '@repo/typescript-config'"**

Solution: Install dependencies

```bash
pnpm install
```

**Issue: Compilation errors after updating config**

Solution: Delete build cache

```bash
rm -rf dist/ .turbo/
pnpm build
```

---

**[← Back to Main README](../../README.md)**

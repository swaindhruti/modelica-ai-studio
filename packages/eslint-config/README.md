# @repo/eslint-config

Shared ESLint configurations for the Modelia AI Studio monorepo. Provides consistent code quality and style enforcement across all packages.

**[← Back to Main README](../../README.md)**

---

## Purpose

This package centralizes ESLint configuration to ensure:

- **Consistent Code Style**: All packages follow the same rules
- **Code Quality**: Catch common bugs and anti-patterns
- **Best Practices**: Enforce TypeScript and React best practices
- **DRY Configuration**: Define rules once, use everywhere

---

## Available Configurations

### `@repo/eslint-config/base`

Base configuration for all TypeScript projects (backend, libraries).

**Includes:**

- ESLint recommended rules
- TypeScript ESLint recommended rules
- Prettier integration (no style conflicts)
- Turbo plugin (monorepo-specific rules)

**Usage:**

```javascript
// eslint.config.js
import { config } from "@repo/eslint-config/base";

export default [
  ...config,
  // Add project-specific overrides
];
```

### `@repo/eslint-config/react-internal`

Configuration for React applications and component libraries.

**Includes:**

- Base config (above)
- React ESLint plugin
- React Hooks rules
- JSX-specific linting

**Usage:**

```javascript
// eslint.config.js
import { reactInternalConfig } from "@repo/eslint-config/react-internal";

export default [
  ...reactInternalConfig,
  // Add project-specific overrides
];
```

### `@repo/eslint-config/next-js`

Configuration for Next.js applications.

**Includes:**

- React config (above)
- Next.js plugin rules
- Next.js-specific optimizations

---

## Key Rules Explained

### `turbo/no-undeclared-env-vars`

**Why:** Ensures environment variables are declared in `turbo.json` for proper caching.

**Fix:** Add env vars to `turbo.json`:

```json
{
  "globalEnv": ["DATABASE_URL", "JWT_SECRET"]
}
```

### `@typescript-eslint/no-unused-vars`

**Why:** Catch unused variables that bloat the codebase.

**Configuration:** Warning (not error) to avoid blocking development.

### `@typescript-eslint/no-explicit-any`

**Why:** Enforce type safety, avoid `any` types.

**When to disable:** Use `unknown` instead, or add type assertion with comment.

---

## Installation in New Packages

```json
{
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "eslint": "^9.36.0",
    "typescript-eslint": "^8.45.0"
  }
}
```

---

## Extending Configuration

Project-specific overrides:

```javascript
import { config } from "@repo/eslint-config/base";

export default [
  ...config,
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow any in tests
    },
  },
];
```

---

**[← Back to Main README](../../README.md)**

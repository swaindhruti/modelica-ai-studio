# @repo/ui

Shared React component library for the Modelia AI Studio monorepo. Provides reusable UI components with consistent styling and behavior.

**[← Back to Main README](../../README.md)**

---

## Purpose

This package provides a centralized component library to:

- **Reusable Components**: Write once, use in multiple apps
- **Consistent UI**: Same look and feel across all applications
- **Neobrutalist Design**: Bold, high-contrast aesthetic with thick borders
- **Type Safety**: Full TypeScript support

---

## Available Components

### Button

A versatile button component with multiple variants.

**Props:**

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage:**

```tsx
import { Button } from "@repo/ui/button";

<Button variant="primary" size="md">
  Click Me
</Button>;
```

**Styling:**

- Primary: Green background, black text, brutal shadow
- Secondary: Black background, white text
- Outline: Transparent background, thick border

---

### Card

A container component with neobrutalist styling.

**Props:**

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}
```

**Usage:**

```tsx
import { Card } from "@repo/ui/card";

<Card hoverable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>;
```

**Features:**

- 4px black border
- Brutal shadow (4px 4px 0px 0px black)
- Hover effect (optional): Lifts up with enhanced shadow

---

### Code

A syntax-highlighted code block component.

**Props:**

```typescript
interface CodeProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
}
```

**Usage:**

```tsx
import { Code } from "@repo/ui/code";

<Code language="typescript" showLineNumbers>
  {`const hello = "world"`}
</Code>;
```

**Features:**

- Syntax highlighting
- Optional line numbers
- Copy-to-clipboard button
- Dark mode support

---

## Design System

### Neobrutalist Aesthetic

Our UI follows neobrutalist design principles:

**Characteristics:**

- **Bold Borders**: 4px solid borders everywhere
- **Brutal Shadows**: `4px 4px 0px 0px` offset shadows (no blur)
- **High Contrast**: Black/white with vibrant accent colors
- **Flat Design**: No gradients or subtle shadows
- **Geometric Shapes**: Sharp corners, no border radius

**Color Palette:**

```css
/* Light Mode */
--background: white --foreground: black --primary: #22c55e (green-500)
  --primary-hover: #16a34a (green-600) --border: black --shadow: black
  /* Dark Mode */ --background: #09090b (zinc-950) --foreground: white
  --primary: #4ade80 (green-400) --primary-hover: #22c55e (green-500)
  --border: white --shadow: rgba(255, 255, 255, 0.2);
```

---

## Installation

This is an internal workspace package:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

---

## Usage in Applications

### Import Components

```tsx
// Named imports
import { Button, Card, Code } from "@repo/ui";

// Or individual imports
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
```

### With Tailwind CSS

Components use Tailwind classes. Ensure your app's `tailwind.config.ts` includes the UI package:

```typescript
// tailwind.config.ts
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}", // Include UI package
  ],
  // ...
};
```

---

## Creating New Components

### 1. Create Component File

```tsx
// src/input.tsx
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            border-4 border-black
            font-mono
            focus:outline-none focus:ring-4 focus:ring-green-400
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

### 2. Export from Index

```tsx
// src/index.ts
export { Button } from "./button";
export { Card } from "./card";
export { Code } from "./code";
export { Input } from "./input"; // Add new component
```

### 3. Document in README

Add component documentation to this file.

---

## Component Development Best Practices

### ✅ Do:

- Use `React.forwardRef` for components that accept refs
- Export TypeScript interfaces for props
- Use Tailwind classes for styling
- Add `displayName` for better debugging
- Support dark mode with `dark:` variants
- Make components composable (accept `children`, `className`)

### ❌ Don't:

- Use inline styles (use Tailwind instead)
- Hardcode colors (use design tokens)
- Create overly complex components
- Forget to export new components

---

## Testing Components

Use Vitest + React Testing Library:

```tsx
// src/__tests__/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    screen.getByText("Click me").click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

---

## Storybook (Future Enhancement)

Consider adding Storybook for component documentation and visual testing:

```bash
pnpm add -D @storybook/react @storybook/addon-essentials
```

**Benefits:**

- Visual component browser
- Interactive prop controls
- Isolated component development
- Automatic documentation

---

## Accessibility

All components should be accessible:

- **Keyboard Navigation**: All interactive elements focusable
- **ARIA Labels**: Meaningful labels for screen readers
- **Focus Indicators**: Visible focus rings
- **Semantic HTML**: Use proper HTML5 elements

**Example:**

```tsx
<Button aria-label="Close dialog" onClick={onClose}>
  ×
</Button>
```

---

## Related Documentation

- [Main README](../../README.md) - Project overview
- [Frontend README](../../apps/web-client/README.md) - Frontend architecture
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) - Styling framework

---

**[← Back to Main README](../../README.md)**

# Faro Style Guide

> Code conventions and best practices for contributing to Faro.

## TypeScript

### General Rules

- **Strict mode** is enabled. Do not disable it.
- No implicit `any`. Use `unknown` with type guards when the type is uncertain.
- Prefer `const` over `let` and `let` over `var`.
- Use `as const` for constant arrays and objects.
- Use `interface` for public API types, `type` for unions and complex compositions.
- Export types that are used across files.

### Server Actions

Every Server Action must follow this pattern:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod/v4";
import type { ActionResponse } from "@/types";

const schema = z.object({
  /* ... */
});

export async function actionName(
  input: unknown,
): Promise<ActionResponse<Result>> {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      message: "Authentication required.",
    };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      code: "VALIDATION_ERROR",
      message: "Invalid input.",
    };
  }

  try {
    // Business logic with Drizzle
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      code: "INTERNAL_ERROR",
      message: "Something went wrong.",
    };
  }
}
```

### React Components

#### Server Components (default)

```typescript
// No "use client" directive
import { getUnits, getUserProgress } from "@/db/queries";

export default async function LearnPage() {
    const units = await getUnits();
    const userProgress = await getUserProgress();

    return <div>{/* render */}</div>;
}
```

#### Client Components (when needed)

```typescript
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ActionResponse } from "@/types";

type Props = {
  initialData: SomeType;
};

export function ClientComponent({ initialData }: Props) {
  const [state, setState] = useState(initialData);
  // ...
}
```

### Imports Order

```typescript
// 1. React / Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";

// 3. Internal modules
import { getUserProgress } from "@/db/queries";
import { cn } from "@/lib/utils";

// 4. Components
import { Button } from "@/components/ui/button";

// 5. Types
import type { SomeType } from "@/types";
```

## CSS & Tailwind

- Use Tailwind utility classes. Avoid custom CSS unless absolutely required.
- Follow the [Design System](DESIGN_SYSTEM.md) for colors, spacing, and effects.
- Always support dark mode with `dark:` prefix.
- Use the semantic z-index tokens:
  - `z-overlay` (60): backdrops
  - `z-modal` (70): modals
  - `z-toast` (80): toasts
  - `z-above-modal` (90): stacked modals
  - `z-supreme` (9999): absolute top

### Conditional Classes

Always use `cn()` from `@/lib/utils`:

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
    "base-classes",
    isActive && "active-classes",
    variant === "primary" && "primary-classes",
)} />
```

### Button Pattern

Every button should have the 3D press effect:

```typescript
<button className="
    bg-[#58cc02] text-white font-black uppercase tracking-wide
    rounded-xl border-2 border-[#46a302] border-b-4
    hover:bg-[#46a302]
    active:border-b-0 active:translate-y-0.5
    transition-all
">
    Click Me
</button>
```

## Database

- All queries go through Drizzle ORM. No raw SQL in production code.
- Server-side queries must use `React.cache()` for memoization.
- Use Drizzle relations for JOINs, not manual joins.
- Add indexes for columns used in frequent `WHERE` clauses.

```typescript
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";

export const getUserProgress = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;
  return await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
});
```

## File Naming

| Pattern      | Example              | When                        |
| ------------ | -------------------- | --------------------------- |
| `kebab-case` | `course-form.tsx`    | Component files             |
| `camelCase`  | `getUserProgress.ts` | Utility/function files      |
| `snake_case` | `user_progress`      | Database tables             |
| `PascalCase` | `LessonClient.tsx`   | Component names (not files) |

## Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add streak freeze power-up
fix(scope): correct heart regeneration off-by-one
docs(scope): update API reference
ui(scope): redesign lesson node animation
```

## Testing

- Unit tests in `src/__tests__/` using Vitest
- E2E tests in `tests/` using Playwright
- Test files mirror source structure: `src/lib/foo.ts` → `src/__tests__/foo.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { someFunction } from "@/lib/some-function";

describe("someFunction", () => {
  it("should handle valid input", () => {
    expect(someFunction("valid")).toBe("expected");
  });

  it("should throw on invalid input", () => {
    expect(() => someFunction(null)).toThrow();
  });
});
```

## Linting

- ESLint is configured with `eslint-config-next` and strict rules.
- Run `npm run lint` before committing.
- Husky runs `lint-staged` on commit — ESLint + Prettier on staged files.

# Contributing to Faro

First off, thank you for considering contributing to Faro! We're building a language learning platform for everyone, and every contribution — whether code, design, translation, or documentation — makes a difference.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Branching Strategy](#branching-strategy)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Translation](#translation)
- [Need Help?](#need-help)

---

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9
- **PostgreSQL** 15+ (or Docker)
- A **Clerk** account (free tier works)
- A **Google Gemini** API key (free tier available)

### Setup

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/myduolingo.git
cd myduolingo

# 3. Install dependencies
npm install

# 4. Copy environment variables
cp .env.example .env

# 5. Fill in the .env file (see SETUP.md for detailed instructions)

# 6. Start the database
docker compose up -d

# 7. Push the schema
npx drizzle-kit push

# 8. Start the dev server
npm run dev
```

> **Complete setup instructions** → [SETUP.md](SETUP.md)

---

## Development Workflow

### 1. Pick an Issue

Browse our [issues](https://github.com/imperador1k/myduolingo/issues) for something that interests you. Issues labeled `good first issue` are great for newcomers.

### 2. Create a Branch

```bash
git checkout -b type/description-of-change
```

See [Branching Strategy](#branching-strategy) for naming conventions.

### 3. Make Your Changes

- Write clean, typed TypeScript
- Follow the [Code Style](#code-style)
- Add or update tests
- Keep changes focused and atomic

### 4. Run Checks

```bash
# TypeScript compilation
npx tsc --noEmit

# Linting
npm run lint

# Tests
npm run test:run
```

### 5. Commit

```bash
git commit -m "type(scope): description"
```

See [Commit Convention](#commit-convention) below.

### 6. Push & Open a PR

```bash
git push origin type/description-of-change
```

Then open a Pull Request on GitHub.

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Usage                        | Example                                       |
| ----------- | ---------------------------- | --------------------------------------------- |
| `feat:`     | New feature                  | `feat: add streak freeze power-up`            |
| `fix:`      | Bug fix                      | `fix: passive heart regeneration off-by-one`  |
| `docs:`     | Documentation changes        | `docs: add API reference for translate route` |
| `ui:`       | Visual/UI changes (no logic) | `ui: redesign lesson node entrance animation` |
| `refactor:` | Code refactoring             | `refactor: extract chat hooks from component` |
| `test:`     | Adding or fixing tests       | `test: add vault-token HMAC edge cases`       |
| `chore:`    | Maintenance (deps, configs)  | `chore: upgrade drizzle-orm to 0.45`          |
| `security`: | Security fixes               | `security: sanitize AI-generated HTML output` |
| `i18n:`     | Translations                 | `i18n: add French translation for onboarding` |

---

## Branching Strategy

```
feature/description       → New features
fix/description           → Bug fixes
ui/component-or-page      → Visual changes
docs/what-changed         → Documentation
refactor/what             → Code improvements
security/what             → Security patches
test/what                 → Test additions
chore/what                → Maintenance
```

**Workflow:**

1. Branch from `main`
2. Work on your changes
3. Open a PR against `main`
4. Ensure CI passes
5. Request review

---

## Pull Request Process

1. **Title** should follow commit convention: `type(scope): description`
2. **Description** should explain:
   - What problem this solves
   - How you solved it
   - Any testing you did
   - Screenshots for UI changes
3. **Keep PRs small** — one feature/fix per PR
4. **Ensure CI passes** — all checks must be green
5. **Self-review** before requesting review

### PR Template

We have a [PR template](.github/PULL_REQUEST_TEMPLATE.md) — please fill it out.

---

## Code Style

### TypeScript

- **Strict mode** enabled — no implicit `any`
- Prefer `unknown` over `any` when type is uncertain
- Use `as const` for constant arrays/objects
- All Server Actions must return `ActionResponse<T>`

### React

- Server Components by default, Client Components only when needed
- "use client" as the first line for client components
- Props interfaces/types before the component definition
- Use `cn()` from `@/lib/utils` for conditional classes

### Imports Order

```typescript
// 1. External libraries (React, Next.js, Clerk, etc.)
import { useState } from "react";
import Link from "next/link";

// 2. Internal modules (actions, lib, hooks, store)
import { upsertChallengeProgress } from "@/actions/user-progress";
import { cn } from "@/lib/utils";

// 3. Components
import { Button } from "@/components/ui/button";

// 4. Types
import type { ActionResponse } from "@/types";
```

### CSS/Tailwind

- Use Tailwind utility classes — no custom CSS unless absolutely necessary
- Follow the [Design System](DESIGN_SYSTEM.md) for colors, spacing, and effects
- Support dark mode with `dark:` prefix
- Use semantic z-index tokens (`z-overlay`, `z-modal`, `z-toast`, etc.)

---

## Testing

We use two testing frameworks:

| Type           | Tool           | What to Test                               |
| -------------- | -------------- | ------------------------------------------ |
| **Unit tests** | Vitest + jsdom | Utility functions (lib/), security modules |
| **E2E tests**  | Playwright     | Critical user flows (auth, lesson, shop)   |

### Running Tests

```bash
# Unit tests (watch mode)
npm test

# Unit tests (single run)
npm run test:run

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

### Writing Tests

- Place unit tests in `src/__tests__/`
- Name files after what they test: `html-sanitizer.test.ts`
- Use descriptive test names
- Mock external services (Gemini, Stripe, Clerk)

---

## Translation

We use `next-intl` with JSON translation files in `messages/`.

To add or edit translations:

1. Edit the relevant key in `messages/en.json`
2. Add the corresponding key to `messages/pt.json` (or other languages)
3. The app automatically picks up the right locale from the `NEXT_LOCALE` cookie

See [TRANSLATION.md](TRANSLATION.md) for the full guide.

---

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/imperador1k/myduolingo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/imperador1k/myduolingo/discussions)
- **Security**: See [SECURITY.md](SECURITY.md)

---

## Recognition

Contributors get listed in our README and release notes. We appreciate every contribution, no matter how small!

---

> **Thank you for helping make Faro better for everyone!** 🌟

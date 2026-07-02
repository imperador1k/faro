# Testing Guide

> How Faro is tested and how to write and run tests.

## Testing Philosophy

We believe in **pragmatic testing**:

- Test utility functions thoroughly (security, validation, business logic)
- Test critical user flows end-to-end
- Don't test implementation details — test behavior
- Every bug fix should include a regression test

## Test Types

| Type            | Tool           | Scope                                           | Location         |
| --------------- | -------------- | ----------------------------------------------- | ---------------- |
| **Unit Tests**  | Vitest + jsdom | Utility functions, security modules, validation | `src/__tests__/` |
| **Integration** | Vitest         | Server Actions (with mocked DB)                 | `src/__tests__/` |
| **E2E Tests**   | Playwright     | Critical user flows (auth, lesson, shop)        | `tests/`         |

## Running Tests

```bash
# Unit tests — watch mode (great for development)
npm test

# Unit tests — single run (for CI)
npm run test:run

# Unit tests — with coverage report
npm run test:coverage

# E2E tests — headless
npm run test:e2e

# E2E tests — with Playwright UI
npm run test:e2e:ui
```

## Writing Unit Tests

### File Structure

```
src/
├── lib/
│   ├── html-sanitizer.ts
│   └── vault-token.ts
├── __tests__/
│   ├── html-sanitizer.test.ts
│   └── vault-token.test.ts
```

### Test Patterns

#### Basic Utility Test

```typescript
import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "@/lib/html-sanitizer";

describe("sanitizeHtml", () => {
  it("should strip script tags", () => {
    const result = sanitizeHtml("<script>alert('xss')</script>Hello");
    expect(result).toBe("Hello");
  });

  it("should allow safe HTML", () => {
    const result = sanitizeHtml("<strong>Hello</strong>");
    expect(result).toBe("<strong>Hello</strong>");
  });

  it("should return empty string for null input", () => {
    expect(sanitizeHtml(null)).toBe("");
  });
});
```

#### Security Module Test

```typescript
import { describe, it, expect } from "vitest";
import { signVaultToken, validateVaultToken } from "@/lib/vault-token";

describe("vaultToken", () => {
  it("should sign and validate a token", async () => {
    const userId = "user_123";
    const token = await signVaultToken(userId);
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");

    const validatedUserId = await validateVaultToken(token);
    expect(validatedUserId).toBe(userId);
  });

  it("should reject tampered tokens", async () => {
    const token = await signVaultToken("user_123");
    const tampered = token + "tampered";
    const result = await validateVaultToken(tampered);
    expect(result).toBeNull();
  });
});
```

## Writing E2E Tests (Playwright)

### Setup

```typescript
// tests/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can sign in with Google", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Sign in");
  // ...
});
```

### Running Locally

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e
```

## Coverage

Coverage reports are generated with `npm run test:coverage`:

- Open `coverage/index.html` in your browser for a visual report
- Coverage thresholds are not enforced yet (planned for 1.0.0)

### Current Coverage Targets

| Module                        | Target | Priority |
| ----------------------------- | ------ | -------- |
| `src/lib/html-sanitizer.ts`   | 100%   | Critical |
| `src/lib/vault-token.ts`      | 100%   | Critical |
| `src/lib/action-error.ts`     | 100%   | Critical |
| `src/lib/subscription.ts`     | 90%    | High     |
| `src/lib/admin-validators.ts` | 90%    | High     |
| `src/lib/ratelimit.ts`        | 90%    | High     |

## Testing Checklist Before PR

- [ ] `npm run test:run` passes
- [ ] New features have corresponding tests
- [ ] Bug fixes include a regression test
- [ ] No console errors (from tests)
- [ ] E2E tests pass for affected flows

# Faro — Unit Tests (`src/__tests__/`)

> Vitest unit tests for critical security and business logic modules.

## Test Files

| File                     | What It Tests                                                    |
| ------------------------ | ---------------------------------------------------------------- |
| `action-error.test.ts`   | Server Action response helper (success/error shapes, edge cases) |
| `html-sanitizer.test.ts` | XSS sanitization (script tags, event handlers, dangerous SVG)    |
| `vault-token.test.ts`    | HMAC token signing and validation (admin panel security)         |
| `subscription.test.ts`   | Subscription tier logic (free/pro/super, feature gating)         |

## Running

```bash
# Run once
npm run test:run

# Watch mode
npm run test

# With coverage
npm run test:coverage
```

See [TESTING.md](../../TESTING.md) for the complete testing guide.

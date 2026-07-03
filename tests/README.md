# Faro — End-to-End Tests (`tests/`)

> Playwright E2E tests for critical user flows.

## Structure

```
tests/
└── landing.spec.ts   # Landing page smoke tests
```

## Running

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/landing.spec.ts
```

See [TESTING.md](../TESTING.md) for the complete testing guide, including unit tests with Vitest.

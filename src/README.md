# Faro — Source Code (`src/`)

> The heart of Faro. A Next.js 14+ App Router application with ~347 source files.

## Directory Map

| Path          | Files | Purpose                                           |
| ------------- | ----- | ------------------------------------------------- |
| `app/`        | 136   | Next.js App Router pages, layouts, API routes     |
| `components/` | 112   | React components organized by domain              |
| `actions/`    | 34    | Server Actions (backend logic)                    |
| `lib/`        | 25    | Utility libraries (Stripe, AI, crypto, etc.)      |
| `db/`         | 12    | Database layer: schema, queries, migrations       |
| `hooks/`      | 8     | Custom React hooks                                |
| `store/`      | 8     | Zustand state stores                              |
| `constants/`  | 3     | Shared constants (achievements, docs, dictionary) |
| `__tests__/`  | 4     | Vitest unit tests                                 |
| `types/`      | 1     | Shared TypeScript type definitions                |
| `i18n/`       | 1     | Locale detection / routing                        |

## Architecture Pattern

```
Server Actions (actions/) ───► Database (db/)
     │
     ├──► React Components (components/)
     │         │
     │         └──► Pages (app/)
     │
     └──► Utility Libraries (lib/)
               │
               └──► External APIs (Stripe, Groq, Supabase)
```

## Key Conventions

- **RSC-first**: Pages default to React Server Components; add `"use client"` only when needed
- **Server Actions**: All data mutations live in `actions/` — no fetch calls in components
- **Zustand**: Client-side state (modals, preferences) in `store/`
- **Drizzle ORM**: Type-safe database queries in `db/queries/`
- **Middleware**: Auth redirects, CSP headers, locale detection in `middleware.ts`

## Root Files

| File                        | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `middleware.ts`             | Clerk auth, CSP headers, admin vault token, i18n redirects |
| `instrumentation.ts`        | Sentry error tracking (server)                             |
| `instrumentation-client.ts` | Sentry error tracking (client)                             |

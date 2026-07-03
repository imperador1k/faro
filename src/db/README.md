# Faro — Database Layer (`src/db/`)

> Drizzle ORM + PostgreSQL (Supabase). 35+ tables, type-safe queries, and zero raw SQL.

## Structure

```
db/
├── drizzle.ts          # Drizzle ORM client initialization
├── schema.ts           # All table definitions (~35 tables)
├── queries.ts          # Shared query helpers
├── migrate-banner.ts   # Migration runner script
├── migration.sql       # Reference SQL migration
└── queries/            # Domain-specific query modules
    ├── challenges.ts   # Challenge/lesson queries
    ├── courses.ts      # Course & enrollment queries
    ├── lessons.ts      # Lesson progression queries
    ├── shop.ts         # Shop & purchase queries
    ├── social.ts       # Friends & social queries
    ├── users.ts        # User profile & settings
    └── vocabulary.ts   # Vocabulary tracking queries
```

## Schema (`schema.ts`)

The single source of truth for the database. Contains ~35 table definitions including:

**Core Domain**

- `users`, `courses`, `units`, `lessons`, `challenges`
- `user_progress`, `user_vocabulary`, `user_reviews`

**Social & Engagement**

- `friendships`, `messages` (E2EE), `knowledge_posts`, `knowledge_likes`, `knowledge_saves`
- `user_read_history`, `achievements`, `quests`, `daily_quests`
- `leaderboard`, `league_results`, `league_participants`

**Gamification**

- `hearts`, `streaks`, `shop_items`, `purchases`, `subscriptions`
- `survival_sessions`, `survival_questions`

**Admin & System**

- `admin_logs`, `support_tickets`, `notification_settings`
- `certificates`, `evaluation_results`

## Query Pattern

Queries in `db/queries/` use Drizzle's type-safe query builder:

```typescript
import { db } from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getLessonById(id: string) {
  return db.query.lessons.findFirst({
    where: eq(lessons.id, id),
    with: { challenges: true, unit: true },
  });
}
```

## Conventions

- **No raw SQL** — Drizzle ORM handles all query generation
- **Relations** defined in `schema.ts` via `relations()` for eager loading
- **Migrations** managed through `drizzle.config.ts` + `drizzle-kit`
- **Indexes** created for frequent query patterns (language+level, user_id lookups)

# Faro — Server Actions (`src/actions/`)

> 34 Server Actions — the entire backend logic layer. No REST API, no GraphQL — just Server Actions.

## Why Server Actions?

- **No API layer to maintain** — no routers, no validation duplication
- **Type-safe end-to-end** — types flow from DB → action → component
- **Progressive enhancement** — forms work without JavaScript
- **Zero CORS** — same origin, no headers to configure

## Action Categories

| Category     | Files | Purpose                                                                              |
| ------------ | ----- | ------------------------------------------------------------------------------------ |
| **Admin**    | 8     | Course/lesson/unit/user/feed/inbox CRUD                                              |
| **AI**       | 4     | Content generation, AI tutor, Gemini, Marco chat                                     |
| **Social**   | 4     | Friends, messages, feed posts, creator economy                                       |
| **Progress** | 5     | XP, streaks, reviews, practice, subscription                                         |
| **Content**  | 4     | Courses, vocabulary, translations, certificates                                      |
| **System**   | 9     | Onboarding, preferences, survival, evaluation, crypto, cron, support, creator portal |

## Complete File List

```
actions/
├── admin.ts                 # Admin dashboard actions
├── admin-courses.ts         # Course CRUD (Zod-validated)
├── admin-feed.ts            # Feed moderation
├── admin-inbox.ts           # Support inbox management
├── admin-lessons.ts         # Lesson CRUD
├── admin-survival.ts        # Survival mode management
├── admin-units.ts           # Unit CRUD
├── admin-users.ts           # User management
├── ai-generator.ts          # AI content generation
├── ai-tutor.ts              # AI tutor interaction
├── certificates.ts          # Certificate generation
├── clear-league-result.ts   # Weekly league reset
├── courses.ts               # Course enrollment
├── create-post.ts           # Feed post creation
├── creator.ts               # Creator portal
├── crypto.ts                # E2EE key management
├── daily-stats.ts           # Daily statistics
├── evaluation.ts            # Placement test scoring
├── feed.ts                  # Feed read/like/save
├── gemini.ts                # Gemini AI integration
├── marco-chat.ts            # Marco chat assistant
├── messages.ts              # E2EE messaging
├── onboarding.ts            # Onboarding wizard
├── practice.ts              # Practice session management
├── preferences.ts           # User preferences
├── social.ts                # Friends, follows, search
├── support.ts               # Support ticket creation
├── survival.ts              # Survival game mode
├── translate.ts             # Translation requests
├── user-actions.ts          # XP, streak, heart management
├── user-progress.ts         # Lesson progress tracking
├── user-reviews.ts          # Review management
├── user-subscription.ts     # Subscription management
└── vocabulary.ts            # Vocabulary tracking
```

## Convention

Every Server Action follows this pattern:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { actionError } from "@/lib/action-error";

export async function myAction(input: MyInput) {
  const { userId } = await auth();
  if (!userId) return actionError("Unauthorized");

  // Zod validation
  // Business logic
  // Database mutation via Drizzle
  // Revalidate path
  // Return success
}
```

## Return Type

All actions return `ActionResponse<T>`:

```typescript
{ success: true, data: T }
// or
{ success: false, error: "Human-readable message" }
```

# API Reference

> Faro's API routes and their usage.

Faro uses two types of server-side endpoints:

1. **Next.js API Routes** (`/api/*`) — for external services (webhooks, cron, auth callbacks)
2. **Server Actions** (`src/actions/*`) — for all internal client-server communication

---

## API Routes

### Authentication

#### `POST /api/auth/desktop-token`

Generates a JWT token for desktop (Tauri) authentication.

- **Auth**: Clerk session
- **Response**: `{ token: string }`
- **Used by**: Tauri app to authenticate against Clerk

#### `POST /api/auth/native-google`

Handles Google OAuth from native mobile (Capacitor) apps.

- **Auth**: Google Auth Library
- **Body**: `{ idToken: string }`
- **Response**: Redirects to app with session

---

### Cron Jobs (Vercel Cron)

#### `GET /api/cron/ingest-feed`

Ingests content from external sources (Reddit), translates via Groq/LLM, and inserts into the knowledge feed.

- **Auth**: Bearer token (`CRON_SECRET` env var)
- **Schedule**: Every 6 hours
- **Response**: `{ success: true, postsCreated: number }`

#### `GET /api/cron/league-reset`

Weekly league reset — promotes/demotes users and resets weekly XP.

- **Auth**: Bearer token (`CRON_SECRET` env var)
- **Schedule**: Every Monday at 00:00 UTC
- **Response**: `{ success: true, usersProcessed: number }`

---

### Payments

#### `POST /api/webhooks/stripe`

Stripe webhook handler for subscription events.

- **Auth**: Stripe webhook signature verification
- **Events handled**:
  - `checkout.session.completed` — new subscription
  - `customer.subscription.updated` — subscription changes
  - `customer.subscription.deleted` — cancellation
- **Idempotency**: Supported via Stripe `Idempotency-Key` header
- **Response**: `200 OK` or `400 Bad Request`

---

### E2EE (End-to-End Encryption)

#### `GET /api/crypto/keys`

Retrieves E2E public keys for a list of users.

- **Auth**: Clerk session
- **Query**: `?userIds=user_1,user_2,user_3`
- **Response**: `{ keys: { [userId]: string } }`

---

### Practice

#### `GET /api/practice/survival`

Returns available survival mode scenarios.

- **Auth**: Clerk session
- **Response**: `{ scenarios: Scenario[] }`

---

## Server Actions (Internal)

All data mutations happen through Server Actions in `src/actions/`. These are called directly from client components:

```typescript
import { someAction } from "@/actions/some-action";

// In a client component:
const result = await someAction(inputData);
if (result.success) {
  // handle success
} else {
  // handle error with result.code and result.message
}
```

### Action Categories

| Category          | File                   | Key Actions                                                                   |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------- |
| **User Progress** | `user-progress.ts`     | `finishLesson`, `reduceHearts`, `refillHearts`, `addPoints`, `consumeXpBoost` |
| **Admin Courses** | `admin-courses.ts`     | `saveCourseAction` (CRUD)                                                     |
| **Admin Units**   | `admin-units.ts`       | `saveUnitAction` (CRUD)                                                       |
| **Admin Lessons** | `admin-lessons.ts`     | `saveLessonAction` (CRUD)                                                     |
| **AI Generator**  | `ai-generator.ts`      | `generateUnitAndLessons`                                                      |
| **AI Tutoring**   | `gemini.ts`            | `askGemini`, `getWritingFeedback`, `getListeningFeedback`                     |
| **Chat**          | `messages.ts`          | `sendMessage`, `createConversation`, `reactToMessage`                         |
| **Social**        | `social.ts`            | `toggleHighFive`, `followUser`, `unfollowUser`                                |
| **Feed**          | `feed.ts`              | `toggleLike`, `toggleSave`, `getFeedPosts`                                    |
| **Evaluation**    | `evaluation.ts`        | `startTest`, `submitAnswer`, `evaluateTest`                                   |
| **Vocabulary**    | `vocabulary.ts`        | `saveWord`, `deleteWord`, `getWordTranslation`                                |
| **Subscription**  | `user-subscription.ts` | `createStripeUrl`                                                             |
| **Support**       | `support.ts`           | `submitSupportTicket`                                                         |

### Response Format

All Server Actions return `ActionResponse<T>`:

```typescript
// Success
{ success: true, data: result }

// Error
{ success: false, code: "ERROR_CODE", message: "User-friendly message" }
```

### Common Error Codes

| Code                 | Meaning                            |
| -------------------- | ---------------------------------- |
| `UNAUTHORIZED`       | User is not authenticated          |
| `VALIDATION_ERROR`   | Input failed Zod validation        |
| `NOT_FOUND`          | Resource does not exist            |
| `RATE_LIMITED`       | Action was rate-limited            |
| `INSUFFICIENT_FUNDS` | User doesn't have enough XP/hearts |
| `INTERNAL_ERROR`     | Something went wrong on the server |

---

## WebSockets

### Supabase Realtime

Used for real-time features:

| Channel Pattern         | Purpose                          |
| ----------------------- | -------------------------------- |
| `chat_{conversationId}` | Live message updates, reactions  |
| `global_presence`       | Online status, typing indicators |

### Gemini Live API

Used for voice conversation mode:

- **Endpoint**: `wss://generativelanguage.googleapis.com/ws/...`
- **Protocol**: Bidirectional WebSocket with PCM16 audio chunks

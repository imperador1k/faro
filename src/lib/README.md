# Faro — Library (`src/lib/`)

> 25 utility modules — the shared logic layer that powers both Server Actions and components.

## Complete File List

```
lib/
├── action-error.ts         # Standardized error/success response helper
├── admin-guard.ts          # Admin role verification (Clerk + DB check)
├── admin-validators.ts     # Zod schemas for all admin forms
├── ai-config.ts            # AI feature flags and model config
├── ai-manager.ts           # AI provider orchestration (Groq, Gemini)
├── ai-topics.ts            # Conversation topic definitions
├── constants.ts            # App-wide constants (XP rates, limits, etc.)
├── crypto.ts               # Encryption utilities (AES-GCM, key derivation)
├── email-templates.ts      # Email HTML template rendering
├── giphy.ts                # Giphy API client
├── haptics.ts              # Haptic feedback (mobile + desktop)
├── html-sanitizer.ts       # Server-side XSS sanitization (DOMPurify)
├── notifications.ts        # Push notification dispatching
├── quests.ts               # Daily quest generation and validation
├── ratelimit.ts            # Rate limiting (Upstash Redis)
├── share.ts                # Web Share API wrapper
├── signal-store.ts         # WebSocket signal store (real-time)
├── string-matching.ts      # Answer comparison (fuzzy, normalized)
├── stripe.ts               # Stripe SDK client and helpers
├── subscription.ts         # Subscription tier logic (free, pro, super)
├── supabaseClient.ts       # Supabase/PostgreSQL client
├── tts-helper.ts           # Text-to-speech (ElevenLabs, browser TTS)
├── utils.ts                # General utilities (cn(), formatDate(), etc.)
├── vault-token.ts          # Admin vault token (HMAC-signed)
└── ai/
    └── prompts.ts          # LLM system prompt templates
```

## Key Modules

| Module               | Why It Exists                                                    |
| -------------------- | ---------------------------------------------------------------- |
| `action-error.ts`    | Every Server Action returns the same shape — this is the factory |
| `html-sanitizer.ts`  | Prevents XSS in user-generated content                           |
| `vault-token.ts`     | HMAC-signed tokens protect the admin panel                       |
| `ratelimit.ts`       | Sliding window rate limiter (Upstash Redis)                      |
| `crypto.ts`          | E2EE for chat (XChaCha20-Poly1305)                               |
| `signal-store.ts`    | Real-time presence, typing indicators, read receipts             |
| `string-matching.ts` | Intelligent answer comparison (lemmatization, fuzzy match)       |
| `stripe.ts`          | Payment processing for subscriptions                             |

## Dependencies Map

```
External APIs           Internal Modules
├── Stripe  ───────────► stripe.ts ───────► subscription.ts
├── Groq/Gemini ───────► ai-manager.ts ───► prompts.ts
├── Supabase ──────────► supabaseClient.ts
├── Upstash Redis ─────► ratelimit.ts
├── ElevenLabs ────────► tts-helper.ts
└── Giphy ─────────────► giphy.ts
```

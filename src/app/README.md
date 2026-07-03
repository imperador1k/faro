# Faro — Pages (`src/app/`)

> Next.js 14+ App Router — 136 files across 30+ route segments.

## Structure

```
app/
├── layout.tsx              # Root layout (Clerk, i18n, theme, Toaster)
├── page.tsx                # Landing page
├── globals.css             # Global styles + Tailwind + animations
├── not-found.tsx           # Custom 404 page
├── error.tsx               # Error boundary
├── loading.tsx             # Global loading state
├── sitemap.ts              # SEO sitemap
├── robots.ts               # Robots.txt
│
├── (auth)/                 # Auth pages (grouped, no layout nesting)
│   ├── sign-in/            # Clerk sign-in ([[...sign-in]])
│   ├── sign-up/            # Clerk sign-up ([[...sign-up]])
│   └── forgot-password/    # Password reset
│
├── (main)/                 # Main app shell (sidebar, header, mobile nav)
│   ├── layout.tsx          # Sidebar + header layout
│   ├── learn/              # Main learning path (lesson map)
│   ├── courses/            # Course selection
│   ├── practice/           # Practice hub (writing, reading, listening, speaking, survival, vocab, history)
│   ├── leaderboard/        # League rankings
│   ├── quests/             # Daily quests
│   ├── shop/               # In-app shop
│   ├── profile/            # User profile
│   ├── settings/           # User settings (20+ config options)
│   ├── friends/            # Social friends list
│   ├── messages/           # E2EE chat
│   ├── notifications/      # Notification inbox
│   ├── reviews/            # Lesson reviews
│   ├── vocabulary/         # Vocabulary dashboard
│   ├── arcade/             # Mini-games (casino, meteoros, sprint, swipe)
│   ├── analytics/          # User analytics dashboard
│   ├── docs/               # In-app documentation
│   └── support/            # Support page
│
├── admin/                  # Admin panel (protected, HMAC-guarded)
│   ├── courses/            # CRUD courses
│   ├── lessons/            # CRUD lessons
│   ├── units/              # CRUD units
│   ├── users/              # User management
│   ├── feed/               # Feed moderation
│   ├── inbox/              # Support inbox
│   └── survival/           # Survival mode management
│
├── api/                    # API routes
│   ├── cron/               # Vercel Cron Jobs (ingest-feed, league-reset)
│   ├── auth/               # Desktop/mobile auth tokens
│   ├── webhooks/           # Stripe webhooks
│   ├── crypto/             # E2EE key exchange
│   └── practice/           # Survival mode API
│
├── feed/                   # Knowledge Feed (TikTok-style)
├── lesson/                 # Interactive lesson player
├── onboarding/             # Multi-step onboarding wizard
├── evaluation/             # Placement test
├── practice/               # Conversation practice
│
├── privacy/                # Privacy policy
├── terms/                  # Terms of service
├── support/                # Support center
└── licenses/               # Open source licenses
```

## Route Groups

- `(auth)/` — No sidebar, minimal layout (sign-in, sign-up)
- `(main)/` — Full app shell with sidebar + mobile nav
- All other routes at root level are standalone pages (feed, lesson, admin, etc.)

## Patterns

- **Each route** has its own `page.tsx` (server component that fetches data)
- **Client interactivity** lives in separated `*-client.tsx` files (e.g., `feed-client.tsx`)
- **API routes** use `route.ts` with `NextRequest`/`NextResponse`
- **Admin CRUD** follows `[resourceId]/page.tsx` for detail/edit views

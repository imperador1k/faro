# Faro — Knowledge Feed (`src/app/feed/`)

> A TikTok-style scrollable feed of educational content, available at `/feed`.

## Route Structure

```
feed/
├── page.tsx               # Feed page (server component)
├── feed-client.tsx         # Client interactivity (swipe, likes, saves)
├── create/                # Create post
│   ├── page.tsx
│   └── create-post-client.tsx
└── saved/                 # Saved posts (Knowledge Vault)
    ├── page.tsx
    └── saved-client.tsx
```

## How It Works

1. **Content Generation**: Daily cron job (`/api/cron/ingest-feed`) uses Groq AI to generate 5 educational facts
2. **Personalization**: Algorithm filters posts by language + level, excludes already-read posts
3. **Swipe UX**: CSS Scroll Snap for native TikTok-like physics
4. **Tracking**: `IntersectionObserver` silently marks posts as read
5. **Ghost Dictionary**: Tap any word for AI-powered contextual translation (cached in Redis)

See `docs/architecture/knowledge-feed.md` for the full architecture document.

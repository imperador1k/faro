# Changelog

All notable changes to Faro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added

- Custom documentation site at `/docs` with Mintlify-like layout
- Vitest unit tests for security utilities (vault-token, html-sanitizer, action-error)
- HMAC-signed admin vault token for enhanced admin security
- DOMPurify server-side HTML sanitization
- Zod validators for all admin actions
- Rate limiting via Upstash Redis for critical actions
- Idempotency key support for Stripe webhooks
- Generic error messages (no stack traces exposed)
- Shared TypeScript types in `src/types/index.ts`

### Changed

- ESLint `no-explicit-any` from "off" to "warn"
- Admin panel now requires HMAC vault token alongside Clerk auth
- CSP headers strengthened across all routes

### Security

- Fixed potential XSS vectors by adding HTML sanitization
- Added server-side input validation for all admin forms
- Stripe webhook now uses idempotency keys to prevent duplicate processing
- Authentication errors return generic messages instead of stack traces

---

## [0.2.0] — 2026-06-15

### Added

- Knowledge Feed with infinite scroll (AI-curated articles)
- Survival Mode — roleplay conversations with NPC AI characters
- Voice Conversation mode using Gemini Live API (WebSocket audio)
- End-to-end encryption for chat messages (WebCrypto AES-GCM)
- Updater plugin for Tauri desktop auto-updates
- Custom NSIS installer with branded UI
- Heart Clinic — practice mode for revisiting past mistakes
- League system with weekly promotions/demotions (Bronze → Diamond)
- Achievement badges and certifications
- Unit search via CTRL+M command palette
- Gamified onboarding walkthrough with Driver.js

### Changed

- Migrated from Tauri v1 to Tauri v2
- Migrated from Zustand v4 to v5
- Migrated from Zod v3 to v4
- Redesigned lesson player with new match-grid and dictation challenge types
- Upgraded Gemini model to 2.5 Flash
- Upgraded Clerk to v6
- Upgraded Drizzle ORM to 0.45
- Upgraded Supabase client to v2
- Improved mobile responsiveness for practice pages

### Fixed

- Heart regeneration timing edge case
- League reset not applying correctly across timezones
- OAuth redirect loop on fresh accounts
- E2EE key generation race condition
- Audio playback on iOS Safari

---

## [0.1.0] — 2026-04-01

### Added

- Initial release
- Next.js 14 App Router with TypeScript
- Drizzle ORM with PostgreSQL (Supabase)
- Clerk authentication with OAuth (Google, GitHub)
- Basic gamification: XP, hearts, streaks
- Course/unit/lesson/challenge system with 4 challenge types
- AI-generated content via Google Gemini 2.0 Flash
- Real-time chat via Supabase Realtime
- Presence indicators (online/typing)
- Follow system and social features
- Leaderboard with weekly leagues
- Shop with power-ups (XP Boost, Heart Shield, Streak Freeze)
- PRO subscription via Stripe
- Tauri v1 desktop wrapper
- Capacitor v8 Android wrapper
- Dark mode with next-themes
- Portuguese (pt) and English (en) i18n
- Playwright E2E tests
- CI/CD with GitHub Actions
- Sentry error monitoring
- Docker Compose for local PostgreSQL

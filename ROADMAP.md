# Roadmap

> Faro's planned features and improvements.

## Vision

Faro aims to become the best open-source language learning platform — combining AI-powered personalized learning, real-time social interaction, and native desktop/mobile experiences.

---

## Current Status (v0.2.0)

✅ AI-powered content generation (Gemini 2.5 Flash)
✅ 4 challenge types (SELECT, INSERT, MATCH, DICTATION)
✅ Gamification (XP, hearts, streaks, leagues, power-ups)
✅ Real-time chat with E2EE
✅ Social features (following, feed, high-fives)
✅ Knowledge feed with AI-curated content
✅ Survival Mode (AI roleplay)
✅ Voice conversation (Gemini Live API)
✅ PRO subscriptions (Stripe)
✅ Desktop app (Tauri v2)
✅ Android app (Capacitor v8)
✅ Dark mode
✅ Admin panel
✅ Security hardening (Zod, CSP, DOMPurify, rate limiting)

---

## Short-Term (v0.3.0)

### Content & Learning

- [ ] **iOS app** — Capacitor iOS build
- [ ] **AI-generated vocabulary lists** — per-lesson vocabulary extracted from generated content
- [ ] **Spaced repetition review** — SRS algorithm for vocabulary review
- [ ] **Pronunciation practice** — Use Web Speech API to evaluate pronunciation

### Social

- [ ] **Group chat improvements** — Admin controls, invites, and permissions
- [ ] **Voice messages** — Record and send voice notes in chat
- [ ] **Friend suggestions** — Based on shared languages and activity

### Platform

- [ ] **PWA improvements** — Offline support, install prompt, background sync
- [ ] **Linux desktop** — Test and certify Linux builds

### Quality

- [ ] **Unit test coverage > 80%** for security utilities
- [ ] **E2E tests for critical flows** — Auth, lesson, shop, admin
- [ ] **i18n: French and Spanish** UI translations

---

## Medium-Term (v0.4.0)

### Content & Learning

- [ ] **Grammar explanations** — AI-generated grammar breakdowns per exercise
- [ ] **Writing correction** — AI-powered essay/paragraph correction with detailed feedback
- [ ] **Adaptive difficulty** — Auto-adjust CEFR level based on performance
- [ ] **Custom flashcard mode** — User-created and AI-recommended flashcards

### Social

- [ ] **Language clubs** — Group learning with shared goals and leaderboards
- [ ] **Live tutoring** — Connect with human tutors (integration with external platforms)
- [ ] **Content moderation** — Automated moderation for user-generated content

### Platform

- [ ] **macOS desktop** — Notarized builds for macOS
- [ ] **Auto-updater improvements** — Delta updates, rollback support
- [ ] **Performance optimization** — Image optimization, lazy loading, bundle splitting

### Security

- [ ] **Security audit** — External security audit
- [ ] **Bug bounty program** — Responsible disclosure rewards

---

## Long-Term (v1.0.0)

### Content & Learning

- [ ] **Full CEFR curriculum** — Complete A1-C2 curriculum for top 5 languages
- [ ] **AI conversation partner** — Free-form voice conversations with AI
- [ ] **Reading library** — Curated articles and stories at every level
- [ ] **Certification exams** — In-app CEFR-aligned certification

### Platform

- [ ] **API for third-party integrations** — REST API for external apps
- [ ] **Plugins/extensions** — Community plugin system
- [ ] **Localization to 20+ languages**

### Community

- [ ] **Contributor program** — Recognition and rewards for top contributors
- [ ] **Translation platform** — Web-based translation UI for community translators
- [ ] **Documentation site** — Full docs at docs.faro.app

---

## Completed Milestones

### v0.1.0 (April 2026)

- Initial MVP: basic gamification, lessons, Clerk auth, Supabase DB
- 4 challenge types with basic AI content generation

### v0.2.0 (June 2026)

- Tauri v2 migration, E2EE chat, Survival Mode
- Voice conversation, knowledge feed, leagues
- Custom installer, auto-updater, Sentry monitoring

---

## Priorities

We prioritize features based on:

1. **User impact** — How many users benefit?
2. **Community demand** — What do contributors and users ask for?
3. **Architectural importance** — Does this enable other features?
4. **Maintenance cost** — Can we sustain it long-term?

---

## Get Involved

Want to help build these features? Check our [issues page](https://github.com/imperador1k/faro/issues) for open tasks. See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

Have a suggestion? Open a [GitHub Discussion](https://github.com/imperador1k/faro/discussions) or feature request.

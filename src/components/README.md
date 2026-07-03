# Faro — Components (`src/components/`)

> 112 React components organized by domain. Every component is TypeScript, Tailwind-styled, and follows the HD Play design system.

## Structure

```
components/
├── ui/              (14)  — Primitive design kit
├── shared/          (34)  — Reusable domain components
├── modals/          (18)  — Modal dialogs
├── settings/        (11)  — Settings page components
├── admin/            (9)  — Admin CRUD forms
├── chat/             (7)  — Messaging UI
├── learn/            (5)  — Learning path components
├── providers/        (4)  — Context providers
├── leaderboard/      (3)  — League & ranking
├── animations/       (2)  — Animation components
├── feed/             (1)  — Feed creation
├── practice/         (1)  — Practice header
└── quests/           (1)  — Quests header
```

## Component Categories

### `ui/` — Design Kit (14 files)

Buttons, dialogs, flashcards, loading screens, textareas, word cards, toasts, Lottie animations. These are the atomic building blocks — they know nothing about business logic.

### `shared/` — Domain Components (34 files)

The largest category. Reusable components that are specific to Faro's features:

- **Navigation**: `sidebar.tsx`, `mobile-nav.tsx`, `mobile-header.tsx`, `command-menu.tsx`
- **Profile**: `profile-hero.tsx`, `edit-profile-button.tsx`, `achievements-list.tsx`
- **Social**: `follow-button.tsx`, `user-search.tsx`, `notification-list.tsx`, `notification-inbox.tsx`
- **Learning**: `lesson-map.tsx`, `practice-setup.tsx`, `vocabulary-sprint.tsx`, `streak-check.tsx`, `tactile-stars.tsx`
- **AI**: `ai-tutor-feedback.tsx`, `floating-marco.tsx`
- **Onboarding**: `app-walkthrough.tsx`, `client-intro-overlay.tsx`

### `modals/` — Modals (18 files)

Every modal is a separate component. Common pattern: `use-*-modal-store.ts` (Zustand) controls open/close state, modal component renders conditionally in `global-modals.tsx`.

### `settings/` — Settings (11 files)

One component per settings section: theme toggle, sound toggle, language toggle, E2E settings, subscription card, danger zone, connected accounts, etc.

### `admin/` — Admin (9 files)

CRUD form components for courses, lessons, units, users. Each form uses the same pattern: Zod validation + Server Action submission.

## Patterns

- **Client components** have `"use client"` directive at the top
- **Server components** (no directive) can be async and directly query the DB
- **Imports** follow: React → Next.js → Libraries → Internal (actions → db → lib → components)
- **CSS**: Tailwind utility classes with `cn()` for conditional merging
- **Animations**: Framer Motion for page transitions, CSS keyframes for micro-interactions

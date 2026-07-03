# Faro — Onboarding Wizard (`src/app/onboarding/`)

> A multi-step guided setup for new users, available at `/onboarding`.

## Route Structure

```
onboarding/
├── page.tsx               # Onboarding entry point
└── _components/
    ├── onboarding-client.tsx       # Step controller (state machine)
    ├── step-welcome.tsx            # Welcome & value proposition
    ├── step-get-ready.tsx          # App introduction
    ├── step-sign-up.tsx            # Account creation (inline)
    ├── step-level.tsx              # Current language level
    ├── step-course.tsx             # Course selection
    ├── step-motivation.tsx         # Learning goals
    ├── step-placement.tsx          # Placement test start
    └── step-placement-result.tsx   # Placement test results
```

## Flow

```
Welcome → Get Ready → Sign Up → Select Level → Pick Course → Motivation → Placement → Results → Learn Page
```

Each step is independently controllable — users can go back/forward, and progress is persisted in `use-onboarding-store` (Zustand) so refreshing doesn't restart.

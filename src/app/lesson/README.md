# Faro — Lesson Player (`src/app/lesson/`)

> The core learning experience — renders interactive challenges inside a full-screen lesson session.

## Route Structure

```
lesson/
├── page.tsx               # Lesson entry point (reads lesson_id from search params)
├── lesson-client.tsx       # Main lesson controller (state machine)
└── _components/           # Internal lesson components
    ├── challenge-card.tsx  # Renders the current challenge
    ├── header.tsx          # Lesson header (progress bar, hearts, close)
    ├── footer.tsx          # Lesson footer (check button, hints)
    ├── match-grid.tsx      # Matching challenge grid
    └── result-screen.tsx   # Lesson completion screen (XP, streak, corrections)
```

## Challenge Types

| Type            | Component            | Description                          |
| --------------- | -------------------- | ------------------------------------ |
| Multiple Choice | `challenge-card.tsx` | Pick the correct answer from options |
| Matching        | `match-grid.tsx`     | Pair words with translations         |
| Writing         | `challenge-card.tsx` | Type the correct translation         |
| Listening       | `challenge-card.tsx` | Listen and transcribe                |
| Speaking        | `challenge-card.tsx` | Speak into microphone                |

## State Machine

The lesson follows a strict flow:

```
Start → Show Challenge → User Answers → Check → Feedback → Next Challenge → Result Screen
```

Progress is saved incrementally via `user-progress.ts` Server Action (not just at the end), so users never lose progress on page refresh.

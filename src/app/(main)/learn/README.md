# Faro — Learning Path (`src/app/(main)/learn/`)

> The main learning page — shows the unit/lesson progression map.

```
learn/
└── page.tsx               # Renders the interactive lesson map
```

## How It Works

- Displays units as horizontal sections with lesson nodes
- Active nodes are golden jewels with breathing animation
- Completed nodes show checkmarks and accuracy percentage
- Locked nodes are grayed out until prerequisites are met
- Clicking a node starts the lesson (`/lesson?lesson_id=X`)

## Key Components

- `src/components/learn/active-unit.tsx` — Current unit with progress
- `src/components/learn/locked-unit.tsx` — Locked unit display
- `src/components/learn/unit-island-feed.tsx` — Unit card in feed
- `src/components/learn/desktop-sidebar.tsx` — Desktop unit sidebar
- `src/components/learn/living-background.tsx` — Animated background
- `src/components/shared/lesson-map.tsx` — Interactive lesson nodes

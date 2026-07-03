# Faro — Practice Hub (`src/app/(main)/practice/`)

> A comprehensive practice center with 7 different skill-focused modes.

## Route Structure

```
practice/
├── page.tsx               # Practice hub overview
├── layout.tsx             # Shared layout for all practice modes
│
├── writing/page.tsx       # Writing practice (compositions, translations)
├── reading/page.tsx       # Reading comprehension
├── listening/page.tsx     # Audio-based comprehension
├── speaking/page.tsx      # Speech recognition practice
├── vocabulary/page.tsx    # Vocabulary review and drills
├── history/               # Practice history
│   ├── page.tsx
│   └── history-list.tsx   # Past session results
└── survival/              # Survival mode (roguelike challenges)
    ├── page.tsx
    ├── survival-lobby-client.tsx
    ├── [sessionId]/       # Active survival session
    └── components/
        └── dynamic-npc.tsx  # AI NPC interaction
```

## Mode Types

| Mode       | Focus                      | Input Type              |
| ---------- | -------------------------- | ----------------------- |
| Writing    | Grammar, composition       | Text input              |
| Reading    | Comprehension              | Multiple choice         |
| Listening  | Audio understanding        | Audio + multiple choice |
| Speaking   | Pronunciation              | Microphone              |
| Vocabulary | Word retention             | Flashcards, matching    |
| History    | Review past sessions       | Read-only               |
| Survival   | Timed roguelike challenges | Mixed (all types)       |

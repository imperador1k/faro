# Faro — Arcade (`src/app/(main)/arcade/`)

> Mini-games that make language practice fun and addictive.

## Route Structure

```
arcade/
├── page.tsx               # Arcade hub (game selection)
├── casino/                # Casino game (bet coins, answer questions)
│   ├── page.tsx
│   └── casino-client.tsx
├── meteoros/page.tsx      # Meteor shower typing game
├── sprint/page.tsx        # Timed sprint challenge
└── swipe/page.tsx         # Swipe-based quiz (Tinder-style)
```

## Games

| Game     | Mechanic                                         | Skill            |
| -------- | ------------------------------------------------ | ---------------- |
| Casino   | Bet coins, answer correctly to multiply winnings | Vocabulary       |
| Meteoros | Type translations before meteors hit             | Typing speed     |
| Sprint   | Answer as many as possible in 60s                | Speed & accuracy |
| Swipe    | Swipe left/right for correct/incorrect           | Comprehension    |

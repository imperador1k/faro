# Faro — Constants (`src/constants/`)

> App-wide constant definitions used by Server Actions, components, and database queries.

| File              | Contents                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| `achievements.ts` | All achievement definitions (id, title, icon, XP reward, unlock condition) |
| `dictionary.ts`   | Lookup tables and vocabulary reference data                                |
| `docs.ts`         | Documentation content and navigation structure                             |

## Purpose

Constants live in a dedicated directory — not scattered across files — for two reasons:

1. **Single source of truth** — no duplicate magic values
2. **Tree-shakeable imports** — components import only what they need

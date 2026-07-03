# Faro — Modals (`src/components/modals/`)

> 18 modal dialogs — each one is a separate component controlled by a Zustand store.

## Modal Pattern

Every modal follows the same architecture:

```
Zustand Store (src/store/use-*-modal-store.ts)
    │  Controls: isOpen, data, onOpen, onClose
    ▼
Modal Component (this directory)
    │  Renders: shadcn Dialog + content
    ▼
global-modals.tsx (renders all modals conditionally)
```

## Modal Inventory

| Modal                         | Store                    | Purpose                              |
| ----------------------------- | ------------------------ | ------------------------------------ |
| `streak-modal`                | —                        | Streak milestone celebration         |
| `hearts-modal`                | `use-hearts-modal-store` | Hearts depleted, show refill options |
| `pro-modal`                   | `use-pro-modal-store`    | Pro subscription upsell              |
| `lesson-start-modal`          | `use-lesson-modal-store` | Lesson start confirmation            |
| `review-modal`                | `use-review-modal-store` | Review session prompt                |
| `share-app-modal`             | —                        | Share Faro with friends              |
| `share-profile-modal`         | `use-share-modal-store`  | Share user profile                   |
| `purchase-success-modal`      | `use-purchase-store`     | Purchase confirmation                |
| `quests-info-modal`           | —                        | Daily quest details                  |
| `league-result-modal`         | —                        | Weekly league results ceremony       |
| `arcade-info-modal`           | —                        | Arcade game instructions             |
| `practice-info-modal`         | —                        | Practice mode info                   |
| `course-completed-modal`      | —                        | Course completion celebration        |
| `unit-search-modal`           | —                        | Search units/courses                 |
| `create-group-modal`          | —                        | Create friend group                  |
| `new-chat-modal`              | —                        | Start new conversation               |
| `notification-settings-modal` | —                        | Notification preferences             |
| `custom-modals`               | —                        | Customizable modal templates         |

## Conventions

- Modal visibility is managed by Zustand, not local state
- Each modal has a `"use client"` directive
- `global-modals.tsx` imports and renders all modals in a single fragment
- Keyboard navigation (Escape to close, Enter to confirm) is handled by shadcn Dialog
- Focus trapping is automatic via Radix UI

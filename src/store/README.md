# Faro — State Stores (`src/store/`)

> 8 Zustand stores — lightweight, TypeScript-safe, no boilerplate.

## What's in a Store?

All stores follow the same pattern:

```typescript
interface StoreState {
  isOpen: boolean;
  data: SomeType | null;
  onOpen: (data?: SomeType) => void;
  onClose: () => void;
}

export const useStore = create<StoreState>((set) => ({
  isOpen: false,
  data: null,
  onOpen: (data) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: null }),
}));
```

## Stores

| Store                    | Controls                              |
| ------------------------ | ------------------------------------- |
| `use-hearts-modal-store` | Hearts depleted modal                 |
| `use-lesson-modal-store` | Lesson start confirmation modal       |
| `use-onboarding-store`   | Onboarding wizard step state          |
| `use-preferences-store`  | User preferences (cached client-side) |
| `use-pro-modal-store`    | Pro subscription upsell modal         |
| `use-purchase-store`     | Shop purchase flow                    |
| `use-review-modal-store` | Review session modal                  |
| `use-share-modal-store`  | Share profile/feed modal              |

## Persistence

- **Modal stores** are ephemeral (no persistence)
- **`use-preferences-store`** persists to `localStorage` for instant load
- **`use-onboarding-store`** persists progress to avoid re-showing completed steps

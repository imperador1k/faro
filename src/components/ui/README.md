# Faro — UI Kit (`src/components/ui/`)

> 14 primitive components — the atomic design system layer. Every other component in Faro builds on these.

## Component Inventory

| Component               | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `button.tsx`            | 3D tactile button (CVA-based variants: primary, secondary, ghost, danger) |
| `dialog.tsx`            | Modal dialog wrapper (shadcn Dialog + Radix UI)                           |
| `textarea.tsx`          | Auto-resizing textarea for chat and forms                                 |
| `flashcard.tsx`         | Flip animation flashcard (word translation)                               |
| `word-card.tsx`         | Vocabulary word display card                                              |
| `interactive-text.tsx`  | Clickable text with tap-to-translate                                      |
| `sound-button.tsx`      | Button with sound effect                                                  |
| `loading-screen.tsx`    | Full-screen loading state                                                 |
| `ai-loading-screen.tsx` | AI-specific loading animation                                             |
| `lottie-animation.tsx`  | Lottie JSON animation player                                              |
| `lottie-block.tsx`      | Block-level Lottie animation                                              |
| `custom-toast.tsx`      | Custom toast notification                                                 |
| `empty-state.tsx`       | Empty state illustration with message                                     |
| `index.ts`              | Barrel export file                                                        |

## Design System Integration

These components implement the HD Play design system:

- **3D press mechanic**: `border-b-4` + `active:translate-y-[2px]`
- **Bento box aesthetic**: `rounded-2xl` + `border-2` + `border-b-8`
- **Nunito font**: All text uses `font-sans` (mapped to Nunito in Tailwind config)
- **Colors**: `#58CC02` green, `#ff4b4b` red, `#0ea5e9` blue

See [DESIGN_SYSTEM.md](../../../DESIGN_SYSTEM.md) for the complete design reference.

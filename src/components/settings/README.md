# Faro — Settings Components (`src/components/settings/`)

> 11 components for the settings page (`/settings`).

| Component                        | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| `theme-toggle.tsx`               | Light/dark mode switch                  |
| `language-toggle.tsx`            | App language selector                   |
| `sound-toggle.tsx`               | Sound effects on/off                    |
| `in-app-notification-toggle.tsx` | In-app notification preferences         |
| `e2e-settings.tsx`               | E2E encryption management               |
| `subscription-card.tsx`          | Current plan + upgrade button           |
| `connected-accounts.tsx`         | Linked social accounts (Google, Apple)  |
| `active-sessions.tsx`            | Active login sessions management        |
| `review-buttons.tsx`             | Rate the app / write a review           |
| `danger-zone.tsx`                | Account deletion with confirmation flow |
| `sign-out-zone.tsx`              | Sign out from all devices               |

## Architecture

- Settings are split between **server** (DB) and **client** (localStorage)
- Server settings are loaded via `preferences-loader.tsx`
- Client settings are hydrated from `use-preferences-store` (Zustand + localStorage)
- Toggles trigger Server Actions immediately (no save button needed)

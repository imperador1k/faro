# Faro — Chat Components (`src/components/chat/`)

> 7 components that power Faro's E2EE messaging system.

| Component                 | Purpose                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `chat-window.tsx`         | Main chat view: message list, input bar, scroll-to-bottom          |
| `chat-sidebar.tsx`        | Conversation list with avatars, last message, unread count         |
| `chat-settings-modal.tsx` | Per-conversation settings (notifications, media, encryption info)  |
| `message-item.tsx`        | Single message bubble (text, image, GIF, reactions, read receipts) |
| `gif-selector.tsx`        | GIF search and picker (Giphy API integration)                      |
| `upload-button.tsx`       | File upload with progress indicator                                |
| `signal-onboarding.tsx`   | E2EE key setup guide (first-time encryption setup)                 |

## Patterns

- Optimistic UI updates for sent messages (no waiting for server)
- Typing indicators via Supabase Realtime
- Infinite scroll pagination for message history
- E2EE decryption happens client-side after fetch

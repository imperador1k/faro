# Faro — Messaging (`src/app/(main)/messages/`)

> End-to-end encrypted chat with friends.

```
messages/
├── page.tsx               # Chat list / conversation selector
└── empty-lottie.tsx       # Empty state animation
```

## Architecture

- **Encryption**: E2EE via XChaCha20-Poly1305 (key exchange through `crypto.ts`)
- **Real-time**: Supabase Realtime subscriptions for live messages
- **Presence**: Online/offline indicators via `global-presence-provider`
- **Media**: GIF support via Giphy API, image upload with upload button

## Key Components

- `src/components/chat/chat-window.tsx` — Main conversation view
- `src/components/chat/chat-sidebar.tsx` — Conversation list
- `src/components/chat/message-item.tsx` — Individual message bubble
- `src/components/chat/chat-settings-modal.tsx` — Chat configuration
- `src/components/chat/gif-selector.tsx` — GIF picker integration
- `src/components/chat/upload-button.tsx` — File upload trigger
- `src/components/chat/signal-onboarding.tsx` — Encryption setup guide

## Server Actions

- `src/actions/messages.ts` — Send, read, delete messages
- `src/actions/crypto.ts` — E2EE key management

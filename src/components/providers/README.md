# Faro — Providers (`src/components/providers/`)

> React context providers that wrap the application root.

## Providers

| Provider                       | Purpose                                               |
| ------------------------------ | ----------------------------------------------------- |
| `global-presence-provider.tsx` | Real-time online/offline presence (Supabase Realtime) |
| `native-bridge.tsx`            | Bridges web app with Tauri/Capacitor native APIs      |
| `native-updater.tsx`           | Desktop app auto-update notifications (Tauri updater) |
| `ui-sound-provider.tsx`        | Global sound effects context (click, XP, streak)      |

## Usage

All providers are composed in the root layout (`src/app/layout.tsx`):

```typescript
<ClerkProvider>
  <NextIntlClientProvider>
    <ThemeProvider>
      <UiSoundProvider>
        <NativeBridgeProvider>
          <GlobalPresenceProvider>
            {children}
          </GlobalPresenceProvider>
        </NativeBridgeProvider>
      </UiSoundProvider>
    </ThemeProvider>
  </NextIntlClientProvider>
</ClerkProvider>
```

## Pattern

Each provider follows the same pattern:

1. Creates a React context with `createContext`
2. Exports a custom hook (e.g., `useUiSounds()`)
3. Wraps children with the context provider
4. Cleans up subscriptions/event listeners in `useEffect` return

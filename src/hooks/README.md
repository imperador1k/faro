# Faro — Custom Hooks (`src/hooks/`)

> 8 reusable React hooks that encapsulate complex browser APIs and third-party integrations.

| Hook                    | File                        | Purpose                                               |
| ----------------------- | --------------------------- | ----------------------------------------------------- |
| `use-debounce`          | `use-debounce.ts`           | Debounces a value (search input, form fields)         |
| `use-gemini-live`       | `use-gemini-live.ts`        | WebSocket connection to Gemini live API               |
| `use-long-press`        | `use-long-press.ts`         | Long-press gesture detection (mobile/desktop)         |
| `use-realtime-messages` | `use-realtime-messages.tsx` | Supabase Realtime subscription for chat               |
| `use-share-prompt`      | `use-share-prompt.ts`       | Web Share API wrapper with fallback                   |
| `use-tts`               | `use-tts.ts`                | Text-to-speech (ElevenLabs + browser SpeechSynthesis) |
| `use-ui-sounds`         | `use-ui-sounds.ts`          | Sound effect playback for interactions                |
| `use-voice-tutor`       | `use-voice-tutor.ts`        | Voice-based AI tutor interaction                      |

## Patterns

- All hooks return `{ value, setValue }` or `{ state, handlers }` shaped objects
- Side-effect cleanup is handled in `useEffect` return functions
- Browser API availability checks are done at runtime, not import time
- Hooks that use `"use client"` components (like `use-realtime-messages`) have a `.tsx` extension

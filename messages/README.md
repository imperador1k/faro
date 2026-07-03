# Faro — Translations (`messages/`)

> i18n translation files for 11 languages, organized by namespace.

## Languages

| Code | Language   | Status                          |
| ---- | ---------- | ------------------------------- |
| `en` | English    | Base language (source of truth) |
| `pt` | Portuguese | Complete                        |
| `es` | Spanish    | Complete                        |
| `fr` | French     | Complete                        |
| `de` | German     | Complete                        |
| `it` | Italian    | Complete                        |
| `hi` | Hindi      | Partial                         |
| `ja` | Japanese   | Partial                         |
| `ar` | Arabic     | Partial                         |
| `uk` | Ukrainian  | Partial                         |
| `zh` | Chinese    | Partial                         |

## Namespace Structure

Each language has 14 JSON files:

```
messages/{lang}/
├── common.json        # Global UI strings (buttons, errors, menus)
├── feed.json          # Knowledge Feed
├── learn.json         # Learning path and lessons
├── practice.json      # Practice hub
├── leaderboard.json   # Leagues and rankings
├── shop.json          # In-app shop
├── settings.json      # Settings page
├── profile.json       # User profile
├── friends.json       # Social features
├── messages.json      # Chat and messaging
├── admin.json         # Admin panel
├── onboarding.json    # Onboarding wizard
├── quests.json        # Daily quests
└── arcade.json        # Mini-games
```

## Workflow

1. Edit `messages/en/*.json` (add new strings in English)
2. Run `npm run translate` to auto-translate all languages via Groq API
3. Review translations and manually fix any issues
4. Open a PR with the updated translation files

See [TRANSLATION.md](../TRANSLATION.md) for the complete guide.

# Translation Guide

> How to contribute translations to Faro.

## How It Works

Faro uses [next-intl](https://next-intl-docs.vercel.app/) for internationalization. Translation files are JSON files stored in `messages/`.

### Locale Detection

- The app reads the `NEXT_LOCALE` cookie to determine the user's language
- Default is `pt` (Portuguese)
- Falls back to `en` (English) if the translation file doesn't exist

---

## Currently Supported Languages

| Code | Language   | Status      |
| ---- | ---------- | ----------- |
| `en` | English    | ✅ Complete |
| `pt` | Portuguese | ✅ Complete |

## Adding a New Language

### 1. Create the Translation File

Copy `messages/en.json` to `messages/{locale}.json`:

```bash
cp messages/en.json messages/fr.json
```

Replace `fr` with your [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

### 2. Translate the Content

Open the JSON file and translate all string values. Keep the JSON structure intact:

```json
{
  "seo": {
    "title": "Your Translated Title",
    "description": "Your Translated Description"
  },
  "shared": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading..."
  }
}
```

### 3. Update the i18n Config

The i18n configuration is in `src/i18n/request.ts`. The app automatically loads any JSON file from `messages/`, so no code changes are needed.

### 4. Add to Language Constants

Update the language list in:

- `scripts/content_pipeline.py` — `LANGUAGES` dict
- `scripts/prompt_maker.py` — `LANGUAGES` dict
- `src/lib/constants.ts` — `SUPPORTED_LANGUAGES` (if it exists)
- `src/lib/ai-config.ts` — `AI_CONFIG.languages` (for AI persona)

### 5. Test Your Translation

```bash
npm run dev
# Set the cookie: document.cookie = "NEXT_LOCALE=fr";
# Or use browser dev tools to set the cookie
```

---

## Translation Tips

1. **Keep the JSON structure identical** — keys must match exactly
2. **Check for variables** — some strings use `{variable}` syntax. Preserve these.
3. **Consider context** — the same English word may translate differently in different contexts
4. **Use the correct register** — Faro uses informal tone (Portuguese: "tu", not "você")
5. **Test in context** — translations that look correct in isolation may not fit the UI

---

## JSON Structure

Translation files are organized by namespace, matching the `useTranslations("namespace")` calls in the code:

```json
{
  "seo": {}, // SEO metadata (title, description, keywords)
  "shared": {}, // Shared UI strings (buttons, labels)
  "Learn": {}, // Learn page
  "courses": {}, // Course selection
  "shop": {}, // In-app shop
  "leaderboard": {}, // League/leaderboard
  "practice": {}, // Practice modes
  "chat": {}, // Chat/messaging
  "feed": {}, // Knowledge feed
  "admin": {}, // Admin panel
  "onboarding": {}, // Onboarding flow
  "providers": {}, // Provider components (NativeBridge, etc.)
  "settings": {}, // Settings page
  "profile": {}, // User profile
  "modals": {}, // Modal dialogs
  "notifications": {}, // Notification strings
  "errors": {} // Error messages
}
```

---

## Translation Review Process

1. Create a PR with your translation file
2. A maintainer or native speaker will review
3. Once approved, the translation is merged
4. You'll be credited in the release notes

---

## Questions?

Open a [GitHub Discussion](https://github.com/imperador1k/faro/discussions) with the `i18n` tag.

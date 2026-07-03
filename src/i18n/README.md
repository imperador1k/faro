# Faro — Internationalization (`src/i18n/`)

> Locale detection and routing for Faro's 11 supported languages.

## `request.ts`

The core i18n module. Determines the user's locale using this hierarchy:

1. **Cookie** (`NEXT_LOCALE`) — user's manual choice
2. **Database** (`native_language`) — from user profile
3. **HTTP Header** (`Accept-Language`) — browser default
4. **Fallback** — English (`en`)

## Integration

- **Library**: `next-intl` with `localePrefix: 'never'` (no URL prefixes)
- **Translation files**: `messages/{lang}/{namespace}.json` (14 namespaces)
- **Usage**: `const t = useTranslations("Feed"); t("share_with_friends")`

See [TRANSLATION.md](../../TRANSLATION.md) for the full i18n guide.

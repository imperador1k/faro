# Internationalization Architecture (i18n)

## Architecture Decision: Cookie-Based Routing (No Prefixes)

For **Faro**, we chose the **Cookie-Based (No URL Prefixes)** approach.
We discarded the traditional path-based routing (`/en/feed`) and configured `next-intl` with `localePrefix: 'never'`.

### Why this choice?

1. **Aesthetics and UX:** Users hate dirty URLs. We want the link to always be `faro.com/feed`, never `faro.com/pt-PT/feed`.
2. **Smart Link Sharing:** When sharing `/post/1`, the app reads the Cookie (or the recipient's device language) and translates the post and UI automatically to the native language.
3. **SEO is not an internal priority:** Most of the app is behind Login (Feed, Learn, Shop, Admin). The Landing Page (`/`) can handle SEO through `hreflang` metadata without dirtying web app routes.

---

## The Engine: `next-intl`

The implementation uses the official Next.js 14+ library: `next-intl`.

### 1. Language Detection Hierarchy

The system decides the language in this strict priority order:

1. **Cookie (`NEXT_LOCALE`):** If the user has manually chosen in their Profile.
2. **Database (`native_language`):** The system reads the database (via `NativeBridge`).
3. **HTTP Header (`Accept-Language`):** The browser/device default language (unauthenticated visitors).
4. **Fallback (English):** The safety language if everything else fails.

### 2. Dictionary Structure (JSON files)

We use separate files to maintain organization.

```text
/messages
  /pt
    common.json      (Buttons, Errors, Global Menus)
    feed.json        (Feed page translations)
    learn.json       (Lesson translations)
  /en
    common.json
    feed.json
    learn.json
```

**UI Refactoring Example:**

```tsx
const t = useTranslations("Feed");
<button>{t("share_with_friends")}</button>;
```

### 3. Automation at Scale

We write code and dictionary in the base language (English or Portuguese). A helper script (`npm run translate`) uses the Groq/LLaMA API to read `messages/pt/...` and automatically update all other JSON files.

---

## Implementation Roadmap

Steps for safe implementation (individual commits suggested):

1. **Core Setup:**
   - Install `next-intl`.
   - Create core files: `i18n.ts`, `middleware.ts`, and `navigation.ts`.
   - Configure Middleware to handle Cookies and invisible redirects.

2. **Base Layout Migration:**
   - Wrap the Root Layout with `NextIntlClientProvider`.
   - Pass the dynamic locale to the `<html>` tag.

3. **Sidebar & Navbar Refactoring:**
   - Extract all main menu texts to `messages/{lang}/common.json`.
   - Update the UI to consume the translation function.

4. **Language Switcher (Settings):**
   - Create a Server Action that lets the user force the language (updates Cookie and DB).
   - Add the Dropdown in the settings menu.

5. **Progressive Translation:**
   - Granularly migrate remaining pages (Landing Page > Feed > Learn) to avoid breaking changes in layouts.

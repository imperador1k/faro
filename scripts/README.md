# Faro — Scripts (`scripts/`)

> Automation scripts for development, translation, and maintenance.

## Available Scripts

All run via `bun run scripts/<name>.ts` or `npm run <name>`.

| Script               | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| `i18n-extractor.ts`  | Extracts hardcoded strings from source files into i18n JSON namespaces |
| `translate.ts`       | Batch-translates all i18n JSON files via Groq/LLaMA API                |
| `patch-seo.js`       | Patches SEO metadata across pages                                      |
| `scratch_migrate.ts` | One-off database migration scripts                                     |

## Adding a Script

1. Create a `.ts` file in this directory
2. Use `bun` for execution (ESM, TypeScript-native)
3. Log progress with `console.log` — no external logger needed

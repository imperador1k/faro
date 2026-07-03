# Deployment Guide

> How to deploy Faro to production environments.

## Overview

Faro deploys to three targets:

| Target      | Platform               | Hosting           |
| ----------- | ---------------------- | ----------------- |
| **Web**     | Next.js 14 App Router  | Vercel            |
| **Desktop** | Tauri v2 (Rust)        | GitHub Releases   |
| **Mobile**  | Capacitor v8 (Android) | Google Play Store |

---

## Web (Vercel)

### Prerequisites

- A [Vercel](https://vercel.com/) account (Hobby plan works)
- Your project connected to GitHub
- All environment variables configured (see [SETUP.md](SETUP.md))

### Steps

1. **Push to GitHub** — Vercel auto-deploys from the `main` branch

2. **Configure Environment Variables** in Vercel Dashboard → Settings → Environment Variables

   Add all variables from `.env.example`. Critical ones:
   - `DATABASE_URL` — Use a **production** Supabase connection string
   - `CLERK_SECRET_KEY` — Use production Clerk keys
   - `GEMINI_API_KEY` — Production Gemini key
   - `ADMIN_ALLOWED_USER_IDS` — Your Clerk user IDs
   - `CRON_SECRET` — A strong random string

3. **Set Up Cron Jobs** (Vercel Cron)

   In `vercel.json`:

   ```json
   {
     "crons": [
       {
         "path": "/api/cron/league-reset",
         "schedule": "0 0 * * 1"
       },
       {
         "path": "/api/cron/ingest-feed",
         "schedule": "0 */6 * * *"
       }
     ]
   }
   ```

4. **Configure Custom Domain**
   - Vercel Dashboard → Domains → Add `yourdomain.com`
   - Update DNS records

5. **Set Up Sentry** (optional)
   - Add `SENTRY_AUTH_TOKEN` to environment variables
   - Sentry is pre-configured in `next.config.mjs`

### Build Command

```bash
npm run build
```

Vercel detects Next.js automatically.

---

## Desktop (Tauri)

### Prerequisites

- **Rust** toolchain (`rustup`)
- **Windows**: WebView2 (pre-installed on Windows 10+)
- **macOS**: Xcode Command Line Tools
- **Linux**: WebKitGTK + dependencies

### Build Steps

```bash
# 1. Build the Next.js app
npm run build

# 2. Build the Tauri desktop app
npm run tauri build
```

The compiled binary will be in `src-tauri/target/release/`.

### Auto-Updates

Faro uses `tauri-plugin-updater` for automatic updates:

1. **Configure** endpoints in `src-tauri/tauri.conf.json`:

   ```json
   {
     "plugins": {
       "updater": {
         "endpoints": [
           "https://github.com/imperador1k/faro/releases/latest/download/updater.json"
         ]
       }
     }
   }
   ```

2. **Update `updater.json`** with each release:

   ```json
   {
     "version": "0.2.0",
     "notes": "Release notes here",
     "pub_date": "2026-07-02T00:00:00Z",
     "platforms": {
       "windows-x86_64": {
         "signature": "...",
         "url": "https://github.com/imperador1k/faro/releases/download/v0.2.0/Faro_0.2.0_x64_en-US.msi.zip"
       }
     }
   }
   ```

3. **Sign the updater** using the Tauri CLI:
   ```bash
   npm run tauri signer generate
   ```

### Custom NSIS Installer

For Windows, Faro uses a custom NSIS installer with a branded UI:

```bash
cd installer-app
npm install
npm run build
```

The built installer is in `installer-app/dist/`.

### Custom Uninstaller

```bash
cd uninstaller-app
npm install
npm run tauri build
```

---

## Mobile (Capacitor Android)

### Prerequisites

- Android Studio
- Android SDK 34+
- A Keystore for signing

### Build Steps

```bash
# 1. Build the web app
npm run build

# 2. Sync with Capacitor
npx cap sync

# 3. Open in Android Studio
npx cap open android

# 4. Build APK/AAB in Android Studio
# Build → Build Bundle(s) / APK(s)
```

### Google Play Store

1. Generate a signed AAB:

   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. Upload to Google Play Console

---

## CI/CD (GitHub Actions)

Faro uses GitHub Actions for CI/CD. The workflow:

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci && npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci && npm run test:run

  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci && npm run build
```

---

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] DATABASE_URL points to production Supabase
- [ ] Clerk keys are production keys (not test)
- [ ] Supabase RLS policies are active
- [ ] Stripe webhook endpoint is configured
- [ ] CRON_SECRET is set and matches webhook secrets
- [ ] Sentry is configured for error tracking
- [ ] CSP headers are production-ready
- [ ] Custom domain SSL is active
- [ ] Rate limiting is configured (Upstash)

# Faro — Android App (`android/`)

> Capacitor native Android project. Auto-generated, not edited manually.

## Overview

This directory contains the Android Studio project for Faro's mobile app. It's generated and managed by Capacitor.

## Commands

```bash
# Sync web build to native project
npx cap sync android

# Open in Android Studio
npx cap open android

# Build release APK
cd android && ./gradlew assembleRelease
```

## Key Files

| File                                  | Purpose                             |
| ------------------------------------- | ----------------------------------- |
| `app/src/main/AndroidManifest.xml`    | App permissions and configuration   |
| `app/build.gradle.kts`                | Android build configuration         |
| `app/src/main/res/values/strings.xml` | App name and string resources       |
| `app/src/main/java/`                  | Capacitor bridge and native plugins |

## Notes

- Do **not** edit files here directly — make changes via Capacitor config or native plugins
- Run `npx cap sync android` after updating `capacitor.config.ts` in the root
- Icons and splash screens are in `app/src/main/res/` (generated from `assets/`)

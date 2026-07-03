# Faro — Shared Components (`src/components/shared/`)

> 34 reusable domain components — the largest component category in the project.

## Navigation

| Component           | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `sidebar.tsx`       | Main app sidebar with route links, streak, profile |
| `mobile-header.tsx` | Mobile top bar with hamburger menu                 |
| `mobile-nav.tsx`    | Mobile bottom navigation bar                       |
| `command-menu.tsx`  | Cmd+K palette for quick navigation                 |

## Social & Profile

| Component                 | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `profile-hero.tsx`        | User profile header (avatar, stats, bio) |
| `edit-profile-button.tsx` | Profile editing trigger                  |
| `follow-button.tsx`       | Friend follow/unfollow toggle            |
| `user-search.tsx`         | Global user search                       |
| `achievements-list.tsx`   | Achievement badges grid                  |
| `notification-list.tsx`   | Notification items list                  |
| `notification-inbox.tsx`  | Notification center panel                |
| `notification-toggle.tsx` | Per-type notification toggle             |

## Learning

| Component               | Purpose                            |
| ----------------------- | ---------------------------------- |
| `lesson-map.tsx`        | Interactive lesson progression map |
| `unit-card-island.tsx`  | Unit/course card display           |
| `practice-setup.tsx`    | Practice mode configuration        |
| `vocabulary-sprint.tsx` | Vocabulary review game             |
| `streak-check.tsx`      | Daily streak indicator             |
| `tactile-stars.tsx`     | Star rating with animation         |

## AI & Onboarding

| Component                  | Purpose                       |
| -------------------------- | ----------------------------- |
| `ai-tutor-feedback.tsx`    | AI feedback on answers        |
| `floating-marco.tsx`       | Floating AI assistant (Marco) |
| `app-walkthrough.tsx`      | First-time user tutorial      |
| `client-intro-overlay.tsx` | Welcome overlay for new users |

## Utilities

| Component                | Purpose                             |
| ------------------------ | ----------------------------------- |
| `landing-cta.tsx`        | Landing page call-to-action         |
| `legal-layout.tsx`       | Legal page wrapper (privacy, terms) |
| `qr-scanner.tsx`         | QR code scanner for desktop auth    |
| `qr-scanner-modal.tsx`   | QR scan in modal dialog             |
| `user-sync.tsx`          | Cross-device sync component         |
| `preferences-loader.tsx` | Client-side preferences hydration   |
| `tts-unlocker.tsx`       | Unlocks browser TTS audio context   |

## Platform-Specific

| Component                        | Purpose                        |
| -------------------------------- | ------------------------------ |
| `MedianOAuthFix.tsx`             | OAuth token refresh workaround |
| `native-google-login-button.tsx` | Mobile native Google sign-in   |
| `OneSignalProvider.tsx`          | Push notification provider     |
| `in-app-notifier.tsx`            | In-app notification toasts     |
| `certifications-list.tsx`        | Certificate download/gallery   |

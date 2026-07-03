# Faro — Static Assets (`public/`)

> All publicly served static files — images, sounds, fonts, animations, and app manifests.

## Structure

```
public/
├── images/          # PNG, SVG, WebP images (icons, illustrations, backgrounds)
├── sounds/          # MP3, OGG sound effects (UI clicks, XP gain, streak, etc.)
├── fonts/           # Self-hosted font files (Geist, Nunito variants)
├── lottie/          # Lottie JSON animations (loading, celebrations, mascots)
├── og/              # Open Graph images for social sharing
├── icons/           # Favicon, PWA icons, Apple touch icons
│
├── manifest.json    # PWA manifest (name, icons, theme_color, display)
├── sw.js            # Service worker (offline support)
├── sitemap.xml      # SEO sitemap
└── robots.txt       # Search engine crawling rules
```

## Conventions

- All images are optimized via Next.js `<Image>` component (no unoptimized `<img>`)
- Lottie animations use `lottie-react` for lightweight rendering
- Sounds are loaded lazily via `use-ui-sounds` hook
- PWA manifest uses Faro branding colors (`#58CC02` green)

# Frequently Asked Questions

> Common questions about Faro.

## General

### What is Faro?

Faro is an open-source language learning platform. It combines gamification (XP, streaks, leagues) with AI-powered content generation and real-time social features. Think Duolingo-inspired design philosophy, but with our own architecture, stack, and pedagogical approach.

### Is it a Duolingo clone?

No. Faro is inspired by Duolingo's excellent gamification and UI design, but it's an independent project with:

- Its own architecture (Next.js + Tauri + Supabase)
- AI-generated content (not static curricula)
- Real-time chat with end-to-end encryption
- Desktop and mobile native apps
- A completely different codebase

### Is Faro free?

Yes, Faro is free and open-source (MIT license). There's a PRO subscription (via Stripe) that unlocks unlimited hearts and exclusive AI practice modes, but all core features are free.

### Who maintains Faro?

Faro was created and is maintained by Miguel Pereira Santos. See our [Governance Model](GOVERNANCE.md) for how decisions are made.

---

## Technical

### What tech stack does Faro use?

See the full list in [README.md](README.md#-tech-stack) or the deep dive in [ARCHITECTURE.md](ARCHITECTURE.md).

### Can I run it locally?

Yes! See [SETUP.md](SETUP.md) for a complete guide. You'll need Node.js, Docker (or PostgreSQL), and a few free API keys.

### How does AI content generation work?

Administrators can generate complete language curricula (units + lessons + challenges) with one click. The system sends a structured prompt to Google Gemini 2.5 Flash, which returns valid JSON that's inserted directly into the database. See [AI_CONTENT.md](AI_CONTENT.md) for details.

### Is my chat data encrypted?

Yes. Faro uses end-to-end encryption (AES-GCM) for all chat messages. Public keys are exchanged via the server, and room keys are stored encrypted. See [ARCHITECTURE.md](ARCHITECTURE.md#section-4) for details.

### What languages are supported?

12 languages: English, Spanish, French, Portuguese, German, Italian, Japanese, Korean, Mandarin, Russian, Arabic, and Dutch. The UI is available in Portuguese and English.

---

## Community

### How can I contribute?

We welcome all contributions! Start by reading [CONTRIBUTING.md](CONTRIBUTING.md). You can:

- Fix bugs or add features
- Improve documentation
- Translate the app
- Report issues
- Review pull requests

### How do I report a bug?

Open a [GitHub Issue](https://github.com/imperador1k/myduolingo/issues) with the `bug` label. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues.

### How do I request a feature?

Open a [GitHub Issue](https://github.com/imperador1k/myduolingo/issues) with the `enhancement` label.

### How do I report a security vulnerability?

**Do not open a public issue.** Email the maintainer directly. See [SECURITY.md](SECURITY.md) for details.

---

## Deployment

### Where is the web app hosted?

The main app is deployed on Vercel at [myduolingo.vercel.app](https://myduolingo.vercel.app).

### How do I deploy my own instance?

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel, Tauri desktop, and Capacitor mobile deployment guides.

### Is there a desktop app?

Yes! Faro has a native desktop app built with Tauri v2 (Rust). It's available for Windows, macOS, and Linux. See [DEPLOYMENT.md](DEPLOYMENT.md) for build instructions.

### Is there a mobile app?

Yes, Faro has an Android app built with Capacitor v8. iOS support is planned.

---

## Using Faro

### How do I start learning?

1. Sign up at [myduolingo.vercel.app](https://myduolingo.vercel.app)
2. Complete the onboarding (select your target language)
3. Start with the first lesson on the course map

### What are hearts?

Hearts are lives. You start with 5 hearts and lose one for each mistake. They regenerate over time (1 heart every 5 hours). You can also buy refills or use Heart Shields from the shop.

### What are leagues?

Leagues are weekly competitions. Every Monday, users are grouped into leagues based on their previous week's XP. Top performers get promoted to higher leagues (Bronze → Silver → Gold → Platinum → Diamond). Bottom performers get demoted.

### What is PRO?

PRO is a paid subscription that gives you:

- Unlimited hearts
- Exclusive AI practice modes
- VIP Gold badge visible across the app
- Priority support

### What is Survival Mode?

Survival Mode is an AI-powered roleplay conversation. You talk to an AI character in your target language, and the AI adapts to your skill level. It's like a text-based adventure for language practice.

---

## For Developers

### Can I use Faro's code for my own project?

Yes! Faro is MIT licensed. You can use, modify, and distribute the code freely. Attribution is appreciated but not required.

### Can I contribute translations?

Absolutely! See [TRANSLATION.md](TRANSLATION.md) for how to add or update translations.

### What's the roadmap?

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.

---

## Still Have Questions?

Open a [GitHub Discussion](https://github.com/imperador1k/myduolingo/discussions) — we're happy to help!

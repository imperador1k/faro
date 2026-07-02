# Faro: Knowledge Feed Architecture (TikTok-Style)

This document describes the workings, technologies, and architectural vision of the **Knowledge Feed** (available at `/feed`), designed as a highly addictive and educational feature similar to TikTok's feed.

---

## 1. How It Works (Current Implementation)

The Feed is a 100% automated ecosystem composed of two major parts: **Daily Content Generation** and **Interactive Consumption**.

### A. Daily Ingestion Engine (Backend / Cron Job)

Content is not inserted manually. A cron endpoint (`/api/cron/ingest-feed`) runs daily.

- **Cron API Security:** The route is natively protected! When Vercel calls the cron job, it silently injects an `Authorization: Bearer <CRON_SECRET>` header. If an external user or bot tries to access the endpoint in Production without this Secret, the server rejects the request with a **401 Unauthorized** error.
- **Vercel Implementation:** The cron periodicity is defined in `vercel.json`. Configured to run daily (`0 8 * * *` - 08:00 UTC).
- **Native AI (Groq + LLaMA 3.1):** Initially, we considered scraping Reddit (`r/todayilearned`) and Wikipedia. Due to robust anti-bot protections on these platforms (like Cloudflare causing `403 Forbidden` errors), the architecture was **pivoted**.
- Currently, the script communicates **exclusively with the Groq API** (using the ultra-fast `llama-3.1-8b-instant` model).
- **Process:** The AI is instructed to _invent_ 5 factual curiosities in English, immediately translate them to the user's target language (e.g., Portuguese, B1 Level), and associate a keyword with each fact (e.g., "volcano", "computer"). This data is saved directly to the PostgreSQL database (via Drizzle).
- **Images (LoremFlickr):** Dynamic background images don't use AI to avoid generation costs. We take the keyword Groq extracted (e.g., `computer`) and call the public **LoremFlickr** API (`https://loremflickr.com/800/1200/computer`).

### B. Consumption and Interactivity (Frontend)

- **Infinite Swipe:** Posts load in fullscreen with the classic vertical scroll mechanic.
- **Read History:** As soon as a post becomes visible (via the Web `IntersectionObserver` API), it is silently marked as read in the database (`user_read_history`). On reloading the app, already-seen posts won't appear again, ensuring fresh content.
- **Ghost Dictionary V2 (Groq + Redis Caching):** Each word in the post (and title) has an interactive dashed underline. Clicking a word triggers an on-the-fly contextual translation using the Groq AI. To avoid high API costs and limits, the response is permanently stored in ultra-fast RAM (Upstash Redis). Future clicks on the same word/context load the translation from Redis in 5ms at zero cost.

| Component                          | Technology                           | Rationale                                                                                                       |
| ---------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Content Generation**             | `Groq` + `LLaMA-3.1`                 | Extremely fast (absurd tokens/second) and free on current tier. Eliminates need for Web Scraping.               |
| **Background Images**              | `LoremFlickr`                        | Free, fast, no API Key required, allows keyword-based fetching.                                                 |
| **Contextual Instant Translation** | `Groq (LLaMA-3.1)` + `Upstash Redis` | Perfect translations because they analyze the full sentence. Redis ensures AI only works once per word/context. |
| **Database**                       | `Supabase` (PostgreSQL) + `Drizzle`  | Transactional support, speed, and perfect TypeScript integration.                                               |

---

## 3. Scalability and Future Improvements

If the application grows to thousands of users, the Redis (for translations) and Groq (for generation) foundation already provides massive support. However, here is the evolution plan:

### A. Offline / Edge Solution (Local AI)

- Since the project already scales to Desktop apps (using Tauri/Capacitor), we could run tiny models like `Gemma-2b` directly in the user's browser (via WebGPU / Transformers.js) to do translations and validations **100% offline**, without ever contacting the Redis or Groq servers.

### B. Distributed Weighted Ingestion

- The Cron Job is configured for Vercel. Vercel's free tier limit for Serverless Functions is 10 to 60 seconds. The script can time out if generating 50 posts at once.
- **Solution:** Migrate cron execution to asynchronous Background Job services (like **Upstash QStash** or **Inngest**).
- This would allow the Ingestion Engine to run over hours, generating hundreds of posts daily to populate a global database.

### C. Video / Audio Recommendation System

- Replace static LoremFlickr images with dynamic vertical royalty-free videos (via `Pexels Video API`), crossed with a Text-to-Speech API (like `ElevenLabs` or `OpenAI TTS`), creating the full illusion of an AI-narrated Reels / TikTok.

### D. Feed Gamification

- Reward coins whenever a user clicks to translate a word the system considers "Advanced," encouraging active study even in "Passive Scroll" mode.

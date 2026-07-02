# Architecture Document: Knowledge Feed (TikTok-Style Learning)

**Status:** Implementation In Progress (Phases 1 & 2 completed/ongoing)
**Tech Stack:** Next.js, React, Tailwind CSS, Supabase (PostgreSQL), Groq API, Vercel Cron

---

## 1. Data Ingestion Strategy

To ensure an infinite flow of interesting content at zero cost, we use free public APIs that provide formatted data.

### Data Sources

- **Reddit API (`.json` format, no aggressive auth):**
  - Endpoints: `https://www.reddit.com/r/todayilearned/top.json?limit=15&t=day` and `https://www.reddit.com/r/science/top.json?limit=15&t=day`.
  - _Why:_ Community-validated facts (high upvotes) perfect for micro-learning.
- **Wikipedia API ("On this day"):**
  - Endpoint: `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{MM}/{DD}`
  - _Why:_ Interesting historical facts, short and sweet.

### Ingestion Infrastructure

- **Cron Job Hosting:** **Vercel Cron Jobs**. Allows scheduling an API endpoint call (`/api/cron/ingest-feed`) without dedicated servers.
- **Cadence:** Once daily at **03:00 UTC** (off-peak hours).
- **Volume:** Extraction of 30 best combined posts (15 TIL, 10 Science, 5 Wikipedia). ~900 posts/month per language, more than enough for daily swiping.

---

## 2. AI Pipeline (Translation and Formatting)

Raw English data needs to be translated and adapted to the user's level (e.g., A2/B1) and supported platform languages.

### AI Processor

- **Provider:** **Groq API** (focused on LPU for ultra-fast inference and reduced cost).
- **Model:** `llama-3.1-8b-instant`. Fast, lightweight, excellent at following strict JSON schemas.

### Rate Limit Management (Groq TPM = 6000)

To avoid exhausting 6000 Tokens Per Minute on the Free Tier:

1. **Batching and Delays:** The Cron Job processes sequentially (or in batches of 3 posts at a time).
2. **Throttle Loop:** After processing each batch (~500 tokens/post, ~1500 tokens/batch), implement a `await new Promise(r => setTimeout(r, 15000))` (15s delay) before the next batch.
3. **Vercel Timeout Limits:** Since the free Vercel tier limits API Routes to 10s (60s on Pro), ingestion can be split by category or dispatched through a queue system (e.g., **Upstash Redis / QStash**) to delegate execution and circumvent timeouts.

### The System Prompt

```text
You are an expert language teacher and translator.
Convert the provided English trivia fact into {TARGET_LANGUAGE} adapted for a {CEFR_LEVEL} learner.
Keep the language natural but accessible. Use common vocabulary.

You must reply with a STRICT JSON object containing exactly these fields:
{
  "title": "A short, engaging title (max 6 words).",
  "category": "One of: TECHNOLOGY, HISTORY, SCIENCE, CULTURE, RANDOM.",
  "body": "The translated fact, split into 2-3 short sentences. Max 350 characters total."
}

Do not include markdown blocks or any other text. Return ONLY the JSON object.
```

---

## 3. Creator Economy (User Generated Content)

To complement automatic ingestion (APIs), we allow the community itself to create Feed content, increasing engagement and retention.

### Submission Flow

- **Interface:** Floating button (+) in Feed opens a Gamified Modal.
- **Creation:** User writes a fact/curiosity (max 350 characters).
- **AI Moderation (Automatic):** The fact is sent to an Edge Function (Groq LLaMA 3.1) that instantly checks if the content is educational, useful, and free of profanity/nudity.
  - If approved: Title, Category, and Colors (bgClass) are extracted, inserting into `knowledge_posts` with `status = 'APPROVED'` and the `author_id`.
  - If rejected or suspicious: The post is classified as `REJECTED` or `PENDING` (not appearing in the global feed).

---

## 4. Database Architecture (Supabase / PostgreSQL)

The database must support hyper-efficient read queries to feed users quickly as they swipe.

### Schema (Implemented)

> **Note:** Data is static and shared. Multiple users learning the same language consume the same row in `knowledge_posts`.

**Tables implemented in `src/db/schema.ts`:**

- `knowledge_posts`: The curiosity itself (title, body, category, level, target_language, status, author_id).
- `user_read_history`: Records of posts already read by the user (used by the filtering algorithm).
- `knowledge_likes`: Like records (social gamification).
- `knowledge_saves`: Saved post records ("Knowledge Vault").

### Indexing Strategy

For the user's Feed, the typical query looks for "Posts in language X and level Y that user Z hasn't read yet."

```sql
CREATE INDEX idx_kp_lang_level ON knowledge_posts(target_language, cefr_level);
```

**Main Query and TikTok Algorithm (Completed):**
The Feed is built using Server Actions (`getFeedPosts`).

1. **Filter:** Fetch all post IDs from `user_read_history` for the logged-in user.
2. **Fetch:** Query `knowledge_posts` for `APPROVED` posts whose ID is NOT in the read history (`notInArray`).
3. **Shuffle:** Randomize results with SQL (`ORDER BY RANDOM()`) for a genuine TikTok feel.
4. **Invisible Tracking:** The frontend uses `IntersectionObserver` on the `.snap-start` divs. Once a post is 60% visible, `markPostAsRead` fires via Server Action (Fire and Forget).

---

## 5. Presentation Layer (Frontend & UX) — Partially Complete

The UX is designed to be addictive, with native Light/Dark mode and pure CSS magnetic scroll.

### Swipe Physics (Native CSS Scroll Snap)

To replicate the TikTok feel ultra-fast on Desktop/Mobile:

- Container: `overflow-y-scroll snap-y snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]`.
- Physical drag support on desktop added manually via `onMouseMove`.
- Separate Light and Dark modes.

### Social and Viral Layer (Completed)

- **Likes:** Server Actions that increment Likes in Realtime (optimistic UI).
- **Saves:** User saves to review in the "Knowledge Vault" (`/feed/saved`).
- **Shares:** Direct integration with `messages` table using mutual friendships (native Share Bottom Sheet).

### Ghost Dictionary (Tap-to-Translate)

To ensure the user learns difficult words immediately, without expensive AI calls:

1. **Frontend Splitting:** The `body` text is split into tokens/words: `{body.split(' ').map(word => <span onClick={() => handleTap(word)}>{word}</span>)}`.
2. **Lightweight Dictionary:** Uses the free public **Google Translate / MyMemory API** or an Edge Function that maps directly from a dictionary in a Worker. The result appears as a native floating Tooltip, almost instantaneously, without blocking navigation.

---

## 6. Phased Execution Plan (Roadmap)

The architecture is being executed iteratively.

### Phase 1: Frontend and Core UI (Mock Data) — COMPLETED

- **Focus:** Perfect the "TikTok feeling" and Magnetic Scroll (Native CSS).
- Create the Feed screen with Snap and Duolingo-style gamification.
- Full Light/Dark Mode support.
- Implement word splitting for the "Ghost Dictionary."

### Phase 2: Backend Logic, DB, and Creator Economy — COMPLETED

- **Focus:** Storage, Social Interaction, and Tracking Algorithm.
- (✅) Create `knowledge_posts`, `user_read_history`, `knowledge_likes`, `knowledge_saves` tables.
- (✅) Create direct sharing logic via Chat (Friends Modal).
- (✅) Implement Creator Economy mechanic (Users create, AI approves, DB stores).
- (✅) Connect Frontend to Database: Server Actions `getFeedPosts()` and IntersectionObserver Tracker.
- (✅) Update Knowledge Vault (`/feed/saved`) with real data.

### Phase 3: Ghost Dictionary — PARTIALLY COMPLETED

- (PENDING) Connect the word click action to a free fast translation API (MyMemory API).

### Phase 4: Daily AI Engine (Ingestion) — PENDING

- **Focus:** The Daily Production Pipeline.
- Write the script that connects to Reddit (`.json`) and cleans HTML.
- Integrate the Groq SDK with `llama-3.1-8b-instant`, passing the strict System Prompt.
- Create Throttling/Batching system to respect the 6000 TPM limit.
- Host the process on Vercel or QStash and schedule the daily Cron.

# Faro — Local Development Setup

> Everything you need to get Faro running on your machine.

## Prerequisites

| Requirement | Version   | Notes                                                       |
| ----------- | --------- | ----------------------------------------------------------- |
| Node.js     | >= 18.0.0 | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| npm         | >= 9      | Comes with Node.js                                          |
| Docker      | Latest    | For local PostgreSQL (recommended)                          |
| Git         | Latest    | For version control                                         |

### Required Accounts (Free Tiers Work)

| Service                                          | Sign Up | Why You Need It                 |
| ------------------------------------------------ | ------- | ------------------------------- |
| [Clerk](https://clerk.com/)                      | Free    | Authentication (users + admin)  |
| [Supabase](https://supabase.com/)                | Free    | PostgreSQL database + Realtime  |
| [Google AI Studio](https://aistudio.google.com/) | Free    | Gemini API keys for AI features |
| [Stripe](https://stripe.com/)                    | Free    | Test mode for PRO subscriptions |
| [Upstash](https://upstash.com/)                  | Free    | Redis for rate limiting         |

### Optional Accounts

| Service                                | Why                                    |
| -------------------------------------- | -------------------------------------- |
| [Resend](https://resend.com/)          | Transactional emails (support tickets) |
| [OneSignal](https://onesignal.com/)    | Push notifications                     |
| [Giphy](https://developers.giphy.com/) | GIF picker in chat                     |
| [Sentry](https://sentry.io/)           | Error monitoring                       |

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/imperador1k/myduolingo.git
cd myduolingo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values. Here's what each section needs:

#### Database (`DATABASE_URL`)

**Option A: Local Docker (Recommended)**

```bash
docker compose up -d
```

Your DATABASE_URL will be:

```
postgresql://postgres:password@localhost:5432/myduolingo
```

**Option B: Supabase Cloud**

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → Database → Connection string
3. Copy the URI connection string (with password)

#### Authentication (Clerk)

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
4. Under JWT Templates, create a **Supabase** template for row-level security

#### AI (Google Gemini)

1. Go to [aistudio.google.com](https://aistudio.google.com/)
2. Create an API key
3. Set it as `GEMINI_API_KEY` in `.env`
4. For redundancy, you can add up to 4 keys: `GEMINI_API_KEY_1` through `GEMINI_API_KEY_4`

#### Supabase Client

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can find these in your Supabase project dashboard → Settings → API.

#### Stripe (Test Mode)

1. Create a Stripe account
2. Go to Developers → API keys
3. Copy the **publishable** key to `NEXT_PUBLIC_STRIPE_KEY`
4. Copy the **secret** key to `STRIPE_SECRET_KEY`
5. Create a price in Products → Add Product
6. Copy the price ID to `STRIPE_PRICE_ID`

#### Admin Access

```bash
# Comma-separated list of Clerk user IDs allowed in /admin
ADMIN_ALLOWED_USER_IDS="user_2xxx"

# Strong random string for CRON job authentication
CRON_SECRET="generate-a-long-random-string-here"
```

### 4. Push the Database Schema

```bash
npx drizzle-kit push
```

This creates all 35 tables in your database.

### 5. Seed Test Data (Optional)

```bash
npx tsx scripts/seed.ts
```

This creates sample courses, units, and a demo user.

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verifying Your Setup

| Check      | What to Do                      | Expected Result                               |
| ---------- | ------------------------------- | --------------------------------------------- |
| Auth       | Go to `/learn`                  | You should be redirected to sign-in           |
| Sign Up    | Create an account               | You should land on onboarding                 |
| Learn Page | Complete onboarding             | You should see the course tree                |
| Admin      | Sign in with your admin user ID | Visit `/admin` — you should see the dashboard |
| AI         | Generate content                | In admin, try generating a unit               |

---

## Environment Variables Reference

| Variable                            | Required | Description                             |
| ----------------------------------- | -------- | --------------------------------------- |
| `DATABASE_URL`                      | ✅       | PostgreSQL connection string            |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅       | Clerk publishable key                   |
| `CLERK_SECRET_KEY`                  | ✅       | Clerk secret key                        |
| `NEXT_PUBLIC_APP_URL`               | ✅       | App URL (http://localhost:3000 for dev) |
| `GEMINI_API_KEY`                    | ✅       | Google Gemini API key                   |
| `NEXT_PUBLIC_SUPABASE_URL`          | ✅       | Supabase project URL                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | ✅       | Supabase anon key                       |
| `SUPABASE_SERVICE_ROLE_KEY`         | ✅       | Supabase service role key               |
| `ADMIN_ALLOWED_USER_IDS`            | ✅       | Clerk user IDs for admin access         |
| `CRON_SECRET`                       | ✅       | Secret for cron job authentication      |
| `NEXT_PUBLIC_STRIPE_KEY`            | ✅       | Stripe publishable key                  |
| `STRIPE_SECRET_KEY`                 | ✅       | Stripe secret key                       |
| `STRIPE_PRICE_ID`                   | ✅       | Stripe price ID for PRO subscription    |
| `UPSTASH_REDIS_REST_URL`            | ⚠️       | Upstash Redis URL (rate limiting)       |
| `UPSTASH_REDIS_REST_TOKEN`          | ⚠️       | Upstash Redis token                     |
| `GEMINI_API_KEY_1`                  | ⚠️       | Extra Gemini key (round-robin)          |
| `GEMINI_API_KEY_2`                  | ⚠️       | Extra Gemini key                        |
| `GEMINI_API_KEY_3`                  | ⚠️       | Extra Gemini key                        |
| `GEMINI_API_KEY_4`                  | ⚠️       | Extra Gemini key                        |
| `ONESIGNAL_APP_ID`                  | ⚠️       | OneSignal app ID                        |
| `ONESIGNAL_REST_API_KEY`            | ⚠️       | OneSignal REST key                      |
| `RESEND_API_KEY`                    | ⚠️       | Resend API key                          |
| `NEXT_PUBLIC_GIPHY_API_KEY`         | ⚠️       | Giphy API key                           |
| `GOOGLE_CLIENT_ID`                  | ⚠️       | Google OAuth client ID                  |
| `SENTRY_AUTH_TOKEN`                 | ⚠️       | Sentry auth token                       |
| `SUPPORT_EMAIL`                     | ⚠️       | Email for support tickets               |

---

## Desktop (Tauri) Setup

For desktop development, you also need:

- **Rust** (install via [rustup](https://rustup.rs/))
- **Windows**: WebView2 (pre-installed on Windows 10+)
- **macOS**: Xcode Command Line Tools
- **Linux**: WebKitGTK, libappindicator

```bash
# Install Tauri CLI (already in devDependencies)
npm run tauri dev
```

---

## Mobile (Capacitor) Setup

```bash
# Build the web app first
npm run build

# Sync with Capacitor
npx cap sync

# Open Android Studio
npx cap open android
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues.

---

## Next Steps

- Read the [Architecture Overview](ARCHITECTURE.md)
- Check out our [Contributing Guidelines](CONTRIBUTING.md)
- Look at our [Project Roadmap](ROADMAP.md)

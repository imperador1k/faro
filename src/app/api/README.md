# Faro — API Routes (`src/app/api/`)

> 8 API routes for external integrations, cron jobs, and native app auth.

## Routes

| Route                    | Method | Auth           | Purpose                                                  |
| ------------------------ | ------ | -------------- | -------------------------------------------------------- |
| `api/auth/desktop-token` | POST   | Clerk          | Exchanges Clerk session for a desktop auth token (Tauri) |
| `api/auth/native-google` | POST   | Google SDK     | Native Google Sign-In for mobile apps                    |
| `api/cron/ingest-feed`   | GET    | CRON_SECRET    | Daily AI content generation for the Knowledge Feed       |
| `api/cron/league-reset`  | GET    | CRON_SECRET    | Weekly league ranking reset                              |
| `api/crypto/keys`        | POST   | Clerk + User   | E2EE key exchange for encrypted chat                     |
| `api/practice/survival`  | GET    | Clerk          | Fetches survival mode challenge data                     |
| `api/webhooks/stripe`    | POST   | Stripe Webhook | Subscription payment events                              |
| `api/sentry-example-api` | GET    | Public         | Sentry test endpoint                                     |

## Security

- **Cron routes** are protected by `CRON_SECRET` (injected by Vercel, validated by middleware)
- **Webhooks** verify Stripe signatures via `stripe.webhooks.constructEvent()`
- **Auth routes** use Clerk session tokens or platform-specific SDKs
- **No CORS configuration needed** — these are not consumed by external clients

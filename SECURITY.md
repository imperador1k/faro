# Security Policy

## Supported Versions

We currently support the latest release with security updates.

| Version | Supported        |
| ------- | ---------------- |
| 0.2.x   | ✅ Active        |
| < 0.2   | ❌ Not supported |

## Reporting a Vulnerability

We take the security of Faro seriously. If you believe you have found a security vulnerability, **please do not open a public GitHub issue**.

### Disclosure Process

1. **Report via email** to the project maintainer at the address listed in the [security advisory page](https://github.com/imperador1k/faro/security/advisories)
2. You should receive a response within **48 hours**
3. If you don't receive a response, please follow up
4. We will investigate and release a patch as soon as possible
5. We will acknowledge your contribution (with your consent) in the release notes

### What to Include

- **Type** of vulnerability (SQL injection, XSS, CSRF, etc.)
- **Location** — file path and line number if known
- **Impact** — what an attacker could achieve
- **Reproduction steps** — POC scripts, screenshots, or curl commands are very helpful
- **Suggested fix** (optional) — if you have a patch in mind

---

## Security Architecture

Faro implements a **defense-in-depth** strategy across multiple layers:

### Layer 1: Authentication & Authorization

```
User → Clerk Auth → middleware.ts → Route Protection
  → Admin: HMAC-signed vault cookie + Clerk userId check
  → Protected: Clerk session required
  → Public: Whitelisted routes only
```

### Layer 2: Input Validation

```
Every Server Action:
  1. Clerk auth() guard → rejects unauthenticated
  2. Zod schema validation → rejects malformed input
  3. Business logic validation → rejects invalid state transitions
```

### Layer 3: Data Access

```
Server Actions → Drizzle ORM (parameterized queries)
  → Supabase RLS (Clerk JWT template)
    → Row-level policies per table
```

### Layer 4: Output Protection

```
AI-generated content → DOMPurify sanitization
All API responses → Generic error messages (no stack traces)
CSP Headers → Restricted connect-src, script-src, frame-src
```

---

## Known Security Features

| Feature                      | Description                                           | Location                                        |
| ---------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| Admin Vault Token            | HMAC-SHA256 signed cookie for admin panel access      | `src/lib/vault-token.ts`                        |
| Server-Side XSS Sanitization | DOMPurify running in jsdom on the server              | `src/lib/html-sanitizer.ts`                     |
| Rate Limiting                | Upstash Redis for authentication and critical actions | `src/lib/ratelimit.ts`                          |
| CSP Headers                  | Strict Content Security Policy in next.config.mjs     | `next.config.mjs`                               |
| Zod Validation               | Every Server Action validates its input               | `src/actions/*` + `src/lib/admin-validators.ts` |
| Stripe Webhook Verification  | Signature verification for payment events             | `src/app/api/webhooks/stripe/route.ts`          |
| Generic Error Messages       | No stack traces or internal details exposed           | `src/lib/action-error.ts`                       |
| E2EE Chat                    | WebCrypto AES-GCM for message encryption              | `src/actions/crypto.ts` + `src/lib/crypto.ts`   |
| Idempotency Keys             | Prevent duplicate Stripe webhook processing           | `src/app/api/webhooks/stripe/route.ts`          |
| File Upload Validation       | Type, size, and content validation for admin uploads  | `src/actions/admin-courses.ts`                  |

---

## Third-Party Security

| Service       | Security Measure                                   |
| ------------- | -------------------------------------------------- |
| Clerk         | SOC 2 compliant, session management, MFA support   |
| Supabase      | RLS, SSL/TLS, encryption at rest                   |
| Stripe        | PCI DSS Level 1, webhook signatures                |
| Google Gemini | API key authentication, data encryption in transit |
| Upstash Redis | TLS encryption, IP allowlisting                    |
| Vercel        | SOC 2 compliant, DDoS protection, WAF              |

---

## Responsible Disclosure

We appreciate the community's help in identifying and reporting vulnerabilities. We follow a **responsible disclosure** policy:

1. Reporter discloses vulnerability privately
2. We acknowledge receipt within 48 hours
3. We develop and test a fix
4. We release a patch and publish a security advisory
5. Reporter is credited (if desired)

---

## Security-Related Configuration

### Environment Variables

The following environment variables are **critical** for security:

```bash
# Must be kept secret
CLERK_SECRET_KEY            # Clerk API secret
STRIPE_SECRET_KEY           # Stripe API secret
SUPABASE_SERVICE_ROLE_KEY   # Supabase admin key
GEMINI_API_KEY*             # Google AI keys
SENTRY_AUTH_TOKEN           # Sentry auth
UPSTASH_REDIS_REST_TOKEN    # Redis auth

# Admin access control
ADMIN_ALLOWED_USER_IDS="user_2xxx user_3xxx"
CRON_SECRET="long-random-string"
```

### Recommended Production Settings

- **Clerk**: Enable bot detection, MFA for admin accounts
- **Supabase**: Enable RLS on all tables, disable public access
- **Vercel**: Enable WAF, set up DDoS protection
- **CSP**: Regularly audit and tighten in `next.config.mjs`

---

## Questions?

If you have questions about Faro's security, please:

1. Check our [GitHub Security Advisories](https://github.com/imperador1k/faro/security/advisories)
2. Open a discussion in [GitHub Discussions](https://github.com/imperador1k/faro/discussions)

> **Last updated:** 2026-07-02 | **Applies to:** Faro 0.2.x

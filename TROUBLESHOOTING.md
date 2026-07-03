# Troubleshooting Guide

> Common issues and their solutions when working with Faro.

## Development Setup

### `npm install` fails with native module errors

**Problem**: Errors compiling native modules (bcryptjs, postgres, etc.)

**Solutions**:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Windows: Install build tools
npm install --global windows-build-tools

# Ensure Python is available (for node-gyp)
python --version
```

### Docker PostgreSQL won't start

**Problem**: `docker compose up -d` fails

**Solutions**:

```bash
# Check if port 5432 is already in use
netstat -ano | findstr :5432

# Kill the process using port 5432, or change the port in docker-compose.yml

# Check Docker is running
docker info

# Try restarting Docker Desktop
```

### Drizzle push fails

**Problem**: `npx drizzle-kit push` returns errors

**Solutions**:

- Verify `DATABASE_URL` is correct in `.env`
- Ensure the database server is running
- Check for existing schema conflicts:
  ```bash
  npx drizzle-kit push --force
  ```

### TypeScript compilation errors

**Problem**: `npx tsc --noEmit` shows errors

**Solutions**:

```bash
# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo

# Restart your editor/IDE

# Check for missing dependencies
npm install
```

---

## Authentication

### "Redirect URI mismatch" when signing in

**Problem**: Clerk returns redirect URI error

**Solutions**:

- In Clerk Dashboard → Configure → URLs, add:
  - `http://localhost:3000` (for development)
  - `https://yourdomain.com` (for production)
- Clear cookies and try again

### Admin panel shows "Access Denied"

**Problem**: `/admin` route inaccessible

**Solutions**:

- Ensure your Clerk user ID is in `ADMIN_ALLOWED_USER_IDS` in `.env`
- Clear the `admin_vault_session` cookie and re-authenticate at `/admin-login`
- Check the browser console for middleware logs

### Sign-in works but redirects back to /sign-in

**Problem**: OAuth loop after authentication

**Solutions**:

- Clear all site cookies
- Ensure `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` are correct
- Check middleware.ts — the `isPublicRoute` matcher may need updating

---

## Database

### Data not saving

**Problem**: Actions succeed but no data appears in the database

**Solutions**:

- Check Supabase RLS policies — the Clerk JWT template might be misconfigured
- Verify the `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check the browser console and server logs for 401/403 errors

### League reset not running

**Problem**: Weekly league reset doesn't happen

**Solutions**:

- Verify `CRON_SECRET` is set correctly
- Check Vercel Cron Jobs dashboard
- Manually trigger: `GET /api/cron/league-reset` with `Authorization: Bearer YOUR_CRON_SECRET`

### Migrations out of sync

**Problem**: Schema doesn't match the database

**Solutions**:

```bash
# Regenerate migrations
npx drizzle-kit generate

# Push to database
npx drizzle-kit push
```

---

## AI Features

### "No Gemini keys found" error

**Problem**: AI features return key errors

**Solutions**:

- Verify `GEMINI_API_KEY` is set in `.env`
- Check that the API key is valid at [aistudio.google.com](https://aistudio.google.com/)
- Ensure billing is enabled (Gemini has free quota, but needs billing setup)

### AI generation returns empty/malformed JSON

**Problem**: Generated content is incomplete or invalid

**Solutions**:

- The Gemini model may be overloaded — try again
- Check the network response in browser dev tools
- Reduce the generation complexity (fewer lessons, simpler topics)

### Voice conversation not working

**Problem**: Speaking or listening doesn't work

**Solutions**:

- Ensure microphone permissions are granted
- Chrome/Firefox only — Safari has limited Web Speech API support
- Check that the correct language code is being used (e.g., "en-US" not "en")

---

## Desktop (Tauri)

### Tauri build fails

**Problem**: `npm run tauri build` returns Rust errors

**Solutions**:

```bash
# Update Rust
rustup update

# Clean Tauri build artifacts
cd src-tauri
cargo clean
cd ..

# Rebuild
npm run tauri build
```

### App won't start

**Problem**: The Tauri desktop app crashes on launch

**Solutions**:

- Check `tari.conf.json` for valid CSP settings
- Ensure the dev server is running (`npm run dev`) before `npm run tauri dev`
- For production builds, ensure `beforeDevCommand` is not needed in tauri.conf.json

### Deep links not working

**Problem**: `myduolingo://` links don't open the app

**Solutions**:

- **Windows**: Check registry for `myduolingo` protocol handler
- **macOS**: Check if the app is registered for the custom URL scheme
- Reinstall the app to register protocol handlers

---

## Real-Time Features

### Chat messages not appearing in real-time

**Problem**: Messages only appear after page refresh

**Solutions**:

- Check Supabase Realtime is enabled for the `messages` table
- Verify the Clerk JWT template for Supabase is correctly configured
- Check browser console for WebSocket errors
- Ensure `NEXT_PUBLIC_SUPABASE_URL` points to the correct project

### Presence indicators not working

**Problem**: Green dot / typing indicator not showing

**Solutions**:

- WebSocket connection may be blocked by a firewall/VPN
- Check that Supabase Realtime presence feature is enabled
- Reconnect by navigating away and back

---

## Reporting Issues

If your issue isn't listed here:

1. Search [GitHub Issues](https://github.com/imperador1k/faro/issues)
2. Open a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, version)

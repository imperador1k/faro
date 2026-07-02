# i18n Translation Roadmap

This is your checklist for translating all UI (Frontend) folders in the project.
As you run the script on each folder, mark it with `[x]`.

## How to Run the Script

1. Open `scripts/i18n-extractor.ts`.
2. Change the `TARGET_DIRECTORY` variable to the folder you want to translate (e.g., `./src/app/(auth)`).
3. Change the `NAMESPACE` variable to a meaningful name for that area (e.g., `"Auth"` or `"Leaderboard"`).
4. Run:
   ```bash
   bun run scripts/i18n-extractor.ts
   ```
5. Review changes (`git diff`), fix what's needed, and mark `[x]` here.

---

## Pages and Routes (`src/app`)

### Authentication & Onboarding

- [ ] `./src/app/(auth)`
- [ ] `./src/app/onboarding`
- [ ] `./src/app/sso-callback`

### Core App (Main)

- [ ] `./src/app/(main)/learn`
- [ ] `./src/app/(main)/courses`
- [ ] `./src/app/(main)/leaderboard`
- [ ] `./src/app/(main)/quests`
- [ ] `./src/app/(main)/shop`
- [ ] `./src/app/(main)/profile`
- [ ] `./src/app/(main)/settings`
- [ ] `./src/app/(main)/friends`
- [ ] `./src/app/(main)/messages`
- [ ] `./src/app/(main)/notifications`
- [ ] `./src/app/(main)/reviews`
- [ ] `./src/app/(main)/vocabulary`

### Feed (Social Network)

- [x] `./src/app/feed` _(Done!)_
- [x] `./src/app/feed/create` _(Done!)_
- [x] `./src/app/feed/saved` _(Done!)_

### Practice & Arcade

- [ ] `./src/app/(main)/arcade`
- [ ] `./src/app/(main)/practice`
- [ ] `./src/app/lesson`
- [ ] `./src/app/practice`

### Documentation and Legal

- [ ] `./src/app/(main)/docs`
- [ ] `./src/app/(main)/support`
- [ ] `./src/app/support`
- [ ] `./src/app/terms`
- [ ] `./src/app/privacy`

---

## Reusable Components (`src/components`)

- [ ] `./src/components/ui` (Base components: buttons, inputs, etc.)
- [ ] `./src/components/shared`
- [ ] `./src/components/modals`
- [ ] `./src/components/learn`
- [ ] `./src/components/leaderboard`
- [ ] `./src/components/quests`
- [ ] `./src/components/practice`
- [ ] `./src/components/chat`
- [ ] `./src/components/animations`
- [ ] `./src/components/settings`
- [ ] `./src/components/onboarding`
- [ ] `./src/components/feed`
- [ ] `./src/components/providers`

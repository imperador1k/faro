# 🌍 Missão i18n: Roadmap de Tradução

Esta é a tua checklist para traduzires todas as pastas de UI (Frontend) do teu projeto.
À medida que fores rodando o script em cada pasta, podes vir aqui e marcar com um `[x]`.

## Como Rodar o Script

1. Abre o ficheiro `scripts/i18n-extractor.ts`.
2. Altera a variável `TARGET_DIRECTORY` para a pasta que queres traduzir (ex: `./src/app/(auth)`).
3. Altera a variável `NAMESPACE` para um nome que faça sentido para essa zona (ex: `"Auth"` ou `"Leaderboard"`).
4. No terminal, corre:
   ```bash
   bun run scripts/i18n-extractor.ts
   ```
5. Revê as alterações (`git diff`), corrige o que precisares e aponta um `[x]` aqui!

6. RODAR SCRIPT bun run scripts/i18n-extractor.ts

---

## 📂 Pasta: `src/app` (Páginas e Rotas)

### Autenticação & Onboarding

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

### Feed (Rede Social)

- [x] `./src/app/feed` _(Feito!)_
- [x] `./src/app/feed/create` _(Feito!)_
- [x] `./src/app/feed/saved` _(Feito!)_

### Prática & Arcade

- [ ] `./src/app/(main)/arcade`
- [ ] `./src/app/(main)/practice`
- [ ] `./src/app/lesson`
- [ ] `./src/app/practice`

### Documentação e Legais

- [ ] `./src/app/(main)/docs`
- [ ] `./src/app/(main)/support`
- [ ] `./src/app/support`
- [ ] `./src/app/terms`
- [ ] `./src/app/privacy`

---

## 🧩 Pasta: `src/components` (Componentes Reutilizáveis)

- [ ] `./src/components/ui` (Componentes base: botões, inputs, etc.)
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

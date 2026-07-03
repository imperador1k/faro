# FARO MASTER BLUEPRINT

> **Contexto Injetável para Sessões de IA** — Mapeamento Arquitetural Absoluto do Projeto MyDuolingo
> Versão: 0.2.0 | Gerado em: 2026-07-02 | Autor: Miguel Pereira Santos (@imperador1k)

---

## Índice

1. [Executive Summary & Identity](#1-executive-summary--identity)
2. [System Architecture & Topology](#2-system-architecture--topology)
3. [Deep File Manifest & Directory Map](#3-deep-file-manifest--directory-map)
4. [Core Mechanics & Engineering Patterns](#4-core-mechanics--engineering-patterns)
5. [Database Schema & Data Layer](#5-database-schema--data-layer)
6. [Third-Party Integrations & APIs](#6-third-party-integrations--apis)
7. [Future Rules & Constraints (For AI Agents)](#7-future-rules--constraints-for-ai-agents)
8. [Technical Debt & Refactoring Targets](#8-technical-debt--refactoring-targets)
9. [Appendix: Quick Reference](#9-appendix-quick-reference)

---

## 1. Executive Summary & Identity

### 1.1 Project Overview

| Campo                 | Valor                                                                           |
| --------------------- | ------------------------------------------------------------------------------- |
| **Nome**              | Faro (nome de código: `myduolingo`)                                             |
| **Visão**             | Plataforma gamificada de micro-aprendizagem de idiomas via feed/scroll infinito |
| **Modelo de Negócio** | Subscrição PRO (Stripe) + Power-ups (XP Boost, Heart Shields, Streak Freezes)   |
| **Público-alvo**      | Utilizadores lusófonos a aprender idiomas (12 línguas suportadas)               |
| **Autor**             | Miguel Pereira Santos                                                           |
| **Repositório**       | GitHub: `imperador1k/faro`                                                |
| **Domínio**           | `https://myduolingo.vercel.app`                                                 |
| **Licença**           | MIT                                                                             |

### 1.2 Tech Stack

| Categoria             | Tecnologia                               | Versão  |
| --------------------- | ---------------------------------------- | ------- |
| **Framework Web**     | Next.js (App Router)                     | 14.2.35 |
| **Linguagem**         | TypeScript                               | 5.x     |
| **Estilização**       | Tailwind CSS                             | 3.4.1   |
| **Animação Web**      | Framer Motion                            | 12.38.0 |
| **Base de Dados**     | PostgreSQL 15 (Supabase/Neon)            | —       |
| **ORM**               | Drizzle ORM                              | 0.45.1  |
| **Autenticação**      | Clerk                                    | 6.36.7  |
| **i18n**              | next-intl                                | 4.13.0  |
| **AI SDK**            | Google Generative AI (Gemini 2.5 Flash)  | 0.24.1  |
| **Real-time**         | Supabase Realtime (WebSockets)           | 2.99.3  |
| **Pagamentos**        | Stripe                                   | 22.0.2  |
| **Desktop Wrapper**   | Tauri                                    | 2.10.1  |
| **Mobile Wrapper**    | Capacitor                                | 8.3.1   |
| **State Management**  | Zustand                                  | 5.0.9   |
| **UI Sounds**         | use-sound                                | 5.0.0   |
| **Validação**         | Zod                                      | 4.3.6   |
| **Component Library** | Radix UI (Dialog, Slot) + shadcn pattern | —       |
| **Rate Limiting**     | Upstash Ratelimit + Redis                | 2.0.8   |
| **Testes Unitários**  | Vitest + jsdom                           | 4.1.6   |
| **Testes E2E**        | Playwright                               | 1.58.2  |
| **Observabilidade**   | Sentry                                   | 10.45.0 |
| **Notificações Push** | OneSignal                                | 3.5.1   |
| **Emails**            | Resend                                   | 6.10.0  |
| **Ambiente Dev DB**   | Docker Compose (PostgreSQL 15 Alpine)    | —       |

### 1.3 Línguas Suportadas

| Código | Idioma     |
| ------ | ---------- |
| `en`   | English    |
| `es`   | Spanish    |
| `fr`   | French     |
| `pt`   | Portuguese |
| `de`   | German     |
| `it`   | Italian    |
| `ja`   | Japanese   |
| `ko`   | Korean     |
| `zh`   | Mandarin   |
| `ru`   | Russian    |
| `ar`   | Arabic     |
| `nl`   | Dutch      |

### 1.4 Modos de Aprendizagem

| Modo                 | Descrição                                                               | Ficheiro principal                           |
| -------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| **Lições**           | Currículo estruturado com desafios SELECT/ASSIST/INSERT/MATCH/DICTATION | `src/app/lesson/lesson-client.tsx`           |
| **Speaking**         | Prática de conversação com Web Speech API                               | `src/app/(main)/practice/speaking/page.tsx`  |
| **Listening**        | Compreensão oral com Speech Recognition                                 | `src/app/(main)/practice/listening/page.tsx` |
| **Writing**          | Produção escrita com feedback Gemini                                    | `src/app/(main)/practice/writing/page.tsx`   |
| **Reading**          | Compreensão de leitura                                                  | `src/app/(main)/practice/reading/page.tsx`   |
| **Vocabulary**       | Gestão de vocabulário pessoal ("Cofre")                                 | `src/app/(main)/vocabulary/page.tsx`         |
| **Survival Mode**    | Roleplay conversacional com NPC IA (Gemini)                             | `src/app/(main)/practice/survival/`          |
| **Conversation**     | Chat de voz bidirecional com Gemini Live API                            | `src/app/practice/conversation/page.tsx`     |
| **Feed (Knowledge)** | Scroll infinito de artigos para leitura contextual                      | `src/app/feed/page.tsx`                      |
| **Arcade**           | Minijogos (Casino, Meteoros, Sprint, Swipe)                             | `src/app/(main)/arcade/`                     |
| **Avaliação**        | Teste de nivelamento CEFR com IA                                        | `src/app/evaluation/page.tsx`                |

---

## 2. System Architecture & Topology

### 2.1 Diagrama de Arquitetura (4 Camadas)

```mermaid
┌────────────────────────────────────────────────────────────────────┐
│                        UI LAYER (React 18)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ RSC (Server) │  │ Client Comp. │  │ Zustand      │             │
│  │ Cache/DB     │  │ Interação    │  │ Stores (8)   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
├────────────────────────────────────────────────────────────────────┤
│                     ACTIONS LAYER (Server Actions)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Zod Schema   │  │ Drizzle ORM  │  │ Clerk Auth   │             │
│  │ Validação    │  │ Queries      │  │ Guard        │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
├────────────────────────────────────────────────────────────────────┤
│                    PROVIDERS LAYER (Context)                        │
│  Clerk → Theme → next-intl → Toaster → UISounds → GlobalPresence   │
├────────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                                  │
│  PostgreSQL (Supabase) + Drizzle ORM + Upstash Redis + Storage     │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Fluxo de Dados Principal

```
Utilizador → Browser/Tauri/Capacitor
  → Clerk Auth (middleware.ts)
    → RSC carrega dados (React.cache + Drizzle)
        → Client Component renderiza
            → Utilizador interage → Server Action
                → Zod valida input
                    → Clerk auth() verifica userId
                        → Drizzle ORM executa query/transação
                            → ActionResponse<T> retorna ao client
                                → UI atualiza (router.refresh / setState)
```

### 2.3 Pipeline de IA (Content Generation)

```
CLI (content_pipeline.py)
  → Utilizador escolhe: língua + curso + tema + nível CEFR
    → Gera prompt estruturado (get_base_prompt)
        → Chama Gemini 2.5 Flash (JSON mode, retry 1x)
            → Valida JSON parseado
                → Insere no PostgreSQL via psycopg2 (transação)
                    ┌─────────────────────────────────────┐
                    │ 1 prompt = 1 Unit + 3 Lessons +     │
                    │ ~12-15 Challenges com Options        │
                    └─────────────────────────────────────┘
```

### 2.4 Fluxo de Real-time (Supabase Realtime)

```
Cliente conecta
  → createClerkSupabaseClient(token) [transient client]
    → channel.subscribe("chat_{conversationId}")
        → postgres_changes (INSERT/UPDATE/DELETE on messages)
        → postgres_changes (INSERT/UPDATE/DELETE on message_reactions)
        → presence.track({ isTyping, online_at })
            → UI atualiza sem refresh
```

### 2.5 Native Bridge (Tauri + Capacitor)

```
Detecção de plataforma:
  navigator.userAgent.includes("TauriDesktop") || window.__TAURI_INTERNALS__
  Capacitor.isNativePlatform()

Tauri Desktop:
  → Deep Link: tauri-plugin-deep-link (myduolingo:// scheme)
  → Single Instance: tauri-plugin-single-instance
  → Auto-updater: tauri-plugin-updater (via GitHub Releases)
  → Registry: Winreg custom uninstaller injection
  → CSP restrito: localhost:3000 + myduolingo.vercel.app

Capacitor Android:
  → Deep Link: App.addListener("appUrlOpen")
  → Back Button: window.history.back() or App.exitApp()
```

---

## 3. Deep File Manifest & Directory Map

### 3.1 Raiz do Projeto

```
faro/
├── src/                    # Código-fonte principal (Next.js App Router)
├── src-tauri/              # Tauri v2 (Rust + config NSIS)
├── scripts/                # Scripts Python/TS (pipeline IA, migrações, seeds)
├── messages/               # Ficheiros i18n (en.json, pt.json)
├── drizzle/                # Migrações Drizzle Kit
├── migrations/             # Migrações SQL manuais (alternativa)
├── public/                 # Assets estáticos (sons, imagens, fonts)
├── assets/                 # Assets para build Tauri/Capacitor
├── icons/                  # Ícones da aplicação
├── tests/                  # Testes E2E Playwright
├── installer-app/          # Custom NSIS installer UI (Vite + React)
├── uninstaller-app/        # Uninstaller Tauri separado
├── .github/                # GitHub Actions workflows
├── .husky/                 # Git hooks (lint-staged)
├── android/                # Build Capacitor Android
├── backups/                # Backups de base de dados
└── docs/                   # Documentação adicional
```

### 3.2 `src/` — Core Source (15 diretórios)

```
src/
├── app/                    # Next.js App Router (131 ficheiros, 90 sub-dirs)
├── components/             # Componentes React (137 ficheiros, 15 categorias)
├── actions/                # Server Actions (34 ficheiros)
├── lib/                    # Utilitários (24 ficheiros + 1 sub-dir ai/)
├── db/                     # Database (schema, drizzle, queries)
├── types/                  # Tipos TypeScript partilhados (1 ficheiro, 40+ tipos)
├── hooks/                  # Custom hooks (8 ficheiros)
├── store/                  # Zustand stores (8 ficheiros)
├── i18n/                   # Config next-intl (1 ficheiro: request.ts)
├── constants/              # Constantes partilhadas (1 ficheiro)
├── __tests__/              # Testes Vitest (4 ficheiros)
└── middleware.ts           # Clerk middleware (auth + admin vault)
```

### 3.3 `src/app/` — Páginas por Route Group

```
src/app/
├── (auth)/                 # Sign-in, Sign-up, Forgot-password
│   ├── layout.tsx          # Layout auth (sem sidebar/nav)
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   └── forgot-password/page.tsx
├── (main)/                 # App principal (com sidebar + nav)
│   ├── layout.tsx          # Layout main (Sidebar, MobileNav, GlobalModals)
│   ├── template.tsx        # Template (animação de entrada)
│   ├── learn/page.tsx      # Core: árvore de lições gamificada
│   ├── feed/page.tsx       # Knowledge feed (scroll infinito)
│   ├── courses/page.tsx    # Selecção de cursos
│   ├── leaderboard/page.tsx # Sistema de ligas
│   ├── shop/page.tsx       # Loja de power-ups
│   ├── quests/page.tsx     # Missões diárias
│   ├── friends/page.tsx    # Rede social (seguir/utilizadores)
│   ├── messages/page.tsx   # Chat com E2EE
│   ├── practice/           # 5 modos de prática + survival mode
│   ├── profile/            # Perfil do utilizador
│   ├── settings/           # Definições (som, tema, auth, notificações)
│   ├── analytics/          # Dashboard de estatísticas
│   ├── vocabulary/         # Gestão de vocabulário
│   ├── notifications/      # Centro de notificações
│   ├── reviews/            # Avaliações
│   ├── arcade/             # Minijogos (casino, meteoros, sprint, swipe)
│   ├── docs/               # Documentação da plataforma
│   └── support/            # (vazio)
├── admin/                  # Painel admin (protegido por vault + Clerk)
│   ├── layout.tsx          # Admin sidebar
│   ├── courses/            # CRUD cursos + geração IA
│   ├── lessons/            # CRUD lições
│   ├── units/              # CRUD unidades
│   ├── feed/               # Moderação de posts do feed
│   ├── inbox/              # Gestão de suporte
│   ├── users/              # Gestão de utilizadores
│   └── survival/           # Gestão de cenários survival
├── admin-login/            # Autenticação extra para admin (vault cookie HMAC)
├── api/                    # API Routes (8 handlers)
│   ├── auth/desktop-token/route.ts
│   ├── auth/native-google/route.ts
│   ├── cron/ingest-feed/route.ts
│   ├── cron/league-reset/route.ts
│   ├── crypto/keys/route.ts
│   ├── practice/survival/route.ts
│   ├── webhooks/stripe/route.ts
│   └── sentry-example-api/route.ts
├── lesson/                 # Player de lições (client-heavy)
│   ├── page.tsx
│   ├── lesson-client.tsx   # (959 linhas) — core game engine
│   └── _components/        # header, challenge-card, match-grid, result-screen, footer
├── onboarding/             # Fluxo de onboarding (7 steps)
├── evaluation/             # Teste de nivelamento CEFR
├── feed/                   # Feed + criar post + guardados
├── certificate/            # Certificados de conclusão
├── layout.tsx              # Root layout (155 linhas) — todos os providers
├── globals.css             # (599 linhas) — Tailwind + animações + design system
├── loading.tsx             # Loading screen global
├── error.tsx               # Error boundary
├── not-found.tsx           # Página 404
├── sitemap.ts              # Sitemap dinâmico
└── robots.ts               # Config robots.txt
```

### 3.4 `src/components/` — Árvore Completa

```
src/components/
├── admin/                  # Formulários CRUD admin (9 ficheiros)
│   ├── admin-sidebar.tsx
│   ├── course-form.tsx
│   ├── unit-form.tsx
│   ├── lesson-form.tsx
│   ├── ai-generator-form.tsx    # Geração IA de conteúdo
│   ├── delete-course-button.tsx
│   ├── delete-lesson-button.tsx
│   ├── delete-unit-button.tsx
│   └── delete-user-button.tsx
├── animations/             # Componentes animados
│   ├── counter.tsx         # Contador animado (XP, pontos)
│   └── tilt-card.tsx       # Efeito 3D tilt (mouse parallax)
├── chat/                   # Sistema de mensagens
│   ├── chat-window.tsx
│   ├── chat-sidebar.tsx
│   ├── message-item.tsx
│   ├── chat-settings-modal.tsx
│   ├── gif-selector.tsx
│   ├── upload-button.tsx
│   └── signal-onboarding.tsx
├── feed/                   # Criação de posts
│   └── create-post-modal.tsx
├── leaderboard/            # Sistema de ligas
│   ├── league-countdown.tsx
│   ├── league-info-modal.tsx
│   └── league-journey.tsx
├── learn/                  # Página de aprendizagem
│   ├── unit-island-feed.tsx     # Mapa de ilhas (core gamification)
│   ├── active-unit.tsx
│   ├── locked-unit.tsx
│   ├── desktop-sidebar.tsx
│   └── living-background.tsx
├── modals/                 # 18 modais (Zustand-driven)
│   ├── pro-modal.tsx       # PRO subscription upsell
│   ├── hearts-modal.tsx    # Corações esgotados
│   ├── lesson-start-modal.tsx
│   ├── streak-modal.tsx
│   ├── league-result-modal.tsx
│   ├── course-completed-modal.tsx
│   ├── purchase-success-modal.tsx
│   ├── share-app-modal.tsx
│   ├── share-profile-modal.tsx
│   ├── review-modal.tsx
│   ├── quests-info-modal.tsx
│   ├── practice-info-modal.tsx
│   ├── arcade-info-modal.tsx
│   ├── unit-search-modal.tsx
│   ├── notification-settings-modal.tsx
│   ├── create-group-modal.tsx
│   ├── new-chat-modal.tsx
│   └── global-modals.tsx   # Barrel export + orchestrator
├── providers/              # Context Providers (5)
│   ├── global-presence-provider.tsx  # Supabase Realtime Presence
│   ├── native-bridge.tsx             # Tauri + Capacitor bridge
│   ├── native-updater.tsx            # Tauri updater listener
│   └── ui-sound-provider.tsx         # useSound context
├── quests/
│   └── quests-header.tsx
├── settings/               # 10 componentes de definições
│   ├── subscription-card.tsx
│   ├── theme-toggle.tsx
│   ├── sound-toggle.tsx
│   ├── language-toggle.tsx
│   ├── sign-out-zone.tsx
│   ├── danger-zone.tsx
│   ├── e2e-settings.tsx
│   ├── connected-accounts.tsx
│   ├── active-sessions.tsx
│   ├── in-app-notification-toggle.tsx
│   └── review-buttons.tsx
├── shared/                 # 30+ componentes partilhados
│   ├── sidebar.tsx         # Sidebar desktop (navegação principal)
│   ├── mobile-nav.tsx      # Nav inferior mobile
│   ├── mobile-header.tsx
│   ├── floating-marco.tsx  # Mascote IA (chat overlay)
│   ├── command-menu.tsx    # CMD+K palette de comandos
│   ├── practice-setup.tsx
│   ├── profile-hero.tsx
│   ├── achievements-list.tsx
│   ├── certifications-list.tsx
│   ├── notifications-list.tsx
│   ├── notification-inbox.tsx
│   ├── notification-toggle.tsx
│   ├── streak-check.tsx
│   ├── app-walkthrough.tsx # Driver.js tour gamificado
│   ├── in-app-notifier.tsx # Notificações in-app (toast-like)
│   ├── user-search.tsx
│   ├── user-sync.tsx
│   ├── follow-button.tsx
│   ├── edit-profile-button.tsx
│   ├── landing-cta.tsx
│   ├── lesson-map.tsx
│   ├── unit-card-island.tsx
│   ├── vocabulary-sprint.tsx
│   ├── tactile-stars.tsx
│   ├── tts-unlocker.tsx
│   ├── qr-scanner.tsx
│   ├── qr-scanner-modal.tsx
│   ├── preferences-loader.tsx
│   ├── AI-tutor-feedback.tsx
│   ├── client-intro-overlay.tsx
│   ├── legal-layout.tsx
│   ├── native-google-login-button.tsx
│   ├── MedianOAuthFix.tsx
│   └── OneSignalProvider.tsx
├── ui/                     # Componentes base (shadcn pattern)
│   ├── button.tsx          # Sistema de botões (CVA + cn)
│   ├── dialog.tsx          # Modal Radix UI
│   ├── textarea.tsx
│   ├── word-card.tsx
│   ├── flashcard.tsx
│   ├── interactive-text.tsx
│   ├── ai-loading-screen.tsx
│   ├── loading-screen.tsx
│   ├── empty-state.tsx
│   ├── custom-toast.tsx
│   ├── sound-button.tsx
│   ├── lottie-animation.tsx
│   ├── lottie-block.tsx
│   └── index.ts            # Barrel exports
├── theme-provider.tsx       # next-themes wrapper
└── onboarding-sync.tsx
```

### 3.5 `src/lib/` — Utilitários (24 ficheiros)

| Ficheiro              | Propósito                                   | Depende de                                       |
| --------------------- | ------------------------------------------- | ------------------------------------------------ |
| `ai-config.ts`        | Config de personas IA por língua            | —                                                |
| `ai-manager.ts`       | Round-robin Gemini API keys com timeout 60s | `@google/generative-ai`                          |
| `ai-topics.ts`        | 27 temas pedagógicos (espelho Python)       | —                                                |
| `ai/prompts.ts`       | Template de prompt para Survival Mode       | —                                                |
| `action-error.ts`     | Tipos `ActionResponse<T>` e helpers         | Zod                                              |
| `admin-guard.ts`      | `assertAdmin()` + `assertVault()` helpers   | Clerk                                            |
| `admin-validators.ts` | Schemas Zod para admin (Zod v4)             | Zod                                              |
| `constants.ts`        | Constantes partilhadas (línguas, etc.)      | —                                                |
| `crypto.ts`           | Funções de criptografia                     | Web Crypto API                                   |
| `email-templates.ts`  | Templates HTML para Resend                  | —                                                |
| `giphy.ts`            | Cliente Giphy para selecção de GIFs         | `@giphy/js-fetch-api`                            |
| `haptics.ts`          | Feedback tátil (Capacitor + fallback)       | `@capacitor/haptics`                             |
| `html-sanitizer.ts`   | Sanitização XSS (DOMPurify server-side)     | `dompurify`, `jsdom`                             |
| `notifications.ts`    | Helpers de notificações push                | OneSignal                                        |
| `quests.ts`           | Lógica de missões diárias                   | —                                                |
| `ratelimit.ts`        | Rate limiting (Upstash Redis)               | `@upstash/ratelimit`                             |
| `share.ts`            | API de partilha nativa                      | Web Share API                                    |
| `signal-store.ts`     | Signal Protocol E2EE (deprecado)            | `@privacyresearch/libsignal-protocol-typescript` |
| `string-matching.ts`  | Fuzzy matching de respostas do utilizador   | —                                                |
| `stripe.ts`           | Inicialização Stripe server-side            | `stripe`                                         |
| `subscription.ts`     | `checkSubscription()` + `calculateIsPro()`  | Stripe, Drizzle                                  |
| `supabaseClient.ts`   | 3 variantes de cliente Supabase             | `@supabase/supabase-js`                          |
| `tts-helper.ts`       | Text-to-Speech via Web Speech API           | —                                                |
| `utils.ts`            | `cn()` + helpers genéricos                  | `clsx`, `tailwind-merge`                         |
| `vault-token.ts`      | HMAC token signing/validation (admin)       | `crypto` (Node)                                  |

### 3.6 `src/actions/` — Server Actions (34 ficheiros)

| Ficheiro            | Exportações principais                             | Linhas aprox. |
| ------------------- | -------------------------------------------------- | ------------- |
| `admin.ts`          | `deleteCourse/Unit/Lesson(id)`                     | 90            |
| `admin-courses.ts`  | `saveCourseAction(formData)`                       | 180           |
| `admin-units.ts`    | `saveUnitAction(formData)`                         | 150           |
| `admin-lessons.ts`  | `saveLessonAction(formData)`                       | 150           |
| `admin-users.ts`    | `deleteUserAction(userId)`                         | 80            |
| `admin-feed.ts`     | `getPendingPosts()`, `updatePostStatus()`          | 120           |
| `admin-inbox.ts`    | `getInboxItems()`, `replyToTicket()`               | 100           |
| `admin-survival.ts` | CRUD + generate de cenários survival               | 100           |
| `ai-generator.ts`   | `generateUnitAndLessons()`                         | 329           |
| `ai-tutor.ts`       | `getErrorExplanation()`                            | 60            |
| `gemini.ts`         | `askGemini()`, feedback writing/speaking/listening | 677           |
| `marco-chat.ts`     | `askMarco()` com anti-abuse                        | 120           |
| `user-progress.ts`  | Coração do sistema (~786 linhas)                   | 786           |
| `messages.ts`       | Chat completo com E2EE                             | 687           |
| `evaluation.ts`     | Teste de nivelamento CEFR                          | 622           |
| `feed.ts`           | Likes, saves, trending, search                     | 243           |
| `vocabulary.ts`     | Gestão de vocabulário                              | 176           |
| `social.ts`         | High-fives, follows, notificações                  | 250+          |
| `courses.ts`        | Update course details                              | 60            |
| `practice.ts`       | Histórico de prática                               | 80            |
| `translate.ts`      | Tradução contextual (MyMemory + Groq)              | 100           |
| `survival.ts`       | Iniciar sessão survival                            | 40            |
| Restantes (11)      | crypto, daily-stats, creator, certificates, etc.   | <100 cada     |

### 3.7 `src/db/` — Database Layer

```
src/db/
├── drizzle.ts              # Singleton Drizzle client (postgres.js + prepare:false)
├── schema.ts               # (888 linhas) — 25 tabelas + 30 relations
├── queries.ts              # Barrel export hub
├── migrate-banner.ts       # Script de migração avulsa
├── migration.sql           # Migração SQL manual
└── queries/
    ├── users.ts            # getUserProgress, getUserProgressById, etc.
    ├── courses.ts          # getCourses, getCourseById (React.cache)
    ├── lessons.ts          # getUnits, getLesson, getLessonPercentage, getHeartClinicLesson, etc.
    ├── challenges.ts       # upsertChallengeProgress, logMistake, resolveMistake
    ├── social.ts           # follows, notificações, mensagens (ficheiro grande ~1500+ linhas)
    ├── shop.ts             # buyXpBoost, buyHeartShield, buyStreakFreeze, consumes
    └── vocabulary.ts       # getVocabulary, searchVocabulary, getDailyWord
```

### 3.8 `src/hooks/` & `src/store/`

**Hooks (8):**
| Hook | Propósito |
|---|---|
| `use-debounce.ts` | Debounce genérico (input, pesquisa) |
| `use-gemini-live.ts` | (268 linhas) Conexão WebSocket com Gemini Live API (áudio bidirecional) |
| `use-long-press.ts` | Evento long-press (mobile/desktop) |
| `use-realtime-messages.tsx` | (280 linhas) Supabase Realtime para chat + presença |
| `use-share-prompt.ts` | Prompt de partilha (5 em 5 dias) |
| `use-tts.ts` | (192 linhas) Text-to-Speech com mixed-language support |
| `use-ui-sounds.ts` | Forwarding para contexto de som |
| `use-voice-tutor.ts` | (192 linhas) Voice tutor com Web Speech API + Gemini |

**Stores Zustand (8):**
| Store | Persist | Propósito |
|---|---|---|
| `use-hearts-modal-store` | — | Modal de corações esgotados |
| `use-lesson-modal-store` | — | Modal de início de lição |
| `use-onboarding-store` | localStorage | Estado do onboarding (7 steps) |
| `use-preferences-store` | localStorage | Preferências + sync servidor |
| `use-pro-modal-store` | — | Modal PRO upsell |
| `use-purchase-store` | — | Modal de compra bem-sucedida |
| `use-review-modal` | — | Modal de avaliação |
| `use-share-modal-store` | — | Modal de partilha |

---

## 4. Core Mechanics & Engineering Patterns

### 4.1 State & Data Fetching

#### Server Components (RSC)

```typescript
// Pattern: async RSC + React.cache() + force-dynamic
import { cache } from "react";
import { eq } from "drizzle-orm";

export const getUserProgress = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;
  return await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
});

// Página: importa dados no servidor, passa como props
export default async function LearnPage() {
  const userProgress = await getUserProgress();
  const units = await getUnits();
  // ... render
}
```

#### Client Components + Server Actions

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod/v4";  // Zod v4 import pattern

const actionSchema = z.object({ ... });

export async function someAction(input: unknown): Promise<ActionResponse<Data>> {
    const { userId } = await auth();
    if (!userId) return { success: false, code: "UNAUTHORIZED", message: "..." };

    const parsed = actionSchema.safeParse(input);
    if (!parsed.success) return { success: false, code: "VALIDATION", message: "..." };

    try {
        // Drizzle query
        return { success: true, data: result };
    } catch (error) {
        return { success: false, code: "ERROR", message: "..." };
    }
}
```

#### Zustand + Persist (localStorage)

```typescript
// Pattern: Zustand persist com syncServer
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // ... state
      setPreference: (key, value) => {
        set({ [key]: value });
        syncClientPreferences({ [key]: value }).catch(console.error);
      },
    }),
    {
      name: "myduolingo-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

### 4.2 UI/UX & Design System

#### Core Tokens (globals.css + tailwind.config.ts)

| Token           | CSS Variable       | Tailwind         | Valor                         |
| --------------- | ------------------ | ---------------- | ----------------------------- |
| Verde Duolingo  | `--duo-green`      | `duo-green`      | `#58cc02` (115, 83%, 40% HSL) |
| Verde Escuro    | `--duo-green-dark` | `duo-green-dark` | `#46a302` (borda 3D)          |
| Vermelho Erro   | `--duo-red`        | `duo-red`        | `#ff4b4b`                     |
| Azul Lição      | `--duo-blue`       | `duo-blue`       | `#0ea5e9`                     |
| Dourado Premium | `--duo-gold`       | `duo-gold`       | `#f5b800`                     |
| Roxo Super      | `--duo-purple`     | `duo-purple`     | `#8b5cf6`                     |
| Raio            | `--radius`         | `rounded-xl`     | `0.75rem`                     |

#### Z-Index Semântico

| Token         | Valor | Uso                                             |
| ------------- | ----- | ----------------------------------------------- |
| `overlay`     | 60    | Mobile nav backdrop, command menu backdrop      |
| `modal`       | 70    | General modals (pro, hearts, lesson-start)      |
| `toast`       | 80    | Toasts, custom-toast, snackbars                 |
| `above-modal` | 90    | Modal-on-modal (shop confirm, purchase success) |
| `supreme`     | 9999  | League result ceremony (sits above everything)  |

#### Botões (3D Press Effect)

```typescript
// CVA + cn pattern (src/components/ui/button.tsx)
const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-xl font-black uppercase tracking-wide transition-all active:translate-y-0.5",
  {
    variants: {
      variant: {
        primary:
          "bg-[#58cc02] border-b-4 border-[#46a302] text-white hover:bg-[#46a302]",
        premium: "bg-[#f5b800] border-b-4 border-[#d49c00] text-white",
        danger: "bg-[#ff4b4b] border-b-4 border-[#d63e3e] text-white",
      },
      size: {
        default: "h-12 px-6",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
      },
    },
  },
);
```

#### Animacoes Framer Motion

```typescript
// Padrao de entrada com stagger
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
>
```

```typescript
// AnimatePresence para transicoes condicionais
<AnimatePresence mode="wait">
    {currentChallenge ? <ChallengeCard key={c.id} /> : <ResultScreen />}
</AnimatePresence>
```

### 4.3 Gamification Engine

O sistema de gamificação está centralizado em `src/actions/user-progress.ts` (~786 linhas):

| Sistema          | Descrição                                                         |
| ---------------- | ----------------------------------------------------------------- |
| **Corações**     | 5 máx, regeneração passiva (lazy UTC check), refill via shop/ads  |
| **XP / Pontos**  | Ganhos por lição, bónus XP Boost, streak bónus                    |
| **Streak**       | Dias consecutivos, freeze items, longest streak tracking          |
| **Ligas**        | BRONZE → SILVER → GOLD → PLATINUM → DIAMOND, reset semanal (CRON) |
| **Power-ups**    | XP Boost (5 lições), Heart Shield (1 vida), Streak Freeze         |
| **Baú Diário**   | Recompensa por completar missões diárias                          |
| **Power-up Use** | `usePowerUp(type)` — server action unificada com anti-cheat       |
| **Anti-Cheat**   | Zod validation, Drizzle boundaries, rate limiting (Upstash)       |

### 4.4 Sistema de Chat (E2EE)

Arquitetura de camadas:

```
Physical Layer: Drizzle ORM + PostgreSQL
  → conversations, conversationParticipants, messages, messageReactions
Transport Layer: Supabase Realtime (WebSocket)
  → postgres_changes on messages + message_reactions
  → presence for typing indicators
Security Layer: WebCrypto API (AES-GCM)
  → E2E Public Key exchange (user_progress.e2e_public_key)
  → Encrypted Room Keys (conversationKeys table)
  → client-side encryption/decryption (src/lib/crypto.ts)
Legacy Layer: Signal Protocol (DEPRECATED)
  → signalPreKeys, signalSignedPreKeys, signalRegistrationId
  → Still in schema but unused in chat code
```

### 4.5 Native Integration (Tauri v2)

#### Rust Source (`src-tauri/src/`)

```rust
// main.rs — Desktop entry point
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            // Focus existing window + emit event
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            #[cfg(not(debug_assertions))]
            { window.navigate("https://myduolingo.vercel.app"); }
            Ok(())
        })
        .run(tauri::generate_context!())
}

// lib.rs — Library (mobile entry + shared logic)
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_single_instance::init(...))
        .setup(|app| {
            #[cfg(windows)] {
                // Winreg: override UninstallString in registry
                // Point to custom faro-uninstaller.exe
            }
            Ok(())
        })
}
```

#### Capabilities (Permissions)

```json
// default.json
{
  "permissions": [
    "core:default",
    "opener:default",
    "opener:allow-open-url",
    "deep-link:default",
    "updater:default",
    "process:allow-restart"
  ],
  "remote": {
    "urls": ["http://localhost:3000/**", "https://myduolingo.vercel.app/**"]
  }
}
```

#### Tauri.conf.json Key Settings

- `withGlobalTauri: true` (expõe `window.__TAURI__`)
- `userAgent: "Faro TauriDesktop"` (usado para detecção de plataforma)
- Custom NSIS installer em `src-tauri/installer/`
- Uninstaller separado em `uninstaller-app/`
- Deep link scheme: `myduolingo://`
- CSP restrito para desktop

### 4.6 Sistema de Tipo `ActionResponse<T>`

```typescript
// src/types/index.ts + src/lib/action-error.ts
export type ActionResponse<T> =
  | { success: true; data?: T }
  | { success: false; code: string; message: string };

// Pattern de uso em todas as Server Actions
export async function someAction(): Promise<ActionResponse<Result>> {
  // Early returns com { success: false, code: "ERROR_CODE", message: "..." }
  // Sucesso com { success: true, data: result }
}
```

### 4.7 Content Pipeline (Python → Gemini → SQL)

```
scripts/content_pipeline.py
  → LANGUAGES (12), TEMAS (27), CEFR levels (4)
  → get_base_prompt() → prompt estruturado
  → call_llm() → Gemini 2.5 Flash com retry + JSON validation
  → insert_into_db() → psycopg2 transação ACID
  → interactive_course_selection() → CLI loop

scripts/prompt_maker.py
  → Geração de 4 prompts CEFR (A1, A2_B1, B2, C1_C2)
  → Cada um com regras pedagógicas específicas
  → Hybrid Sliding Scale methodology
```

### 4.8 AI Key Rotation (Round-Robin)

```typescript
// src/lib/ai-manager.ts
// 1. Busca todas as GEMINI_API_KEY_N do .env
// 2. Adiciona GEMINI_API_KEY como fallback
// 3. Shuffle keys (random distribution)
// 4. Tenta cada key sequencialmente com timeout 60s
// 5. Se todas falharem, throw error
```

---

## 5. Database Schema & Data Layer

### 5.1 Todas as Tabelas (25 tabelas em `schema.ts`)

| Tabela                      | PK          | FK                                                             | Propósito                                           |
| --------------------------- | ----------- | -------------------------------------------------------------- | --------------------------------------------------- |
| `courses`                   | `id` serial | —                                                              | Cursos de idiomas                                   |
| `units`                     | `id` serial | `course_id` → courses                                          | Unidades de cada curso                              |
| `lessons`                   | `id` serial | `unit_id` → units                                              | Lições de cada unidade                              |
| `challenges`                | `id` serial | `lesson_id` → lessons                                          | Desafios (SELECT, ASSIST, INSERT, MATCH, DICTATION) |
| `challenge_options`         | `id` serial | `challenge_id` → challenges                                    | Opções de resposta                                  |
| `challenge_progress`        | `id` serial | `challenge_id` → challenges                                    | Progresso do utilizador nos desafios                |
| `user_progress`             | `id` serial | —                                                              | Perfil gamificado (hearts, XP, streak, league)      |
| `user_vocabulary`           | `id` serial | —                                                              | Vocabulário pessoal                                 |
| `user_daily_stats`          | `id` serial | —                                                              | Estatísticas diárias (XP, lições)                   |
| `user_subscriptions`        | `id` serial | `user_id` → user_progress                                      | Subscrições Stripe                                  |
| `challenge_mistakes`        | `id` serial | `challenge_id` → challenges                                    | Erros (Heart Clinic)                                |
| `placement_test_history`    | `id` serial | —                                                              | Histórico de testes de nivelamento                  |
| `practice_sessions`         | `id` serial | —                                                              | Sessões de prática (speaking, writing, etc.)        |
| `feed_activities`           | `id` serial | —                                                              | Atividades do feed social                           |
| `high_fives`                | `id` serial | `activity_id` → feed_activities                                | High-fives entre utilizadores                       |
| `follows`                   | `id` serial | `follower_id` → user_progress, `following_id` → user_progress  | Seguir/Deixar de seguir                             |
| `notifications`             | `id` serial | `user_id` → user_progress                                      | Notificações push                                   |
| `conversations`             | `id` uuid   | —                                                              | Conversas de chat                                   |
| `conversation_participants` | `id` uuid   | `conversation_id` → conversations, `user_id` → user_progress   | Participantes                                       |
| `messages`                  | `id` serial | `conversation_id` → conversations, `sender_id` → user_progress | Mensagens                                           |
| `message_reactions`         | `id` serial | `message_id` → messages, `user_id` → user_progress             | Reacções a mensagens                                |
| `conversation_keys`         | `id` serial | `conversation_id` → conversations, `user_id` → user_progress   | Chaves E2EE                                         |
| `support_tickets`           | `id` serial | `user_id` → user_progress                                      | Tickets de suporte                                  |
| `user_reviews`              | `id` serial | `user_id` → user_progress                                      | Avaliações                                          |
| `admin_audit_logs`          | `id` serial | `user_id` → user_progress                                      | Logs de auditoria admin                             |
| `admin_auth_attempts`       | `id` serial | `user_id` → user_progress                                      | Tentativas de auth admin                            |
| `certificates`              | `id` uuid   | `user_id` → user_progress, `course_id` → courses               | Certificados de conclusão                           |
| `survival_scenarios`        | `id` serial | `course_id` → courses, `unit_id` → units                       | Cenários survival mode                              |
| `survival_sessions`         | `id` uuid   | `user_id` → user_progress, `scenario_id` → survival_scenarios  | Sessões survival                                    |
| `knowledge_posts`           | `id` uuid   | `author_id` → user_progress                                    | Feed de conhecimento                                |
| `user_read_history`         | (composite) | `user_id` + `post_id`                                          | Histórico de leitura                                |
| `knowledge_saves`           | `id` uuid   | `user_id` + `post_id`                                          | Posts guardados                                     |
| `knowledge_likes`           | `id` uuid   | `user_id` + `post_id`                                          | Likes no feed                                       |
| `signal_pre_keys`           | `id` serial | `user_id` → user_progress                                      | Chaves Signal (DEPRECATED)                          |
| `signal_signed_pre_keys`    | `id` serial | `user_id` → user_progress                                      | Chaves Signal (DEPRECATED)                          |

### 5.2 Drizzle Connection

```typescript
// src/db/drizzle.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

### 5.3 Key Schema Patterns

```typescript
// Enum de desafios
export const challengeTypeEnum = pgEnum("type", [
    "SELECT", "ASSIST", "INSERT", "MATCH", "DICTATION",
]);

// Relações tipadas (Drizzle relations)
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, { fields: [lessons.unitId], references: [units.id] }),
    challenges: many(challenges),
}));

// Índices para queries frequentes
export const userProgress = pgTable("user_progress", { ... }, (t) => ({
    leagueIdx: index("user_progress_league_idx").on(t.league),
    pointsIdx: index("user_progress_points_idx").on(t.points),
    totalXpIdx: index("user_progress_total_xp_idx").on(t.totalXpEarned),
}));
```

### 5.4 Queries Pattern (React.cache)

```typescript
// Todas as queries do servidor usam React.cache() para memoização
export const getUnits = cache(async () => {
  const { userId } = await auth();
  // ... Drizzle findMany com relations
});
```

---

## 6. Third-Party Integrations & APIs

### 6.1 Tabela de Integrações

| Serviço              | SDK/Biblioteca             | Chaves .env                                                             | Uso principal                                           |
| -------------------- | -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------- |
| **Clerk**            | `@clerk/nextjs`            | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`                 | Autenticação + middleware + JWT templates (Supabase)    |
| **Gemini**           | `@google/generative-ai`    | `GEMINI_API_KEY_1` a `_4` + fallback `GEMINI_API_KEY`                   | Geração de conteúdo, tutoria, feedback, chat            |
| **Supabase**         | `@supabase/supabase-js`    | `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | DB PostgreSQL, Storage (imagens), Realtime (WebSockets) |
| **Stripe**           | `stripe`                   | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_KEY`                           | Subscrições PRO, checkout, webhooks                     |
| **Resend**           | `resend`                   | `RESEND_API_KEY`                                                        | Emails transacionais (suporte, confirmações)            |
| **OneSignal**        | `react-onesignal`          | `ONESIGNAL_APP_ID`, `ONESIGNAL_REST_API_KEY`                            | Notificações push (web + mobile)                        |
| **Upstash**          | `@upstash/ratelimit`       | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                    | Rate limiting anti-cheat                                |
| **Sentry**           | `@sentry/nextjs`           | `SENTRY_AUTH_TOKEN`                                                     | Observabilidade, source maps, crons                     |
| **Giphy**            | `@giphy/js-fetch-api`      | `NEXT_PUBLIC_GIPHY_API_KEY`                                             | Selecção de GIFs no chat                                |
| **Vercel Analytics** | `@vercel/analytics`        | —                                                                       | Analytics de página                                     |
| **QR Code**          | `@yudiel/react-qr-scanner` | —                                                                       | Leitura de QR codes (autenticação)                      |
| **MyMemory**         | HTTP (fetch)               | —                                                                       | Tradução de palavras (fallback: Groq LLM)               |

### 6.2 API Routes (8 handlers)

| Route                     | Método | Propósito                                          | Auth                       |
| ------------------------- | ------ | -------------------------------------------------- | -------------------------- |
| `/api/auth/desktop-token` | POST   | Gera token JWT desktop (Tauri)                     | Clerk                      |
| `/api/auth/native-google` | POST   | Login Google nativo (Capacitor)                    | Google Auth Library        |
| `/api/cron/ingest-feed`   | GET    | Ingestão de feed Reddit → tradução Groq → Supabase | Bearer token (CRON_SECRET) |
| `/api/cron/league-reset`  | GET    | Reset semanal de ligas                             | Bearer token (CRON_SECRET) |
| `/api/crypto/keys`        | GET    | Obter chaves públicas E2EE                         | Clerk                      |
| `/api/practice/survival`  | GET    | Obter cenários survival                            | Clerk                      |
| `/api/webhooks/stripe`    | POST   | Webhooks Stripe (checkout, subscription)           | Stripe signature           |
| `/api/sentry-example-api` | GET    | Exemplo Sentry                                     | —                          |

### 6.3 WebSocket Endpoints

| Conexão           | Protocolo                                             | Propósito                                      |
| ----------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Supabase Realtime | WebSocket (porta 443)                                 | Presença online, mensagens chat, notificações  |
| Gemini Live API   | WebSocket wss://generativelanguage.googleapis.com/... | Chat de áudio bidirecional (Conversation mode) |

### 6.4 Security & Anti-Cheat

```
┌─────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                     │
├─────────────────────────────────────────────────────┤
│ 1. Clerk Auth → middleware.ts (rota protegida)       │
│ 2. Admin Vault → HMAC-signed cookie + validate       │
│ 3. Zod Validation → todas as Server Actions          │
│ 4. Drizzle Boundaries → confirmar existência IDs     │
│ 5. Rate Limiting → Upstash Redis (ações críticas)    │
│ 6. CSP → Headers HTTP restritivos                    │
│ 7. DOMPurify → Sanitização XSS no servidor           │
│ 8. Stripe Webhook → Verificação de assinatura        │
│ 9. Supabase RLS → Row Level Security (JWT Clerk)     │
│ 10. Generic Errors → Nunca expor stack traces        │
└─────────────────────────────────────────────────────┘
```

### 6.5 Variáveis de Ambiente (`.env.example`)

```
# 23 variáveis categorizadas:
# APP, DATABASE, AUTH, SUPABASE, AI (4 keys), STRIPE,
# ADMIN, CRON, GIPHY, GOOGLE, ONESIGNAL, UPSTASH, SENTRY, RESEND
```

---

## 7. Future Rules & Constraints (For AI Agents)

### 7.1 Regras de Arquitectura

1. **Server Actions First**: Toda a mutação de dados deve passar por Server Actions. Nunca usar API Routes para lógica de negócio — API Routes são apenas para webhooks externos e cron jobs.

2. **ActionResponse Pattern**: Todas as Server Actions devem retornar `Promise<ActionResponse<T>>`. Nunca retornar dados crus ou lançar erros não tratados.

3. **Zod Validation Obrigatório**: Toda Server Action que recebe input do cliente deve validar com Zod schema. Nunca confiar em dados não validados.

4. **React.cache() em Queries**: Todas as queries Drizzle usadas em Server Components devem usar `cache()` de React para memoização.

5. **force-dynamic**: Páginas que usam dados do utilizador autenticado devem ter `export const dynamic = "force-dynamic"`.

### 7.2 Regras de UI & Design

6. **Nunca Usar Google Translate**: Usar MyMemory API (HTTP fetch) com fallback para Groq LLM. A tradução está em `src/actions/translate.ts`.

7. **Componentes Modulares (shadcn Pattern)**: Usar `cva()` + `cn()` para variantes de componentes. Manter `src/components/ui/` para primitivos base.

8. **3D Button Pattern**: Todos os botões principais devem usar `border-b-4` + `active:translate-y-0.5` para o efeito 3D press característico.

9. **Z-Index Semântico**: Usar sempre os tokens definidos (`overlay: 60`, `modal: 70`, `toast: 80`, `above-modal: 90`, `supreme: 9999`). Nunca usar valores arbitrários.

10. **Dark Mode Obrigatório**: Todo novo componente deve suportar `dark:` Tailwind classes.

### 7.3 Regras de Native (Tauri + Capacitor)

11. **Nunca Remover Flags do Cargo.toml**: `tauri-plugin-deep-link`, `tauri-plugin-single-instance`, `tauri-plugin-updater`, `tauri-plugin-process`, `tauri-plugin-opener`, `tauri-plugin-log`.

12. **OAuth Redirect Usa window.location.href**: Para OAuth callbacks, usar `window.location.href` (full reload) em vez de `router.push()`. Isto força Clerk a re-inicializar a partir dos cookies.

13. **Detecção de Plataforma**: `window.__TAURI_INTERNALS__` para Tauri, `Capacitor.isNativePlatform()` para Capacitor, `navigator.userAgent.includes("TauriDesktop")` como fallback.

### 7.4 Regras de IA & Conteúdo

14. **Nunca Expor GEMINI_API_KEY no Client-side**: As keys Gemini devem ser usadas apenas em Server Actions ou API Routes. O hook `use-gemini-live.ts` é a única excepção (embute a key no WebSocket por necessidade da API).

15. **Round-Robin de Keys**: Usar `ai-manager.ts` para rotation de múltiplas API keys Gemini com timeout de 60s e shuffle.

16. **Pipeline de Conteúdo**: Sempre gerar conteúdo via Python CLI (`content_pipeline.py`) ou pelo admin panel (`ai-generator-form.tsx`). Nunca gerar conteúdo fora destes pipelines.

### 7.5 Regras de Segurança

17. **Admin Vault Obrigatório**: O acesso ao painel `/admin` requer validação HMAC do cookie `admin_vault_session`. Nunca contornar este mecanismo.

18. **Sanitização XSS**: Usar `src/lib/html-sanitizer.ts` (DOMPurify server-side) para todo HTML gerado por IA ou input do utilizador.

19. **Rate Limiting**: Usar Upstash Redis para rate limiting em ações críticas (login admin, envio de mensagens, geração IA).

20. **Generic Error Messages**: Nunca expor detalhes de erros internos ao cliente. Usar mensagens genéricas como "Ocorreu um erro. Tenta novamente."

### 7.6 Regras de Base de Dados

21. **Drizzle ORM Exclusivo**: Nunca usar SQL cru no servidor. Toda a interação com a BD deve passar por Drizzle ORM. Excepção: `scripts/content_pipeline.py` (Python psycopg2).

22. **Índices em Queries Frequentes**: Adicionar índices Drizzle para colunas usadas em `WHERE` frequentes (ex: `league`, `points`, `userId` + `date`).

23. **Regeneração Passiva de Corações**: Os corações regeneram-se lazy (verificação UTC no momento do acesso) — não usar CRON jobs para regeneração.

### 7.7 Regras de Manutenção

24. **Testes Vitest Obrigatórios**: Toda utilitário novo em `src/lib/` deve ter testes Vitest correspondentes em `src/__tests__/`.

25. **Cobertura Mínima**: Manter cobertura de testes nos utilitários de segurança (vault, sanitizer, action-error, subscription).

26. **Commits com lint-staged**: Husky + lint-staged corre ESLint e Prettier em ficheiros staged. Não fazer `--no-verify` a não ser que explicitamente necessário.

---

## 8. Technical Debt & Refactoring Targets

### 8.1 Issues Críticas (Prioridade Alta)

| #   | Problema                                 | Ficheiro                                                 | Risco                             | Solução Proposta                                                 |
| --- | ---------------------------------------- | -------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------- |
| 1   | **API Key exposta no client**            | `use-gemini-live.ts` envia `setup.apiKey` para WebSocket | ALTO — key visível em network tab | Implementar proxy server-side que faz relay do WebSocket         |
| 2   | **Duas estratégias de migração**         | `drizzle/` vs `migrations/` vs `migration.sql`           | ALTO — risco de divergência       | Unificar para Drizzle Kit apenas; remover migrações manuais      |
| 3   | **`(window as any).webkitAudioContext`** | `use-gemini-live.ts:159`                                 | MÉDIO — typescript unsafe         | Usar tipos de `src/types/index.ts` (`SpeechRecognitionInstance`) |

### 8.2 Dead Code & Código Não Utilizado

| #   | Problema                 | Ficheiro                                                               | Prova                                                                               |
| --- | ------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 4   | **Signal Protocol E2EE** | Schema: `signalPreKeys`, `signalSignedPreKeys` + `lib/signal-store.ts` | Código chat real usa WebCrypto (`conversationKeys`). Signal fields nunca populados. |
| 5   | **`null` package**       | `package.json` dependências                                            | `"null": "^2.0.0"` — instalado acidentalmente                                       |
| 6   | **`src-tauri/2`**        | Ficheiro solto na raiz do src-tauri                                    | Stray file (npm output artifact)                                                    |
| 7   | **Pastas vazias**        | `(main)/support/`, `components/onboarding/`, `desktop-sso-callback/`   | Sem ficheiros                                                                       |
| 8   | **Mintlify rewrites**    | `vercel.json` (assumido)                                               | Mintlify foi cancelado, rewrites legados devem ser removidos                        |

### 8.3 Refactoring Targets (Prioridade Média)

| #   | Problema                    | Ficheiro                            | Tamanho      | Solução                                                                 |
| --- | --------------------------- | ----------------------------------- | ------------ | ----------------------------------------------------------------------- |
| 9   | **Monstro de 1500+ linhas** | `src/db/queries/social.ts` (61KB)   | ~1500 linhas | Split por domínio: `follows.ts`, `notifications.ts`, `conversations.ts` |
| 10  | **Server Action gigante**   | `src/actions/user-progress.ts`      | 786 linhas   | Split: `hearts.ts`, `streak.ts`, `xp.ts`, `league.ts`                   |
| 11  | **Lesson Client massivo**   | `src/app/lesson/lesson-client.tsx`  | 959 linhas   | Extrair hooks customizados e sub-componentes                            |
| 12  | **`floating-marco.tsx`**    | CSS injection via `style.innerHTML` | 582 linhas   | Mover CSS dinâmico para CSS module ou Tailwind                          |

### 8.4 Melhorias de Código (Prioridade Baixa)

| #   | Problema                        | Ficheiro                                            | Solução                                                                  |
| --- | ------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| 13  | **`use-gemini-live.ts`**        | AudioContext e WebSocket lifecycle complexo         | Extrair para hooks menores (`use-websocket.ts`, `use-audio-recorder.ts`) |
| 14  | **Zod v4 import pattern**       | Alguns ficheiros usam `zod` (v3) em vez de `zod/v4` | Unificar imports                                                         |
| 15  | **`getTranslations` sem await** | `src/app/(main)/learn/page.tsx`                     | Adicionar `await` (Next.js 14 pattern)                                   |
| 16  | **`i18n/request.ts`**           | Só suporta `pt` e `en`                              | Adicionar fallback estruturado para mais línguas                         |

### 8.5 Performance

| #   | Problema                   | Impacto                                                   | Solução                                                                        |
| --- | -------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 17  | **Sem ISR/SSG**            | Todas as páginas são `force-dynamic`                      | Considerar ISR para páginas públicas (cursos, avaliações)                      |
| 18  | **Sem Image Optimization** | Imagens usam `<img>` em vez de `<Image>` em alguns locais | Migrar para Next/Image com remotePatterns configurados                         |
| 19  | **Bundle grande**          | `lucide-react` importado inteiro                          | Usar `optimizePackageImports` já configurado para lucide-react + framer-motion |

---

## 9. Appendix: Quick Reference

### 9.1 Comandos Principais

```bash
npm run dev           # Desenvolvimento (Next.js)
npm run build         # Build produção
npm run lint          # ESLint
npm test              # Vitest (watch mode)
npm run test:run      # Vitest (single run)
npm run test:coverage # Vitest + coverage report
npm run test:e2e      # Playwright E2E
npm run tauri dev     # Tauri + Next.js
npm run db:push       # Drizzle Kit push
npm run db:migrate    # Drizzle Kit generate
npm run db:studio     # Drizzle Kit studio (GUI)
npm run db:seed       # Executa scripts/seed.ts
npm run release       # scripts/release.mjs
```

### 9.2 Estrutura de Diretórios (Resumo)

```
src/                        # 15 sub-dirs
├── app/                    # 131 ficheiros, 90 sub-dirs
├── components/             # 137 ficheiros, 15 categorias
├── actions/                # 34 Server Actions
├── lib/                    # 24 utilitários + ai/prompts.ts
├── db/                     # schema (35 tabelas) + 7 query modules
├── types/                  # 40+ tipos partilhados
├── hooks/                  # 8 custom hooks
├── store/                  # 8 Zustand stores
├── i18n/                   # next-intl config
├── __tests__/              # 4 test files (Vitest)
└── middleware.ts           # Clerk auth + admin vault

src-tauri/                  # Desktop (Rust)
├── src/main.rs             # Entry point desktop
├── src/lib.rs              # Shared logic (mobile + registry hack)
├── tauri.conf.json         # Config Tauri v2
├── capabilities/           # Permissões
├── installer/              # Custom NSIS installer (Vite + React)
└── Cargo.toml              # Rust dependencies

scripts/                    # 27 scripts
├── content_pipeline.py     # Pipeline IA (Python)
├── seed.ts                 # Seed de dados
├── test_gemini.ts          # Teste de API Gemini
└── release.mjs             # Script de release

messages/                   # i18n (en.json, pt.json)
installer-app/              # NSIS installer UI
uninstaller-app/            # Tauri uninstaller
```

### 9.3 Padrão de código (Template para novos componentes)

```tsx
"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useUISounds } from "@/hooks/use-ui-sounds";

type Props = {
  // Props tipadas
  children: React.ReactNode;
};

export function ComponentName({ children }: Props) {
  const t = useTranslations("namespace");
  const { playClick } = useUISounds();

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-b-4 border-slate-200 bg-white p-6",
        "dark:border-slate-800 dark:bg-slate-900",
        "transition-all hover:border-slate-300 active:translate-y-0.5",
      )}
      onClick={() => playClick()}
    >
      {children}
    </div>
  );
}
```

---

> **FIM DO FARO MASTER BLUEPRINT**
>
> Este documento serve como contexto injetável para futuras sessões de IA.
> Qualquer alteração arquitetural deve atualizar este blueprint.

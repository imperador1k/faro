# Faro — Production-Grade Global Launch Plan

> Análise exaustiva de tudo o que falta fazer, melhorar ou implementar para a Faro ser uma app de nível mundial, comercial e pronta para milhões de utilizadores.

---

## Índice

1. [Critical (0–3 meses)](#1-critical-0-3-meses)
2. [High (3–6 meses)](#2-high-3-6-meses)
3. [Medium (6–12 meses)](#3-medium-6-12-meses)
4. [Low / Nice-to-Have (12+ meses)](#4-low--nice-to-have-12-meses)
5. [Infraestrutura & DevOps](#5-infraestrutura--devops)
6. [Monetização & Negócio](#6-monetização--negócio)
7. [Qualidade & Testes](#7-qualidade--testes)
8. [Referências Técnicas](#8-referências-técnicas)

---

## 1. Critical (0–3 meses)

### 1.1 Testes — Cobertura Mínima Viável

| O quê | Porquê | Como |
|---|---|---|
| **Unit tests para todas as server actions** | 0 testes para 30+ actions. Qualquer `throw` não tratado dá 500 ao utilizador | Vitest + mocks de DB. Alvo: 70%+ nas actions core (auth, progress, subscription) |
| **Unit tests para todas as API routes** | Stripe webhook, cron jobs — erros aqui perdem dinheiro ou dados | Testar signature verification, event handling, edge cases (duplicados, malformed) |
| **Integration tests para DB queries** | 31 tabelas, queries complexas com joins. Sem testes, regressões silenciosas | Drizzle + testcontainers ou SQLite in-memory |
| **E2E para o fluxo completo de registo → onboarding → lição** | O core da app. Se quebrar, 100% dos users são afetados | Playwright com Clerk test tokens. Testar sem login, com login, onboarding, lição |
| **E2E para subscrição PRO (Stripe)** | Dinheiro envolvido. Erros no checkout ou webhook podem cobrar sem dar acesso | Stripe test mode + Playwright + webhook mock |

**Estado atual:** 4 ficheiros de teste (subscription, vault-token, sanitizer, action-error).  
**Objetivo:** 40+ ficheiros de teste com 60%+ coverage.

### 1.2 Service Worker & PWA Completo

| O quê | Porquê |
|---|---|
| Criar `public/sw.js` com cache-first para assets estáticos, network-first para API | A app só tem offline banner + `localforage`, sem service worker. Utilizadores mobile perdem acesso sem internet |
| Estratégias: cache-first para CSS/JS/images/fonts, network-first para API, stale-while-revalidate para conteúdo dinâmico | 70% dos utilizadores mobile têm conectividade intermitente (Brasil, África, Ásia) |
| Adicionar `beforeinstallprompt` handler | Utilizadores Android podem adicionar à home screen como app nativa |
| Background sync para ações offline (responder a desafios, completar lições) | Experiência contínua mesmo sem rede |

### 1.3 Otimização de Performance (Core Web Vitals)

| O quê | Onde | Prioridade |
|---|---|---|
| **Lazy loading de imagens** | `public/` tem 13 imagens. Muitas são carregadas sem `loading="lazy"` | **Alta** |
| **Bundle analysis** | `next build` com `@next/bundle-analyzer`. Muitos packages (70+ deps) sem tree-shaking audit | **Alta** |
| **Otimizar Lottie animations** | `public/` tem 12 ficheiros Lottie. Cada um pode ter 500KB+ não comprimido. Converter para `.lottie` ou dotLottie | **Média** |
| **Font optimization** | Nunito carregado via Google Fonts. Usar `next/font/google` com `display=swap` e `preload` | **Alta** |
| **Reduzir JavaScript initial bundle** | Clerk + Stripe + Sentry + framer-motion + recharts + cmdk + etc tudo no bundle inicial | **Alta** |
| **Image CDN** | Todas as imagens servidas do Next.js. Migrar para Cloudinary/Imgix com transformações | **Média** |
| **Database query optimization** | N+1 queries em páginas como leaderboard, feed, friends | **Média** |

### 1.4 Gestão de Erros & Resiliência

| O quê | Porquê |
|---|---|
| **Adicionar `try/catch` em TODAS as server actions** | Muitas actions não têm error handling. Um erro de DB = 500 para o utilizador |
| **Criar ErrorBoundary por página/rota** | Só existe ErrorBoundary no layout `(main)`. Landing, onboarding, eval, admin não têm |
| **Implementar retry logic na Stripe webhook** | Se o Stripe enviar um evento e a DB estiver em baixo, perdemos a subscription |
| **Graceful degradation para APIs externas** | Gemini, GIPHY, OneSignal, Supabase Realtime — se um falhar, a app não deve quebrar |
| **Adicionar health check endpoint** | `GET /api/health` → DB + Redis + Stripe + Gemini. Essencial para monitoring e load balancers |

### 1.5 Segurança — Pendências Críticas

| O quê | Estado | Ação |
|---|---|---|
| **CSRF protection** | ❌ Não implementado | Adicionar `SameSite=Strict` + `csrf-token` header em mutations |
| **Rate limiting em todas as API routes públicas** | ✅ Só em AI, gameplay, AI Tutor, Email | Adicionar em Stripe webhook, sign-up, password reset |
| **Input validation em todas as server actions** | ⚠️ Parcial (Zod nalgumas, outras não) | Adicionar Zod schema validation em TODAS as actions com input |
| **Dependency scanning** | ❌ Não configurado | Adicionar `npm audit` + `snyk` + `socket.dev` no CI |
| **Secrets scanning** | ❌ Não configurado | Adicionar `git secrets` ou `talisman` pre-commit hook |
| **CSP audit** | ✅ Existe | Auditar se todas as origens externas estão cobertas (Stripe, Clerk, Sentry, Supabase, GIPHY, OneSignal, Gemini) |
| **SQL injection** | ✅ Drizzle ORM | OK |
| **XSS** | ✅ Sanitizer + DOMPurify | OK |

### 1.6 Localização — Correções

| O quê | Porquê |
|---|---|
| **10 idiomas mas NENHUM tem tradução completa** | `en.json` tem 2342 linhas. Os outros têm menos. Alguns podem ter 0% traduzido | Auditoria urgente |
| **Faltam locale para Clerk** | Só `ptBR` configurado. Utilizadores espanhóis, franceses, etc veem Clerk em inglês | Instalar `@clerk/localizations` para cada idioma |
| **next-intl sem fallback** | Se a chave não existe no locale atual, quebra em produção | Configurar `fallbackLocale: 'en'` |
| **Mensagens de erro da API não são traduzidas** | Erros devolvidos pelo Stripe, Gemini, etc estão sempre em inglês | Wrapper de tradução para mensagens de erro |

### 1.7 Email System — Completo

| O quê | Status |
|---|---|
| **Resend configurado** | ✅ No package.json |
| **Email templates Clerk** | ⚠️ Template básico, precisa de design Faro (já iniciado) |
| **Transactional emails** (bem-vindo, recovery, subscrição) | ❌ Não implementados |
| **Email de confirmação de pagamento** | ❌ Não implementado |
| **Weekly report / streak reminder** | ❌ Não implementado |
| **Email delivery monitoring** | ❌ Resend webhooks não configurados |
| **SPF/DKIM/DMARC** | ❌ Não configurado no domínio |

---

## 2. High (3–6 meses)

### 2.1 Analytics & Observability

| O quê | Prioridade |
|---|---|
| **Custom event tracking** (Vercel Analytics só dá page views) | Adicionar `trackEvent()` para: registo, lição completada, compra PRO, erro, streak, partilha |
| **Dashboard de analytics no admin** | Ver métricas em tempo real: MAU, DAU, conversão, retenção, top idiomas |
| **Performance monitoring (RUM)** | Adicionar `web-vitals` library + reportar a Sentry ou endpoint próprio |
| **Uptime monitoring** | Configurar Better Stack / Checkly / Sentry Cron para health checks |
| **Logs centralizados** | Substituir `console.log` disperso por pino/winston + logtail/axiom |
| **Sentry performance tracing** | Transações para páginas lentas, queries lentas, API lenta |

### 2.2 Database & Data Layer

| O quê | Porquê |
|---|---|
| **Connection pooling** | Atualmente `postgres` driver direto. Sem pool, cada request abre nova conexão | Adicionar `pg-pool` ou `@neondatabase/serverless` |
| **Database migration automation** | `drizzle-kit push` em dev, `drizzle-kit migrate` em prod. Não há rollback | Adicionar scripts de migration + rollback + CI step |
| **Database backup & restore** | Sem backup = risco de perder todos os dados | Configurar pg_dump diário + 30-day retention |
| **Soft delete em tabelas críticas** | `user_progress`, `messages` — delete direto = perda permanente | Adicionar coluna `deleted_at` |
| **Read replicas** | Para scale horizontal, separar leituras de escritas | Configurar replicação PostgreSQL |
| **Data archival** | `user_daily_stats` cresce 1 linha/user/dia. 1M users × 365 = 365M linhas/ano | Tabela partitioned por mês + archive após 12 meses |

### 2.3 Caching Estratégico

| O quê | Estado | Ação |
|---|---|---|
| **Redis (Upstash) para rate limiting** | ✅ OK | Manter |
| **Redis para cache de queries pesadas** | ❌ Não usado | Cache: leaderboard, feed, amigos, vocabulary |
| **Redis para sessões** | ❌ Clerk gere sessões | OK |
| **Redis para filas (queue)** | ❌ Não usado | BullMQ + Redis para tarefas async (gerar feed, enviar emails, processar analytics) |
| **Next.js ISR para páginas estáticas** | ❌ Não usado | Termos, privacidade, licenças — gerar estaticamente com revalidate |
| **CDN caching** | ❌ Vercel CDN já faz | Configurar `Cache-Control` headers, `stale-while-revalidate` |

### 2.4 User Management & Admin

| O quê | Porquê |
|---|---|
| **Dashboard de moderação de conteúdo** | Feed tem posts gerados por AI + users podem criar. Sem moderação = risco legal |
| **Sistema de reports de utilizadores** | Sem forma de reportar spam, abuso, conteúdo ilegal |
| **GDPR data export tool** | Utilizadores têm direito a exportar todos os seus dados |
| **Account deletion com data purge** | `danger-zone.tsx` existe mas precisa de verificar se apaga realmente todos os dados |
| **Admin audit logs UI** | Tabela `admin_audit_logs` existe mas sem interface para consultar |
| **Sistema de bans/suspensões** | Sem forma de banir utilizadores abusivos |
| **Suporte multi-tenant** | Se quiseres vender Faro a escolas/empresas | (nice-to-have) |

### 2.5 Monetização — Subscrição PRO

| O quê | Estado |
|---|---|
| **Stripe checkout** | ✅ Funcional |
| **Stripe webhook handling** | ⚠️ Básico, faltam cenários: cancelamento, renewal failed, refund |
| **PRO features gate** | ⚠️ `checkSubscription()` existe, mas nem todas as features PRO estão protegidas |
| **Trial period** | ❌ Não implementado |
| **Family plan / referral** | ❌ Não implementado |
| **Regional pricing** | ❌ Preço único para todo o mundo |
| **Gift cards / promo codes** | ❌ Não implementado |
| **In-app purchases (mobile)** | ❌ Stripe não funciona em apps iOS/Android sem StoreKit/Google Play |
| **Revenue analytics dashboard** | ❌ Não existe |

### 2.6 Mobile Experience

| O quê | Porquê |
|---|---|
| **Capacitor Android — testes reais** | `android/` existe mas não sabemos se compila e funciona em dispositivo real |
| **iOS setup** | ❌ Não existe. Capacitor `ionic build` + Xcode project |
| **Push notifications funcionais** | OneSignal + `react-onesignal` estão no package.json mas sem configuração verificada |
| **Deep linking** | Links existem (`/native-callback`, etc) mas sem testes |
| **Offline mode funcional** | Service worker + IndexedDB cache de challenges para lições offline |
| **App performance (mobile)** | Animations Lottie, framer-motion — podem ser pesados em dispositivos low-end |
| **Adaptive icons** | Só existe um icon. Android precisa de adaptive icon + legacy |
| **Splash screen** | Capacitor/configurado mas sem design Faro |

---

## 3. Medium (6–12 meses)

### 3.1 AI & Personalization

| O quê | Estado | Ação |
|---|---|---|
| **Personalized learning path** | ❌ | AI recomenda próximas lições baseado em erros e ritmo |
| **Spaced repetition** | ⚠️ Vocabulary existe mas sem algoritmo de revisão | Implementar SM-2 / FSRS para revisões |
| **AI conversation partner** | ⚠️ `use-voice-tutor.ts` + `gemini.ts` existem | Melhorar latency, adicionar mais cenários, reconhecimento de voz contínuo |
| **Writing correction** | ✅ `analyzeWriting()` | Melhorar feedback granular |
| **Pronunciation assessment** | ⚠️ `analyzeSpeaking()` básico | Integrar API especializada (Speechace, Elsa) |
| **Content recommendation** | ❌ | Feed personalizado baseado em nível, interesses, histórico |
| **AI-generated exercises dinâmicos** | ✅ `ai-generator.ts` | Otimizar para variedade e evitar repetição |
| **Chatbot Marco mais inteligente** | ⚠️ `marco-chat.ts` existe | Memória de longo prazo, personalidade consistente, mais cenários |

### 3.2 Social Features

| O quê | Estado |
|---|---|
| **Amigos** | ✅ `friends/` existe |
| **Leaderboard semanal** | ✅ `leaderboard/` + `api/cron/league-reset/` |
| **High-fives** | ✅ `highFives()` |
| **Feed de conhecimento** | ✅ `feed/` + `knowledge_posts` |
| **Chat E2EE** | ⚠️ `chat/` + `crypto.ts` + `messages.ts` — funcional mas sem testes |
| **Clans / grupos de estudo** | ❌ Não implementado |
| **Desafios entre amigos** | ❌ Não implementado |
| **Streaks visível para amigos** | ❌ Não implementado |
| **Comentários em atividades** | ❌ Feed só tem likes, sem comentários |
| **Perfil público personalizável** | ⚠️ Básico, sem personalização |

### 3.3 Gamificação Avançada

| O quê | Estado |
|---|---|
| **Achievements / badges** | ⚠️ `achievements.ts` + `achievements-list.tsx` existem | Expandir para 50+ conquistas |
| **Quests diárias** | ⚠️ `quests-header.tsx` + `quests.ts` existem | Mais variedade, recompensas melhores |
| **Hearts system** | ✅ `hearts-modal.tsx` | Funcional |
| **Streak (dias consecutivos)** | ✅ `streak-check.tsx` + `user_progress.streak` | Funcional |
| **XP boost / double XP** | ✅ `xpBoostLessons` | Funcional |
| **Shop** | ✅ `shop/` com items | Expandir items cosméticos |
| **Arcade minigames** | ⚠️ `arcade-info-modal.tsx` existe | Implementar jogos reais |
| **Survival mode** | ⚠️ `survival/` routes + API | Completar e expandir cenários |
| **Season / battle pass** | ❌ Não implementado | Sistema sazonal com recompensas exclusivas |
| **Level-up celebrations** | ⚠️ `course-completed-modal.tsx` | Melhorar animações e partilha |

### 3.4 Acessibilidade (a11y)

| O quê | Prioridade |
|---|---|
| **Auditoria axe-core** | Detetar: missing labels, contraste insuficiente, focus order errado |
| **Navegação por teclado** | Toda a app deve ser navegável sem rato |
| **Screen reader support** | ARIA roles, live regions, alt text em todas as imagens |
| **Reduced motion** | Respeitar `prefers-reduced-motion` para framer-motion e Lottie |
| **Contraste de cores** | Verificar WCAG AA em todos os temas (light/dark) |
| **Font size scaling** | Suportar aumento de fonte do sistema |

---

## 4. Low / Nice-to-Have (12+ meses)

### 4.1 Feature Flags & Experimentação

- Implementar **LaunchDarkly** ou **flagsmith** ou sistema caseiro
- A/B testing para onboarding, landing page, preços
- Rollout gradual de novas features (canary releases)

### 4.2 API Pública

- REST API pública documentada com OpenAPI/Swagger
- API keys geradas no dashboard
- SDK para Python, JavaScript, etc
- Rate limiting por API key (já existe infraestrutura Upstash)

### 4.3 Enterprise / B2B

- Multi-tenant com escolas e empresas
- Dashboard de admin para organizações
- SSO (SAML/OIDC)
- Bulk user management
- Custom branding (white-label)
- SLA

### 4.4 Language Features

- **OCR para aprender de imagens** (tirar foto a um menu, placa, etc)
- **AR (realidade aumentada)** — apontar câmara para objeto e ver tradução
- **Writing prompts semanais** com correção por AI
- **Language exchange** — conectar utilizadores que aprendem línguas diferentes
- **Tandem / 1:1 conversation** com nativos via chat de voz

### 4.5 Content Ecosystem

- **User-generated courses** (parecido com Duolingo Stories)
- **Community translations** de challenges
- **Curated content partnerships** (news, podcasts, YouTube integrado)
- **Daily news in target language** adaptado ao nível CEFR (feed já faz isto)

### 4.6 Multi-Platform

- **Apple Watch app** para streak tracking + quick practice
- **Chrome extension** para aprender enquanto navega
- **Discord bot** para prática social
- **WhatsApp bot** para prática conversational

---

## 5. Infraestrutura & DevOps

### 5.1 CI/CD — Melhorias

| O quê | Estado | Ação |
|---|---|---|
| **Staging/Preview environment** | ❌ | Deploy automático para Vercel Preview + DB de staging |
| **Database migrations no CI** | ❌ | Step que corre `drizzle-kit migrate` antes dos testes |
| **E2E com DB real em CI** | ❌ | Testcontainers PostgreSQL em vez de mock |
| **Performance budget no CI** | ❌ | Lighthouse CI com thresholds |
| **Bundle size check no CI** | ❌ | `size-limit` ou `bundlesize` |
| **Auto-merge dependabot** | ❌ | Configurar auto-merge para minor/patch com testes verdes |
| **Semantic release** | ❌ | Automatizar versionamento + changelog + publish |

### 5.2 Docker & Deployment

| O quê | Estado | Ação |
|---|---|---|
| **Docker compose dev** | ✅ | OK |
| **Docker compose prod** | ❌ | Para self-hosted option |
| **Kubernetes manifests** | ❌ | Se fores escalar para milhões |
| **Terraform / Pulumi** | ❌ | Infra as code |
| **Vercel config** | ⚠️ | `vercel.json` não encontrado. Configurar headers, rewrites, redirects |
| **Sentry source maps** | ⚠️ | Configurados mas verificar se funcionam |
| **Log drain** | ❌ | Vercel → Axiom / Logtail / Datadog |

### 5.3 Monitoring Stack

| O quê | Ação |
|---|---|
| **Uptime monitoring** | Better Stack / Checkly / Sentry Cron (10 endpoints) |
| **Alerting** | PagerDuty / Slack / Telegram para: 5xx rate > 1%, pagamentos a falhar, DB down |
| **SLO tracking** | Definição de SLOs (99.9% uptime, <2s response time) |
| **Sentry Performance** | Transações para rotas lentas, queries lentas |
| **Custom dashboards** | Grafana ou Datadog para métricas de negócio + técnicas |

---

## 6. Monetização & Negócio

### 6.1 Pricing Strategy

| O quê | Ação |
|---|---|
| **Definir tiers** | Free (básico) / PRO ($9.99/mês) / Family ($14.99/5 users) |
| **Regional pricing** | Preços ajustados por país (ex: Brasil R$19,90, Índia ₹399) |
| **Annual discount** | 20% off no plano anual |
| **Trial period** | 7 dias grátis PRO |
| **Lifetime deal** | Opção única para early adopters |
| **Student discount** | Verificação .edu |
| **School/Enterprise** | Custom pricing |

### 6.2 Revenue Streams Adicionais

| O quê | Prioridade |
|---|---|
| **PRO subscription** | ✅ Core |
| **In-app purchases** (hearts, streak freezes, boosters) | ⚠️ Shop existe, expandir |
| **Cosmetics** (themes, avatars, badges) | ❌ Não implementado |
| **Certificates** (verificados, pagos) | ⚠️ `certificates/` existe — monetizar |
| **Tutoring marketplace** (conexão com professores) | ❌ |
| **Sponsored content** (parcerias com escolas, publishers) | ❌ |
| **Ads (non-intrusive)** | ❌ Apenas como último recurso |

### 6.3 Métricas de Negócio

| Métrica | Onde medir |
|---|---|
| **MAU / DAU** | Vercel Analytics + custom |
| **Retention (D1, D7, D30)** | Vercel Analytics + user_daily_stats |
| **Conversion rate (Free → PRO)** | Stripe + Clerk |
| **Churn rate** | Stripe |
| **LTV / CAC** | Stripe + Vercel |
| **NPS** | In-app survey |
| **Feature adoption** | Custom events |
| **Stripe revenue** | Stripe dashboard |

---

## 7. Qualidade & Testes

### 7.1 Testing Matrix

| Tipo | Atual | Objetivo | Prioridade |
|---|---|---|---|
| **Unit tests (Vitest)** | 4 files | 80+ files cobrindo actions, lib, utils, hooks | 🚨 Crítica |
| **Integration tests (DB)** | 0 | Testar queries com drizzle + testcontainers | Alta |
| **Component tests** | 0 | Storybook ou Vitest + @testing-library/react para componentes críticos | Alta |
| **E2E (Playwright)** | 1 spec (landing) | 10+ specs: auth, onboarding, lesson, subscription, admin | 🚨 Crítica |
| **Visual regression** | 0 | Percy / Chromatic para UI diffs | Média |
| **API tests** | 0 | Supertest + Vitest para API routes | Alta |
| **Performance tests** | 0 | k6 ou autocannon para rotas críticas | Média |
| **Security tests** | 0 | OWASP ZAP ou `security` script | Média |
| **Accessibility tests** | 0 | axe-core + Pa11y CI | Média |
| **Load tests** | 0 | k6 para simular 10k+ users concorrentes | Baixa |

### 7.2 Code Quality

| O quê | Ação |
|---|---|
| **TypeScript strict mode** | ✅ Já ativo |
| **`any` usage** | ⚠️ 80+ warnings. Limpar progressivamente |
| **Circular dependencies** | Verificar com `madge` |
| **Dead code elimination** | `knip` ou `ts-prune` para detetar exports não usados |
| **Prettier + ESLint** | ✅ Configurado |
| **Husky + lint-staged** | ✅ Configurado |
| **Commit lint** | ❌ Adicionar `@commitlint/config-conventional` |
| **Code review checklist** | Criar PR template com checklist |

---

## 8. Referências Técnicas

### Problemas específicos encontrados na análise

| Problema | Ficheiro | Risco |
|---|---|---|
| **`PRIVACY_KEY` importa de `crypto` que é deprecated no browser** | `src/lib/vault-token.ts` | Pode quebrar em runtime edge |
| **`@privacyresearch/libsignal-protocol-typescript` deprecated** | `package.json` | Usa Signal Protocol antigo. Migrar para libsignal (Signal oficial) |
| **`src/lib/ai/prompts.ts` usa `buildSurvivalPrompt` não exportado** | `src/actions/survival.ts` | Pode estar a importar algo que não existe |
| **`console.log` em produção** | middleware.ts, cron routes | Vazar informação sensível. Usar `logger` do Sentry ou pino |
| **In-memory Map para dedup Stripe eventos** | `stripe/route.ts` | Perde dedup se o serverless function reciclar. Usar Redis |
| **`clerk-email-template.html` solto na raiz** | Root dir | Ficheiro esquecido, pode confundir devs |
| **`android/` committed no git** | Root dir | `android/` é build artifact, deve estar em `.gitignore` |
| **`backups/` committed no git** | Root dir | Backups locais nunca devem estar no repo |
| **`out/` (static export) committed no git** | Root dir | Build artifact |
| **`scratch/` committed no git** | Root dir | Ficheiros temporários de dev |
| **`.env` (sem local) committed?** | Root dir | Verificar se `.env` está em `.gitignore` (`.env.local` está) |
| **`src/instrumentation.ts` sem export de `register()`** | Next.js 14 precisa | Pode não estar a carregar Sentry corretamente |

---

## Prioridade de Execução Recomendada

```
MÊS 1-2:    Testes (unit + E2E core) + Service Worker + Error Handling + Rate Limiting
MÊS 3-4:    Performance (Core Web Vitals) + Analytics + DB Connection Pool + Email System
MÊS 5-6:    Mobile Polish + Subscription Expansion + Admin Dashboard + Cache Strategy
MÊS 7-9:    Social Features + Gamificação Avançada + Acessibilidade + i18n Completo
MÊS 10-12:  AI Personalization + API Pública + B2B Prep + Infra Scale
```

---

> **Nota:** Este plano assume equipa de 1–2 developers full-time. Se tiveres mais recursos, os timings comprimem proporcionalmente.
>
> O foco NOW deve ser **testes + resiliência + PWA** — sem isto, qualquer crescimento de utilizadores vai resultar em crashes, perda de dados e má reputação.

# Arquitetura de Internacionalização (i18n)

## A Decisão do Arquiteto: Routing Baseado em Cookies (Sem Prefixos)

Para a **MyDuolingo**, escolhemos a abordagem **Cookie-Based (Sem Prefixos na URL)**.
Descartamos a abordagem tradicional de Paths (`/en/feed`) e configuramos o `next-intl` com `localePrefix: 'never'`.

### Porquê esta escolha?

1. **Estética e UX Pura:** Utilizadores odeiam URLs sujos. Queremos que o link seja sempre `myduolingo.com/feed` e nunca `myduolingo.com/pt-PT/feed`.
2. **Partilha de Links Inteligente:** Ao partilhar o link `/post/1`, a app lê a _Cookie_ (ou o idioma do dispositivo de quem recebe o link) e traduz o post e a UI automaticamente para a língua nativa na hora.
3. **SEO não é prioridade interna:** Grande parte da app está atrás de Login (Feed, Learn, Shop, Admin). A Landing Page (`/`) pode gerir o SEO através de metadados _hreflang_ sem precisar de sujar as rotas da web app.

---

## 🏗️ O Motor: `next-intl`

A implementação usa a biblioteca oficial para Next.js 14+: `next-intl`.

### 1. A Hierarquia de Deteção de Língua

O sistema decide a língua nesta ordem rigorosa de prioridade:

1. **Cookie (`NEXT_LOCALE`):** Se o utilizador já escolheu manualmente no seu Perfil.
2. **Base de Dados (`native_language`):** O sistema lê a base de dados (através do `NativeBridge`).
3. **Header HTTP (`Accept-Language`):** O idioma de fábrica do Browser/Telemóvel (Visitantes não autenticados).
4. **Fallback (Inglês):** A língua de segurança se tudo o resto falhar.

### 2. A Estrutura de Dicionários (JSONs)

Usamos ficheiros separados para manter a organização.

```text
/messages
  /pt
    common.json      (Botões, Erros, Menus globais)
    feed.json        (Traduções exclusivas da página de Feed)
    learn.json       (Traduções das aulas)
  /en
    common.json
    feed.json
    learn.json
```

**Exemplo de Refactoring UI:**

```tsx
const t = useTranslations("Feed");
<button>{t("share_with_friends")}</button>;
```

### 3. A Automação de Escala

Escrevemos o código e dicionário na língua base (Inglês ou Português). Um script auxiliar (`npm run translate`) usa a API do Groq/LLaMA para ler o `messages/pt/...` e atualizar automaticamente todos os outros JSONs da app.

---

## 🚀 Roteiro de Implementação (Roadmap)

Passos para implementação segura (commits individuais sugeridos):

1. **Setup Core:**
   - Instalar `next-intl`.
   - Criar ficheiros nucleares: `i18n.ts`, `middleware.ts` e `navigation.ts`.
   - Configurar o Middleware para gerir as Cookies e redirecionamentos invisíveis.

2. **Migração do Layout Base:**
   - Envolver o Root Layout com o `NextIntlClientProvider`.
   - Passar o idioma dinâmico (`locale`) para a tag `<html>`.

3. **Refactoring da Sidebar & Navbar:**
   - Extrair todos os textos do menu principal para `messages/pt/common.json`.
   - Atualizar a UI para consumir a função de tradução.

4. **Botão de Mudança de Língua (Settings):**
   - Criar uma Server Action que permite ao utilizador forçar a língua (atualiza a Cookie e a BD).
   - Adicionar o Dropdown no menu de opções.

5. **Tradução Progressiva:**
   - Migrar de forma granular as páginas restantes (Landing Page > Feed > Learn) para evitar breaking changes nos layouts.

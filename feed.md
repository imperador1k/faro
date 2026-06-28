# MyDuolingo: Arquitetura do Knowledge Feed (TikTok Style) 📱🧠

Este documento documenta o funcionamento, as tecnologias e a visão arquitetural do **Knowledge Feed** (disponível na rota `/feed`), criado para ser uma funcionalidade altamente viciante e educativa, semelhante ao feed do TikTok.

---

## 1. Como funciona atualmente? (O que está implementado)

O Feed é um ecossistema 100% automatizado, composto por duas grandes vertentes: **Geração de Conteúdo Diária** e **Consumo Interativo**.

### A. Motor de Ingestão Diário (Backend / Cron Job)

O conteúdo não é inserido manualmente. Existe um endpoint cron (`/api/cron/ingest-feed`) que deve ser executado diariamente.

- **Segurança da API Cron:** A rota está protegida nativamente! Quando a Vercel chama o cron job, ela injeta silenciosamente um cabeçalho `Authorization: Bearer <CRON_SECRET>`. Se um utilizador ou bot externo tentar aceder ao link em Produção sem este _Secret_, o servidor rejeita o pedido com um **Error 401 Unauthorized**.
- **Implementação Vercel:** A periodicidade do cron está definida no ficheiro raiz `vercel.json`. Configurado para correr todos os dias (`0 8 * * *` - 08:00 UTC).
- **A IA Nativa (Groq + LLaMA 3.1):** Originalmente, ponderou-se fazer _scraping_ ao Reddit (`r/todayilearned`) e à Wikipedia. Devido às robustas proteções contra bots destas plataformas (como a Cloudflare que causava o erro `403 Forbidden`), a arquitetura foi **pivotada**.
- Atualmente, o script comunica **exclusivamente com a API da Groq** (usando o modelo ultrarrápido `llama-3.1-8b-instant`).
- **Processo:** A IA é instruída a _inventar_ 5 factos/curiosidades verídicas em Inglês, traduzi-las imediatamente para a linguagem-alvo do utilizador (ex: Português, Nível B1) e associar a cada facto uma palavra-chave (ex: "volcano", "computer"). Estes dados são guardados diretamente na base de dados PostgreSQL (via Drizzle).
- **Imagens (LoremFlickr):** As imagens de fundo dinâmicas não usam IA para evitar custos de geração. Pegamos na palavra-chave que o Groq extraiu sobre o assunto (ex: `computer`) e chamamos a API pública do **LoremFlickr** (`https://loremflickr.com/800/1200/computer`).

### B. Consumo e Interatividade (Frontend)

- **O Swipe Infinito:** Os posts carregam em ecrã inteiro com a mecânica clássica de _scroll vertical_.
- **Histórico de Leitura:** Assim que um post fica visível (através da Web API `IntersectionObserver`), ele é marcado silenciosamente como lido na base de dados (`user_read_history`). Ao recarregar a app, posts já vistos não voltam a aparecer, garantindo sempre conteúdo novo.
- **Dicionário Fantasma V2 (Groq + Redis Caching):** Cada palavra do post (e do título) tem um sublinhado tracejado interativo. Ao clicar na palavra, o sistema faz a tradução contextual "on-the-fly" usando a IA da Groq. Para evitar elevados custos de API e limites, a resposta é guardada permanentemente numa memória RAM ultrarrápida (Upstash Redis). Futuros cliques na mesma palavra/contexto carregam a tradução do Redis em 5 milissegundos a custo zero.

| Componente                          | Tecnologia Atual                     | Motivo da Escolha                                                                                                       |
| :---------------------------------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **Geração de Conteúdo**             | `Groq` + `LLaMA-3.1`                 | Extremamente rápido (tokens/segundo absurdos) e gratuito no tier atual. Elimina a necessidade de Web Scraping.          |
| **Imagens de Fundo**                | `LoremFlickr`                        | Gratuito, rápido, não exige API Key e permite _fetching_ via palavra-chave exata.                                       |
| **Tradução Instantânea Contextual** | `Groq (LLaMA-3.1)` + `Upstash Redis` | Traduções perfeitas porque analisam a frase inteira. O Redis garante que a IA só trabalha uma vez por palavra/contexto. |
| **Base de Dados**                   | `Supabase` (PostgreSQL) + `Drizzle`  | Suporte transacional, rapidez e integração perfeita com a tipagem do TypeScript.                                        |

---

## 3. Escalabilidade e Melhorias Futuras 🚀

Caso a aplicação cresça para milhares de utilizadores, a fundação em Redis (para traduções) e Groq (para geração) já nos dá um suporte monstruoso. No entanto, aqui está o plano de evolução:

### A. Solução Offline / Edge (Local AI)

- Como o projeto já está a escalar para apps _Desktop_ (usando Tauri/Capacitor), poderíamos correr modelos minúsculos como o `Gemma-2b` diretamente no _browser_ do utilizador (via WebGPU / Transformers.js) para fazer traduções e validações **100% offline**, sem sequer contactar o servidor Redis ou Groq.

### B. Ingestão Distribuída e Ponderada

- O Cron Job está configurado para o Vercel. A limitação gratuita da Vercel para _Serverless Functions_ é de 10 a 60 segundos. O script pode ir abaixo (Timeout) se gerarmos 50 posts de uma vez.
- **Solução:** Migrar a execução do cron para serviços assíncronos focados em _Background Jobs_ (como o **Upstash QStash** ou o **Inngest**).
- Isto permitiria que o motor de Ingestão executasse ao longo de horas, gerando centenas de posts diariamente para preencher uma base de dados global.

### C. Sistema de Recomendação de Vídeos (Áudio)

- Substituir as imagens estáticas do LoremFlickr por vídeos dinâmicos verticais livres de direitos de autor (via `Pexels Video API`), cruzados com uma API de Text-to-Speech (como a `ElevenLabs` ou a `OpenAI TTS`), criando literalmente a ilusão completa de um Reels / TikTok narrado por inteligência artificial.

### D. Gamificação do Feed

- Dar recompensas em moedas (Coins) sempre que o utilizador clica para traduzir uma palavra que o sistema considere "Avançada", encorajando o estudo ativo mesmo quando o utilizador está em modo "Scroll Passivo".

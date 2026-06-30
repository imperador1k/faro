export type DocCategory =
  | "Mecânicas Base"
  | "Gamificação & Loja"
  | "Competição & Social"
  | "Modo Arcade"
  | "Conta & Configurações";

export type DocArticle = {
  id: string;
  slug: string;
  title: string;
  category: DocCategory;
  summary: string;
  content: string;
  icon: string;
};

export const getDocsArticles = (t: any): DocArticle[] => [
  // ── MECÂNICAS BASE ──
  {
    id: "base-1",
    slug: "o-que-e-xp",
    title: t("articles.o-que-e-xp.title"),
    category: "Mecânicas Base", // These are category IDs now, we will translate them in the UI
    summary: t("articles.o-que-e-xp.summary"),
    icon: "Zap",
    content: t.raw("articles.o-que-e-xp.content"),
  },
  {
    id: "base-2",
    slug: "como-funcionam-os-coracoes",
    title: t("articles.como-funcionam-os-coracoes.title"),
    category: "Mecânicas Base",
    summary: t("articles.como-funcionam-os-coracoes.summary"),
    icon: "Heart",
    content: t.raw("articles.como-funcionam-os-coracoes.content"),
  },
  {
    id: "base-3",
    slug: "recuperar-vidas",
    title: t("articles.recuperar-vidas.title"),
    category: "Mecânicas Base",
    summary: t("articles.recuperar-vidas.summary"),
    icon: "Activity",
    content: t.raw("articles.recuperar-vidas.content"),
  },

  // ── GAMIFICAÇÃO & LOJA ──
  {
    id: "gamificacao-1",
    slug: "a-ofensiva-streak",
    title: t("articles.a-ofensiva-streak.title"),
    category: "Gamificação & Loja",
    summary: t("articles.a-ofensiva-streak.summary"),
    icon: "Flame",
    content: t.raw("articles.a-ofensiva-streak.content"),
  },
  {
    id: "gamificacao-2",
    slug: "congelamentos-streak-freezes",
    title: t("articles.congelamentos-streak-freezes.title"),
    category: "Gamificação & Loja",
    summary: t("articles.congelamentos-streak-freezes.summary"),
    icon: "Snowflake",
    content: t.raw("articles.congelamentos-streak-freezes.content"),
  },
  {
    id: "gamificacao-3",
    slug: "missoes-diarias-baus",
    title: t("articles.missoes-diarias-baus.title"),
    category: "Gamificação & Loja",
    summary: t("articles.missoes-diarias-baus.summary"),
    icon: "Target",
    content: t.raw("articles.missoes-diarias-baus.content"),
  },
  {
    id: "gamificacao-4",
    slug: "myduolingo-pro-vs-gratis",
    title: t("articles.myduolingo-pro-vs-gratis.title"),
    category: "Gamificação & Loja",
    summary: t("articles.myduolingo-pro-vs-gratis.summary"),
    icon: "Crown",
    content: t.raw("articles.myduolingo-pro-vs-gratis.content"),
  },

  // ── COMPETIÇÃO & SOCIAL ──
  {
    id: "social-1",
    slug: "sistema-de-divisoes",
    title: t("articles.sistema-de-divisoes.title"),
    category: "Competição & Social",
    summary: t("articles.sistema-de-divisoes.summary"),
    icon: "Trophy",
    content: t.raw("articles.sistema-de-divisoes.content"),
  },
  {
    id: "social-2",
    slug: "promocoes-despromocoes",
    title: t("articles.promocoes-despromocoes.title"),
    category: "Competição & Social",
    summary: t("articles.promocoes-despromocoes.summary"),
    icon: "ArrowUpRight",
    content: t.raw("articles.promocoes-despromocoes.content"),
  },
  {
    id: "social-3",
    slug: "high-fives-e-feed-social",
    title: t("articles.high-fives-e-feed-social.title"),
    category: "Competição & Social",
    summary: t("articles.high-fives-e-feed-social.summary"),
    icon: "Users",
    content: t.raw("articles.high-fives-e-feed-social.content"),
  },

  // ── MODO ARCADE ──
  {
    id: "arcade-1",
    slug: "sprint-vocabulario",
    title: t("articles.sprint-vocabulario.title"),
    category: "Modo Arcade",
    summary: t("articles.sprint-vocabulario.summary"),
    icon: "Timer",
    content: t.raw("articles.sprint-vocabulario.content"),
  },
  {
    id: "arcade-2",
    slug: "chuva-de-meteoros-swipe",
    title: t("articles.chuva-de-meteoros-swipe.title"),
    category: "Modo Arcade",
    summary: t("articles.chuva-de-meteoros-swipe.summary"),
    icon: "Rocket",
    content: t.raw("articles.chuva-de-meteoros-swipe.content"),
  },
  {
    id: "arcade-3",
    slug: "o-assistente-marco",
    title: t("articles.o-assistente-marco.title"),
    category: "Modo Arcade",
    summary: t("articles.o-assistente-marco.summary"),
    icon: "Bot",
    content: t.raw("articles.o-assistente-marco.content"),
  },

  // ── CONTA & CONFIGURAÇÕES ──
  {
    id: "conta-1",
    slug: "alterar-nome-avatar",
    title: t("articles.alterar-nome-avatar.title"),
    category: "Conta & Configurações",
    summary: t("articles.alterar-nome-avatar.summary"),
    icon: "UserCog",
    content: t.raw("articles.alterar-nome-avatar.content"),
  },
  {
    id: "conta-2",
    slug: "modo-escuro-e-temas",
    title: t("articles.modo-escuro-e-temas.title"),
    category: "Conta & Configurações",
    summary: t("articles.modo-escuro-e-temas.summary"),
    icon: "Moon",
    content: t.raw("articles.modo-escuro-e-temas.content"),
  },
  {
    id: "conta-3",
    slug: "deixar-feedback-mural",
    title: t("articles.deixar-feedback-mural.title"),
    category: "Conta & Configurações",
    summary: t("articles.deixar-feedback-mural.summary"),
    icon: "Star",
    content: t.raw("articles.deixar-feedback-mural.content"),
  },
];

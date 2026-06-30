import type { DBUserProgress } from "@/types";

export type Achievement = {
  id?: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: DBUserProgress) => boolean;
};

export const getAchievements = (t: any): Achievement[] => [
  // ==========================================
  // 🧠 SÁBIO (Total XP Earned)
  // ==========================================
  {
    id: "mente-curiosa",
    title: t("items.mente-curiosa.title"),
    description: t("items.mente-curiosa.description"),
    icon: "🌱",
    condition: (p) => (p.totalXpEarned || p.points) >= 100,
  },
  {
    id: "estudante-dedicado",
    title: t("items.estudante-dedicado.title"),
    description: t("items.estudante-dedicado.description"),
    icon: "📝",
    condition: (p) => (p.totalXpEarned || p.points) >= 500,
  },
  {
    id: "aspirante",
    title: t("items.aspirante.title"),
    description: t("items.aspirante.description"),
    icon: "📗",
    condition: (p) => (p.totalXpEarned || p.points) >= 1000,
  },
  {
    id: "aprendiz",
    title: t("items.aprendiz.title"),
    description: t("items.aprendiz.description"),
    icon: "📘",
    condition: (p) => (p.totalXpEarned || p.points) >= 2500,
  },
  {
    id: "erudito",
    title: t("items.erudito.title"),
    description: t("items.erudito.description"),
    icon: "📙",
    condition: (p) => (p.totalXpEarned || p.points) >= 5000,
  },
  {
    id: "mestre",
    title: t("items.mestre.title"),
    description: t("items.mestre.description"),
    icon: "🎓",
    condition: (p) => (p.totalXpEarned || p.points) >= 10000,
  },
  {
    id: "grao-mestre",
    title: t("items.grao-mestre.title"),
    description: t("items.grao-mestre.description"),
    icon: "🦉",
    condition: (p) => (p.totalXpEarned || p.points) >= 25000,
  },
  {
    id: "sabio",
    title: t("items.sabio.title"),
    description: t("items.sabio.description"),
    icon: "🧠",
    condition: (p) => (p.totalXpEarned || p.points) >= 50000,
  },
  {
    id: "iluminado",
    title: t("items.iluminado.title"),
    description: t("items.iluminado.description"),
    icon: "✨",
    condition: (p) => (p.totalXpEarned || p.points) >= 100000,
  },
  {
    id: "lendario",
    title: t("items.lendario.title"),
    description: t("items.lendario.description"),
    icon: "🏆",
    condition: (p) => (p.totalXpEarned || p.points) >= 250000,
  },
  {
    id: "mitico",
    title: t("items.mitico.title"),
    description: t("items.mitico.description"),
    icon: "🦄",
    condition: (p) => (p.totalXpEarned || p.points) >= 500000,
  },
  {
    id: "divino",
    title: t("items.divino.title"),
    description: t("items.divino.description"),
    icon: "⛈️",
    condition: (p) => (p.totalXpEarned || p.points) >= 1000000,
  }, // Tier Absurdo 1
  {
    id: "omnisciente",
    title: t("items.omnisciente.title"),
    description: t("items.omnisciente.description"),
    icon: "👁️",
    condition: (p) => (p.totalXpEarned || p.points) >= 5000000,
  }, // Tier Absurdo 2
  {
    id: "o-criador",
    title: t("items.o-criador.title"),
    description: t("items.o-criador.description"),
    icon: "🌌",
    condition: (p) => (p.totalXpEarned || p.points) >= 10000000,
  }, // Tier Absurdo 3

  // ==========================================
  // 🔥 INCANSÁVEL (Streak)
  // ==========================================
  {
    id: "aquecimento",
    title: t("items.aquecimento.title"),
    description: t("items.aquecimento.description"),
    icon: "🕯️",
    condition: (p) => p.longestStreak >= 3,
  },
  {
    id: "faisca",
    title: t("items.faisca.title"),
    description: t("items.faisca.description"),
    icon: "🔥",
    condition: (p) => p.longestStreak >= 7,
  },
  {
    id: "chama",
    title: t("items.chama.title"),
    description: t("items.chama.description"),
    icon: "🥓",
    condition: (p) => p.longestStreak >= 14,
  },
  {
    id: "incendio",
    title: t("items.incendio.title"),
    description: t("items.incendio.description"),
    icon: "🧨",
    condition: (p) => p.longestStreak >= 30,
  },
  {
    id: "inferno",
    title: t("items.inferno.title"),
    description: t("items.inferno.description"),
    icon: "🌋",
    condition: (p) => p.longestStreak >= 60,
  },
  {
    id: "centenario",
    title: t("items.centenario.title"),
    description: t("items.centenario.description"),
    icon: "💯",
    condition: (p) => p.longestStreak >= 100,
  },
  {
    id: "obsessivo",
    title: t("items.obsessivo.title"),
    description: t("items.obsessivo.description"),
    icon: "👺",
    condition: (p) => p.longestStreak >= 150,
  },
  {
    id: "meio-ano",
    title: t("items.meio-ano.title"),
    description: t("items.meio-ano.description"),
    icon: "🗓️",
    condition: (p) => p.longestStreak >= 183,
  },
  {
    id: "imparavel",
    title: t("items.imparavel.title"),
    description: t("items.imparavel.description"),
    icon: "🚂",
    condition: (p) => p.longestStreak >= 250,
  },
  {
    id: "volta-ao-sol",
    title: t("items.volta-ao-sol.title"),
    description: t("items.volta-ao-sol.description"),
    icon: "🌍",
    condition: (p) => p.longestStreak >= 365,
  },
  {
    id: "marciano",
    title: t("items.marciano.title"),
    description: t("items.marciano.description"),
    icon: "👽",
    condition: (p) => p.longestStreak >= 687,
  }, // Ano em Marte
  {
    id: "milenio",
    title: t("items.milenio.title"),
    description: t("items.milenio.description"),
    icon: "🗿",
    condition: (p) => p.longestStreak >= 1000,
  },
  {
    id: "eterno",
    title: t("items.eterno.title"),
    description: t("items.eterno.description"),
    icon: "♾️",
    condition: (p) => p.longestStreak >= 2000,
  }, // ~5 anos

  // ==========================================
  // 📚 LITERATO (Lessons completed - estimated via point / 10 for simplicity or existing field)
  // ==========================================
  // Assumindo que o utilizador ganha em média 10-15xp por lição, vamos usar `points` como proxy se não tivermos contador de lições,
  // MAS espera, temos 'actions/user-progress' que incrementa pontos. Não temos "lessonsCompleted" explícito no schema.
  // Vamos usar (points / 10) como aproximação grosseira ou criar achievements baseados em XP que "soam" a lições.
  // OU, melhor, vamos assumir que o sistema de XP é a métrica principal.
  // MAS, vamos checar o schema.ts... `points` é o que temos.
  // Vamos adicionar achievements baseados em "Corações" (hearts) ou "Shields" (heartShields).

  // ==========================================
  // 🛡️ GUARDIÃO (Escudos - Inventário Atual, não histórico, infelizmente)
  // PARA TERMOS HISTÓRICO PRECISÁVAMOS DE MAIS CAMPOS NA BD.
  // Vamos focar no que temos: XP e Streak são os mais fiáveis "históricos".
  // Mas podemos ter achievements por "Nível" (XP / 1000).

  // Vamos criar Tiers intermédios de Sábio com nomes criativos para encher.
  {
    id: "alfabetizado",
    title: t("items.alfabetizado.title"),
    description: t("items.alfabetizado.description"),
    icon: "🅰️",
    condition: (p) => (p.totalXpEarned || p.points) >= 50,
  },
  {
    id: "tagarela",
    title: t("items.tagarela.title"),
    description: t("items.tagarela.description"),
    icon: "💬",
    condition: (p) => (p.totalXpEarned || p.points) >= 250,
  },
  {
    id: "poliglota-jr",
    title: t("items.poliglota-jr.title"),
    description: t("items.poliglota-jr.description"),
    icon: "🐤",
    condition: (p) => (p.totalXpEarned || p.points) >= 750,
  },
  {
    id: "tradutor",
    title: t("items.tradutor.title"),
    description: t("items.tradutor.description"),
    icon: "🗣️",
    condition: (p) => (p.totalXpEarned || p.points) >= 1500,
  },
  {
    id: "poeta",
    title: t("items.poeta.title"),
    description: t("items.poeta.description"),
    icon: "✒️",
    condition: (p) => (p.totalXpEarned || p.points) >= 3000,
  },
  {
    id: "novelista",
    title: t("items.novelista.title"),
    description: t("items.novelista.description"),
    icon: "📖",
    condition: (p) => (p.totalXpEarned || p.points) >= 7500,
  },
  {
    id: "enciclopedia",
    title: t("items.enciclopedia.title"),
    description: t("items.enciclopedia.description"),
    icon: "📚",
    condition: (p) => (p.totalXpEarned || p.points) >= 15000,
  },
  {
    id: "bibliotecario",
    title: t("items.bibliotecario.title"),
    description: t("items.bibliotecario.description"),
    icon: "🏛️",
    condition: (p) => (p.totalXpEarned || p.points) >= 35000,
  },
  {
    id: "oraculo",
    title: t("items.oraculo.title"),
    description: t("items.oraculo.description"),
    icon: "🔮",
    condition: (p) => (p.totalXpEarned || p.points) >= 75000,
  },
  {
    id: "profeta",
    title: t("items.profeta.title"),
    description: t("items.profeta.description"),
    icon: "📜",
    condition: (p) => (p.totalXpEarned || p.points) >= 150000,
  },

  // ==========================================
  // ⚡ COLECIONADOR (Inventário atual - verificar se tem X items)
  // ==========================================
  {
    id: "preparado",
    title: t("items.preparado.title"),
    description: t("items.preparado.description"),
    icon: "🛡️",
    condition: (p) => (p.heartShields || 0) >= 1,
  },
  {
    id: "tanque",
    title: t("items.tanque.title"),
    description: t("items.tanque.description"),
    icon: "🏯",
    condition: (p) => (p.heartShields || 0) >= 3,
  },
  {
    id: "intocavel",
    title: t("items.intocavel.title"),
    description: "Tem 5 Escudos (Max?)",
    icon: "💎",
    condition: (p) => (p.heartShields || 0) >= 5,
  },

  {
    id: "energizado",
    title: t("items.energizado.title"),
    description: t("items.energizado.description"),
    icon: "🔋",
    condition: (p) => (p.xpBoostLessons || 0) >= 1,
  },
  {
    id: "sobrecarga",
    title: t("items.sobrecarga.title"),
    description: t("items.sobrecarga.description"),
    icon: "⚡",
    condition: (p) => (p.xpBoostLessons || 0) >= 5,
  },
  {
    id: "alta-tensao",
    title: t("items.alta-tensao.title"),
    description: t("items.alta-tensao.description"),
    icon: "🏭",
    condition: (p) => (p.xpBoostLessons || 0) >= 10,
  },

  {
    id: "fresquinho",
    title: t("items.fresquinho.title"),
    description: t("items.fresquinho.description"),
    icon: "🍦",
    condition: (p) => (p.streakFreezes || 0) >= 1,
  },
  {
    id: "congelado",
    title: t("items.congelado.title"),
    description: t("items.congelado.description"),
    icon: "🥶",
    condition: (p) => (p.streakFreezes || 0) >= 3,
  },
  {
    id: "era-do-gelo",
    title: t("items.era-do-gelo.title"),
    description: t("items.era-do-gelo.description"),
    icon: "🧊",
    condition: (p) => (p.streakFreezes || 0) >= 5,
  },

  // ==========================================
  // ❤️ VITALIDADE (Corações)
  // ==========================================
  {
    id: "vivo",
    title: t("items.vivo.title"),
    description: "Tem 1+ coração",
    icon: "💓",
    condition: (p) => p.hearts >= 1,
  },
  {
    id: "saudavel",
    title: t("items.saudavel.title"),
    description: "Tem 3+ corações",
    icon: "💖",
    condition: (p) => p.hearts >= 3,
  },
  {
    id: "perfeito",
    title: t("items.perfeito.title"),
    description: t("items.perfeito.description"),
    icon: "💪",
    condition: (p) => p.hearts >= 5,
  },

  // ==========================================
  // 🔢 NÍVEIS "LÓGICOS" (XP Levels simulados)
  // ==========================================
  {
    id: "nivel-1",
    title: t("items.nivel-1.title"),
    description: t("items.nivel-1.description"),
    icon: "1️⃣",
    condition: (p) => (p.totalXpEarned || p.points) >= 100,
  },
  {
    id: "nivel-5",
    title: t("items.nivel-5.title"),
    description: t("items.nivel-5.description"),
    icon: "5️⃣",
    condition: (p) => (p.totalXpEarned || p.points) >= 500,
  },
  {
    id: "nivel-10",
    title: t("items.nivel-10.title"),
    description: t("items.nivel-10.description"),
    icon: "🔟",
    condition: (p) => (p.totalXpEarned || p.points) >= 1000,
  },
  {
    id: "nivel-20",
    title: t("items.nivel-20.title"),
    description: t("items.nivel-20.description"),
    icon: "😎",
    condition: (p) => (p.totalXpEarned || p.points) >= 2000,
  },
  {
    id: "nivel-30",
    title: t("items.nivel-30.title"),
    description: t("items.nivel-30.description"),
    icon: "🦁",
    condition: (p) => (p.totalXpEarned || p.points) >= 3000,
  },
  {
    id: "nivel-40",
    title: t("items.nivel-40.title"),
    description: t("items.nivel-40.description"),
    icon: "🐯",
    condition: (p) => (p.totalXpEarned || p.points) >= 4000,
  },
  {
    id: "nivel-50",
    title: t("items.nivel-50.title"),
    description: t("items.nivel-50.description"),
    icon: "🦅",
    condition: (p) => (p.totalXpEarned || p.points) >= 5000,
  },
  {
    id: "nivel-60",
    title: t("items.nivel-60.title"),
    description: t("items.nivel-60.description"),
    icon: "🦈",
    condition: (p) => (p.totalXpEarned || p.points) >= 6000,
  },
  {
    id: "nivel-70",
    title: t("items.nivel-70.title"),
    description: t("items.nivel-70.description"),
    icon: "🦖",
    condition: (p) => (p.totalXpEarned || p.points) >= 7000,
  },
  {
    id: "nivel-80",
    title: t("items.nivel-80.title"),
    description: t("items.nivel-80.description"),
    icon: "🐲",
    condition: (p) => (p.totalXpEarned || p.points) >= 8000,
  },
  {
    id: "nivel-90",
    title: t("items.nivel-90.title"),
    description: t("items.nivel-90.description"),
    icon: "👹",
    condition: (p) => (p.totalXpEarned || p.points) >= 9000,
  },
  {
    id: "nivel-100",
    title: t("items.nivel-100.title"),
    description: t("items.nivel-100.description"),
    icon: "💯",
    condition: (p) => (p.totalXpEarned || p.points) >= 10000,
  },

  // ==========================================
  // 🌌 EXPANSÃO CÓSMICA (XP Absurdo Extra)
  // ==========================================
  {
    id: "via-lactea",
    title: t("items.via-lactea.title"),
    description: t("items.via-lactea.description"),
    icon: "🌌",
    condition: (p) => (p.totalXpEarned || p.points) >= 2000000,
  },
  {
    id: "buraco-negro",
    title: t("items.buraco-negro.title"),
    description: t("items.buraco-negro.description"),
    icon: "⚫",
    condition: (p) => (p.totalXpEarned || p.points) >= 3000000,
  },
  {
    id: "multiverso",
    title: t("items.multiverso.title"),
    description: t("items.multiverso.description"),
    icon: "💠",
    condition: (p) => (p.totalXpEarned || p.points) >= 4000000,
  },

  // ... total ~60 achievements here. Adding more purely creative ones based on weird numbers

  {
    id: "numero-da-besta",
    title: t("items.numero-da-besta.title"),
    description: t("items.numero-da-besta.description"),
    icon: "🤘",
    condition: (p) => (p.totalXpEarned || p.points) >= 666,
  },
  {
    id: "sorte-grande",
    title: t("items.sorte-grande.title"),
    description: t("items.sorte-grande.description"),
    icon: "🎰",
    condition: (p) => (p.totalXpEarned || p.points) >= 777,
  },
  {
    id: "ano-novo",
    title: t("items.ano-novo.title"),
    description: t("items.ano-novo.description"),
    icon: "🎆",
    condition: (p) => (p.totalXpEarned || p.points) >= 2024,
  },
  {
    id: "futurista",
    title: t("items.futurista.title"),
    description: t("items.futurista.description"),
    icon: "🤖",
    condition: (p) => (p.totalXpEarned || p.points) >= 2077,
  },
  {
    id: "over-9000",
    title: t("items.over-9000.title"),
    description: t("items.over-9000.description"),
    icon: "💥",
    condition: (p) => (p.totalXpEarned || p.points) > 9000,
  },

  // Streak Fun
  {
    id: "fim-de-semana",
    title: t("items.fim-de-semana.title"),
    description: t("items.fim-de-semana.description"),
    icon: "✌️",
    condition: (p) => p.longestStreak >= 2,
  },
  {
    id: "mao-cheia",
    title: t("items.mao-cheia.title"),
    description: t("items.mao-cheia.description"),
    icon: "🖐️",
    condition: (p) => p.longestStreak >= 5,
  },
  {
    id: "duas-maos",
    title: t("items.duas-maos.title"),
    description: t("items.duas-maos.description"),
    icon: "👐",
    condition: (p) => p.longestStreak >= 10,
  },
  {
    id: "tres-semanas",
    title: t("items.tres-semanas.title"),
    description: t("items.tres-semanas.description"),
    icon: "🥚",
    condition: (p) => p.longestStreak >= 21,
  }, // Eclosão?
  {
    id: "quaresma",
    title: t("items.quaresma.title"),
    description: t("items.quaresma.description"),
    icon: "🕯️",
    condition: (p) => p.longestStreak >= 40,
  },

  // Shop Big Spender Simulations (requires tracking 'points' spent which we don't have, but we can assume High Total XP implies high spending potential)
  {
    id: "rico",
    title: t("items.rico.title"),
    description: "Acumula 1.000 XP (Total)",
    icon: "💰",
    condition: (p) => (p.totalXpEarned || p.points) >= 1000,
  },
  {
    id: "milionario",
    title: t("items.milionario.title"),
    description: "Acumula 1.000.000 XP (Total)",
    icon: "🏦",
    condition: (p) => (p.totalXpEarned || p.points) >= 1000000,
  },

  // More Fillers to reach "Immense" feel
  {
    id: "passo-1",
    title: t("items.passo-1.title"),
    description: t("items.passo-1.description"),
    icon: "🦶",
    condition: (p) => (p.totalXpEarned || p.points) >= 10,
  },
  {
    id: "passo-2",
    title: t("items.passo-2.title"),
    description: t("items.passo-2.description"),
    icon: "🦶",
    condition: (p) => (p.totalXpEarned || p.points) >= 20,
  },
  {
    id: "passo-3",
    title: t("items.passo-3.title"),
    description: t("items.passo-3.description"),
    icon: "🦶",
    condition: (p) => (p.totalXpEarned || p.points) >= 30,
  },
  {
    id: "passo-4",
    title: t("items.passo-4.title"),
    description: t("items.passo-4.description"),
    icon: "🦶",
    condition: (p) => (p.totalXpEarned || p.points) >= 40,
  },
  {
    id: "maratona",
    title: t("items.maratona.title"),
    description: t("items.maratona.description"),
    icon: "🏃",
    condition: (p) => (p.totalXpEarned || p.points) >= 42000,
  },
  {
    id: "monte-everest",
    title: t("items.monte-everest.title"),
    description: t("items.monte-everest.description"),
    icon: "🏔️",
    condition: (p) => (p.totalXpEarned || p.points) >= 8848,
  },
  {
    id: "profundezas",
    title: t("items.profundezas.title"),
    description: t("items.profundezas.description"),
    icon: "🌊",
    condition: (p) => (p.totalXpEarned || p.points) >= 11000,
  },

  // Elements
  {
    id: "agua",
    title: t("items.agua.title"),
    description: t("items.agua.description"),
    icon: "💧",
    condition: (p) => p.longestStreak >= 4,
  },
  {
    id: "terra",
    title: t("items.terra.title"),
    description: t("items.terra.description"),
    icon: "🌱",
    condition: (p) => p.longestStreak >= 8,
  },
  {
    id: "ar",
    title: t("items.ar.title"),
    description: t("items.ar.description"),
    icon: "💨",
    condition: (p) => p.longestStreak >= 12,
  },
  {
    id: "fogo",
    title: t("items.fogo.title"),
    description: t("items.fogo.description"),
    icon: "🔥",
    condition: (p) => p.longestStreak >= 16,
  },
  {
    id: "eter",
    title: t("items.eter.title"),
    description: t("items.eter.description"),
    icon: "✨",
    condition: (p) => p.longestStreak >= 20,
  },
];

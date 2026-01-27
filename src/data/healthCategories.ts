export interface HealthCategory {
  id: string;
  title: string;
  icon: string;
  positiveDescription: string;
  negativeDescription: string;
}

export const healthCategories: HealthCategory[] = [
  {
    id: "delivering-value",
    title: "Entregando Valor",
    icon: "🏆",
    positiveDescription: "¡Entregamos cosas increíbles! Estamos orgullosos y nuestros stakeholders están muy contentos.",
    negativeDescription: "Entregamos cosas mediocres. Nos da vergüenza entregarlas y nuestros stakeholders no están satisfechos."
  },
  {
    id: "easy-to-release",
    title: "Facilidad de Entrega",
    icon: "📦",
    positiveDescription: "Liberar es simple, seguro, sin dolor y mayormente automatizado.",
    negativeDescription: "Liberar es riesgoso, doloroso, requiere mucho trabajo manual y toma una eternidad."
  },
  {
    id: "fun",
    title: "Diversión",
    icon: "🎉",
    positiveDescription: "¡Nos encanta venir a trabajar y nos divertimos mucho trabajando juntos!",
    negativeDescription: "Aburriiiiido... No disfrutamos el trabajo ni el ambiente."
  },
  {
    id: "health-of-codebase",
    title: "Salud del Código",
    icon: "💻",
    positiveDescription: "¡Estamos orgullosos de nuestro código! Es limpio, fácil de leer y tiene buena cobertura de tests.",
    negativeDescription: "Nuestro código es un desastre. La deuda técnica está fuera de control."
  },
  {
    id: "learning",
    title: "Aprendizaje",
    icon: "📚",
    positiveDescription: "¡Estamos aprendiendo cosas interesantes todo el tiempo!",
    negativeDescription: "Nunca tenemos tiempo para aprender nada nuevo."
  },
  {
    id: "mission",
    title: "Misión",
    icon: "🎯",
    positiveDescription: "Sabemos exactamente por qué estamos aquí y ¡estamos muy emocionados al respecto!",
    negativeDescription: "No tenemos idea de por qué estamos aquí. No hay visión clara ni enfoque."
  },
  {
    id: "pawns-or-players",
    title: "Peones o Jugadores",
    icon: "♟️",
    positiveDescription: "Tenemos el control de nuestro destino. Decidimos qué construir y cómo hacerlo.",
    negativeDescription: "Somos solo peones sin influencia sobre lo que construimos o cómo lo hacemos."
  },
  {
    id: "speed",
    title: "Velocidad",
    icon: "⚡",
    positiveDescription: "¡Terminamos las cosas muy rápido! Sin esperas ni retrasos.",
    negativeDescription: "Nunca logramos terminar nada. Siempre nos quedamos bloqueados por dependencias."
  }
];

export type VoteValue = "green" | "yellow" | "red" | null;

export interface TeamVote {
  categoryId: string;
  vote: VoteValue;
  trend?: "up" | "down" | "same";
}

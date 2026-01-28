export interface HealthCategory {
  id: string;
  title: string;
  icon: string;
  positiveDescription: string;
  negativeDescription: string;
  tips?: string[];
}

export const healthCategories: HealthCategory[] = [
  {
    id: "delivering-value",
    title: "Entregando Valor",
    icon: "🏆",
    positiveDescription: "¡Entregamos cosas increíbles! Estamos orgullosos y nuestros stakeholders están muy contentos.",
    negativeDescription: "Entregamos cosas mediocres. Nos da vergüenza entregarlas y nuestros stakeholders no están satisfechos.",
    tips: [
      "Organizar sesiones de revisión con stakeholders para alinear expectativas",
      "Implementar una Definition of Done más estricta y métricas de calidad",
      "Establecer criterios de aceptación claros antes de cada sprint",
      "Realizar demos frecuentes para obtener feedback temprano"
    ]
  },
  {
    id: "easy-to-release",
    title: "Facilidad de Entrega",
    icon: "📦",
    positiveDescription: "Liberar es simple, seguro, sin dolor y mayormente automatizado.",
    negativeDescription: "Liberar es riesgoso, doloroso, requiere mucho trabajo manual y toma una eternidad.",
    tips: [
      "Invertir en automatización de CI/CD",
      "Crear un pipeline de deployment robusto y documentado",
      "Realizar dry-runs regulares del proceso de release",
      "Implementar feature flags para deploys más seguros"
    ]
  },
  {
    id: "fun",
    title: "Diversión",
    icon: "🎉",
    positiveDescription: "¡Nos encanta venir a trabajar y nos divertimos mucho trabajando juntos!",
    negativeDescription: "Aburriiiiido... No disfrutamos el trabajo ni el ambiente.",
    tips: [
      "Planificar actividades de team building regulares",
      "Celebrar logros y milestones del equipo",
      "Revisar la carga de trabajo y distribuirla equitativamente",
      "Crear espacios para la creatividad e innovación",
      "Rotar tareas para evitar monotonía"
    ]
  },
  {
    id: "health-of-codebase",
    title: "Salud del Código",
    icon: "💻",
    positiveDescription: "¡Estamos orgullosos de nuestro código! Es limpio, fácil de leer y tiene buena cobertura de tests.",
    negativeDescription: "Nuestro código es un desastre. La deuda técnica está fuera de control.",
    tips: [
      "Agendar sesiones de refactoring técnico dedicadas",
      "Implementar code reviews rigurosos",
      "Aumentar cobertura de tests unitarios y de integración",
      "Establecer y documentar estándares de código",
      "Usar herramientas de análisis estático (linters, SonarQube)"
    ]
  },
  {
    id: "learning",
    title: "Aprendizaje",
    icon: "📚",
    positiveDescription: "¡Estamos aprendiendo cosas interesantes todo el tiempo!",
    negativeDescription: "Nunca tenemos tiempo para aprender nada nuevo.",
    tips: [
      "Establecer 'Innovation Time' semanal (10-20% del tiempo)",
      "Crear un presupuesto de capacitación para el equipo",
      "Asistir a conferencias y eventos técnicos",
      "Organizar sesiones de conocimiento compartido (brown bags)",
      "Fomentar la experimentación con nuevas tecnologías"
    ]
  },
  {
    id: "mission",
    title: "Misión",
    icon: "🎯",
    positiveDescription: "Sabemos exactamente por qué estamos aquí y ¡estamos muy emocionados al respecto!",
    negativeDescription: "No tenemos idea de por qué estamos aquí. No hay visión clara ni enfoque.",
    tips: [
      "Realizar workshop de visión y objetivos con todo el equipo",
      "Asegurar que el Product Owner comunique claramente el 'por qué'",
      "Crear un roadmap visible y accesible para todos",
      "Conectar cada tarea con el objetivo de negocio",
      "Revisar y refrescar la misión trimestralmente"
    ]
  },
  {
    id: "pawns-or-players",
    title: "Peones o Jugadores",
    icon: "♟️",
    positiveDescription: "Tenemos el control de nuestro destino. Decidimos qué construir y cómo hacerlo.",
    negativeDescription: "Somos solo peones sin influencia sobre lo que construimos o cómo lo hacemos.",
    tips: [
      "Aumentar la autonomía del equipo en decisiones técnicas",
      "Involucrar al equipo en la planificación y priorización",
      "Empoderar al equipo para proponer soluciones alternativas",
      "Crear espacios de decisión técnica del equipo",
      "Fomentar la propiedad colectiva del producto"
    ]
  },
  {
    id: "speed",
    title: "Velocidad",
    icon: "⚡",
    positiveDescription: "¡Terminamos las cosas muy rápido! Sin esperas ni retrasos.",
    negativeDescription: "Nunca logramos terminar nada. Siempre nos quedamos bloqueados por dependencias.",
    tips: [
      "Identificar y eliminar blockers recurrentes",
      "Mapear dependencias críticas y crear planes de mitigación",
      "Considerar pair programming para temas complejos",
      "Reducir el work in progress (WIP)",
      "Mejorar la comunicación entre equipos dependientes"
    ]
  },
  {
    id: "suitable-process",
    title: "Proceso Adecuado",
    icon: "🔄",
    positiveDescription: "Nuestro proceso nos ayuda a ser efectivos. Es flexible y se adapta a nuestras necesidades.",
    negativeDescription: "Nuestro proceso es burocrático y nos frena. No aporta valor real al equipo.",
    tips: [
      "Realizar retrospectiva enfocada en procesos y ceremonias",
      "Eliminar rituales que no aportan valor",
      "Adaptar frameworks ágiles a las necesidades del equipo",
      "Simplificar la documentación y reportes",
      "Medir el tiempo invertido en ceremonias vs. desarrollo"
    ]
  },
  {
    id: "support",
    title: "Apoyo",
    icon: "🤝",
    positiveDescription: "Siempre obtenemos el apoyo y ayuda que necesitamos cuando lo pedimos.",
    negativeDescription: "No recibimos el apoyo necesario. Nos sentimos abandonados y sin recursos.",
    tips: [
      "Escalar necesidades de recursos a management",
      "Crear un canal directo para solicitar ayuda",
      "Identificar mentores o coaches internos",
      "Documentar y comunicar obstáculos claramente",
      "Establecer SLAs de respuesta para solicitudes de soporte"
    ]
  },
  {
    id: "teamwork",
    title: "Trabajo en Equipo",
    icon: "👥",
    positiveDescription: "Somos un equipo cohesionado. Nos apoyamos mutuamente y colaboramos efectivamente.",
    negativeDescription: "Trabajamos en silos. Hay poca colaboración y comunicación entre nosotros.",
    tips: [
      "Implementar pair/mob programming regular",
      "Crear rituales de sincronización diaria efectivos",
      "Fomentar la transparencia y comunicación abierta",
      "Establecer normas de colaboración claras",
      "Realizar actividades de team building"
    ]
  }
];

export type VoteValue = "green" | "yellow" | "red" | null;

export interface TeamVote {
  categoryId: string;
  vote: VoteValue;
  trend?: "up" | "down" | "same";
}

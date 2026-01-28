import { healthCategories } from "@/data/healthCategories";

interface WelcomeScreenProps {
  onMultiplayer: () => void;
}

export const WelcomeScreen = ({ onMultiplayer }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="health-card p-8 text-center animate-bounce-in">
          {/* Logo/Icon */}
          <div className="mb-6">
            <span className="text-7xl block mb-4">🏥</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Team Health Check
            </h1>
            <p className="text-muted-foreground mt-2">
              Evaluación de Salud del Equipo
            </p>
          </div>

          {/* Description */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
            <h2 className="font-bold text-lg mb-2">¿Qué es esto?</h2>
            <p className="text-sm text-muted-foreground mb-3">
              El <strong>Squad Health Check</strong> es una metodología ágil
              creada por Spotify para evaluar la salud de un equipo en
              diferentes dimensiones.
            </p>
            <h2 className="font-bold text-lg mb-2">¿Cómo funciona?</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                ✅ Evalúa {healthCategories.length} dimensiones clave del equipo
              </li>
              <li>🚦 Vota usando el semáforo (verde/amarillo/rojo)</li>
              <li>📊 Genera un reporte visual automático</li>
            </ul>
          </div>

          {/* Multiplayer Button */}
          <button
            type="button"
            onClick={onMultiplayer}
            className="w-full py-4 bg-secondary text-secondary-foreground font-bold text-lg rounded-xl
                     hover:bg-secondary/80 transition-all hover:scale-[1.02] active:scale-[0.98]
                     flex items-center justify-center gap-2"
          >
            Empezar
          </button>

          {/* Footer */}
          <p className="mt-6 text-xs text-muted-foreground">
            Basado en la metodología de Spotify Squad Health Check
          </p>
        </div>
      </div>
    </div>
  );
};

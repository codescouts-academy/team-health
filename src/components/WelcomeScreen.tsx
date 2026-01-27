import { useState } from "react";

interface WelcomeScreenProps {
  onStart: (teamName: string) => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      onStart(teamName.trim());
    }
  };

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
              El <strong>Squad Health Check</strong> es una metodología ágil creada
              por Spotify para evaluar la salud de un equipo en diferentes
              dimensiones.
            </p>
            <h2 className="font-bold text-lg mb-2">¿Cómo funciona?</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Evalúa 8 dimensiones clave del equipo</li>
              <li>🚦 Vota usando el semáforo (verde/amarillo/rojo)</li>
              <li>📊 Genera un reporte visual automático</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="teamName"
                className="block text-left font-semibold mb-2"
              >
                Nombre del Equipo
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ej: Equipo Innovación"
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background
                         focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                         transition-all text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!teamName.trim()}
              className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl
                       hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              🚀 Comenzar Evaluación
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-xs text-muted-foreground">
            Basado en la metodología de Spotify Squad Health Check
          </p>
        </div>
      </div>
    </div>
  );
};

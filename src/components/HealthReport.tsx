import { healthCategories, TeamVote, VoteValue } from "@/data/healthCategories";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface HealthReportProps {
  votes: TeamVote[];
  teamName: string;
  onReset: () => void;
}

const voteToScore = (vote: VoteValue): number => {
  if (vote === "green") return 3;
  if (vote === "yellow") return 2;
  if (vote === "red") return 1;
  return 0;
};

const getScoreColor = (score: number): string => {
  if (score >= 2.5) return "text-success";
  if (score >= 1.5) return "text-warning";
  return "text-danger";
};

const getScoreEmoji = (vote: VoteValue): string => {
  if (vote === "green") return "🟢";
  if (vote === "yellow") return "🟡";
  if (vote === "red") return "🔴";
  return "⚪";
};

export const HealthReport = ({ votes, teamName, onReset }: HealthReportProps) => {
  const chartData = healthCategories.map((category) => {
    const vote = votes.find((v) => v.categoryId === category.id);
    return {
      category: category.title,
      score: voteToScore(vote?.vote || null),
      fullMark: 3,
    };
  });

  const averageScore =
    votes.reduce((acc, v) => acc + voteToScore(v.vote), 0) / votes.length;

  const greenCount = votes.filter((v) => v.vote === "green").length;
  const yellowCount = votes.filter((v) => v.vote === "yellow").length;
  const redCount = votes.filter((v) => v.vote === "red").length;

  const getOverallHealth = () => {
    if (averageScore >= 2.5) return { label: "Excelente", emoji: "🌟", color: "text-success" };
    if (averageScore >= 2) return { label: "Buena", emoji: "👍", color: "text-success" };
    if (averageScore >= 1.5) return { label: "Regular", emoji: "⚠️", color: "text-warning" };
    return { label: "Necesita Atención", emoji: "🚨", color: "text-danger" };
  };

  const overallHealth = getOverallHealth();

  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            📊 Reporte de Salud del Equipo
          </h1>
          <p className="text-muted-foreground">Squad Health Check - Metodología Ágil</p>
          <div className="mt-4 inline-block bg-primary/10 px-4 py-2 rounded-full">
            <span className="font-bold text-primary">{teamName}</span>
            <span className="text-muted-foreground ml-2">• {currentDate}</span>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="health-card p-6 mb-8 text-center animate-bounce-in">
          <h2 className="text-xl font-bold mb-4">Salud General del Equipo</h2>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl">{overallHealth.emoji}</span>
            <div>
              <p className={cn("text-4xl font-extrabold", overallHealth.color)}>
                {overallHealth.label}
              </p>
              <p className="text-muted-foreground">
                Puntuación: {averageScore.toFixed(1)} / 3.0
              </p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{greenCount}</div>
              <div className="text-sm text-muted-foreground">🟢 Excelente</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">{yellowCount}</div>
              <div className="text-sm text-muted-foreground">🟡 Regular</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-danger">{redCount}</div>
              <div className="text-sm text-muted-foreground">🔴 Mejorar</div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="health-card p-6 mb-8">
          <h2 className="text-xl font-bold text-center mb-4">
            🎯 Gráfico de Radar
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 3]}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Radar
                  name="Salud"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="health-card p-6 mb-8">
          <h2 className="text-xl font-bold text-center mb-6">
            📋 Resultados Detallados
          </h2>
          <div className="grid gap-4">
            {healthCategories.map((category) => {
              const vote = votes.find((v) => v.categoryId === category.id);
              const score = voteToScore(vote?.vote || null);
              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-semibold">{category.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getScoreEmoji(vote?.vote || null)}</span>
                    <span className={cn("font-bold", getScoreColor(score))}>
                      {vote?.vote === "green"
                        ? "Excelente"
                        : vote?.vote === "yellow"
                        ? "Regular"
                        : "Mejorar"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Items */}
        <div className="health-card p-6 mb-8">
          <h2 className="text-xl font-bold text-center mb-4">
            🚀 Áreas de Enfoque Sugeridas
          </h2>
          {redCount > 0 ? (
            <div className="space-y-3">
              {votes
                .filter((v) => v.vote === "red")
                .map((vote) => {
                  const category = healthCategories.find(
                    (c) => c.id === vote.categoryId
                  );
                  return (
                    <div
                      key={vote.categoryId}
                      className="p-4 bg-danger/10 border border-danger/20 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{category?.icon}</span>
                        <span className="font-bold text-danger">
                          {category?.title}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70">
                        💡 Sugerencia: Programar una retrospectiva específica para
                        abordar este tema con el equipo.
                      </p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-5xl">🎉</span>
              <p className="mt-4 text-lg font-semibold text-success">
                ¡Excelente! No hay áreas críticas que requieran atención inmediata.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl
                       hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          >
            🔄 Nueva Evaluación
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-xl
                       hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
          >
            🖨️ Imprimir Reporte
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-muted-foreground text-sm">
          <p>Squad Health Check basado en la metodología de Spotify</p>
          <p>Generado con Team Health Check App</p>
        </div>
      </div>
    </div>
  );
};

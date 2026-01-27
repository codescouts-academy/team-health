import { useState } from "react";
import { healthCategories, TeamVote, VoteValue } from "@/data/healthCategories";
import { HealthCard } from "./HealthCard";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

interface HealthEvaluationProps {
  teamName: string;
  onComplete: (votes: TeamVote[]) => void;
  onBack: () => void;
}

export const HealthEvaluation = ({
  teamName,
  onComplete,
  onBack,
}: HealthEvaluationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<TeamVote[]>([]);

  const currentCategory = healthCategories[currentIndex];
  const currentVote = votes.find((v) => v.categoryId === currentCategory.id);
  const votedCount = votes.length;
  const isLastCategory = currentIndex === healthCategories.length - 1;
  const allVoted = votes.length === healthCategories.length;

  const handleVote = (vote: VoteValue) => {
    setVotes((prev) => {
      const existing = prev.find((v) => v.categoryId === currentCategory.id);
      if (existing) {
        return prev.map((v) =>
          v.categoryId === currentCategory.id ? { ...v, vote } : v
        );
      }
      return [...prev, { categoryId: currentCategory.id, vote }];
    });
  };

  const handleNext = () => {
    if (currentIndex < healthCategories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (allVoted) {
      onComplete(votes);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <button
            onClick={onBack}
            className="absolute left-4 top-4 md:left-8 md:top-8 text-muted-foreground 
                     hover:text-foreground transition-colors"
          >
            ← Volver
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
            🏥 Evaluación de Salud
          </h1>
          <p className="text-primary font-semibold mt-1">{teamName}</p>
        </div>

        {/* Progress */}
        <ProgressBar current={votedCount} total={healthCategories.length} />

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {healthCategories.map((category, index) => {
            const categoryVote = votes.find((v) => v.categoryId === category.id);
            const isVoted = !!categoryVote?.vote;
            const isCurrent = index === currentIndex;

            return (
              <button
                key={category.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "px-3 py-2 rounded-full text-sm font-semibold transition-all",
                  isCurrent && "bg-primary text-primary-foreground scale-110",
                  !isCurrent && isVoted && "bg-success/20 text-success border border-success/30",
                  !isCurrent && !isVoted && "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <span className="mr-1">{category.icon}</span>
                <span className="hidden md:inline">{category.title}</span>
              </button>
            );
          })}
        </div>

        {/* Current Card */}
        <div className="max-w-md mx-auto mb-8">
          <HealthCard
            key={currentCategory.id}
            category={currentCategory}
            vote={currentVote?.vote || null}
            onVote={handleVote}
            isActive={true}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-muted text-foreground font-semibold rounded-xl
                     hover:bg-muted/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          {!isLastCategory ? (
            <button
              onClick={handleNext}
              disabled={!currentVote}
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl
                       hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!allVoted}
              className={cn(
                "px-8 py-3 font-bold rounded-xl transition-all",
                allVoted
                  ? "bg-success text-success-foreground hover:bg-success/90 animate-pulse-slow"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {allVoted ? "📊 Ver Reporte" : `Faltan ${healthCategories.length - votedCount} votos`}
            </button>
          )}
        </div>

        {/* Quick vote summary */}
        <div className="mt-8 text-center">
          <div className="inline-flex gap-6 bg-muted/50 px-6 py-3 rounded-full">
            <span className="flex items-center gap-1">
              <span className="text-success text-lg">●</span>
              <span className="text-sm font-medium">
                {votes.filter((v) => v.vote === "green").length}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-warning text-lg">●</span>
              <span className="text-sm font-medium">
                {votes.filter((v) => v.vote === "yellow").length}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-danger text-lg">●</span>
              <span className="text-sm font-medium">
                {votes.filter((v) => v.vote === "red").length}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

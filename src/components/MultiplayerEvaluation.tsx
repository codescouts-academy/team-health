import { useState, useEffect } from "react";
import { healthCategories, VoteValue } from "@/data/healthCategories";
import { HealthCard } from "./HealthCard";
import { ProgressBar } from "./ProgressBar";
import { Room, Participant } from "@/types/room";
import { cn } from "@/lib/utils";

interface MultiplayerEvaluationProps {
  room: Room;
  currentParticipant: Participant;
  isConnected: boolean;
  onVote: (categoryId: string, vote: VoteValue) => Promise<boolean>;
  onComplete: () => void;
  onLeave: () => void;
}

export const MultiplayerEvaluation = ({
  room,
  currentParticipant,
  isConnected,
  onVote,
  onComplete,
  onLeave,
}: MultiplayerEvaluationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCategory = healthCategories[currentIndex];

  // Get current participant's votes
  const myVotes = room.votes.filter(
    (v) => v.odataidPtant === currentParticipant.id,
  );
  const myCurrentVote = myVotes.find(
    (v) => v.categoryId === currentCategory.id,
  );
  const allMyVotesComplete = myVotes.length === healthCategories.length;

  // Get vote counts per category for live feedback
  const getCategoryVoteStats = (categoryId: string) => {
    const categoryVotes = room.votes.filter((v) => v.categoryId === categoryId);
    return {
      total: categoryVotes.length,
      green: categoryVotes.filter((v) => v.vote === "green").length,
      yellow: categoryVotes.filter((v) => v.vote === "yellow").length,
      red: categoryVotes.filter((v) => v.vote === "red").length,
    };
  };

  const handleVote = async (vote: VoteValue) => {
    const success = await onVote(currentCategory.id, vote);
    if (success) handleNext();

    return success;
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

  // Check if all participants have voted on all categories
  const allParticipantsComplete = room.participants.every((p) => {
    const participantVotes = room.votes.filter((v) => v.odataidPtant === p.id);
    return participantVotes.length === healthCategories.length;
  });

  useEffect(() => {
    // Solo ejecutar si todos completaron Y el status aún no es "completed"
    if (allParticipantsComplete && room.status !== "completed") {
      onComplete();
    }
  }, [allParticipantsComplete, room.status, onComplete]);

  const currentStats = getCategoryVoteStats(currentCategory.id);
  const isLastCategory = currentIndex === healthCategories.length - 1;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onLeave}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Salir
            </button>
            <div
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2",
                isConnected
                  ? "bg-success/20 text-success"
                  : "bg-warning/20 text-warning",
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-success" : "bg-warning",
                )}
              />
              {room.participants.length} en línea
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
            🏥 {room.teamName}
          </h1>
          <p className="text-muted-foreground text-sm">Sala: {room.code}</p>
        </div>

        {/* Progress */}
        <ProgressBar current={myVotes.length} total={healthCategories.length} />

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {healthCategories.map((category, index) => {
            const myVote = myVotes.find((v) => v.categoryId === category.id);
            const stats = getCategoryVoteStats(category.id);
            const isCurrent = index === currentIndex;

            return (
              <button
                key={category.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "px-3 py-2 rounded-full text-sm font-semibold transition-all relative",
                  isCurrent && "bg-primary text-primary-foreground scale-110",
                  !isCurrent &&
                    myVote &&
                    "bg-success/20 text-success border border-success/30",
                  !isCurrent &&
                    !myVote &&
                    "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                <span className="mr-1">{category.icon}</span>
                {stats.total > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground 
                                 rounded-full text-xs flex items-center justify-center"
                  >
                    {stats.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Vote Stats */}
        <div className="flex justify-center gap-4 mb-4 animate-slide-up">
          <div className="bg-muted/50 px-4 py-2 rounded-full flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Votos:</span>
            <span className="flex items-center gap-1">
              <span className="text-success">●</span> {currentStats?.green}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-warning">●</span> {currentStats?.yellow}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-danger">●</span> {currentStats?.red}
            </span>
          </div>
        </div>

        {/* Current Card */}
        <div className="max-w-md mx-auto mb-8">
          <HealthCard
            category={currentCategory}
            vote={myCurrentVote?.vote || null}
            onVote={handleVote}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "px-6 py-3 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-all disabled:opacity-40",
              {
                hidden: currentIndex === 0,
              },
            )}
          >
            ← Anterior
          </button>

          {!isLastCategory ? (
            <></>
          ) : (
            <div className="px-6 py-3 text-center">
              {allMyVotesComplete ? (
                <span className="text-success font-semibold animate-pulse">
                  ✓ ¡Votación completa! Esperando a otros...
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Faltan {healthCategories.length - myVotes.length} votos
                </span>
              )}
            </div>
          )}
        </div>

        {/* Participant Progress */}
        <div className="mt-8 bg-card rounded-2xl p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3 text-sm">
            Progreso del Equipo
          </h3>
          <div className="space-y-2">
            {room.participants.map((p) => {
              const pVotes = room.votes.filter((v) => v.odataidPtant === p.id);
              const progress = (pVotes.length / healthCategories.length) * 100;

              return (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-sm w-20 truncate text-muted-foreground">
                    {p.name}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        progress === 100 ? "bg-success" : "bg-primary",
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {pVotes.length}/{healthCategories.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import { HealthCategory, VoteValue } from "@/data/healthCategories";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HealthCardProps {
  category: HealthCategory;
  vote: VoteValue;
  onVote: (vote: VoteValue) => Promise<boolean>;
}

export const HealthCard = ({ category, vote, onVote }: HealthCardProps) => {
  const [canVote, setCanVote] = useState(true);

  const handleVote = async (voteValue: VoteValue) => {
    if (!canVote) return;

    setCanVote(false);

    try {
      const result = await onVote(voteValue);

      setCanVote(result);
    } catch {
      setCanVote(true);
    }
  };

  return (
    <div className="health-card p-6 flex flex-col h-[26rem] w-full select-none">
      {/* Header */}
      <div className="text-center mb-4">
        <span className="text-5xl mb-3 block">{category.icon}</span>
        <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
      </div>

      {/* Descriptions */}
      <div className="flex-1 space-y-4 mb-6">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
          <span className="text-xl">🟢</span>
          <p className="text-sm text-foreground/80">
            {category.positiveDescription}
          </p>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-lg bg-danger/10 border border-danger/20">
          <span className="text-xl">🔴</span>
          <p className="text-sm text-foreground/80">
            {category.negativeDescription}
          </p>
        </div>
      </div>

      {/* Traffic Light Voting */}
      <div
        className={cn("flex justify-center gap-4", {
          "opacity-50 pointer-events-none": !canVote,
        })}
      >
        <button
          onClick={() => handleVote("green")}
          className={cn(
            "traffic-light-btn traffic-green",
            vote === "green" && "selected-ring",
          )}
          aria-label="Excelente"
        >
          😄
        </button>
        <button
          onClick={() => handleVote("yellow")}
          className={cn(
            "traffic-light-btn traffic-yellow",
            vote === "yellow" && "selected-ring",
          )}
          aria-label="Regular"
        >
          😐
        </button>
        <button
          onClick={() => handleVote("red")}
          className={cn(
            "traffic-light-btn traffic-red",
            vote === "red" && "selected-ring",
          )}
          aria-label="Necesita mejorar"
        >
          😟
        </button>
      </div>

      {/* Vote status */}
      {vote && (
        <p className="text-center mt-4 text-sm text-muted-foreground animate-slide-up">
          ✓ Votado:{" "}
          {vote === "green"
            ? "Excelente"
            : vote === "yellow"
              ? "Regular"
              : "Necesita mejorar"}
        </p>
      )}
    </div>
  );
};

import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { HealthEvaluation } from "@/components/HealthEvaluation";
import { HealthReport } from "@/components/HealthReport";
import { TeamVote } from "@/data/healthCategories";

type AppState = "welcome" | "evaluation" | "report";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [teamName, setTeamName] = useState("");
  const [votes, setVotes] = useState<TeamVote[]>([]);

  const handleStart = (name: string) => {
    setTeamName(name);
    setAppState("evaluation");
  };

  const handleComplete = (completedVotes: TeamVote[]) => {
    setVotes(completedVotes);
    setAppState("report");
  };

  const handleReset = () => {
    setTeamName("");
    setVotes([]);
    setAppState("welcome");
  };

  const handleBack = () => {
    setAppState("welcome");
  };

  return (
    <>
      {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {appState === "evaluation" && (
        <HealthEvaluation
          teamName={teamName}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      )}
      {appState === "report" && (
        <HealthReport votes={votes} teamName={teamName} onReset={handleReset} />
      )}
    </>
  );
};

export default Index;

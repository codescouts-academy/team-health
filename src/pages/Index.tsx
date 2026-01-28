"use client";

import { useEffect, useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { HealthEvaluation } from "@/components/HealthEvaluation";
import { HealthReport } from "@/components/HealthReport";
import { RoomLobby } from "@/components/RoomLobby";
import { RoomWaiting } from "@/components/RoomWaiting";
import { MultiplayerEvaluation } from "@/components/MultiplayerEvaluation";
import { useRoom } from "@/hooks/useRoom";
import { TeamVote, healthCategories } from "@/data/healthCategories";
import { endpoints } from "@/config/api";

type AppState =
  | "welcome"
  | "evaluation"
  | "report"
  | "multiplayer-lobby"
  | "multiplayer-waiting"
  | "multiplayer-voting"
  | "multiplayer-report";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [teamName, setTeamName] = useState("");
  const [votes, setVotes] = useState<TeamVote[]>([]);

  const {
    room,
    currentParticipant,
    isLoading,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    submitVote,
  } = useRoom({
    onVotingCompleted: () => setAppState("multiplayer-report"),
  });

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

  const handleMultiplayer = () => {
    setAppState("multiplayer-lobby");
  };

  const handleCreateRoom = async (teamName: string, hostName: string) => {
    const code = await createRoom(teamName, hostName);
    if (code) {
      setAppState("multiplayer-waiting");
    }
    return code;
  };

  const handleJoinRoom = async (code: string, name: string) => {
    const success = await joinRoom(code, name);
    if (success) {
      setAppState("multiplayer-waiting");
    }
    return success;
  };

  const handleStartVoting = async () => {
    if (!room) return;
    try {
      await fetch(`${endpoints.createRoom}/${room.code}/start`, {
        method: "POST",
      });
      setAppState("multiplayer-voting");
    } catch (err) {
      console.error("Error starting voting:", err);
    }
  };

  const handleLeaveRoom = async () => {
    await leaveRoom();
    setAppState("welcome");
  };

  const handleMultiplayerComplete = () => {
    setAppState("multiplayer-report");
  };

  // Convert room votes to TeamVote format for report
  const getAggregatedVotes = (): TeamVote[] => {
    if (!room) return [];

    return healthCategories.map((category) => {
      const categoryVotes = room.votes.filter(
        (v) => v.categoryId === category.id,
      );
      const greenCount = categoryVotes.filter((v) => v.vote === "green").length;
      const yellowCount = categoryVotes.filter(
        (v) => v.vote === "yellow",
      ).length;
      const redCount = categoryVotes.filter((v) => v.vote === "red").length;

      // Determine majority vote
      let vote: "green" | "yellow" | "red" | null = null;
      const maxCount = Math.max(greenCount, yellowCount, redCount);
      if (maxCount > 0) {
        if (greenCount === maxCount) vote = "green";
        else if (yellowCount === maxCount) vote = "yellow";
        else vote = "red";
      }

      return { categoryId: category.id, vote };
    });
  };

  useEffect(() => {
    if (room?.status === "voting") {
      setAppState("multiplayer-voting");
    }
  }, [room?.status]);

  return (
    <>
      {appState === "welcome" && (
        <WelcomeScreen onMultiplayer={handleMultiplayer} />
      )}
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
      {appState === "multiplayer-lobby" && (
        <RoomLobby
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onBack={handleBack}
          isLoading={isLoading}
        />
      )}
      {appState === "multiplayer-waiting" && room && currentParticipant && (
        <RoomWaiting
          room={room}
          currentParticipant={currentParticipant}
          isConnected={isConnected}
          onStartVoting={handleStartVoting}
          onLeave={handleLeaveRoom}
        />
      )}
      {appState === "multiplayer-voting" && room && currentParticipant && (
        <MultiplayerEvaluation
          room={room}
          currentParticipant={currentParticipant}
          isConnected={isConnected}
          onVote={submitVote}
          onComplete={handleMultiplayerComplete}
          onLeave={handleLeaveRoom}
        />
      )}
      {appState === "multiplayer-report" && room && (
        <HealthReport
          votes={getAggregatedVotes()}
          teamName={room.teamName}
          onReset={handleReset}
          participantCount={room.participants.length}
        />
      )}
    </>
  );
};

export default Index;

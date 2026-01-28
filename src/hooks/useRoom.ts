import { useState, useCallback } from "react";
import { endpoints } from "@/config/api";
import { Room, Participant, RoomVote, SSEEvent, ParticipantJoinedData, VoteCastData } from "@/types/room";
import { useSSE } from "./useSSE";
import { VoteValue } from "@/data/healthCategories";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

interface UseRoomOptions {
  onVotingCompleted?: () => void;
}

export const useRoom = (options: UseRoomOptions = {}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSSEMessage = useCallback((event: SSEEvent) => {
    switch (event.type) {
      case "connected":
        console.log("Connected to room SSE");
        break;

      case "participant_joined": {
        const data = event.data as ParticipantJoinedData;
        setRoom(prev => prev ? {
          ...prev,
          participants: [...prev.participants.filter(p => p.id !== data.participant.id), data.participant]
        } : null);
        toast({
          title: "Nuevo participante",
          description: `${data.participant.name} se unió a la sala`,
          variant: "default",
        })
        break;
      }

      case "participant_left": {
        const data = event.data as { odataidPtant: string; participantName: string };
        setRoom(prev => prev ? {
          ...prev,
          participants: prev.participants.filter(p => p.id !== data.odataidPtant)
        } : null);
        toast({
          title: "Participante salió",
          description: `[${data.participantName}] salió de la sala`,
          variant: "default",
        });
        break;
      }

      case "vote_cast": {
        const data = event.data as VoteCastData;
        setRoom(prev => {
          if (!prev) return null;
          const existingVoteIndex = prev.votes.findIndex(
            v => v.odataidPtant === data.odataidPtant && v.categoryId === data.categoryId
          );
          const newVote: RoomVote = {
            ...data,
            timestamp: event.timestamp
          };

          if (existingVoteIndex >= 0) {
            const newVotes = [...prev.votes];
            newVotes[existingVoteIndex] = newVote;
            return { ...prev, votes: newVotes };
          }
          return { ...prev, votes: [...prev.votes, newVote] };
        });
        break;
      }

      case "voting_started":
        console.log("Voting started");
        setRoom(prev => prev ? { ...prev, status: "voting" } : null);
        toast({
          title: "Votación iniciada",
          description: "¡La votación ha comenzado!",
          variant: "default",
        });
        break;

      case "voting_completed":
        setRoom(prev => prev ? { ...prev, status: "completed" } : null);
        options.onVotingCompleted?.();
        break;

      case "room_closed":
        toast({
          title: "Sala cerrada",
          description: "La sala ha sido cerrada",
          variant: "destructive",
        });
        setRoom(null);
        break;
    }
  }, [options]);

  const { isConnected, connectionError, reconnect } = useSSE({
    url: room ? endpoints.roomEvents(room.code) : "",
    onMessage: handleSSEMessage,
    enabled: !!room,
  });

  const createRoom = useCallback(async (teamName: string, hostName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.createRoom, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, hostName }),
      });

      if (!response.ok) throw new Error("Failed to create room");

      const data = await response.json();
      setRoom(data.room);
      setCurrentParticipant(data.participant);
      return data.room.code;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear la sala";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinRoom = useCallback(async (code: string, participantName: string): Promise<Room | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.joinRoom(code), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantName }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Sala no encontrada");
        throw new Error("Error al unirse a la sala");
      }

      const data = await response.json();
      setRoom(data.room);
      setCurrentParticipant(data.participant);
      return data.room
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al unirse";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      return
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveRoom = useCallback(async () => {
    if (!room || !currentParticipant) return;

    try {
      await fetch(endpoints.leaveRoom(room.code), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odataidPtant: currentParticipant.id }),
      });
    } catch (err) {
      console.error("Error leaving room:", err);
    } finally {
      setRoom(null);
      setCurrentParticipant(null);
    }
  }, [room, currentParticipant]);

  const submitVote = useCallback(async (categoryId: string, vote: VoteValue) => {
    if (!room || !currentParticipant) return false;

    try {
      const response = await fetch(endpoints.submitVote(room.code), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          odataidPtant: currentParticipant.id,
          categoryId,
          vote,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit vote");
      return true;
    } catch {
      toast({
        title: "Error",
        description: "Error al enviar voto",
        variant: "destructive",
      });
      return false;
    }
  }, [room, currentParticipant]);

  return {
    room,
    currentParticipant,
    isLoading,
    error,
    isConnected,
    connectionError,
    createRoom,
    joinRoom,
    leaveRoom,
    submitVote,
    reconnect,
  };
};

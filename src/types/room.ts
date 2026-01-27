import { VoteValue } from "@/data/healthCategories";

export interface Participant {
  id: string;
  name: string;
  joinedAt: string;
}

export interface RoomVote {
  odataidPtant: string;
  participantName: string;
  categoryId: string;
  vote: VoteValue;
  timestamp: string;
}

export interface Room {
  code: string;
  teamName: string;
  hostId: string;
  participants: Participant[];
  votes: RoomVote[];
  status: "waiting" | "voting" | "completed";
  createdAt: string;
}

// SSE Event types
export type SSEEventType = 
  | "connected"
  | "participant_joined"
  | "participant_left"
  | "vote_cast"
  | "voting_started"
  | "voting_completed"
  | "room_closed";

export interface SSEEvent<T = unknown> {
  type: SSEEventType;
  data: T;
  timestamp: string;
}

export interface ParticipantJoinedData {
  participant: Participant;
  totalParticipants: number;
}

export interface VoteCastData {
  odataidPtant: string;
  participantName: string;
  categoryId: string;
  vote: VoteValue;
}

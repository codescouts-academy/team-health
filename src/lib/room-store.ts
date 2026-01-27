import { Room, Participant, RoomVote, SSEEvent } from "@/types/room";

type VoteValue = "green" | "yellow" | "red";

// Store en memoria para las salas
class RoomStore {
  private rooms: Map<string, Room> = new Map();
  private sseClients: Map<string, Set<(event: SSEEvent<any>) => void>> = new Map();

  // Generar código de sala único
  generateRoomCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code: string;
    do {
      code = Array.from(
        { length: 6 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    } while (this.rooms.has(code));
    return code;
  }

  // Crear una nueva sala
  createRoom(teamName: string, hostName: string): { room: Room; participant: Participant } {
    const code = this.generateRoomCode();
    const participantId = this.generateId();

    const participant: Participant = {
      id: participantId,
      name: hostName,
      joinedAt: new Date().toISOString(),
    };

    const room: Room = {
      code,
      teamName,
      hostId: participantId,
      participants: [participant],
      votes: [],
      status: "waiting",
      createdAt: new Date().toISOString(),
    };

    this.rooms.set(code, room);
    this.sseClients.set(code, new Set());

    return { room, participant };
  }

  // Obtener una sala por código
  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  // Unirse a una sala
  joinRoom(code: string, participantName: string): { room: Room; participant: Participant } | null {
    const room = this.rooms.get(code);
    if (!room || room.status !== "waiting") return null;

    const participant: Participant = {
      id: this.generateId(),
      name: participantName,
      joinedAt: new Date().toISOString(),
    };

    room.participants.push(participant);
    this.rooms.set(code, room);

    // Emitir evento SSE
    this.emitEvent(code, {
      type: "participant_joined",
      data: {
        participant,
        totalParticipants: room.participants.length,
      },
      timestamp: new Date().toISOString(),
    });

    return { room, participant };
  }

  // Salir de una sala
  leaveRoom(code: string, participantId: string): boolean {
    const room = this.rooms.get(code);
    if (!room) return false;

    const participant = room.participants.find(p => p.id === participantId);
    if (!participant) return false;

    room.participants = room.participants.filter(p => p.id !== participantId);
    room.votes = room.votes.filter(v => v.odataidPtant !== participantId);

    // Si era el host y quedan participantes, asignar nuevo host
    if (room.hostId === participantId && room.participants.length > 0) {
      room.hostId = room.participants[0].id;
    }

    // Si no quedan participantes, eliminar la sala
    if (room.participants.length === 0) {
      this.emitEvent(code, {
        type: "room_closed",
        data: {},
        timestamp: new Date().toISOString(),
      });
      this.rooms.delete(code);
      this.sseClients.delete(code);
      return true;
    }

    this.rooms.set(code, room);

    // Emitir evento SSE
    this.emitEvent(code, {
      type: "participant_left",
      data: {
        odataidPtant: participantId,
        participantName: participant.name,
      },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  // Registrar un voto
  submitVote(code: string, participantId: string, categoryId: string, vote: VoteValue): boolean {
    const room = this.rooms.get(code);
    if (!room || room.status !== "voting") return false;

    const participant = room.participants.find(p => p.id === participantId);
    if (!participant) return false;

    // Actualizar o agregar voto
    const existingVoteIndex = room.votes.findIndex(
      v => v.odataidPtant === participantId && v.categoryId === categoryId
    );

    const newVote: RoomVote = {
      odataidPtant: participantId,
      participantName: participant.name,
      categoryId,
      vote,
      timestamp: new Date().toISOString(),
    };

    if (existingVoteIndex >= 0) {
      room.votes[existingVoteIndex] = newVote;
    } else {
      room.votes.push(newVote);
    }

    this.rooms.set(code, room);

    // Emitir evento SSE
    this.emitEvent(code, {
      type: "vote_cast",
      data: {
        odataidPtant: participantId,
        participantName: participant.name,
        categoryId,
        vote,
      },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  // Iniciar votación
  startVoting(code: string, hostId: string): boolean {
    const room = this.rooms.get(code);
    if (!room || room.hostId !== hostId || room.status !== "waiting") return false;

    room.status = "voting";
    this.rooms.set(code, room);

    // Emitir evento SSE
    this.emitEvent(code, {
      type: "voting_started",
      data: {},
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  // Completar votación
  completeVoting(code: string): boolean {
    const room = this.rooms.get(code);
    if (!room || room.status !== "voting") return false;

    room.status = "completed";
    this.rooms.set(code, room);

    // Emitir evento SSE
    this.emitEvent(code, {
      type: "voting_completed",
      data: {},
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  // Registrar cliente SSE
  registerSSEClient(code: string, callback: (event: SSEEvent<any>) => void): () => void {
    let clients = this.sseClients.get(code);
    if (!clients) {
      clients = new Set();
      this.sseClients.set(code, clients);
    }
    clients.add(callback);

    // Enviar evento de conexión
    callback({
      type: "connected",
      data: { message: "Conectado a la sala" },
      timestamp: new Date().toISOString(),
    });

    // Retornar función de limpieza
    return () => {
      const clients = this.sseClients.get(code);
      if (clients) {
        clients.delete(callback);
      }
    };
  }

  // Emitir evento a todos los clientes de una sala
  private emitEvent(code: string, event: SSEEvent<any>): void {
    const clients = this.sseClients.get(code);
    if (!clients) return;

    clients.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error("Error emitting SSE event:", error);
      }
    });
  }

  // Generar ID único
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Limpiar salas antiguas (opcional, para ejecutar periódicamente)
  cleanupOldRooms(maxAgeHours: number = 24): void {
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;

    for (const [code, room] of this.rooms.entries()) {
      const roomAge = now - new Date(room.createdAt).getTime();
      if (roomAge > maxAge) {
        this.emitEvent(code, {
          type: "room_closed",
          data: { reason: "Sala cerrada por inactividad" },
          timestamp: new Date().toISOString(),
        });
        this.rooms.delete(code);
        this.sseClients.delete(code);
      }
    }
  }
}

// Singleton instance
export const roomStore = new RoomStore();

// Limpiar salas antiguas cada hora
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    roomStore.cleanupOldRooms(24);
  }, 60 * 60 * 1000);
}

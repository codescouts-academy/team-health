import { Room, Participant } from "@/types/room";
import { cn } from "@/lib/utils";

interface RoomWaitingProps {
  room: Room;
  currentParticipant: Participant;
  isConnected: boolean;
  onStartVoting: () => void;
  onLeave: () => void;
}

export const RoomWaiting = ({
  room,
  currentParticipant,
  isConnected,
  onStartVoting,
  onLeave,
}: RoomWaitingProps) => {
  const isHost = room.hostId === currentParticipant.id;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-slide-up">
        {/* Connection Status */}
        <div className="flex justify-center">
          <div
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2",
              isConnected
                ? "bg-success/20 text-success"
                : "bg-warning/20 text-warning"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-success animate-pulse" : "bg-warning"
              )}
            />
            {isConnected ? "Conectado" : "Reconectando..."}
          </div>
        </div>

        {/* Room Info */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-2">Código de Sala</p>
          <div className="bg-muted rounded-2xl p-4 mb-4">
            <span className="text-4xl font-mono font-bold tracking-widest text-primary">
              {room.code}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{room.teamName}</h2>
        </div>

        {/* Participants */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>👥</span>
            Participantes ({room.participants.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {room.participants.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg",
                  p.id === currentParticipant.id && "bg-primary/10"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm">{p.name[0].toUpperCase()}</span>
                </div>
                <span className="font-medium text-foreground flex-1">
                  {p.name}
                  {p.id === currentParticipant.id && (
                    <span className="text-muted-foreground text-sm ml-2">(tú)</span>
                  )}
                </span>
                {p.id === room.hostId && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isHost ? (
            <button
              onClick={onStartVoting}
              disabled={room.participants.length < 1}
              className="w-full py-4 bg-success text-success-foreground rounded-xl
                       font-bold text-lg hover:bg-success/90 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Iniciar Votación
            </button>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <span className="animate-pulse">⏳</span> Esperando que el host inicie la votación...
            </div>
          )}

          <button
            onClick={onLeave}
            className="w-full py-3 text-muted-foreground hover:text-danger
                     transition-colors font-medium"
          >
            Salir de la Sala
          </button>
        </div>
      </div>
    </div>
  );
};

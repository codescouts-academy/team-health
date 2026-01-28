import { useState } from "react";
import { cn } from "@/lib/utils";

interface RoomLobbyProps {
  onCreateRoom: (teamName: string, hostName: string) => Promise<string | null>;
  onJoinRoom: (code: string, name: string) => Promise<boolean>;
  onBack: () => void;
  isLoading: boolean;
}

export const RoomLobby = ({
  onCreateRoom,
  onJoinRoom,
  onBack,
  isLoading,
}: RoomLobbyProps) => {
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [teamName, setTeamName] = useState("");
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = async () => {
    if (!teamName.trim() || !userName.trim()) return;
    await onCreateRoom(teamName.trim(), userName.trim());
  };

  const handleJoin = async () => {
    if (!roomCode.trim() || !userName.trim()) return;
    await onJoinRoom(roomCode.trim().toUpperCase(), userName.trim());
  };

  if (mode === "select") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 animate-slide-up">
          <div className="text-center">
            <span className="text-6xl mb-4 block">👥</span>
            <h1 className="text-3xl font-extrabold text-foreground mb-2">
              Modo Multijugador
            </h1>
            <p className="text-muted-foreground">
              Vota en equipo en tiempo real
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode("create")}
              className="w-full p-6 bg-primary text-primary-foreground rounded-2xl
                       font-bold text-lg hover:bg-primary/90 transition-all
                       flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🏠</span>
              Crear Sala
            </button>

            <button
              onClick={() => setMode("join")}
              className="w-full p-6 bg-secondary text-secondary-foreground rounded-2xl
                       font-bold text-lg hover:bg-secondary/80 transition-all
                       flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🚪</span>
              Unirse a Sala
            </button>

            <button
              onClick={onBack}
              className="w-full p-4 text-muted-foreground hover:text-foreground
                       transition-colors font-medium"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-slide-up">
        <button
          onClick={() => setMode("select")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Volver
        </button>

        <div className="text-center">
          <span className="text-5xl mb-4 block">
            {mode === "create" ? "🏠" : "🚪"}
          </span>
          <h2 className="text-2xl font-bold text-foreground">
            {mode === "create" ? "Crear Nueva Sala" : "Unirse a Sala"}
          </h2>
        </div>

        <div className="space-y-4">
          {mode === "create" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre del Equipo
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ej: Squad Alpha"
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl
                         text-foreground placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {mode === "join" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Código de Sala
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                maxLength={6}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl
                         text-foreground placeholder:text-muted-foreground text-center
                         text-2xl font-mono tracking-widest uppercase
                         focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  mode === "create" ? handleCreate() : handleJoin();
                }
              }}
              placeholder="Ej: María"
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={mode === "create" ? handleCreate : handleJoin}
            disabled={
              isLoading ||
              !userName.trim() ||
              (mode === "create" ? !teamName.trim() : !roomCode.trim())
            }
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Conectando...
              </span>
            ) : mode === "create" ? (
              "Crear Sala"
            ) : (
              "Unirse"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

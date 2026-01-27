import { useEffect, useRef, useCallback, useState } from "react";
import { SSEEvent } from "@/types/room";

interface UseSSEOptions {
  url: string;
  onMessage?: (event: SSEEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  enabled?: boolean;
}

export const useSSE = ({
  url,
  onMessage,
  onError,
  onOpen,
  enabled = true
}: UseSSEOptions) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Usar refs para los callbacks para evitar recrear la conexión
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onOpenRef.current = onOpen;
  }, [onMessage, onError, onOpen]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(() => {
    if (!url || !enabled) return;

    // Si ya existe una conexión al mismo URL, no recrear
    if (eventSourceRef.current && eventSourceRef.current.url === url) {
      return;
    }

    disconnect();
    setConnectionError(null);

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        onOpenRef.current?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed: SSEEvent = JSON.parse(event.data);
          onMessageRef.current?.(parsed);
        } catch (e) {
          console.error("Error parsing SSE message:", e);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        setIsConnected(false);
        setConnectionError("Connection lost");
        onErrorRef.current?.(error);

        // Cerrar y limpiar la conexión en caso de error
        eventSource.close();
        eventSourceRef.current = null;
      };
    } catch (error) {
      setConnectionError("Failed to connect to server");
      console.error("SSE connection error:", error);
    }
  }, [url, enabled, disconnect]);

  // Conectar solo cuando cambie la URL o el estado enabled
  useEffect(() => {
    if (enabled && url) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [url, enabled]); // Solo dependencias críticas

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 100);
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    reconnect,
    disconnect,
  };
};

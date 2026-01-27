import { useEffect, useRef, useCallback, useState } from "react";
import { SSEEvent, SSEEventType } from "@/types/room";

interface UseSSEOptions {
  url: string;
  onMessage?: (event: SSEEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  enabled?: boolean;
}

export const useSSE = ({ url, onMessage, onError, onOpen, enabled = true }: UseSSEOptions) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled) return;
    
    disconnect();
    setConnectionError(null);

    try {
      const eventSource = new EventSource(url, { withCredentials: false });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        onOpen?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed: SSEEvent = JSON.parse(event.data);
          onMessage?.(parsed);
        } catch (e) {
          console.error("Error parsing SSE message:", e);
        }
      };

      eventSource.onerror = (error) => {
        setIsConnected(false);
        setConnectionError("Connection lost. Retrying...");
        onError?.(error);
      };
    } catch (error) {
      setConnectionError("Failed to connect to server");
      console.error("SSE connection error:", error);
    }
  }, [url, enabled, onMessage, onError, onOpen, disconnect]);

  useEffect(() => {
    if (enabled) {
      connect();
    }
    return () => disconnect();
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    connectionError,
    reconnect: connect,
    disconnect,
  };
};

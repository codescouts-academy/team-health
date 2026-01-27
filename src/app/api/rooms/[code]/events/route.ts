import { NextRequest } from "next/server";
import { roomStore } from "@/lib/room-store";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const { code } = params;

  // Verificar que la sala existe
  const room = roomStore.getRoom(code);
  if (!room) {
    return new Response("Sala no encontrada", { status: 404 });
  }

  // Crear un stream de texto
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Función para enviar eventos SSE
      const sendEvent = (event: any) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // Registrar el cliente en el store
      const unsubscribe = roomStore.registerSSEClient(code, sendEvent);

      // Manejar cierre de conexión
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  // Retornar respuesta con headers SSE
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Para nginx
    },
  });
}

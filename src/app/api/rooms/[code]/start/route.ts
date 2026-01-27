import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/room-store";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;

  try {
    const { code } = params;

    // Si no se envía hostId, intentar obtenerlo de la sala
    const room = roomStore.getRoom(code);
    if (!room) {
      return NextResponse.json(
        { error: "Sala no encontrada" },
        { status: 404 }
      );
    }

    const effectiveHostId = room.hostId;

    const success = roomStore.startVoting(code, effectiveHostId);

    if (!success) {
      return NextResponse.json(
        { error: "No autorizado o la sala ya comenzó" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error starting voting:", error);
    return NextResponse.json(
      { error: "Error al iniciar votación" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/room-store";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;

  try {
    const body = await request.json();
    const { participantName } = body;
    const { code } = params;

    if (!participantName) {
      return NextResponse.json(
        { error: "participantName es requerido" },
        { status: 400 }
      );
    }

    const result = roomStore.joinRoom(code, participantName);

    if (!result) {
      return NextResponse.json(
        { error: "Sala no encontrada o ya comenzó la votación" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json(
      { error: "Error al unirse a la sala" },
      { status: 500 }
    );
  }
}

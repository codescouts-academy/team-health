import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/room-store";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;

  try {
    const body = await request.json();
    const { odataidPtant } = body;
    const { code } = params;

    if (!odataidPtant) {
      return NextResponse.json(
        { error: "odataidPtant es requerido" },
        { status: 400 }
      );
    }

    const success = roomStore.leaveRoom(code, odataidPtant);

    if (!success) {
      return NextResponse.json(
        { error: "Sala o participante no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error leaving room:", error);
    return NextResponse.json(
      { error: "Error al salir de la sala" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/room-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamName, hostName } = body;

    if (!teamName || !hostName) {
      return NextResponse.json(
        { error: "teamName y hostName son requeridos" },
        { status: 400 }
      );
    }

    const { room, participant } = roomStore.createRoom(teamName, hostName);

    return NextResponse.json({
      room,
      participant,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Error al crear la sala" },
      { status: 500 }
    );
  }
}

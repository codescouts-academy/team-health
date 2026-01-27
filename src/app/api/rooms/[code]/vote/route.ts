import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/room-store";

type VoteValue = "green" | "yellow" | "red";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const code = params.code;

  try {
    const body = await request.json();
    const { odataidPtant, categoryId, vote } = body;

    if (!odataidPtant || !categoryId || !vote) {
      return NextResponse.json(
        { error: "odataidPtant, categoryId y vote son requeridos" },
        { status: 400 }
      );
    }

    if (!["green", "yellow", "red"].includes(vote)) {
      return NextResponse.json(
        { error: "vote debe ser 'green', 'yellow' o 'red'" },
        { status: 400 }
      );
    }

    const success = roomStore.submitVote(
      code,
      odataidPtant,
      categoryId,
      vote as VoteValue
    );

    if (!success) {
      return NextResponse.json(
        { error: "Sala no encontrada, votación no iniciada o participante no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Error al enviar voto" },
      { status: 500 }
    );
  }
}

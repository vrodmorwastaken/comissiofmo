import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== "staff") {
    return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
  }

  const penyes = await prisma.penya.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(penyes);
}

export async function PATCH(request) {
  const session = await getSession();
  if (!session || session.user.role !== "staff") {
    return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
  }

  const body = await request.json();
  const { id, estat } = body;

  if (!id || !["activa", "suspesa"].includes(estat)) {
    return NextResponse.json({ error: "Dades invàlides" }, { status: 400 });
  }

  const penya = await prisma.penya.update({
    where: { id },
    data: { estat },
  });

  return NextResponse.json(penya);
}

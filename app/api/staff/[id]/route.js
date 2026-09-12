import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session || session.user.role !== "staff") {
    return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
  }

  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: "No et pots eliminar a tu mateix." },
      { status: 400 }
    );
  }

  await prisma.staff.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

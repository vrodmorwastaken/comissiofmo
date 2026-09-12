import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.user.role !== "staff") {
    return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
  }

  const staff = await prisma.staff.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, nom: true, createdAt: true },
  });
  return NextResponse.json(staff);
}

export async function POST(request) {
  const session = await getSession();
  if (!session || session.user.role !== "staff") {
    return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
  }

  const body = await request.json();
  const username = (body.username || "").toString().trim();
  const password = (body.password || "").toString();
  const nom = (body.nom || "").toString().trim();

  if (!username || username.length < 3) {
    return NextResponse.json(
      { error: "L'usuari ha de tenir com a mínim 3 caràcters." },
      { status: 400 }
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "La contrasenya ha de tenir com a mínim 6 caràcters." },
      { status: 400 }
    );
  }

  const existing = await prisma.staff.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json(
      { error: "Aquest nom d'usuari ja existeix." },
      { status: 400 }
    );
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newStaff = await prisma.staff.create({
    data: { username, passwordHash, nom },
    select: { id: true, username: true, nom: true, createdAt: true },
  });

  return NextResponse.json(newStaff, { status: 201 });
}

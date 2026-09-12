import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Ruta d'ús únic per crear el primer usuari de staff sense accés a un entorn
// local. Un cop l'hagis fet servir, esborra la variable SETUP_SECRET (o
// aquest fitxer) perquè deixi de funcionar.
//
// Ús: visita, en el navegador,
// https://<el-teu-domini>/api/setup?secret=EL_TEU_SETUP_SECRET&username=admin&password=una-contrasenya-forta&nom=Administrador

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const username = (searchParams.get("username") || "").trim();
  const password = searchParams.get("password") || "";
  const nom = (searchParams.get("nom") || "Administrador").trim();

  if (!process.env.SETUP_SECRET) {
    return NextResponse.json(
      { error: "SETUP_SECRET no configurat al servidor." },
      { status: 500 }
    );
  }

  if (!secret || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Secret incorrecte." }, { status: 401 });
  }

  const staffCount = await prisma.staff.count();
  if (staffCount > 0) {
    return NextResponse.json(
      {
        error:
          "Ja existeix almenys un usuari de staff. Per seguretat, aquesta ruta només funciona quan no n'hi ha cap.",
      },
      { status: 400 }
    );
  }

  if (!username || username.length < 3) {
    return NextResponse.json(
      { error: "Cal indicar un 'username' de com a mínim 3 caràcters." },
      { status: 400 }
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Cal indicar un 'password' de com a mínim 6 caràcters." },
      { status: 400 }
    );
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const staff = await prisma.staff.create({
    data: { username, passwordHash, nom },
    select: { id: true, username: true, nom: true },
  });

  return NextResponse.json({
    ok: true,
    missatge:
      "Usuari de staff creat correctament. Ja pots fer login des de /login. Ara esborra SETUP_SECRET de les variables d'entorn de Vercel.",
    staff,
  });
}

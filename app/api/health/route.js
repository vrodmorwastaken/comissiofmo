import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ruta temporal de diagnòstic. Visita /api/health al navegador per veure
// si la connexió a la base de dades funciona, i si no, el missatge d'error
// exacte. Un cop tot funcioni, esborra aquest fitxer.

export async function GET() {
  const result = {
    databaseUrlPresent: Boolean(process.env.BD_POSTGRES_URL),
    blobTokenPresent: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    nextauthSecretPresent: Boolean(process.env.NEXTAUTH_SECRET),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    result.connexio = "OK";
  } catch (error) {
    result.connexio = "ERROR";
    result.errorMessage = error.message;
    result.errorCode = error.code || null;
    return NextResponse.json(result, { status: 500 });
  }

  try {
    result.numPenyes = await prisma.penya.count();
    result.numStaff = await prisma.staff.count();
  } catch (error) {
    result.taulesError = error.message;
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/i;

export async function GET() {
  const penyes = await prisma.penya.findMany({
    where: { estat: "activa" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nombre: true,
      logoUrl: true,
      color: true,
      youtubeLink: true,
      createdAt: true,
    },
  });
  return NextResponse.json(penyes);
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const nombre = (formData.get("nombre") || "").toString().trim();
    const color = (formData.get("color") || "").toString().trim();
    const youtubeLink = (formData.get("youtubeLink") || "").toString().trim();
    const normasOk = formData.get("normasOk") === "true";
    const username = (formData.get("username") || "").toString().trim();
    const password = (formData.get("password") || "").toString();
    const logo = formData.get("logo");

    // Validacions
    const errors = {};
    if (!nombre || nombre.length < 2) errors.nombre = "El nom ha de tenir com a mínim 2 caràcters.";
    if (!color) errors.color = "Cal triar un color.";
    if (!youtubeLink || !YOUTUBE_REGEX.test(youtubeLink))
      errors.youtubeLink = "Introdueix un enllaç vàlid de YouTube.";
    if (!normasOk) errors.normasOk = "Cal acceptar les normes.";
    if (!username || username.length < 3)
      errors.username = "L'usuari ha de tenir com a mínim 3 caràcters.";
    if (!password || password.length < 6)
      errors.password = "La contrasenya ha de tenir com a mínim 6 caràcters.";
    if (!logo || typeof logo === "string")
      errors.logo = "Cal pujar un fitxer d'imatge pel logo.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const existing = await prisma.penya.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { errors: { username: "Aquest nom d'usuari ja està en ús." } },
        { status: 400 }
      );
    }

    // Pujar logo a Vercel Blob
    const arrayBuffer = await logo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = (logo.name?.split(".").pop() || "png").toLowerCase();
    const blob = await put(
      `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`,
      buffer,
      { access: "public", contentType: logo.type || "image/png" }
    );

    const passwordHash = bcrypt.hashSync(password, 10);

    const penya = await prisma.penya.create({
      data: {
        nombre,
        color,
        youtubeLink,
        normasOk,
        username,
        passwordHash,
        logoUrl: blob.url,
        estat: "activa",
      },
    });

    return NextResponse.json(
      { id: penya.id, nombre: penya.nombre },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creant la penya:", error);
    return NextResponse.json(
      { errors: { general: "S'ha produït un error inesperat. Torna-ho a provar." } },
      { status: 500 }
    );
  }
}

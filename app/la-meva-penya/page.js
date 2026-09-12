import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LaMevaPenyaPage() {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.user.role !== "penya") redirect("/panel");

  const penya = await prisma.penya.findUnique({
    where: { id: session.user.id },
  });

  if (!penya) redirect("/login");

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">La meva penya</h1>

      <div className="bg-fmo-card border border-fmo-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <img
            src={penya.logoUrl}
            alt={`Logo de ${penya.nombre}`}
            className="w-20 h-20 rounded-xl object-cover border border-fmo-border bg-black"
          />
          <div>
            <h2 className="text-xl font-semibold">{penya.nombre}</h2>
            <span
              className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${penya.color}22`,
                color: penya.color,
                border: `1px solid ${penya.color}55`,
              }}
            >
              {penya.estat === "activa" ? "Activa" : "Suspesa"}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-300 space-y-2">
          <p>
            <span className="text-gray-500">Usuari:</span> {penya.username}
          </p>
          <p>
            <span className="text-gray-500">Color:</span> {penya.color}
          </p>
          <p>
            <span className="text-gray-500">Cançó:</span>{" "}
            <a
              href={penya.youtubeLink}
              target="_blank"
              rel="noreferrer"
              className="text-fmo-cyan hover:underline"
            >
              Veure a YouTube
            </a>
          </p>
        </div>

        <p className="text-xs text-gray-500 border-t border-fmo-border pt-4">
          Si vols modificar les dades de la teva penya, contacta amb el staff
          de la Comissió FMó.
        </p>
      </div>
    </div>
  );
}

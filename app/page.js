import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PenyaCard from "@/components/PenyaCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let penyes = [];
  try {
    penyes = await prisma.penya.findMany({
      where: { estat: "activa" },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Error carregant penyes:", e);
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-fmo-gradient bg-clip-text text-transparent">
            Penyes de la Comissió FMó
          </span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Descobreix totes les penyes inscrites, els seus colors, logos i la
          cançó que les representa.
        </p>
        <Link
          href="/registre"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-fmo-gradient font-medium hover:opacity-90 transition"
        >
          + Crear una nova penya
        </Link>
      </div>

      {penyes.length === 0 ? (
        <p className="text-center text-gray-500">
          Encara no hi ha cap penya registrada. Sigues la primera!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {penyes.map((penya) => (
            <PenyaCard key={penya.id} penya={penya} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-fmo-border bg-fmo-bg/80 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-display font-bold text-lg text-white">
          <span className="bg-fmo-gradient bg-clip-text text-transparent">
            Comissió FMó
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-300 hover:text-white transition">
            Penyes
          </Link>

          {status === "loading" ? null : session ? (
            <>
              {session.user.role === "staff" && (
                <Link
                  href="/panel"
                  className="text-gray-300 hover:text-white transition"
                >
                  Panell staff
                </Link>
              )}
              {session.user.role === "penya" && (
                <Link
                  href="/la-meva-penya"
                  className="text-gray-300 hover:text-white transition"
                >
                  La meva penya
                </Link>
              )}
              <span className="text-gray-500 hidden sm:inline">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-1.5 rounded-lg bg-fmo-card border border-fmo-border hover:border-fmo-pink transition text-white"
              >
                Tancar sessió
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg bg-fmo-card border border-fmo-border hover:border-fmo-pink transition text-white"
              >
                Entrar
              </Link>
              <Link
                href="/registre"
                className="px-3 py-1.5 rounded-lg bg-fmo-gradient font-medium text-white hover:opacity-90 transition"
              >
                Crear penya
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

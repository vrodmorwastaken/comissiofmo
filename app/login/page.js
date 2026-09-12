"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    router.push(session.user.role === "staff" ? "/panel" : "/la-meva-penya");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Usuari o contrasenya incorrectes.");
      return;
    }

    // Deixem que useSession redirigeixi segons el rol
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-1">Iniciar sessió</h1>
      <p className="text-gray-400 mb-8 text-sm">
        Accedeix com a penya o com a membre del staff.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-fmo-card border border-fmo-border rounded-2xl p-6"
      >
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Usuari</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Contrasenya
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-fmo-gradient font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Entrant..." : "Entrar"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Encara no tens penya?{" "}
          <Link href="/registre" className="text-fmo-pink hover:underline">
            Crea-la aquí
          </Link>
        </p>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function PanelClient() {
  const [tab, setTab] = useState("penyes");
  const [penyes, setPenyes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState("");
  const [newNom, setNewNom] = useState("");
  const [newPass, setNewPass] = useState("");
  const [staffError, setStaffError] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    const [pRes, sRes] = await Promise.all([
      fetch("/api/penyes/status"),
      fetch("/api/staff"),
    ]);
    if (pRes.ok) setPenyes(await pRes.json());
    if (sRes.ok) setStaff(await sRes.json());
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function toggleEstat(penya) {
    const nouEstat = penya.estat === "activa" ? "suspesa" : "activa";
    const res = await fetch("/api/penyes/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: penya.id, estat: nouEstat }),
    });
    if (res.ok) {
      setPenyes((prev) =>
        prev.map((p) => (p.id === penya.id ? { ...p, estat: nouEstat } : p))
      );
    }
  }

  async function handleAddStaff(e) {
    e.preventDefault();
    setStaffError("");
    setStaffLoading(true);
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUser, password: newPass, nom: newNom }),
    });
    const data = await res.json();
    setStaffLoading(false);

    if (!res.ok) {
      setStaffError(data.error || "Error desconegut");
      return;
    }

    setStaff((prev) => [...prev, data]);
    setNewUser("");
    setNewNom("");
    setNewPass("");
  }

  async function handleDeleteStaff(id) {
    if (!confirm("Segur que vols eliminar aquest usuari de staff?")) return;
    const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panell de staff</h1>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("penyes")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "penyes"
              ? "bg-fmo-gradient"
              : "bg-fmo-card border border-fmo-border text-gray-300"
          }`}
        >
          Penyes ({penyes.length})
        </button>
        <button
          onClick={() => setTab("staff")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "staff"
              ? "bg-fmo-gradient"
              : "bg-fmo-card border border-fmo-border text-gray-300"
          }`}
        >
          Staff ({staff.length})
        </button>
      </div>

      {loading && <p className="text-gray-500">Carregant...</p>}

      {!loading && tab === "penyes" && (
        <div className="space-y-3">
          {penyes.length === 0 && (
            <p className="text-gray-500">Encara no hi ha penyes registrades.</p>
          )}
          {penyes.map((penya) => (
            <div
              key={penya.id}
              className="flex items-center justify-between gap-4 bg-fmo-card border border-fmo-border rounded-xl p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={penya.logoUrl}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover border border-fmo-border bg-black shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{penya.nombre}</p>
                  <p className="text-xs text-gray-500 truncate">
                    @{penya.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    penya.estat === "activa"
                      ? "bg-fmo-green/20 text-fmo-green border border-fmo-green/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  }`}
                >
                  {penya.estat === "activa" ? "Activa" : "Suspesa"}
                </span>
                <button
                  onClick={() => toggleEstat(penya)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-fmo-bg border border-fmo-border hover:border-fmo-pink transition"
                >
                  {penya.estat === "activa" ? "Suspendre" : "Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "staff" && (
        <div className="space-y-8">
          <form
            onSubmit={handleAddStaff}
            className="bg-fmo-card border border-fmo-border rounded-2xl p-5 space-y-4"
          >
            <h2 className="font-semibold">Afegir membre de staff</h2>
            {staffError && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {staffError}
              </p>
            )}
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nom (opcional)"
                value={newNom}
                onChange={(e) => setNewNom(e.target.value)}
                className="rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
              />
              <input
                type="text"
                placeholder="Usuari"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
              />
              <input
                type="password"
                placeholder="Contrasenya"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
              />
            </div>
            <button
              type="submit"
              disabled={staffLoading}
              className="px-4 py-2 rounded-lg bg-fmo-gradient text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {staffLoading ? "Afegint..." : "Afegir"}
            </button>
          </form>

          <div className="space-y-3">
            {staff.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-fmo-card border border-fmo-border rounded-xl p-4"
              >
                <div>
                  <p className="font-medium">{s.nom || s.username}</p>
                  <p className="text-xs text-gray-500">@{s.username}</p>
                </div>
                <button
                  onClick={() => handleDeleteStaff(s.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-fmo-bg border border-fmo-border hover:border-red-500 hover:text-red-400 transition"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

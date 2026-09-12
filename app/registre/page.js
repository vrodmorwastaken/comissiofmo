"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = [
  "#ff2e88",
  "#8b5cf6",
  "#22d3ee",
  "#facc15",
  "#34d399",
  "#f97316",
  "#ef4444",
  "#3b82f6",
];

export default function RegistrePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [normasOk, setNormasOk] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    setLogo(file || null);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("nombre", nombre);
      formData.set("color", color);
      formData.set("youtubeLink", youtubeLink);
      formData.set("normasOk", normasOk ? "true" : "false");
      formData.set("username", username);
      formData.set("password", password);
      if (logo) formData.set("logo", logo);

      const res = await fetch("/api/penyes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || { general: "Error desconegut" });
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setErrors({ general: "No s'ha pogut connectar amb el servidor." });
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-fmo-green mb-3">
          Penya creada correctament! 🎉
        </h1>
        <p className="text-gray-400">
          Et redirigim a la pàgina d&apos;inici de sessió...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">Crea la teva penya</h1>
      <p className="text-gray-400 mb-8 text-sm">
        Omple les dades següents per registrar la teva penya a la Comissió
        FMó.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-fmo-card border border-fmo-border rounded-2xl p-6"
      >
        {errors.general && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {errors.general}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nom de la penya
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
            placeholder="Ex: Penya els Marraixos"
          />
          {errors.nombre && (
            <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Logo de la penya
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-fmo-gradient file:text-white file:cursor-pointer"
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Previsualització del logo"
              className="mt-3 w-20 h-20 rounded-xl object-cover border border-fmo-border"
            />
          )}
          {errors.logo && (
            <p className="text-red-400 text-xs mt-1">{errors.logo}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Color de la penya
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-full border-2 transition ${
                  color === c ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Triar color ${c}`}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-9 h-9 rounded-full border border-fmo-border bg-transparent cursor-pointer"
              title="Color personalitzat"
            />
          </div>
          {errors.color && (
            <p className="text-red-400 text-xs mt-1">{errors.color}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Enllaç de la cançó (YouTube)
          </label>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="w-full rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {errors.youtubeLink && (
            <p className="text-red-400 text-xs mt-1">{errors.youtubeLink}</p>
          )}
        </div>

        <hr className="border-fmo-border" />

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nom d&apos;usuari
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-fmo-border px-3 py-2 focus:outline-none focus:border-fmo-pink transition"
            placeholder="usuari_penya"
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">{errors.username}</p>
          )}
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
            placeholder="Mínim 6 caràcters"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <label className="flex items-start gap-2.5 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={normasOk}
            onChange={(e) => setNormasOk(e.target.checked)}
            className="mt-1 accent-fmo-pink"
          />
          <span>He llegit i accepto les normes de la Comissió FMó.</span>
        </label>
        {errors.normasOk && (
          <p className="text-red-400 text-xs -mt-3">{errors.normasOk}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-fmo-gradient font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creant penya..." : "Crear penya"}
        </button>
      </form>
    </div>
  );
}

function getYoutubeId(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/i
  );
  return match ? match[1] : null;
}

export default function PenyaCard({ penya }) {
  const ytId = getYoutubeId(penya.youtubeLink || "");

  return (
    <div
      className="card-glow rounded-2xl border border-fmo-border bg-fmo-card overflow-hidden"
      style={{ boxShadow: `0 0 0 1px ${penya.color}22 inset` }}
    >
      <div
        className="h-2 w-full"
        style={{ backgroundColor: penya.color || "#ff2e88" }}
      />
      <div className="p-5 flex gap-4 items-center">
        <img
          src={penya.logoUrl}
          alt={`Logo de ${penya.nombre}`}
          className="w-16 h-16 rounded-xl object-cover border border-fmo-border bg-black"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-lg text-white truncate">
            {penya.nombre}
          </h3>
          <span
            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${penya.color}22`,
              color: penya.color,
              border: `1px solid ${penya.color}55`,
            }}
          >
            Penya activa
          </span>
        </div>
      </div>

      {ytId && (
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${ytId}`}
            title={`Cançó de ${penya.nombre}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

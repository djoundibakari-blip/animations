import type { HeraldEvent } from "@/types";

interface EventCardProps {
  event: HeraldEvent;
}

const SOURCE_STYLES: Record<string, { color: string; bg: string }> = {
  OpenAgenda: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  Ticketmaster: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  Exemple: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
};

export default function EventCard({ event }: EventCardProps) {
  const srcStyle = SOURCE_STYLES[event.source] ?? {
    color: "rgba(255,255,255,0.45)",
    bg: "rgba(255,255,255,0.06)",
  };

  return (
    <div
      className="p-5 h-full transition-opacity duration-200 hover:opacity-80"
      style={{
        background: "#0e0e18",
        borderLeft: "2px solid rgba(167,139,250,0.25)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3
          className="font-black uppercase text-sm tracking-[0.04em] leading-tight"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          {event.title}
        </h3>
        <span
          className="shrink-0 text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5"
          style={{ color: srcStyle.color, background: srcStyle.bg }}
        >
          {event.source}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "rgba(167,139,250,0.55)" }}>◷</span>
          <span className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.38)" }}>
            {event.date}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "rgba(167,139,250,0.55)" }}>⊙</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
            {event.location}
            {event.address ? ` — ${event.address}` : ""}
          </span>
        </div>
      </div>

      {event.description && (
        <p
          className="text-xs leading-relaxed line-clamp-2 mb-3"
          style={{ color: "rgba(255,255,255,0.26)" }}
        >
          {event.description}
        </p>
      )}

      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] transition-opacity duration-200 hover:opacity-100"
          style={{ color: "rgba(167,139,250,0.65)" }}
        >
          Voir les détails →
        </a>
      )}
    </div>
  );
}

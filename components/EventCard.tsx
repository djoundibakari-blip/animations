import type { HeraldEvent } from "@/types";

interface EventCardProps {
  event: HeraldEvent;
}

const SOURCE_COLORS: Record<string, string> = {
  OpenAgenda: "bg-green-100 text-green-700",
  Ticketmaster: "bg-purple-100 text-purple-700",
  Exemple: "bg-amber-100 text-amber-700",
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow border-l-4 border-l-herald-500">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-slate-900 leading-tight">{event.title}</h3>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
            SOURCE_COLORS[event.source] || "bg-slate-100 text-slate-600"
          }`}
        >
          {event.source}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>📅</span>
          <span className="capitalize">{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>📍</span>
          <span>
            {event.location}
            {event.address ? ` — ${event.address}` : ""}
          </span>
        </div>
      </div>

      {event.description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {event.description}
        </p>
      )}

      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-herald-600 hover:text-herald-700 font-medium"
        >
          Voir les détails
          <span>→</span>
        </a>
      )}
    </div>
  );
}

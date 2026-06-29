import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { fetchEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";
import AgendaButton from "@/components/AgendaButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const events = user.city
    ? await fetchEvents({ city: user.city, preferences: user.preferences, radius: user.radius })
    : [];

  const profileComplete = !!(user.city && user.preferences.length && user.schedule);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-400 text-sm capitalize mb-1">{today}</p>
        <h1 className="text-3xl font-black text-slate-900">
          Bonjour, {user.name} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {user.city ? `Événements à ${user.city}` : "Configurez votre ville pour voir des événements"}
        </p>
      </div>

      {/* Alerte profil incomplet */}
      {!profileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-amber-500 text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800">Profil incomplet</p>
            <p className="text-sm text-amber-600 mt-0.5">
              {!user.city && "Ville manquante · "}
              {!user.preferences.length && "Préférences non définies · "}
              {!user.schedule && "Fréquence non configurée"}
            </p>
            <Link href="/profile" className="text-sm text-amber-700 font-medium hover:underline mt-1 inline-block">
              Compléter mon profil →
            </Link>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Ville",
            value: user.city || "—",
            icon: "📍",
            href: "/profile",
          },
          {
            label: "Préférences",
            value: user.preferences.length ? `${user.preferences.length} catégories` : "—",
            icon: "🎭",
            href: "/profile",
          },
          {
            label: "Fréquence",
            value: user.schedule
              ? user.schedule.charAt(0).toUpperCase() + user.schedule.slice(1)
              : "—",
            icon: "📆",
            href: "/profile",
          },
          {
            label: "Dernier envoi",
            value: user.lastSentAt
              ? new Date(user.lastSentAt).toLocaleDateString("fr-FR")
              : "Jamais",
            icon: "📧",
            href: null,
          },
        ].map((s) =>
          s.href ? (
            <Link key={s.label} href={s.href} className="card p-4 hover:shadow-md transition-shadow">
              <div className="text-xl mb-2">{s.icon}</div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{s.label}</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{s.value}</p>
            </Link>
          ) : (
            <div key={s.label} className="card p-4">
              <div className="text-xl mb-2">{s.icon}</div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{s.label}</p>
              <p className="font-bold text-slate-900 mt-0.5">{s.value}</p>
            </div>
          )
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <AgendaButton disabled={!user.city} />
        <Link href="/chat" className="btn-secondary flex items-center gap-2">
          <span>◎</span> Parler à Herald
        </Link>
        <Link href="/profile" className="btn-secondary flex items-center gap-2">
          <span>⚙️</span> Modifier le profil
        </Link>
      </div>

      {/* Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {user.city ? `Événements à ${user.city}` : "Vos prochains événements"}
          </h2>
          {user.city && (
            <span className="text-sm text-slate-400">
              {events.length} événement{events.length !== 1 ? "s" : ""} trouvé{events.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {!user.city ? (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3">📍</p>
            <p className="font-semibold text-slate-700 mb-2">Aucune ville configurée</p>
            <p className="text-slate-400 text-sm mb-4">
              Indiquez votre ville pour découvrir les événements proches de vous.
            </p>
            <Link href="/profile" className="btn-primary">
              Configurer ma ville
            </Link>
          </div>
        ) : events.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-slate-700 mb-2">Aucun événement trouvé</p>
            <p className="text-slate-400 text-sm">
              Essayez de modifier vos préférences ou d&apos;augmenter le rayon de recherche.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {events.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

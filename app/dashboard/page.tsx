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

  const stats = [
    { num: "01", label: "Ville", value: user.city || "—", href: "/profile" },
    {
      num: "02",
      label: "Préférences",
      value: user.preferences.length ? String(user.preferences.length) : "—",
      sub: user.preferences.length ? "catégories" : undefined,
      href: "/profile",
    },
    {
      num: "03",
      label: "Fréquence",
      value: user.schedule
        ? user.schedule.charAt(0).toUpperCase() + user.schedule.slice(1)
        : "—",
      href: "/profile",
    },
    {
      num: "04",
      label: "Dernier envoi",
      value: user.lastSentAt
        ? new Date(user.lastSentAt).toLocaleDateString("fr-FR")
        : "Jamais",
      href: null,
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6 anim-fade anim-d1">
          <div
            className="h-[1px] w-8 anim-line"
            style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)" }}
          />
          <span
            className="text-[10px] font-mono tracking-[0.4em] uppercase capitalize"
            style={{ color: "rgba(167,139,250,0.7)" }}
          >
            {today}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.2)" }}>
              En ligne
            </span>
          </div>
        </div>

        <div className="anim-clip anim-d2">
          <h1
            className="font-black uppercase"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            Bonjour,{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {user.name}
            </span>
          </h1>
        </div>

        <p className="mt-3 text-sm anim-up anim-d3" style={{ color: "rgba(255,255,255,0.32)" }}>
          {user.city
            ? `Événements à ${user.city}`
            : "Configurez votre ville pour voir des événements"}
        </p>
      </div>

      {/* ── Profil incomplet ─────────────────────────── */}
      {!profileComplete && (
        <div
          className="mb-8 p-4 anim-up anim-d3"
          style={{
            background: "rgba(251,191,36,0.06)",
            border: "1px solid rgba(251,191,36,0.15)",
            borderLeft: "2px solid #fbbf24",
          }}
        >
          <div className="flex items-start gap-3">
            <span style={{ color: "#fbbf24" }} className="text-sm mt-0.5">⚠</span>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.15em]"
                style={{ color: "rgba(251,191,36,0.9)" }}
              >
                Profil incomplet
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(251,191,36,0.5)" }}>
                {!user.city && "Ville manquante · "}
                {!user.preferences.length && "Préférences non définies · "}
                {!user.schedule && "Fréquence non configurée"}
              </p>
              <Link
                href="/profile"
                className="text-[10px] font-mono uppercase tracking-[0.1em] mt-2 inline-block transition-opacity hover:opacity-100"
                style={{ color: "rgba(251,191,36,0.65)" }}
              >
                Compléter mon profil →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats grid ──────────────────────────────── */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-10 anim-up anim-d4"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {stats.map((s) => {
          const inner = (
            <div className="p-5 h-full" style={{ background: "#0e0e18" }}>
              <div
                className="font-mono text-[10px] tracking-[0.3em] mb-4"
                style={{ color: "rgba(167,139,250,0.5)" }}
              >
                {s.num}
              </div>
              <p
                className="font-black uppercase text-[10px] tracking-[0.12em] mb-2"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {s.label}
              </p>
              <p className="font-bold text-sm truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                {s.value}
                {s.sub && (
                  <span className="text-xs font-normal ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {s.sub}
                  </span>
                )}
              </p>
            </div>
          );

          return s.href ? (
            <Link
              key={s.label}
              href={s.href}
              className="block transition-opacity duration-200 hover:opacity-70"
            >
              {inner}
            </Link>
          ) : (
            <div key={s.label}>{inner}</div>
          );
        })}
      </div>

      {/* ── Actions ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-12 anim-up anim-d5">
        <AgendaButton disabled={!user.city} />
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-200 hover:opacity-80"
          style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
        >
          <span>◎</span> Parler à Herald
        </Link>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-200 hover:opacity-80"
          style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
        >
          <span>⚙</span> Modifier le profil
        </Link>
      </div>

      {/* ── Événements ──────────────────────────────── */}
      <div className="anim-up anim-d6">
        <div
          className="flex items-center justify-between pb-5 mb-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <div
              className="h-[1px] w-8 mb-3"
              style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)" }}
            />
            <h2
              className="font-black uppercase tracking-[0.06em]"
              style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", lineHeight: 1, color: "rgba(255,255,255,0.9)" }}
            >
              {user.city ? `Événements à ${user.city}` : "Vos prochains événements"}
            </h2>
          </div>
          {user.city && (
            <span
              className="text-[10px] font-mono uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {events.length} trouvé{events.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {!user.city ? (
          <div
            className="p-12 text-center"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "#0e0e18",
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <p className="text-3xl mb-5">📍</p>
            <p
              className="font-black uppercase tracking-[0.08em] text-sm mb-2"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Aucune ville configurée
            </p>
            <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.28)" }}>
              Indiquez votre ville pour découvrir les événements proches de vous.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.25em] px-6 py-3 transition-all duration-200 hover:opacity-90"
              style={{ background: "#fff", color: "#08080e" }}
            >
              Configurer ma ville
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : events.length === 0 ? (
          <div
            className="p-12 text-center"
            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0e0e18" }}
          >
            <p className="text-3xl mb-5">🔍</p>
            <p
              className="font-black uppercase tracking-[0.08em] text-sm mb-2"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Aucun événement trouvé
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
              Essayez de modifier vos préférences ou d&apos;augmenter le rayon de recherche.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {events.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

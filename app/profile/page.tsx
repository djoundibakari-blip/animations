"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { AVAILABLE_PREFERENCES, type PublicUser } from "@/types";

const SCHEDULE_OPTIONS = [
  { value: "quotidien", label: "Quotidien" },
  { value: "hebdomadaire", label: "Hebdomadaire" },
  { value: "mensuel", label: "Mensuel" },
];

const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.85)",
  padding: "10px 14px",
  fontSize: "13px",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s",
};

function DarkInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.5)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; props.onBlur?.(e); }}
    />
  );
}

function DarkSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, cursor: "pointer" }}
      onFocus={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.5)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; props.onBlur?.(e); }}
    />
  );
}

function SectionLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-4 pb-5 mb-6"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span
        className="font-mono text-[10px] tracking-[0.3em] shrink-0"
        style={{ color: "rgba(167,139,250,0.5)" }}
      >
        {num}
      </span>
      <h2 className="font-black uppercase text-sm tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.85)" }}>
        {children}
      </h2>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [form, setForm] = useState({
    city: "",
    region: "",
    preferences: [] as string[],
    schedule: "",
    scheduleDay: "",
    scheduleTime: "",
    radius: 30,
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          const u: PublicUser = d.user;
          setUser(u);
          setForm({
            city: u.city || "",
            region: u.region || "",
            preferences: u.preferences || [],
            schedule: u.schedule || "",
            scheduleDay: u.scheduleDay || "",
            scheduleTime: u.scheduleTime || "",
            radius: u.radius || 30,
          });
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  function togglePref(pref: string) {
    setForm((f) => ({
      ...f,
      preferences: f.preferences.includes(pref)
        ? f.preferences.filter((p) => p !== pref)
        : [...f.preferences, pref],
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSaveMsg(res.ok ? "Profil mis à jour !" : (data.error || "Erreur lors de la mise à jour."));
      if (res.ok) setUser(data.user);
    } catch {
      setSaveMsg("Erreur réseau.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 4000);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (res.ok) { router.push("/"); router.refresh(); }
    } catch {
      setDeleting(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#08080e" }}>
        <span className="animate-spin text-3xl" style={{ color: "rgba(167,139,250,0.6)" }}>⟳</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#08080e", color: "#fff" }}>
      <Sidebar userName={user.name} userEmail={user.email} />

      <div className="flex-1 p-8 max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10 anim-up anim-d1">
          <div className="flex items-center gap-4 mb-5">
            <div
              className="h-[1px] w-8 anim-line"
              style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)" }}
            />
            <span
              className="text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{ color: "rgba(167,139,250,0.7)" }}
            >
              Paramètres
            </span>
          </div>
          <h1
            className="font-black uppercase"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 0.92, letterSpacing: "-0.02em" }}
          >
            Mon{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Profil
            </span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Gérez vos préférences et votre agenda personnalisé
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-1">

          {/* ── 01 · Localisation ── */}
          <div className="p-6 anim-up anim-d2" style={{ background: "#0e0e18", border: "1px solid rgba(255,255,255,0.06)" }}>
            <SectionLabel num="01">Localisation</SectionLabel>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label
                  className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Ville
                </label>
                <DarkInput
                  type="text"
                  placeholder="ex: Paris, Lyon, Bordeaux…"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div>
                <label
                  className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Région <span style={{ color: "rgba(255,255,255,0.2)" }}>(optionnel)</span>
                </label>
                <DarkInput
                  type="text"
                  placeholder="ex: Île-de-France"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  className="text-[10px] font-mono uppercase tracking-[0.2em]"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Rayon géographique
                </label>
                <span
                  className="font-black text-sm"
                  style={{ color: "rgba(167,139,250,0.8)" }}
                >
                  {form.radius} km
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={form.radius}
                onChange={(e) => setForm((f) => ({ ...f, radius: parseInt(e.target.value) }))}
                className="w-full"
                style={{ accentColor: "#a78bfa" }}
              />
              <div
                className="flex justify-between text-[9px] font-mono mt-1.5 uppercase tracking-[0.1em]"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                <span>5 km</span>
                <span>200 km</span>
              </div>
            </div>
          </div>

          {/* ── 02 · Préférences ── */}
          <div className="p-6 anim-up anim-d3" style={{ background: "#0e0e18", border: "1px solid rgba(255,255,255,0.06)" }}>
            <SectionLabel num="02">Préférences culturelles</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PREFERENCES.map((pref) => {
                const selected = form.preferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePref(pref)}
                    className="px-4 py-2 text-xs font-black uppercase tracking-[0.1em] transition-all duration-150"
                    style={
                      selected
                        ? { background: "#fff", color: "#08080e", border: "1px solid #fff" }
                        : { background: "transparent", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)" }
                    }
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                      }
                    }}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
            {form.preferences.length === 0 && (
              <p
                className="text-[10px] font-mono uppercase tracking-[0.15em] mt-4"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                Sélectionnez au moins une catégorie
              </p>
            )}
          </div>

          {/* ── 03 · Agenda ── */}
          <div className="p-6 anim-up anim-d4" style={{ background: "#0e0e18", border: "1px solid rgba(255,255,255,0.06)" }}>
            <SectionLabel num="03">Agenda automatique</SectionLabel>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Fréquence
                </label>
                <DarkSelect
                  value={form.schedule}
                  onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))}
                >
                  <option value="" style={{ background: "#0e0e18" }}>— Choisir —</option>
                  {SCHEDULE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} style={{ background: "#0e0e18" }}>
                      {o.label}
                    </option>
                  ))}
                </DarkSelect>
              </div>

              {form.schedule === "hebdomadaire" && (
                <div>
                  <label
                    className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Jour
                  </label>
                  <DarkSelect
                    value={form.scheduleDay}
                    onChange={(e) => setForm((f) => ({ ...f, scheduleDay: e.target.value }))}
                  >
                    <option value="" style={{ background: "#0e0e18" }}>— Choisir —</option>
                    {DAYS.map((d) => (
                      <option key={d} value={d} style={{ background: "#0e0e18" }}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </DarkSelect>
                </div>
              )}

              <div>
                <label
                  className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Heure
                </label>
                <DarkInput
                  type="time"
                  value={form.scheduleTime}
                  onChange={(e) => setForm((f) => ({ ...f, scheduleTime: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* ── Save ── */}
          <div className="flex items-center gap-5 pt-4 anim-up anim-d5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] px-6 py-3 transition-all duration-200 disabled:opacity-40 hover:opacity-90"
              style={{ background: "#fff", color: "#08080e" }}
            >
              {saving ? (
                <><span className="animate-spin inline-block">⟳</span> Enregistrement…</>
              ) : (
                <>Enregistrer les modifications</>
              )}
            </button>
            {saveMsg && (
              <span
                className="text-[10px] font-mono uppercase tracking-[0.15em]"
                style={{
                  color: saveMsg.includes("mis à jour") ? "#34d399" : "#f87171",
                }}
              >
                {saveMsg.includes("mis à jour") ? `✓ ${saveMsg}` : `✗ ${saveMsg}`}
              </span>
            )}
          </div>
        </form>

        {/* ── RGPD ── */}
        <div
          className="mt-10 p-6 anim-up anim-d6"
          style={{
            background: "rgba(239,68,68,0.04)",
            border: "1px solid rgba(239,68,68,0.12)",
            borderLeft: "2px solid rgba(239,68,68,0.5)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="font-mono text-[10px] tracking-[0.3em]"
              style={{ color: "rgba(239,68,68,0.5)" }}
            >
              RGPD
            </span>
            <h2
              className="font-black uppercase text-sm tracking-[0.1em]"
              style={{ color: "rgba(239,68,68,0.85)" }}
            >
              Suppression de compte
            </h2>
          </div>
          <p
            className="text-xs leading-relaxed mb-5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Conformément au RGPD, vous pouvez demander la suppression de toutes vos données
            personnelles. Cette action est irréversible.
          </p>

          {!deleteConfirm ? (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="font-black text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-200 hover:opacity-90"
              style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              Supprimer mon compte et mes données
            </button>
          ) : (
            <div
              className="p-4"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <p
                className="text-xs font-black uppercase tracking-[0.1em] mb-4"
                style={{ color: "rgba(239,68,68,0.9)" }}
              >
                Cette action supprimera définitivement votre compte. Confirmer ?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="font-black text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-200 disabled:opacity-40 hover:opacity-90"
                  style={{ background: "#ef4444", color: "#fff" }}
                >
                  {deleting ? "Suppression…" : "Confirmer"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="font-black text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-200 hover:opacity-80"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <p
            className="text-[9px] font-mono uppercase tracking-[0.1em] mt-4"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Compte créé le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            {user.lastSentAt && ` · Dernier agenda : ${new Date(user.lastSentAt).toLocaleDateString("fr-FR")}`}
          </p>
        </div>
      </div>
    </div>
  );
}

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
      if (res.ok) {
        setUser(data.user);
        setSaveMsg("Profil mis à jour !");
      } else {
        setSaveMsg(data.error || "Erreur lors de la mise à jour.");
      }
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
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setDeleting(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin text-herald-600 text-3xl">⟳</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user.name} userEmail={user.email} />

      <div className="flex-1 p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Mon profil</h1>
        <p className="text-slate-400 mb-8">Gérez vos préférences et votre agenda</p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Localisation */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>📍</span> Localisation
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Ville</label>
                <input
                  type="text"
                  className="input"
                  placeholder="ex: Paris, Lyon, Bordeaux…"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Région (optionnel)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="ex: Île-de-France"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Rayon géographique : {form.radius} km</label>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={form.radius}
                onChange={(e) => setForm((f) => ({ ...f, radius: parseInt(e.target.value) }))}
                className="w-full accent-herald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5 km</span>
                <span>200 km</span>
              </div>
            </div>
          </div>

          {/* Préférences */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🎭</span> Préférences culturelles
            </h2>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PREFERENCES.map((pref) => {
                const selected = form.preferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePref(pref)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      selected
                        ? "bg-herald-600 text-white border-herald-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-herald-400"
                    }`}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
            {form.preferences.length === 0 && (
              <p className="text-sm text-slate-400 mt-3">
                Sélectionnez au moins une catégorie pour des événements personnalisés.
              </p>
            )}
          </div>

          {/* Agenda automatique */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>📆</span> Agenda automatique
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Fréquence</label>
                <select
                  className="input"
                  value={form.schedule}
                  onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))}
                >
                  <option value="">— Choisir —</option>
                  {SCHEDULE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {form.schedule === "hebdomadaire" && (
                <div>
                  <label className="label">Jour</label>
                  <select
                    className="input"
                    value={form.scheduleDay}
                    onChange={(e) => setForm((f) => ({ ...f, scheduleDay: e.target.value }))}
                  >
                    <option value="">— Choisir —</option>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="label">Heure</label>
                <input
                  type="time"
                  className="input"
                  value={form.scheduleTime}
                  onChange={(e) => setForm((f) => ({ ...f, scheduleTime: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
            {saveMsg && (
              <span
                className={`text-sm font-medium ${
                  saveMsg.includes("✓") || saveMsg.includes("mis à jour")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {saveMsg}
              </span>
            )}
          </div>
        </form>

        {/* RGPD */}
        <div className="card p-6 mt-8 border-red-100">
          <h2 className="font-bold text-red-700 mb-2 flex items-center gap-2">
            <span>⚠️</span> Zone RGPD — Suppression de compte
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Conformément au RGPD, vous pouvez demander la suppression de toutes vos données personnelles.
            Cette action est irréversible.
          </p>

          {!deleteConfirm ? (
            <button
              type="button"
              className="btn-danger"
              onClick={() => setDeleteConfirm(true)}
            >
              Supprimer mon compte et mes données
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-700 mb-3">
                Êtes-vous sûr(e) ? Cette action supprimera définitivement votre compte.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Suppression…" : "Confirmer la suppression"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-3">
            Compte créé le{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            {user.lastSentAt &&
              ` · Dernier agenda : ${new Date(user.lastSentAt).toLocaleDateString("fr-FR")}`}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", consent: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.consent) {
      setError("Vous devez accepter les conditions pour continuer.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du compte.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-8 shadow-2xl">
      <h1 className="text-2xl font-black text-slate-900 mb-1">Créer un compte</h1>
      <p className="text-slate-500 text-sm mb-7">
        Déjà inscrit ?{" "}
        <Link href="/login" className="text-herald-600 hover:underline font-medium">
          Se connecter
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label" htmlFor="name">
            Prénom
          </label>
          <input
            id="name"
            type="text"
            className="input"
            placeholder="Votre prénom"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="prenom@exemple.fr"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="8+ caractères, une lettre et un chiffre"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        {/* RGPD Consent */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-sm text-slate-600 mb-3 font-medium">Consentement RGPD</p>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Herald collecte votre e-mail, prénom et préférences culturelles pour vous envoyer
            un agenda personnalisé. Vous pouvez modifier ou supprimer vos données à tout moment.
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-herald-600 focus:ring-herald-500"
              checked={form.consent}
              onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
              required
            />
            <span className="text-sm text-slate-700">
              J&apos;accepte la collecte et le traitement de mes données personnelles
              conformément au RGPD.
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading || !form.consent}>
          {loading ? "Création du compte…" : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}

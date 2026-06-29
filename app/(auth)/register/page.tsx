"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Même slideshow que la page connexion ─────────────────────────────────────
const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=85&w=1800&auto=format&fit=crop",
    city: "Bruxelles",
    event: "Nuit Blanche",
  },
  {
    img: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=85&w=1800&auto=format&fit=crop",
    city: "Paris",
    event: "Feux du 14 Juillet",
  },
  {
    img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=85&w=1800&auto=format&fit=crop",
    city: "Barcelone",
    event: "Primavera Sound",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const EyeOpen = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeClosed = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [slide, setSlide]     = useState(0);
  const [form, setForm]       = useState({ name: "", email: "", password: "", consent: false });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

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
      if (!res.ok) setError(data.error || "Erreur lors de la création du compte.");
      else { router.push("/dashboard"); router.refresh(); }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#08080e" }}>

      {/* ══════════════════════════════════════════════
          PANNEAU GAUCHE — Hero festivités
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:block lg:w-[58%] relative overflow-hidden">

        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center auth-pan"
              style={{ backgroundImage: `url('${s.img}')` }}
            />
          </div>
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080e] via-[#08080e]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080e] via-transparent to-[#08080e]/30" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.18) 0%, transparent 60%, rgba(37,99,235,0.12) 100%)" }} />

        {/* Contenu */}
        <div className="relative z-10 h-full flex flex-col justify-between p-14">

          {/* Logo */}
          <div className="auth-fade-in" style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 flex items-center justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
              >
                <span className="text-white font-black text-xs tracking-[3px]">H</span>
              </div>
              <div>
                <p className="text-white font-black text-lg tracking-[0.28em] uppercase leading-none">Herald</p>
                <p className="text-white/35 text-[9px] font-mono tracking-[0.22em] uppercase mt-0.5">your news · your rules</p>
              </div>
            </div>
          </div>

          {/* Titre éditorial */}
          <div>
            <div className="auth-slide-up" style={{ animationDelay: "0.18s" }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-6" style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)" }} />
                <span className="text-[10px] font-mono tracking-[0.35em] uppercase" style={{ color: "rgba(196,181,253,0.7)" }}>
                  {SLIDES[slide].city}
                </span>
              </div>

              <h1 className="font-black text-white uppercase leading-[0.87] tracking-tight mb-6" style={{ fontSize: "4.2rem" }}>
                Rejoignez
                <br />
                <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.45)" }}>
                  la
                </span>
                <br />
                <span style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Culture.
                </span>
              </h1>

              <p className="text-sm leading-relaxed max-w-[270px] mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
                Créez votre compte en 30 secondes et commencez à recevoir votre agenda culturel personnalisé.
              </p>
            </div>

            {/* Indicateurs */}
            <div className="auth-slide-up flex items-center gap-5" style={{ animationDelay: "0.32s" }}>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className="h-[2px] transition-all duration-500 cursor-pointer"
                    style={{
                      width: i === slide ? "2rem" : "0.5rem",
                      background: i === slide
                        ? "linear-gradient(90deg, #a78bfa, #60a5fa)"
                        : "rgba(255,255,255,0.22)",
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.28)" }}>
                {SLIDES[slide].event}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-fade-in flex items-center justify-between" style={{ animationDelay: "0.7s" }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Service actif
              </span>
            </div>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.12)" }}>Photos © Unsplash</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PANNEAU DROIT — Formulaire
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-white px-10 sm:px-16 py-12 relative overflow-hidden">

        {/* Déco dots */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        />

        <div className="w-full max-w-[320px] relative">

          {/* Logo mobile */}
          <div className="lg:hidden mb-10 auth-slide-up" style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-900 flex items-center justify-center">
                <span className="text-white font-black text-xs tracking-widest">H</span>
              </div>
              <span className="font-black text-lg tracking-[0.25em] uppercase text-gray-900">Herald</span>
            </div>
          </div>

          {/* En-tête */}
          <div className="mb-9 auth-slide-up" style={{ animationDelay: "0.12s" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-[2px] w-5" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb)" }} />
              <p className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: "#7c3aed" }}>
                Inscription
              </p>
            </div>
            <h2 className="font-black text-gray-900 tracking-tight leading-[1.0]" style={{ fontSize: "2.15rem" }}>
              Créez votre
              <br />
              compte.
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Prénom */}
            <div className="mb-5 auth-slide-up" style={{ animationDelay: "0.2s" }}>
              <label className="block text-[10px] font-black tracking-[0.3em] uppercase mb-2.5" style={{ color: "#9ca3af" }}>
                Prénom
              </label>
              <div
                className="pb-2.5 transition-all duration-200"
                style={{ borderBottom: `2px solid ${focused === "name" ? "#7c3aed" : "#e5e7eb"}` }}
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="Votre prénom"
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-300"
                  style={{ fontSize: "15px" }}
                  required
                  autoComplete="given-name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-5 auth-slide-up" style={{ animationDelay: "0.26s" }}>
              <label className="block text-[10px] font-black tracking-[0.3em] uppercase mb-2.5" style={{ color: "#9ca3af" }}>
                Adresse e-mail
              </label>
              <div
                className="pb-2.5 transition-all duration-200"
                style={{ borderBottom: `2px solid ${focused === "email" ? "#7c3aed" : "#e5e7eb"}` }}
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="prenom@exemple.fr"
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-300"
                  style={{ fontSize: "15px" }}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="mb-6 auth-slide-up" style={{ animationDelay: "0.32s" }}>
              <label className="block text-[10px] font-black tracking-[0.3em] uppercase mb-2.5" style={{ color: "#9ca3af" }}>
                Mot de passe
              </label>
              <div
                className="pb-2.5 transition-all duration-200 flex items-center gap-3"
                style={{ borderBottom: `2px solid ${focused === "password" ? "#7c3aed" : "#e5e7eb"}` }}
              >
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="8+ caractères"
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-300"
                  style={{ fontSize: "15px" }}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="text-gray-300 hover:text-gray-600 transition-colors shrink-0"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            {/* Consentement RGPD */}
            <div
              className="mb-6 p-4 auth-slide-up"
              style={{
                animationDelay: "0.38s",
                background: "#f9fafb",
                borderLeft: "2px solid #7c3aed",
              }}
            >
              <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#7c3aed" }}>
                Consentement RGPD
              </p>
              <p className="text-[11px] leading-relaxed mb-3" style={{ color: "#9ca3af" }}>
                Herald collecte votre e-mail, prénom et préférences culturelles pour vous envoyer
                un agenda personnalisé. Vous pouvez modifier ou supprimer vos données à tout moment.
              </p>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.consent}
                    onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  />
                  <div
                    className="w-4 h-4 flex items-center justify-center transition-all duration-200"
                    style={{
                      border: `2px solid ${form.consent ? "#7c3aed" : "#d1d5db"}`,
                      background: form.consent ? "#7c3aed" : "transparent",
                    }}
                  >
                    {form.consent && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[11px] leading-relaxed" style={{ color: "#6b7280" }}>
                  J&apos;accepte la collecte et le traitement de mes données personnelles
                  conformément au RGPD.
                </span>
              </label>
            </div>

            {/* Erreur */}
            {error && (
              <div className="mb-5 flex items-start gap-2 text-sm text-red-500">
                <span className="font-black">—</span>
                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="auth-slide-up" style={{ animationDelay: "0.44s" }}>
              <button
                type="submit"
                disabled={loading || !form.consent}
                className="w-full text-white py-4 px-6 flex items-center justify-between font-black text-[11px] uppercase tracking-[0.28em] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)" }}
                onMouseEnter={(e) => {
                  if (!loading && form.consent)
                    (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1f2937 0%, #111827 100%)";
                }}
              >
                <span>{loading ? "Création en cours…" : "Créer mon compte"}</span>
                {loading ? (
                  <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </button>
            </div>
          </form>

          {/* Lien connexion */}
          <div
            className="mt-8 pt-8 flex items-center justify-between auth-slide-up"
            style={{ borderTop: "1px solid #f3f4f6", animationDelay: "0.52s" }}
          >
            <p className="text-xs text-gray-400">Déjà un compte ?</p>
            <Link
              href="/login"
              className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5 group transition-colors duration-200 hover:text-violet-600"
            >
              Se connecter
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Badge sécurité */}
          <div
            className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-widest auth-fade-in"
            style={{ color: "#d1d5db", animationDelay: "0.62s" }}
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Inscription gratuite · Conforme RGPD
          </div>
        </div>
      </div>
    </div>
  );
}

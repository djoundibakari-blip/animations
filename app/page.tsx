import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    num: "01",
    title: "Événements personnalisés",
    description:
      "Herald apprend vos préférences (musique, cinéma, théâtre, sport…) et ne vous propose que ce qui vous correspond.",
  },
  {
    num: "02",
    title: "Local & géolocalisé",
    description:
      "Définissez votre ville et un rayon géographique. Herald agrège les événements proches de chez vous en temps réel.",
  },
  {
    num: "03",
    title: "Agenda par e-mail",
    description:
      "Recevez votre agenda personnalisé quotidiennement, hebdomadairement ou mensuellement, directement dans votre boîte mail.",
  },
  {
    num: "04",
    title: "Assistant IA",
    description:
      "Interagissez avec Herald via notre chatbot intelligent. Posez des questions, affinez vos préférences, explorez les événements.",
  },
  {
    num: "05",
    title: "RGPD & Sécurité",
    description:
      "Vos données restent chez vous. Herald respecte le RGPD : consentement, droit à l'oubli, désabonnement en un clic.",
  },
  {
    num: "06",
    title: "Multi-sources",
    description:
      "OpenAgenda, Ticketmaster et plus encore. Herald agrège plusieurs sources pour vous offrir le meilleur de la programmation locale.",
  },
];

const steps = [
  {
    num: "01",
    title: "Créez votre compte",
    desc: "Inscription en 30 secondes, consentement RGPD explicite.",
  },
  {
    num: "02",
    title: "Configurez votre profil",
    desc: "Indiquez votre ville, vos préférences et votre fréquence d'envoi souhaitée.",
  },
  {
    num: "03",
    title: "Recevez votre agenda",
    desc: "Herald trouve les événements pour vous et les envoie par e-mail automatiquement.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#08080e", color: "#fff" }}>

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav
        className="anim-nav fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 sm:px-14"
        style={{
          height: "68px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,8,14,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)" }}
          >
            <span className="font-black text-xs tracking-[3px]">H</span>
          </div>
          <div>
            <span className="font-black text-sm tracking-[0.28em] uppercase">Herald</span>
            <span
              className="hidden sm:inline text-[9px] font-mono tracking-[0.2em] uppercase ml-3"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              your news · your rules
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[11px] font-black uppercase tracking-[0.25em] px-4 py-2 transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="text-[11px] font-black uppercase tracking-[0.25em] px-5 py-2.5 transition-all duration-200"
            style={{ background: "#fff", color: "#08080e" }}
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-center min-h-screen px-8 sm:px-14 overflow-hidden"
        style={{ paddingTop: "68px" }}
      >
        {/* Halo violet */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,40,217,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Grille de points */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-5xl mx-auto w-full">
          {/* Label */}
          <div className="flex items-center gap-4 mb-10 anim-fade anim-d1">
            <div
              className="h-[1px] w-10 anim-line"
              style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)" }}
            />
            <span
              className="text-[10px] font-mono tracking-[0.4em] uppercase"
              style={{ color: "rgba(167,139,250,0.8)" }}
            >
              Agrégateur culturel personnel
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Actif
              </span>
            </div>
          </div>

          {/* Headline — clip reveal ligne par ligne */}
          <div className="mb-8">
            <div
              className="anim-clip anim-d2 overflow-hidden"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase" }}
            >
              Vivez
            </div>
            <div
              className="anim-clip anim-d3 overflow-hidden"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase", color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.4)" }}
            >
              Votre
            </div>
            <div
              className="anim-clip anim-d4 overflow-hidden"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase", background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Culture.
            </div>
          </div>

          {/* Sous-titre */}
          <p
            className="text-base sm:text-lg leading-relaxed max-w-md mb-12 anim-up anim-d5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Herald agrège les événements culturels et locaux autour de vous,
            les filtre selon vos goûts, et vous envoie un agenda personnalisé par e-mail.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 anim-up anim-d6">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.3em] px-8 py-4 transition-all duration-300 group"
              style={{ background: "#fff", color: "#08080e" }}
            >
              Créer mon compte gratuit
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center font-black text-[11px] uppercase tracking-[0.3em] px-8 py-4 transition-all duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.65)" }}
            >
              Se connecter
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex items-center gap-3 anim-fade anim-d8">
            <div
              className="w-6 h-9 flex items-start justify-center pt-1.5"
              style={{ border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: "12px" }}
            >
              <div
                className="w-1 h-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.5)", animation: "scrollDot 1.8s ease-in-out infinite" }}
              />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.2)" }}>
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ── FONCTIONNALITÉS ─────────────────────────────── */}
      <section
        className="py-32 px-8 sm:px-14"
        style={{ background: "#0e0e18", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-20">
            <ScrollReveal variant="sr-line" className="h-[1px] w-12 mb-8" />
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <ScrollReveal variant="sr-clip">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em]" style={{ color: "rgba(167,139,250,0.7)" }}>
                  Fonctionnalités
                </span>
              </ScrollReveal>
              <ScrollReveal variant="sr" delay={100}>
                <h2
                  className="font-black uppercase tracking-tight"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 0.95 }}
                >
                  Tout ce dont<br />vous avez besoin.
                </h2>
              </ScrollReveal>
            </div>
          </div>

          {/* Grille numérotée façon cryox */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {features.map((f, i) => (
              <ScrollReveal key={f.num} variant="sr" delay={i * 70}>
                <div className="p-8 h-full" style={{ background: "#0e0e18" }}>
                  <div className="font-mono text-[10px] tracking-[0.3em] mb-6" style={{ color: "rgba(167,139,250,0.5)" }}>
                    {f.num}
                  </div>
                  <h3 className="font-black uppercase text-sm tracking-[0.08em] mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {f.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────── */}
      <section
        className="py-32 px-8 sm:px-14"
        style={{ background: "#08080e", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-20">
            <ScrollReveal variant="sr-line" className="h-[1px] w-12 mb-8" />
            <ScrollReveal variant="sr" delay={100}>
              <h2
                className="font-black uppercase tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 0.95 }}
              >
                Comment<br />ça marche ?
              </h2>
            </ScrollReveal>
          </div>

          <div>
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} variant="sr" delay={i * 120}>
                <div
                  className="flex gap-8 sm:gap-16 py-12"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="font-black shrink-0 leading-none select-none"
                    style={{
                      fontSize: "clamp(3rem, 7vw, 6rem)",
                      color: "transparent",
                      WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
                      minWidth: "5rem",
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3
                      className="font-black uppercase tracking-tight mb-3"
                      style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", lineHeight: 1.05 }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "420px" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────── */}
      <section
        className="py-32 px-8 sm:px-14"
        style={{ background: "#0e0e18", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div>
              <ScrollReveal variant="sr-line" className="h-[1px] w-12 mb-8" />
              <ScrollReveal variant="sr-clip">
                <h2
                  className="font-black uppercase tracking-tight"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 0.92 }}
                >
                  Prêt à ne plus<br />
                  <span style={{ color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.35)" }}>
                    manquer un
                  </span>
                  <br />
                  <span style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    événement ?
                  </span>
                </h2>
              </ScrollReveal>
              <ScrollReveal variant="sr" delay={200}>
                <p
                  className="mt-6 text-sm leading-relaxed max-w-sm"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Gratuit, sans abonnement, sans carte bancaire.<br />Désabonnez-vous à tout moment.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal variant="sr" delay={300} className="shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 font-black text-[11px] uppercase tracking-[0.3em] px-10 py-5 transition-all duration-300 group"
                style={{ background: "#fff", color: "#08080e" }}
              >
                Commencer maintenant
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer
        className="px-8 sm:px-14 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 flex items-center justify-center"
            style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
          >
            <span className="font-black text-[9px] tracking-[2px]">H</span>
          </div>
          <span className="font-black text-xs tracking-[0.25em] uppercase">Herald</span>
        </div>
        <p className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
          Projet Epitech Automatisation · Données hébergées localement · Conforme RGPD
        </p>
      </footer>

      {/* Scroll dot keyframe */}
      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(10px); opacity: 0.3; }
        }
        /* Fix sr-line couleur dans ScrollReveal */
        .sr-line.in { background: linear-gradient(90deg, #a78bfa, #60a5fa) !important; }
      `}</style>
    </div>
  );
}

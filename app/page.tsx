import Link from "next/link";

const features = [
  {
    icon: "🎭",
    title: "Événements personnalisés",
    description:
      "Herald apprend vos préférences (musique, cinéma, théâtre, sport…) et ne vous propose que ce qui vous correspond.",
  },
  {
    icon: "📍",
    title: "Local & géolocalisé",
    description:
      "Définissez votre ville et un rayon géographique. Herald agrège les événements proches de chez vous en temps réel.",
  },
  {
    icon: "📧",
    title: "Agenda par e-mail",
    description:
      "Recevez votre agenda personnalisé quotidiennement, hebdomadairement ou mensuellement, directement dans votre boîte mail.",
  },
  {
    icon: "🤖",
    title: "Assistant IA",
    description:
      "Interagissez avec Herald via notre chatbot intelligent. Posez des questions, affinez vos préférences, explorez les événements.",
  },
  {
    icon: "🔒",
    title: "RGPD & Sécurité",
    description:
      "Vos données restent chez vous. Herald respecte le RGPD : consentement, droit à l'oubli, désabonnement en un clic.",
  },
  {
    icon: "🌐",
    title: "Multi-sources",
    description:
      "OpenAgenda, Ticketmaster et plus encore. Herald agrège plusieurs sources pour vous offrir le meilleur de la programmation locale.",
  },
];

const steps = [
  { num: "1", title: "Créez votre compte", desc: "Inscription en 30 secondes, consentement RGPD explicite." },
  { num: "2", title: "Configurez votre profil", desc: "Indiquez votre ville, vos préférences et votre fréquence d'envoi souhaitée." },
  { num: "3", title: "Recevez votre agenda", desc: "Herald trouve les événements pour vous et les envoie par e-mail automatiquement." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-herald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="font-black text-xl text-herald-700">HERALD</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              Connexion
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-herald-900 via-herald-700 to-herald-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-herald-100 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            Votre agrégateur culturel personnel
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
            HERALD
          </h1>
          <p className="text-herald-200 text-xl font-mono mb-4">
            &lt; YOUR NEWS, YOUR RULES /&gt;
          </p>
          <p className="text-herald-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Herald agrège les événements culturels et locaux autour de vous,
            les filtre selon vos goûts, et vous envoie un agenda personnalisé
            par e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-herald-700 hover:bg-herald-50 font-bold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              Créer mon compte gratuit
            </Link>
            <Link
              href="/login"
              className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-3">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-slate-500 text-center mb-12">
            Un seul outil pour ne plus jamais manquer un événement
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5">
                <div className="w-10 h-10 bg-herald-600 text-white rounded-full flex items-center justify-center font-black text-lg shrink-0">
                  {s.num}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-herald-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Prêt à découvrir les événements près de chez vous ?
          </h2>
          <p className="text-herald-200 mb-8">
            Gratuit, sans abonnement, sans carte bancaire. Désabonnez-vous à tout moment.
          </p>
          <Link
            href="/register"
            className="bg-white text-herald-700 hover:bg-herald-50 font-bold px-8 py-4 rounded-xl transition-colors text-lg inline-block"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-100 text-center text-sm text-slate-400">
        <p>
          Herald — Projet Epitech Automatisation · Données hébergées localement
          · Conforme RGPD
        </p>
      </footer>
    </div>
  );
}

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import type { ChatMessage } from "@/types";

// Simple rate limiter en mémoire
const chatLimits = new Map<string, number[]>();
const MAX_MSG = 30;
const WINDOW_MS = 60_000;

function checkChatLimit(userId: string): boolean {
  const now = Date.now();
  const times = (chatLimits.get(userId) || []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_MSG) return false;
  times.push(now);
  chatLimits.set(userId, times);
  return true;
}

function sanitize(msg: string): string {
  return msg.replace(/[<>]/g, "").trim().slice(0, 2000);
}

function detectInjection(msg: string): boolean {
  const lower = msg.toLowerCase();
  return [
    "ignore previous instructions",
    "ignore all instructions",
    "forget everything",
    "jailbreak",
    "you are now",
    "dan mode",
    "javascript:",
    "data:text/html",
  ].some((k) => lower.includes(k));
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (!checkChatLimit(user.id)) {
    return NextResponse.json({ error: "Trop de messages. Patientez une minute." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const rawMessage = String(body.message || "");
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];

    if (detectInjection(rawMessage)) {
      return NextResponse.json({ error: "Message bloqué pour raisons de sécurité." }, { status: 400 });
    }

    const message = sanitize(rawMessage);
    if (!message) return NextResponse.json({ error: "Message vide." }, { status: 400 });

    const today = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const city = user.city || "non définie";
    const prefs = user.preferences.length ? user.preferences.join(", ") : "non définies";
    const sched = user.schedule
      ? `${user.schedule} — ${user.scheduleDay || ""} à ${user.scheduleTime || "?"}`
      : "non configuré";

    const systemPrompt = `Tu es Herald, un assistant bienveillant et enthousiaste spécialisé dans les événements culturels et locaux en France.
Date du jour : ${today}

PROFIL DE L'UTILISATEUR :
- Nom : ${user.name}
- Ville/Région : ${city}
- Préférences : ${prefs}
- Fréquence d'envoi : ${sched}
- Rayon géographique : ${user.radius} km

TON RÔLE :
Tu aides l'utilisateur à trouver des événements culturels, gérer ses préférences et organiser son agenda.
Les modifications de profil se font via l'interface web (onglet Profil).
Pour envoyer un agenda immédiat, l'utilisateur peut cliquer sur "Envoyer mon agenda" dans le tableau de bord.

STYLE :
- Réponds en français, de manière concise et chaleureuse
- Utilise du markdown (gras, listes) pour structurer tes réponses
- Si la ville n'est pas définie, suggère à l'utilisateur de la configurer dans son profil
- Limite tes réponses à 300 mots maximum`;

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey || apiKey.includes("PLACEHOLDER")) {
      const fallback = `Bonjour **${user.name}** ! Je suis Herald, votre assistant événements.\n\n⚠️ Le service IA n'est pas encore configuré (clé Mistral manquante). Configurez \`MISTRAL_API_KEY\` dans votre \`.env.local\`.\n\nEn attendant, retrouvez vos événements dans le **tableau de bord** !`;
      return NextResponse.json({ message: fallback });
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      throw new Error(`Mistral API error: ${res.status}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";

    return NextResponse.json({ message: reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Erreur lors de la génération de la réponse." }, { status: 500 });
  }
}

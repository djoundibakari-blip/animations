import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { fetchEvents } from "@/lib/events";
import { addPendingEmail } from "@/lib/db";

export async function POST() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (!user.city) {
    return NextResponse.json(
      { error: "Configurez d'abord votre ville dans votre profil." },
      { status: 400 }
    );
  }

  try {
    const events = await fetchEvents({
      city: user.city,
      preferences: user.preferences,
      radius: user.radius,
    });

    const today = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const pending = {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      city: user.city,
      preferences: user.preferences,
      events,
      agendaTitle: `Votre agenda Herald — ${today}`,
      requestedAt: new Date().toISOString(),
      type: "immediate",
    };

    // Sauvegarder dans la file d'attente (traité par le scheduler N8N ou un cron)
    addPendingEmail(pending);

    // Tentative d'envoi direct si SMTP configuré
    const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    if (smtpConfigured) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "465"),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const eventsHtml = events
          .map(
            (e) => `
          <div style="background:#f8f9ff;border-left:4px solid #2563eb;padding:16px;margin:12px 0;border-radius:0 8px 8px 0">
            <h3 style="color:#1e40af;margin:0 0 6px 0">${e.title}</h3>
            <p style="margin:4px 0"><strong>Date :</strong> ${e.date}</p>
            <p style="margin:4px 0"><strong>Lieu :</strong> ${e.location}${e.address ? " — " + e.address : ""}</p>
            ${e.description ? `<p style="margin:8px 0;color:#6b7280;font-size:14px">${e.description}</p>` : ""}
            ${e.url ? `<a href="${e.url}" style="color:#2563eb;font-weight:bold">Voir les détails →</a>` : ""}
            <p style="font-size:11px;color:#9ca3af;margin:4px 0">Source : ${e.source}</p>
          </div>`
          )
          .join("");

        const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
  <div style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:24px;border-radius:12px;margin-bottom:24px">
    <h1 style="color:#fff;margin:0">HERALD</h1>
    <p style="color:#93c5fd;margin:4px 0 0;font-size:13px">Your news, your rules</p>
  </div>
  <h2 style="color:#1e293b">${pending.agendaTitle}</h2>
  <p>Bonjour <strong>${user.name}</strong>, voici votre agenda pour <strong>${user.city}</strong>.</p>
  ${eventsHtml}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="font-size:12px;color:#94a3b8;text-align:center">
    Pour modifier vos préférences ou vous désabonner, connectez-vous sur Herald.<br>
    Conformément au RGPD, vous pouvez supprimer vos données à tout moment.
  </p>
</body></html>`;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: pending.agendaTitle,
          html,
        });

        return NextResponse.json({ success: true, sent: true, eventCount: events.length });
      } catch (mailErr) {
        console.error("SMTP error:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      sent: false,
      queued: true,
      eventCount: events.length,
      message: smtpConfigured
        ? "Votre agenda est en file d'attente."
        : "Agenda sauvegardé. Configurez SMTP pour l'envoi automatique.",
    });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la génération de l'agenda." }, { status: 500 });
  }
}

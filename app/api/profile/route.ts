import { NextResponse } from "next/server";
import { getAuthUser, toPublicUser } from "@/lib/auth";
import { updateUser } from "@/lib/db";
import { AVAILABLE_PREFERENCES } from "@/types";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  return NextResponse.json({ user: toPublicUser(user) });
}

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  try {
    const body = await request.json();
    const allowed = ["city", "region", "preferences", "schedule", "scheduleDay", "scheduleTime", "radius"] as const;
    const validSchedules = ["quotidien", "hebdomadaire", "mensuel"];

    const updates: Partial<typeof user> = {};

    if (body.city !== undefined) {
      updates.city = String(body.city).trim().slice(0, 100) || null;
    }
    if (body.region !== undefined) {
      updates.region = String(body.region).trim().slice(0, 100) || null;
    }
    if (Array.isArray(body.preferences)) {
      updates.preferences = body.preferences
        .filter((p: string) => (AVAILABLE_PREFERENCES as readonly string[]).includes(p))
        .slice(0, 12);
    }
    if (body.schedule !== undefined) {
      updates.schedule = validSchedules.includes(body.schedule) ? body.schedule : null;
    }
    if (body.scheduleDay !== undefined) {
      updates.scheduleDay = String(body.scheduleDay).slice(0, 20) || null;
    }
    if (body.scheduleTime !== undefined) {
      const time = String(body.scheduleTime);
      updates.scheduleTime = /^[0-2]\d:[0-5]\d$/.test(time) ? time : null;
    }
    if (body.radius !== undefined) {
      updates.radius = Math.min(200, Math.max(5, parseInt(body.radius) || 30));
    }

    void allowed; // acknowledge unused
    const updated = updateUser(user.id, updates);
    if (!updated) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

    return NextResponse.json({ user: toPublicUser(updated) });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

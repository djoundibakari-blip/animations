import { NextResponse } from "next/server";
import { getUserByEmail, saveUser } from "@/lib/db";
import { hashPassword, createToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";
import type { User } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, consent } = body as {
      email: string;
      password: string;
      name: string;
      consent: boolean;
    };

    // Validation
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }
    if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Mot de passe trop faible (8+ caractères, une lettre et un chiffre)." },
        { status: 400 }
      );
    }
    const cleanName = name?.replace(/[^a-zA-ZÀ-ɏ\s'\-]/g, "").trim();
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: "Prénom invalide." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Le consentement RGPD est requis." }, { status: 400 });
    }

    // Unicité email
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Un compte existe déjà avec cette adresse." }, { status: 409 });
    }

    const now = new Date().toISOString();
    const userId = "u_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);

    const user: User = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      name: cleanName,
      city: null,
      region: null,
      preferences: [],
      schedule: null,
      scheduleDay: null,
      scheduleTime: null,
      radius: 30,
      subscribed: true,
      createdAt: now,
      lastSentAt: null,
      consent: true,
      consentDate: now,
      consentVersion: "1.0",
    };

    await saveUser(user);

    const token = await createToken(user);
    const response = NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword, createToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

const ATTEMPT_WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; firstAt: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(email);
  if (!entry || now - entry.firstAt > ATTEMPT_WINDOW) {
    loginAttempts.set(email, { count: 1, firstAt: now });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

function clearAttempts(email: string) {
  loginAttempts.delete(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!checkRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 }
      );
    }

    const user = getUserByEmail(normalizedEmail);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
    }

    if (!user.subscribed) {
      return NextResponse.json({ error: "Ce compte a été désactivé." }, { status: 403 });
    }

    clearAttempts(normalizedEmail);
    const token = await createToken(user);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
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

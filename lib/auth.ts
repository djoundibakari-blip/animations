// Fonctions d'auth côté serveur uniquement (Node.js runtime - pas Edge)
import crypto from "crypto";
import { SignJWT } from "jose";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { User } from "@/types";
import { getUserById } from "./db";

export const COOKIE_NAME = "herald_token";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "herald-default-secret-change-in-production"
);

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update("herald_v1_salt_" + password)
    .digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function createToken(user: User): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ sub: string; email: string; name: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { sub: string; email: string; name: string };
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return getUserById(payload.sub);
}

export function toPublicUser(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...pub } = user;
  return pub;
}

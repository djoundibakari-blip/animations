// Module utilisable dans le middleware Edge runtime (pas de fs/path/crypto Node.js)
import { jwtVerify } from "jose";

export const COOKIE_NAME = "herald_token";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "herald-default-secret-change-in-production"
);

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

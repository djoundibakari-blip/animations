import { NextResponse } from "next/server";
import { getAuthUser, COOKIE_NAME } from "@/lib/auth";
import { anonymizeUser } from "@/lib/db";

export async function DELETE() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const success = anonymizeUser(user.id);
  if (!success) {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }

  const response = NextResponse.json({
    success: true,
    message: "Votre compte a été supprimé conformément au RGPD. Toutes vos données personnelles ont été anonymisées.",
  });
  response.cookies.delete(COOKIE_NAME);
  return response;
}

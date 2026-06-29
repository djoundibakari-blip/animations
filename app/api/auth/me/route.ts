import { NextResponse } from "next/server";
import { getAuthUser, toPublicUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  return NextResponse.json({ user: toPublicUser(user) });
}

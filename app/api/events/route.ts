import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { fetchEvents } from "@/lib/events";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || user.city || "Paris";
  const daysAhead = parseInt(searchParams.get("days") || "14");

  const events = await fetchEvents({
    city,
    preferences: user.preferences,
    radius: user.radius,
    daysAhead: Math.min(daysAhead, 30),
  });

  return NextResponse.json({ events, city, fetchedAt: new Date().toISOString() });
}

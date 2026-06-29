import type { HeraldEvent } from "@/types";

interface FetchEventsOptions {
  city: string;
  preferences?: string[];
  radius?: number;
  daysAhead?: number;
}

async function fetchOpenAgenda(
  city: string,
  daysAhead: number
): Promise<HeraldEvent[]> {
  const key = process.env.OPENAGENDA_API_KEY;
  if (!key || key.includes("PLACEHOLDER")) return [];

  const start = new Date().toISOString().split("T")[0];
  const end = new Date(Date.now() + daysAhead * 86400000)
    .toISOString()
    .split("T")[0];

  const url = `https://api.openagenda.com/v2/events?search=${encodeURIComponent(city)}&from=${start}&to=${end}&size=10&key=${key}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Herald/1.0 (Epitech project)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.events) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.events.map((e: any): HeraldEvent => ({
      title: e.title?.fr || e.title?.en || "Sans titre",
      date: e.timings?.[0]
        ? new Date(e.timings[0].begin).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
        : "Date inconnue",
      location: e.location?.name || city,
      address: e.location?.address || "",
      description: (e.description?.fr || e.description?.en || "").slice(0, 300),
      url: e.uid
        ? `https://openagenda.com/agendas/${e.originAgenda?.uid}/events/${e.uid}`
        : null,
      source: "OpenAgenda",
      category: e.keywords?.fr?.[0] || "",
    }));
  } catch {
    return [];
  }
}

async function fetchTicketmaster(
  city: string,
  daysAhead: number
): Promise<HeraldEvent[]> {
  const key = process.env.TICKETMASTER_API_KEY;
  if (!key || key.includes("PLACEHOLDER")) return [];

  const start = new Date().toISOString().split("T")[0];
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(city)}&startDateTime=${start}T00:00:00Z&size=8&apikey=${key}&locale=fr`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data._embedded?.events) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data._embedded.events.map((e: any): HeraldEvent => {
      const venue = e._embedded?.venues?.[0];
      return {
        title: e.name || "Sans titre",
        date: e.dates?.start?.localDate
          ? new Date(e.dates.start.localDate).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          : "Date inconnue",
        location: venue?.name || city,
        address: venue?.address?.line1 || "",
        description: (e.description || e.info || "").slice(0, 300),
        url: e.url || null,
        source: "Ticketmaster",
        category: e.classifications?.[0]?.genre?.name || "",
      };
    });
  } catch {
    return [];
  }
}

const FALLBACK_EVENTS = (city: string): HeraldEvent[] => [
  {
    title: "Festival Jazz en Ville",
    date: new Date(Date.now() + 5 * 86400000).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    location: `Scène Principale, ${city}`,
    address: "1 Place de la Musique",
    description:
      "Festival de jazz avec des artistes locaux et internationaux. Entrée libre.",
    url: null,
    source: "Exemple",
    category: "musique",
  },
  {
    title: "Exposition Peinture Contemporaine",
    date: new Date(Date.now() + 3 * 86400000).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    location: `Galerie Municipale, ${city}`,
    address: "5 Rue des Arts",
    description:
      "Exposition temporaire dédiée aux artistes de la région. Vernissage vendredi soir.",
    url: null,
    source: "Exemple",
    category: "expositions",
  },
  {
    title: "Spectacle de Comédie",
    date: new Date(Date.now() + 8 * 86400000).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    location: `Théâtre du Centre, ${city}`,
    address: "12 Avenue Victor Hugo",
    description:
      "One-man show hilarant avec un humoriste régional. Places limitées.",
    url: null,
    source: "Exemple",
    category: "comédie",
  },
  {
    title: "Concert de Musique Classique",
    date: new Date(Date.now() + 10 * 86400000).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    location: `Opéra Municipal, ${city}`,
    address: "2 Place de l'Opéra",
    description:
      "Soirée symphonique avec l'orchestre philharmonique. Tenue de soirée recommandée.",
    url: null,
    source: "Exemple",
    category: "musique",
  },
];

export async function fetchEvents(
  options: FetchEventsOptions
): Promise<HeraldEvent[]> {
  const { city, preferences = [], daysAhead = 14 } = options;

  const [agendaResult, tmResult] = await Promise.allSettled([
    fetchOpenAgenda(city, daysAhead),
    fetchTicketmaster(city, daysAhead),
  ]);

  let events: HeraldEvent[] = [
    ...(agendaResult.status === "fulfilled" ? agendaResult.value : []),
    ...(tmResult.status === "fulfilled" ? tmResult.value : []),
  ];

  if (preferences.length > 0) {
    const terms = preferences.map((p) => p.toLowerCase());
    const filtered = events.filter((e) =>
      terms.some((t) =>
        (e.title + " " + e.description + " " + e.category)
          .toLowerCase()
          .includes(t)
      )
    );
    if (filtered.length > 0) events = filtered;
  }

  if (events.length === 0) {
    events = FALLBACK_EVENTS(city);
    if (preferences.length > 0) {
      const terms = preferences.map((p) => p.toLowerCase());
      const filtered = events.filter((e) =>
        terms.some((t) => e.category.toLowerCase().includes(t))
      );
      if (filtered.length > 0) events = filtered;
    }
  }

  return events.slice(0, 10);
}

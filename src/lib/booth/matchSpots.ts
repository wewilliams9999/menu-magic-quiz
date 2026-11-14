import type { Spot } from "@/data/nashvilleSpots";

export interface Intent {
  neighborhood?: string;
  quiet: boolean;
  parking: boolean;
  reservation: boolean;
  sunday: boolean;
  tags: string[];
}

const HOODS: Record<string, string> = {
  "east nashville": "East Nashville", "east side": "East Nashville", "eastside": "East Nashville",
  germantown: "Germantown", midtown: "Midtown", gulch: "The Gulch", "12 south": "12 South", "twelve south": "12 South",
  downtown: "Downtown", brentwood: "Brentwood", franklin: "Franklin", "leiper": "Leiper's Fork", "green hills": "Green Hills", "sylvan park": "Sylvan Park", nations: "The Nations", "wedgewood": "Wedgewood-Houston", hendersonville: "Hendersonville",
};
const TAG_WORDS: Record<string, string> = {
  dad: "family", mom: "family", parents: "family", family: "family", kids: "family",
  date: "date", romantic: "romantic", anniversary: "romantic", brunch: "brunch",
  patio: "patio", outdoor: "patio", cocktail: "cocktails", cocktails: "cocktails",
  "hot chicken": "hot chicken", beer: "beer", casual: "casual", friends: "friends",
};

export function parseIntent(text: string): Intent {
  const t = text.toLowerCase();
  const hood = Object.keys(HOODS).find((k) => t.includes(k));
  return {
    neighborhood: hood ? HOODS[hood] : undefined,
    quiet: /quiet|calm|conversation|hear each other|intimate/.test(t) || /dad|mom|parents/.test(t),
    parking: /parking|park /.test(t),
    reservation: /reserv|book/.test(t),
    sunday: /sunday/.test(t),
    tags: [...new Set(Object.keys(TAG_WORDS).filter((k) => t.includes(k)).map((k) => TAG_WORDS[k]))],
  };
}

export interface Match { spot: Spot; score: number; reasons: string[] }

export function matchSpots(spots: Spot[], intent: Intent, limit = 3): Match[] {
  return spots
    .map((spot) => {
      let score = 0;
      const reasons: string[] = [];
      if (intent.neighborhood) {
        if (spot.neighborhood === intent.neighborhood) { score += 5; reasons.push(`In ${spot.neighborhood}`); }
        else score -= 4;
      }
      if (intent.quiet) {
        if (spot.noise === "quiet") { score += 3; reasons.push("Quiet, easy conversation"); }
        else if (spot.noise === "loud") score -= 3;
      }
      if (intent.parking) {
        if (spot.parking === "lot") { score += 3; reasons.push("Has its own parking lot"); }
        else if (spot.parking === "valet") { score += 2; reasons.push("Valet available"); }
        else score -= 2;
      }
      if (intent.reservation) {
        if (spot.reservations) { score += 2; reasons.push("Takes reservations"); } else score -= 3;
      }
      if (intent.sunday) {
        if (spot.openSunday) { score += 2; reasons.push("Open Sundays"); } else score -= 5;
      }
      for (const tag of intent.tags) if (spot.tags.includes(tag)) { score += 1; reasons.push(`Great for ${tag}`); }
      return { spot, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

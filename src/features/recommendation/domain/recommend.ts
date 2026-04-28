import type { Spot } from "@/src/types/spot";

export type RecommendationReason = {
  title: string;
  bullets: string[];
};

export type RankedSpot = {
  spot: Spot;
  score: number;
  confidence: number; // 0..100
  reasons: string[];
};

export type RecommendationResult = {
  featured: Spot | null;
  alternatives: Spot[];
  reason: RecommendationReason | null;
  featuredConfidence: number;
  ranked: RankedSpot[];
};

function normalize(text?: string) {
  return (text || "").toLowerCase().trim();
}

function includesAny(haystack: string, keys: string[]) {
  return keys.some((k) => haystack.includes(k));
}

function combinedText(spot: Spot) {
  const tags = (spot.vibe_tags || []).join(" ");
  return `${normalize(spot.name)} ${normalize(spot.address)} ${normalize(
    spot.price_category,
  )} ${normalize(tags)}`;
}

function baseScore(spot: Spot) {
  let score = 0;
  const reasons: string[] = [];
  const rating = Number((spot as any).rating_avg || 0);

  if (rating >= 4.6) {
    score += 3;
    reasons.push("Excellent student rating");
  } else if (rating >= 4.3) {
    score += 2;
    reasons.push("Strong community rating");
  } else if (rating >= 4.0) {
    score += 1;
  }
  return { score, reasons };
}

function needScore(spot: Spot, need: string) {
  const n = normalize(need);
  const text = combinedText(spot);
  let score = 0;
  const reasons: string[] = [];

  const isBudget = includesAny(text, [
    "₱",
    "80",
    "90",
    "100",
    "budget",
    "cheap",
    "sulit",
    "student",
  ]);
  const isCafe = includesAny(text, ["coffee", "cafe", "espresso"]);
  const isSnacky = includesAny(text, [
    "snack",
    "bakery",
    "bake",
    "bread",
    "quick",
    "merienda",
  ]);
  const isStudy = includesAny(text, [
    "study",
    "quiet",
    "wifi",
    "work",
    "student friendly",
  ]);
  const isDate = includesAny(text, [
    "date",
    "cozy",
    "romantic",
    "aesthetic",
    "ambience",
  ]);

  if (n.includes("broke")) {
    if (isBudget) {
      score += 8;
      reasons.push("Fits a budget-friendly spend");
    }
    if (includesAny(text, ["student", "sulit", "value"])) {
      score += 3;
      reasons.push("Great value for students");
    }
    if (includesAny(text, ["premium", "expensive", "fine dining"])) score -= 4;
  } else if (n.includes("study")) {
    if (isStudy) {
      score += 8;
      reasons.push("Has study-friendly signals (quiet/Wi-Fi/work vibe)");
    }
    if (isCafe) {
      score += 3;
      reasons.push("Cafe-type place works for long stays");
    }
    if (includesAny(text, ["loud", "bar", "party"])) score -= 4;
  } else if (n.includes("snack")) {
    if (isSnacky) {
      score += 8;
      reasons.push("Strong snack/quick-bite match");
    }
    if (isCafe) {
      score += 2;
      reasons.push("Good for light bites and drinks");
    }
    if (includesAny(text, ["full meal", "buffet"])) score -= 3;
  } else if (n.includes("date")) {
    if (isDate) {
      score += 8;
      reasons.push("Good ambience for a date");
    }
    if (includesAny(text, ["cozy", "quiet", "aesthetic"])) {
      score += 3;
      reasons.push("Comfortable and pleasant atmosphere");
    }
    if (includesAny(text, ["crowded", "fast food", "noisy"])) score -= 3;
  } else {
    if (includesAny(text, ["student", "popular", "favorite"])) {
      score += 4;
      reasons.push("Reliable student favorite");
    }
    if (isBudget) score += 1;
  }

  return { score, reasons };
}

function stableTieBreaker(spot: Spot, need: string) {
  const seed = `${need}:${spot.id}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return (h % 10) / 100;
}

function toConfidence(score: number, min: number, max: number) {
  if (max <= min) return 85;
  const norm = (score - min) / (max - min);
  return Math.round(70 + norm * 28); // 70..98
}

export function buildRecommendations(
  spots: Spot[],
  need: string,
): RecommendationResult {
  if (!spots?.length) {
    return {
      featured: null,
      alternatives: [],
      reason: null,
      featuredConfidence: 0,
      ranked: [],
    };
  }

  const scored = spots.map((spot) => {
    const b = baseScore(spot);
    const n = needScore(spot, need);
    const score = b.score + n.score + stableTieBreaker(spot, need);
    const reasons = [...n.reasons, ...b.reasons];
    return { spot, score, reasons };
  });

  const rawScores = scored.map((s) => s.score);
  const min = Math.min(...rawScores);
  const max = Math.max(...rawScores);

  const ranked: RankedSpot[] = scored
    .map((s) => ({
      ...s,
      confidence: toConfidence(s.score, min, max),
    }))
    .sort((a, b) => b.score - a.score);

  const featuredPack = ranked[0];
  const featured = featuredPack?.spot ?? null;
  const alternatives = ranked
    .slice(1)
    .map((r) => r.spot)
    .filter((s) => s.id !== featured?.id)
    .slice(0, 3);

  const reason = featuredPack
    ? {
        title: "Why chosen for you",
        bullets: featuredPack.reasons.length
          ? featuredPack.reasons.slice(0, 3)
          : ["Best overall match for your selected need"],
      }
    : null;

  return {
    featured,
    alternatives,
    reason,
    featuredConfidence: featuredPack?.confidence ?? 0,
    ranked,
  };
}

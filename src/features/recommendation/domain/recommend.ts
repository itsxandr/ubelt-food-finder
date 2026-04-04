import type { Spot } from "@/src/types/spot";

export type RecommendationBundle = {
  featured: Spot | null;
  alternatives: Spot[];
};

function hasTag(spot: Spot, tag: string) {
  return (spot.vibe_tags || []).some(
    (t) => t.toLowerCase() === tag.toLowerCase(),
  );
}

function scoreSpot(spot: Spot, need: string) {
  const n = need.toLowerCase();
  let score = 0;

  // Basic fallback score
  score += 1;

  // Map needs to tags (adjust to your real dataset tags)
  if (n.includes("broke") || n.includes("budget")) {
    if (hasTag(spot, "Petsa de Peligro") || hasTag(spot, "Budget")) score += 5;
    if (spot.price_category?.includes("₱")) score += 1;
  }

  if (n.includes("study")) {
    if (hasTag(spot, "WiFi") || hasTag(spot, "Study")) score += 5;
  }

  if (n.includes("snack")) {
    if (hasTag(spot, "Quick bite") || hasTag(spot, "Snack")) score += 5;
  }

  if (n.includes("date")) {
    if (hasTag(spot, "Date spot") || hasTag(spot, "Cozy")) score += 5;
  }

  if (n.includes("protein")) {
    if (hasTag(spot, "Gym Bro Approved") || hasTag(spot, "High protein"))
      score += 5;
  }

  return score;
}

export function buildRecommendations(
  spots: Spot[],
  need: string,
): RecommendationBundle {
  if (!spots.length) return { featured: null, alternatives: [] };

  const ranked = [...spots]
    .map((spot) => ({ spot, score: scoreSpot(spot, need) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.spot);

  const featured = ranked[0] ?? null;
  const alternatives = ranked.slice(1, 4); // max 3 alternatives

  return { featured, alternatives };
}

export function randomPick(spots: Spot[], excludeId?: string): Spot | null {
  const pool = excludeId ? spots.filter((s) => s.id !== excludeId) : spots;
  if (!pool.length) return null;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

import { useHomeController } from "@/src/features/home/hooks/useHomeController";
import { buildRecommendations } from "@/src/features/recommendation/domain/recommend";
import type { Spot } from "@/src/types/spot";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function goToDetail(spot: Spot) {
  router.push({
    pathname: "/detail",
    params: {
      id: spot.id,
      name: spot.name,
      address: spot.address,
      price: spot.price_category || "₱80–₱120",
      tags: (spot.vibe_tags || []).join(", "),
    },
  });
}

const ROLL_MS = 1200;

export default function PickResultScreen() {
  const { need, featuredId } = useLocalSearchParams<{
    need?: string;
    featuredId?: string;
  }>();

  const selectedNeed = need || "Pick for me";
  const { allSpots, loading } = useHomeController();

  const recs = useMemo(
    () => buildRecommendations(allSpots, selectedNeed),
    [allSpots, selectedNeed],
  );

  const pool = useMemo(() => {
    const all = [recs.featured, ...recs.alternatives].filter(Boolean) as Spot[];
    const seen = new Set<string>();
    return all.filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [recs.featured, recs.alternatives]);

  const initialIndex = useMemo(() => {
    if (!pool.length) return 0;
    const idx = pool.findIndex((s) => s.id === featuredId);
    return idx >= 0 ? idx : 0;
  }, [pool, featuredId]);

  const [index, setIndex] = useState(initialIndex);
  const [history, setHistory] = useState<number[]>([initialIndex]);
  const [rolling, setRolling] = useState(true);

  useEffect(() => {
    if (!pool.length) return;
    setRolling(true);
    const t = setTimeout(() => setRolling(false), ROLL_MS);
    return () => clearTimeout(t);
  }, [index, pool.length]);

  const reroll = () => {
    if (pool.length <= 1) return;

    const candidates = pool
      .map((_, i) => i)
      .filter((i) => i !== index && !history.includes(i));

    const next =
      candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : pool.map((_, i) => i).filter((i) => i !== index)[0];

    setIndex(next);
    setHistory((prev) => {
      const merged = [...prev, next];
      return merged.slice(-Math.min(5, pool.length));
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Picking your best match...</Text>
      </View>
    );
  }

  if (!pool.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No spots available.</Text>
        <Text style={styles.emptySub}>Try another need.</Text>

        <Pressable
          style={styles.pillMuted}
          onPress={() => router.replace("/need")}
        >
          <Text style={styles.pillMutedText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const spot = pool[index];

  return (
    <View style={styles.container}>
      <Text style={styles.heroTitle}>Pick For Me!</Text>
      <Text style={styles.needText}>{selectedNeed}</Text>

      <View style={styles.stage}>
        {rolling ? (
          <View style={styles.rollWrap}>
            <Text style={styles.dice}>🎲</Text>
            <Text style={styles.rolling}>Rolling...</Text>
            <Text style={styles.hint}>Finding your best match</Text>
          </View>
        ) : (
          <Pressable style={styles.card} onPress={() => goToDetail(spot)}>
            <Text style={styles.cardTitle}>{spot.name}</Text>
            <Text style={styles.cardMeta}>{spot.address}</Text>
            <Text style={styles.cardMeta}>
              {spot.price_category || "₱80–₱120"} •{" "}
              {spot.vibe_tags?.slice(0, 2).join(" • ") || "Student favorite"}
            </Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.swipeHint}>↓ swipe down</Text>

      <View style={styles.bottomRow}>
        <Pressable style={styles.pillPrimary} onPress={reroll}>
          <Text style={styles.pillPrimaryText}>
            {pool.length > 1 ? "Reroll" : "Only one option"}
          </Text>
        </Pressable>

        <Pressable style={styles.pillMuted} onPress={() => router.back()}>
          <Text style={styles.pillMutedText}>Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  heroTitle: {
    textAlign: "center",
    fontSize: 44,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },
  needText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
    fontWeight: "600",
  },

  stage: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  rollWrap: { alignItems: "center" },
  dice: { fontSize: 56, marginBottom: 8 },
  rolling: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  hint: { color: "#777" },

  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },
  cardMeta: { color: "#555", marginBottom: 2 },

  swipeHint: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 12,
    color: "#6B6B6B",
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  pillPrimary: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  pillPrimaryText: { color: "#FFF", fontWeight: "700" },

  pillMuted: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  pillMutedText: { color: "#111", fontWeight: "700" },

  loadingText: { fontSize: 16, color: "#333" },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    color: "#111",
  },
  emptySub: { color: "#666", marginBottom: 16 },
});

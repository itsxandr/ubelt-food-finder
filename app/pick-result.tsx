import { useHomeController } from "@/src/features/home/hooks/useHomeController";
import { buildRecommendations } from "@/src/features/recommendation/domain/recommend";
import type { Spot } from "@/src/types/spot";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
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
      <View style={styles.container}>
        <Text>Loading pick...</Text>
      </View>
    );
  }

  if (!pool.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyTitle}>No spots available right now.</Text>
        <Text style={styles.emptySub}>Try changing your need.</Text>

        <Pressable
          style={styles.btnSecondary}
          onPress={() => router.replace("/need")}
        >
          <Text style={styles.btnSecondaryText}>Back to Need</Text>
        </Pressable>
      </View>
    );
  }

  const spot = pool[index];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.context}>{selectedNeed}</Text>
      </View>

      <Text style={styles.title}>Your pick</Text>

      <Pressable style={styles.card} onPress={() => goToDetail(spot)}>
        <Text style={styles.label}>Chosen for you</Text>
        <Text style={styles.name}>{spot.name}</Text>
        <Text style={styles.meta}>{spot.address}</Text>
        <Text style={styles.meta}>
          {spot.price_category || "₱80–₱120"} •{" "}
          {spot.vibe_tags?.slice(0, 2).join(" • ") || "Student favorite"}
        </Text>
      </Pressable>

      <Pressable style={styles.btnPrimary} onPress={reroll}>
        <Text style={styles.btnPrimaryText}>
          {pool.length > 1 ? "Reroll pick" : "Only one match available"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.btnSecondary}
        onPress={() => router.replace("/need")}
      >
        <Text style={styles.btnSecondaryText}>Change need</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 56 },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: { paddingVertical: 6, paddingRight: 8 },
  backText: { fontWeight: "700", color: "#111" },
  context: { color: "#666", fontWeight: "600" },

  title: { fontSize: 24, fontWeight: "800", marginTop: 8, marginBottom: 14 },

  card: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "white",
  },
  label: { color: "#FF5A5F", fontWeight: "700", marginBottom: 4 },
  name: { fontSize: 18, fontWeight: "800" },
  meta: { color: "#555", marginTop: 2 },

  btnPrimary: {
    backgroundColor: "#FF5A5F",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  btnPrimaryText: { color: "white", fontWeight: "800" },

  btnSecondary: {
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnSecondaryText: { color: "#111", fontWeight: "700" },

  emptyTitle: { fontSize: 20, fontWeight: "800", marginBottom: 8 },
  emptySub: { color: "#555", marginBottom: 16 },
});

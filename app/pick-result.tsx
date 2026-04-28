import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppCard } from "@/src/components/ui/AppCard";
import { useHomeController } from "@/src/features/home/hooks/useHomeController";
import { buildRecommendations } from "@/src/features/recommendation/domain/recommend";
import { colors, radius, space, type } from "@/src/theme/tokens";
import type { Spot } from "@/src/types/spot";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ROLL_MS = 1200;

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
      <AppScreen contentStyle={styles.centered}>
        <Text style={styles.loadingText}>Picking your best match...</Text>
      </AppScreen>
    );
  }

  if (!pool.length) {
    return (
      <AppScreen contentStyle={styles.centered}>
        <Text style={styles.emptyTitle}>No spots available.</Text>
        <Text style={styles.emptySub}>Try another need.</Text>
        <View style={styles.singleAction}>
          <AppButton
            label="Go Back"
            variant="muted"
            onPress={() => router.replace("/need")}
          />
        </View>
      </AppScreen>
    );
  }

  const spot = pool[index];

  return (
    <AppScreen>
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
          <Pressable onPress={() => goToDetail(spot)}>
            <AppCard style={styles.resultCard}>
              <Text style={styles.cardTitle}>{spot.name}</Text>
              <Text style={styles.cardMeta}>{spot.address}</Text>
              <Text style={styles.cardMeta}>
                {spot.price_category || "₱80–₱120"} •{" "}
                {spot.vibe_tags?.slice(0, 2).join(" • ") || "Student favorite"}
              </Text>
            </AppCard>
          </Pressable>
        )}
      </View>

      <Text style={styles.swipeHint}>↓ swipe down</Text>

      <View style={styles.bottomRow}>
        <View style={styles.action}>
          <AppButton
            label={pool.length > 1 ? "Reroll" : "Only one option"}
            onPress={reroll}
            variant="primary"
            fullWidth
          />
        </View>

        <View style={styles.action}>
          <AppButton
            label="Go Back"
            onPress={() => router.back()}
            variant="muted"
            fullWidth
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    textAlign: "center",
    fontSize: type.hero,
    fontWeight: "800",
    color: colors.text,
    marginBottom: space.xs,
  },
  needText: {
    textAlign: "center",
    color: colors.mutedText,
    marginBottom: space.lg,
    fontWeight: "600",
  },

  stage: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    justifyContent: "center",
    padding: space.md,
  },

  rollWrap: { alignItems: "center" },
  dice: { fontSize: 56, marginBottom: space.sm },
  rolling: {
    fontSize: type.h1,
    fontWeight: "800",
    marginBottom: space.xs,
    color: colors.text,
  },
  hint: { color: colors.mutedText },

  resultCard: {
    width: "100%",
    borderRadius: radius.lg,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  cardMeta: { color: colors.subtext, marginBottom: 2 },

  swipeHint: {
    textAlign: "center",
    marginTop: space.sm,
    marginBottom: space.md,
    color: colors.mutedText,
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    gap: space.sm,
  },
  action: { flex: 1 },

  loadingText: { fontSize: type.body, color: colors.text },

  emptyTitle: {
    fontSize: type.h1,
    fontWeight: "800",
    marginBottom: space.sm,
    color: colors.text,
  },
  emptySub: { color: colors.mutedText, marginBottom: space.lg },
  singleAction: { width: "100%" },
});

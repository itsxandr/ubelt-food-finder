import { useHomeController } from "@/src/features/home/hooks/useHomeController";
import { buildRecommendations } from "@/src/features/recommendation/domain/recommend";
import type { Spot } from "@/src/types/spot";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function SpotMiniCard({
  spot,
  label,
  onPress,
}: {
  spot: Spot;
  label?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.miniCard} onPress={onPress}>
      {label ? <Text style={styles.miniLabel}>{label}</Text> : null}
      <Text style={styles.miniName}>{spot.name}</Text>
      <Text style={styles.miniMeta} numberOfLines={1}>
        {spot.address}
      </Text>
    </Pressable>
  );
}

export default function ResultScreen() {
  const { need } = useLocalSearchParams<{ need?: string }>();
  const selectedNeed = need || "Pick for me";

  const { allSpots, loading } = useHomeController();

  const recs = useMemo(
    () => buildRecommendations(allSpots, selectedNeed),
    [allSpots, selectedNeed],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading top picks...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heroTitle}>Top Picks!</Text>
      <Text style={styles.subTitle}>Based on your vibe: {selectedNeed}</Text>

      <View style={styles.stage}>
        <Text style={styles.sectionTitle}>Top pick</Text>

        {recs.featured ? (
          <>
            <View style={styles.confRow}>
              <Text style={styles.confBadge}>
                {recs.featuredConfidence}% match
              </Text>
            </View>

            <Pressable
              style={styles.heroCard}
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: {
                    id: recs.featured!.id,
                    name: recs.featured!.name,
                    address: recs.featured!.address,
                    price: recs.featured!.price_category || "₱80–₱120",
                    tags: (recs.featured!.vibe_tags || []).join(", "),
                  },
                })
              }
            >
              <Text style={styles.heroCardLabel}>Chosen for you</Text>
              <Text style={styles.heroCardName}>{recs.featured.name}</Text>
              <Text style={styles.heroCardMeta}>{recs.featured.address}</Text>
              <Text style={styles.heroCardMeta}>
                {recs.featured.price_category || "₱80–₱120"} •{" "}
                {recs.featured.vibe_tags?.slice(0, 2).join(" • ") ||
                  "Student favorite"}
              </Text>
            </Pressable>

            {recs.reason ? (
              <View style={styles.whyBox}>
                <Text style={styles.whyTitle}>{recs.reason.title}</Text>
                {recs.reason.bullets.slice(0, 2).map((b, i) => (
                  <Text key={`${b}-${i}`} style={styles.whyBullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.emptyText}>No top pick available yet.</Text>
        )}

        <Pressable
          style={styles.pickBtn}
          onPress={() =>
            router.push({
              pathname: "/pick-result",
              params: {
                need: selectedNeed,
                featuredId: recs.featured?.id || "",
              },
            })
          }
        >
          <Text style={styles.pickBtnText}>Pick For Me!</Text>
          <Text style={styles.pickBtnSub}>Tap for a surprise pick</Text>
        </Pressable>

        <Text style={styles.altTitle}>Alternatives</Text>
        <View style={styles.altList}>
          {recs.alternatives.map((s, i) => (
            <SpotMiniCard
              key={s.id}
              spot={s}
              label={i === 0 ? "Alt 1" : i === 1 ? "Alt 2" : "Alt 3"}
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: {
                    id: s.id,
                    name: s.name,
                    address: s.address,
                    price: s.price_category || "₱80–₱120",
                    tags: (s.vibe_tags || []).join(", "),
                  },
                })
              }
            />
          ))}
        </View>
      </View>

      <Text style={styles.swipeHint}>↓ swipe down</Text>

      <View style={styles.bottomRow}>
        <Pressable
          style={styles.pillMuted}
          onPress={() => router.push("/need")}
        >
          <Text style={styles.pillMutedText}>Change Need</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    backgroundColor: "#F7F7F7",
  },
  centered: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: { color: "#333", fontSize: 16 },

  heroTitle: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },
  subTitle: {
    textAlign: "center",
    color: "#666",
    fontWeight: "600",
    marginBottom: 14,
  },

  stage: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    backgroundColor: "#FFF",
    padding: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },

  confRow: { marginBottom: 8 },
  confBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF8EE",
    color: "#157347",
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
  },

  heroCard: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginBottom: 10,
  },
  heroCardLabel: { color: "#111", fontWeight: "700", marginBottom: 4 },
  heroCardName: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  heroCardMeta: { color: "#555", marginBottom: 2 },

  whyBox: {
    borderWidth: 1,
    borderColor: "#ECECEC",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  whyTitle: { fontWeight: "800", marginBottom: 4, color: "#111" },
  whyBullet: { color: "#444", marginBottom: 2, fontSize: 13 },

  pickBtn: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 12,
  },
  pickBtnText: { color: "#FFF", fontSize: 22, fontWeight: "800" },
  pickBtnSub: { color: "#DDD", marginTop: 2, fontWeight: "600" },

  altTitle: { fontSize: 15, fontWeight: "800", marginBottom: 8, color: "#111" },
  altList: { gap: 8 },

  miniCard: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    backgroundColor: "#FFF",
    padding: 10,
  },
  miniLabel: {
    color: "#555",
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "700",
  },
  miniName: { color: "#111", fontWeight: "800" },
  miniMeta: { color: "#666", marginTop: 2, fontSize: 12 },

  emptyText: { color: "#666", marginBottom: 12 },

  swipeHint: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 12,
    color: "#6B6B6B",
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  pillMuted: {
    backgroundColor: "#EFEFEF",
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  pillMutedText: { color: "#111", fontWeight: "700" },
});

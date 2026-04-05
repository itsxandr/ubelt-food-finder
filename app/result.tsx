import { useHomeController } from "@/src/features/home/hooks/useHomeController";
import { buildRecommendations } from "@/src/features/recommendation/domain/recommend";
import type { Spot } from "@/src/types/spot";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function SpotCard({
  spot,
  label,
  onPress,
}: {
  spot: Spot;
  label?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={styles.name}>{spot.name}</Text>
      <Text style={styles.meta}>{spot.address}</Text>
      <Text style={styles.meta}>
        {spot.price_category || "₱80–₱120"} •{" "}
        {spot.vibe_tags?.slice(0, 2).join(" • ") || "Student favorite"}
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
      <View style={styles.container}>
        <Text>Loading recommendations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{selectedNeed} near you</Text>
        <Pressable
          style={styles.changeBtn}
          onPress={() => router.push("/need")}
        >
          <Text style={styles.changeText}>Change</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.pickBtn}
        onPress={() =>
          router.push({
            pathname: "/pick-result",
            params: { need: selectedNeed, featuredId: recs.featured?.id || "" },
          })
        }
      >
        <Text style={styles.pickText}>Pick for me</Text>
        <Text style={styles.pickSub}>We’ll choose the best one for you</Text>
      </Pressable>

      <Text style={styles.section}>Top pick</Text>

      {recs.featured ? (
        <>
          <View style={styles.confRow}>
            <Text style={styles.confBadge}>
              {recs.featuredConfidence}% match
            </Text>
          </View>

          <SpotCard
            spot={recs.featured}
            label="Chosen for you"
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
          />

          {recs.reason ? (
            <View style={styles.whyBox}>
              <Text style={styles.whyTitle}>{recs.reason.title}</Text>
              {recs.reason.bullets.map((b, i) => (
                <Text key={`${b}-${i}`} style={styles.whyBullet}>
                  • {b}
                </Text>
              ))}
            </View>
          ) : null}
        </>
      ) : (
        <Text>No featured recommendation yet.</Text>
      )}

      <Text style={styles.section}>Alternatives</Text>
      {recs.alternatives.map((s, i) => (
        <SpotCard
          key={s.id}
          spot={s}
          label={
            i === 0 ? "Student favorite" : i === 1 ? "Quick bite" : "Nearby"
          }
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 56 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  header: { fontSize: 24, fontWeight: "800", maxWidth: "75%" },

  changeBtn: {
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  changeText: { fontWeight: "700" },

  pickBtn: {
    backgroundColor: "#FF5A5F",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  pickText: { color: "white", fontWeight: "800", fontSize: 16 },
  pickSub: { color: "white", opacity: 0.9, marginTop: 3 },

  section: { fontSize: 16, fontWeight: "800", marginBottom: 8, marginTop: 8 },

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

  card: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "white",
  },
  label: { color: "#FF5A5F", fontWeight: "700", marginBottom: 4 },
  name: { fontSize: 16, fontWeight: "800" },
  meta: { color: "#555", marginTop: 2 },

  whyBox: {
    borderWidth: 1,
    borderColor: "#F2D9DA",
    backgroundColor: "#FFF7F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  whyTitle: { fontWeight: "800", marginBottom: 6 },
  whyBullet: { color: "#444", marginBottom: 3 },
});

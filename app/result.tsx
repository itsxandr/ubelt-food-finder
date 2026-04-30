import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppCard } from "@/src/components/ui/AppCard";
import { useHomeController } from "@/src/features/home/hooks/useHomeController";
import { buildRecommendations } from "@/src/features/recommendation/domain/recommend";
import { accent, colors, radius, space, type } from "@/src/theme/tokens";
import type { Spot } from "@/src/types/spot";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

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
    <Pressable onPress={onPress}>
      <AppCard style={styles.miniCard}>
        {label ? <Text style={styles.miniLabel}>{label}</Text> : null}
        <Text style={styles.miniName}>{spot.name}</Text>
        <Text style={styles.miniMeta} numberOfLines={1}>
          {spot.address}
        </Text>
      </AppCard>
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

  const { width } = useWindowDimensions();
  const maxWidth = 360;
  const horizontalPad = Math.max(20, Math.min(32, Math.round(width * 0.08)));
  const contentWidth = Math.min(width - horizontalPad * 2, maxWidth);

  if (loading) {
    return (
      <AppScreen contentStyle={styles.centered}>
        <Text style={styles.loadingText}>Loading top picks...</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <View style={[styles.centerWrap, { paddingHorizontal: horizontalPad }]}>
        <View style={[styles.topCard, { width: contentWidth }]}>
          <Text style={styles.topTitle}>Top Picks!</Text>
          <Text style={styles.topSub}>Based on your vibe: {selectedNeed}</Text>

          {recs.featured ? (
            <>
              <View style={styles.confRow}>
                <Text style={styles.confBadge}>
                  {recs.featuredConfidence}% match
                </Text>
              </View>

              <Pressable
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
                <AppCard style={styles.heroCard}>
                  <Text style={styles.heroCardLabel}>Chosen for you</Text>
                  <Text style={styles.heroCardName}>{recs.featured.name}</Text>
                  <Text style={styles.heroCardMeta}>
                    {recs.featured.address}
                  </Text>
                  <Text style={styles.heroCardMeta}>
                    {recs.featured.price_category || "₱80–₱120"} •{" "}
                    {recs.featured.vibe_tags?.slice(0, 2).join(" • ") ||
                      "Student favorite"}
                  </Text>
                </AppCard>
              </Pressable>

              {recs.reason ? (
                <AppCard style={styles.whyBox}>
                  <Text style={styles.whyTitle}>{recs.reason.title}</Text>
                  {recs.reason.bullets.slice(0, 2).map((b, i) => (
                    <Text key={`${b}-${i}`} style={styles.whyBullet}>
                      • {b}
                    </Text>
                  ))}
                </AppCard>
              ) : null}
            </>
          ) : (
            <Text style={styles.emptyText}>No top pick available yet.</Text>
          )}

          <AppButton
            label="Pick For Me!"
            onPress={() =>
              router.push({
                pathname: "/pick-result",
                params: {
                  need: selectedNeed,
                  featuredId: recs.featured?.id || "",
                },
              })
            }
            fullWidth
          />
          <Text style={styles.pickBtnSub}>Tap for a surprise pick</Text>

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

        <View style={styles.bottomRow}>
          <AppButton
            label="Change Need"
            variant="muted"
            onPress={() => router.push("/need")}
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
  loadingText: { color: colors.text, fontSize: type.body },

  centerWrap: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 40,
    gap: 16,
  },

  topCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },

  topTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  topSub: {
    color: colors.mutedText,
    fontWeight: "600",
    marginBottom: 16,
  },

  confRow: { marginBottom: space.sm },
  confBadge: {
    alignSelf: "flex-start",
    backgroundColor: accent[50],
    color: accent[700],
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    fontSize: type.small,
    borderWidth: 1,
    borderColor: accent[200],
  },

  heroCard: {
    marginBottom: space.sm,
    borderRadius: 18,
  },
  heroCardLabel: { color: colors.text, fontWeight: "700", marginBottom: 4 },
  heroCardName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  heroCardMeta: { color: colors.subtext, marginBottom: 2 },

  whyBox: {
    backgroundColor: colors.soft,
    marginBottom: space.md,
    borderRadius: 16,
  },
  whyTitle: { fontWeight: "800", marginBottom: 4, color: colors.text },
  whyBullet: { color: colors.mutedText, marginBottom: 2, fontSize: type.small },

  pickBtnSub: {
    color: colors.mutedText,
    marginTop: 6,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },

  altTitle: {
    fontSize: type.body,
    fontWeight: "800",
    marginBottom: space.sm,
    color: colors.text,
  },
  altList: { gap: 8 },

  miniCard: {
    padding: 10,
    borderRadius: 14,
  },
  miniLabel: {
    color: colors.subtext,
    fontSize: type.small,
    marginBottom: 2,
    fontWeight: "700",
  },
  miniName: { color: colors.text, fontWeight: "800" },
  miniMeta: { color: colors.mutedText, marginTop: 2, fontSize: type.small },

  emptyText: { color: colors.mutedText, marginBottom: 12 },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

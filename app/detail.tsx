import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppCard } from "@/src/components/ui/AppCard";
import { colors, radius, space, type } from "@/src/theme/tokens";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

function parseTags(raw?: string) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function DetailScreen() {
  const { name, address, price, tags } = useLocalSearchParams<{
    id?: string;
    name?: string;
    address?: string;
    price?: string;
    tags?: string;
  }>();

  const tagList = parseTags(tags);
  const displayName = name || "Unknown spot";
  const displayAddress = address || "Address unavailable";
  const displayPrice = price || "₱80–₱120";

  return (
    <AppScreen scroll>
      <Text style={styles.heroTitle}>Spot Details</Text>

      <View style={styles.stage}>
        <View style={styles.imageMock}>
          <Text style={styles.imageMockText}>Food Photo</Text>
        </View>

        <AppCard>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.meta}>{displayAddress}</Text>
          <Text style={styles.meta}>{displayPrice}</Text>

          <Text style={styles.sectionTitle}>Vibe Tags</Text>
          {tagList.length ? (
            <View style={styles.tagsWrap}>
              {tagList.map((tag, i) => (
                <View key={`${tag}-${i}`} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyTags}>No tags available.</Text>
          )}

          <View style={styles.ratingRow}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>Community favorite</Text>
          </View>
        </AppCard>
      </View>

      <Text style={styles.swipeHint}>↓ swipe down</Text>

      <View style={styles.bottomRow}>
        <View style={styles.action}>
          <AppButton
            label="← Go Back"
            variant="muted"
            onPress={() => router.back()}
            fullWidth
          />
        </View>
        <View style={styles.action}>
          <AppButton label="Open in Maps" onPress={() => {}} fullWidth />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    textAlign: "center",
    fontSize: type.hero,
    fontWeight: "800",
    color: colors.text,
    marginBottom: space.md,
  },

  stage: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: space.md,
  },

  imageMock: {
    height: 170,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: space.md,
  },
  imageMockText: {
    color: colors.mutedText,
    fontWeight: "700",
  },

  name: {
    fontSize: type.h1,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  meta: {
    color: colors.subtext,
    marginBottom: 2,
  },

  sectionTitle: {
    marginTop: space.sm,
    marginBottom: space.sm,
    fontSize: type.body,
    fontWeight: "800",
    color: colors.text,
  },

  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  tagPill: {
    backgroundColor: colors.mutedBtn,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: "#333",
    fontWeight: "700",
    fontSize: type.small,
  },

  emptyTags: {
    color: colors.mutedText,
    fontSize: 13,
  },

  ratingRow: {
    marginTop: space.md,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    color: "#F4B400",
    fontSize: type.body,
    marginRight: 6,
  },
  ratingText: {
    color: colors.mutedText,
    fontWeight: "600",
  },

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
});

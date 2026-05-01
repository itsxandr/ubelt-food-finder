import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppCard } from "@/src/components/ui/AppCard";
import { AppChip } from "@/src/components/ui/AppChip";
import { AppPageTitle } from "@/src/components/ui/AppPageTitle";
import { AppStage } from "@/src/components/ui/AppStage";
import { AppSwipeHint } from "@/src/components/ui/AppSwipeHint";
import { useSpotSelection } from "@/src/context/SpotSelectionContext";
import { colors, radius, size, space, type } from "@/src/theme/tokens";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

function parseTags(raw?: string) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function pickDisplayValue(
  value?: string,
  fallback?: string,
  defaultValue?: string,
) {
  if (value !== undefined && value !== null) return value;
  if (fallback !== undefined && fallback !== null) return fallback;
  return defaultValue ?? "";
}

export default function DetailScreen() {
  const { id, name, address, price, tags } = useLocalSearchParams<{
    id?: string;
    name?: string;
    address?: string;
    price?: string;
    tags?: string;
  }>();

  const { selectedSpot } = useSpotSelection();
  const matchedSpot =
    selectedSpot && (!id || selectedSpot.id === id) ? selectedSpot : undefined;
  const tagList = matchedSpot?.vibe_tags?.length
    ? matchedSpot.vibe_tags
    : parseTags(tags);
  const displayName = pickDisplayValue(
    matchedSpot?.name,
    name,
    "Unknown spot",
  );
  const displayAddress = pickDisplayValue(
    matchedSpot?.address,
    address,
    "Address unavailable",
  );
  const displayPrice = pickDisplayValue(
    matchedSpot?.price_category,
    price,
    "₱80–₱120",
  );

  return (
    <AppScreen scroll>
      <AppPageTitle style={styles.heroTitle}>Spot Details</AppPageTitle>

      <AppStage>
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
                <AppChip
                  key={`${tag}-${i}`}
                  label={tag}
                  variant="solid"
                  size="sm"
                />
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
      </AppStage>

      <AppSwipeHint>↓ swipe down</AppSwipeHint>

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
    marginBottom: space.md,
  },

  imageMock: {
    height: size.imageLg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.placeholderBorder,
    backgroundColor: colors.placeholder,
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
    marginBottom: space.micro,
  },
  meta: {
    color: colors.subtext,
    marginBottom: space.xxs,
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

  emptyTags: {
    color: colors.mutedText,
    fontSize: type.small,
  },

  ratingRow: {
    marginTop: space.md,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    color: colors.star,
    fontSize: type.body,
    marginRight: space.xs,
  },
  ratingText: {
    color: colors.mutedText,
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    gap: space.sm,
  },
  action: { flex: 1 },
});

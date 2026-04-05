import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heroTitle}>Spot Details</Text>

      <View style={styles.stage}>
        <View style={styles.imageMock}>
          <Text style={styles.imageMockText}>Food Photo</Text>
        </View>

        <View style={styles.card}>
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
        </View>
      </View>

      <Text style={styles.swipeHint}>↓ swipe down</Text>

      <View style={styles.bottomRow}>
        <Pressable style={styles.pillMuted} onPress={() => router.back()}>
          <Text style={styles.pillMutedText}>← Go Back</Text>
        </Pressable>

        <Pressable style={styles.pillPrimary}>
          <Text style={styles.pillPrimaryText}>Open in Maps</Text>
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

  heroTitle: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
  },

  stage: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    backgroundColor: "#FFF",
    padding: 14,
  },

  imageMock: {
    height: 170,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imageMockText: {
    color: "#666",
    fontWeight: "700",
  },

  card: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  meta: {
    color: "#555",
    marginBottom: 2,
  },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
  },

  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    backgroundColor: "#EFEFEF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 12,
  },

  emptyTags: {
    color: "#777",
    fontSize: 13,
  },

  ratingRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    color: "#F4B400",
    fontSize: 14,
    marginRight: 6,
  },
  ratingText: {
    color: "#666",
    fontWeight: "600",
  },

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

  pillMuted: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  pillMutedText: {
    color: "#111",
    fontWeight: "700",
  },

  pillPrimary: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  pillPrimaryText: {
    color: "#FFF",
    fontWeight: "700",
  },
});

import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const QUICK_NEEDS = [
  "I’m broke",
  "I need to study",
  "I want a snack",
  "Date spot",
  "Pick for me",
];

const MORE_NEEDS = [
  "Place to Study",
  "Budget Meal",
  "Snack",
  "Date Spot",
  "TikTok Trending",
  "Coffee",
  "Samgyup",
  "Inuman",
  "Pick for me",
];

export default function NeedScreen() {
  const [showMore, setShowMore] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const displayedNeeds = useMemo(
    () => (showMore ? MORE_NEEDS : QUICK_NEEDS),
    [showMore],
  );

  const pickNeed = (need: string) => {
    if (typeof window !== "undefined") {
      if (dontShowAgain) {
        window.localStorage.setItem("foodtrip_dont_show_need", "1");
      } else {
        window.localStorage.removeItem("foodtrip_dont_show_need");
      }
    }

    router.push({
      pathname: "/result",
      params: { need },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you need right now?</Text>

      {!showMore ? (
        <View style={styles.quickGrid}>
          {displayedNeeds.map((need) => {
            const isPick = need.toLowerCase() === "pick for me";
            return (
              <Pressable
                key={need}
                style={[styles.quickTile, isPick && styles.quickTileWide]}
                onPress={() => pickNeed(need)}
              >
                <Text style={styles.quickTileText}>{need}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.listWrap}>
          {displayedNeeds.map((need) => (
            <Pressable
              key={need}
              style={styles.pill}
              onPress={() => pickNeed(need)}
            >
              <Text style={styles.pillText}>{need}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable style={styles.moreBtn} onPress={() => setShowMore((v) => !v)}>
        <Text style={styles.moreBtnText}>
          {showMore ? "Show Less" : "More Options"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.checkRow}
        onPress={() => setDontShowAgain((v) => !v)}
      >
        <View style={[styles.checkbox, dontShowAgain && styles.checkboxOn]} />
        <Text style={styles.checkText}>Don’t show me again</Text>
      </Pressable>
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

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  quickTile: {
    width: "48%",
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  quickTileWide: {
    width: "100%",
    minHeight: 64,
  },
  quickTileText: {
    textAlign: "center",
    color: "#111",
    fontWeight: "700",
  },

  listWrap: {
    gap: 10,
    marginBottom: 12,
  },
  pill: {
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#E6E6E6",
    paddingVertical: 11,
    alignItems: "center",
  },
  pillText: {
    color: "#111",
    fontWeight: "700",
  },

  moreBtn: {
    marginTop: 6,
    backgroundColor: "#E2E2E2",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  moreBtnText: {
    fontWeight: "700",
    color: "#333",
  },

  checkRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#DDD",
    borderWidth: 1,
    borderColor: "#C9C9C9",
  },
  checkboxOn: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  checkText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
  },
});

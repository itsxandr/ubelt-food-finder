import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppButton } from "@/src/components/ui/AppButton";
import { accent, colors, type } from "@/src/theme/tokens";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const DONT_SHOW_KEY = "foodtrip_dont_show_need";

const QUICK_NEEDS: readonly string[] = [
  "Budget Meal",
  "Place to Study",
  "Snack",
  "Date Spot",
];

const MORE_NEEDS: readonly string[] = [
  "Budget Meal",
  "Place to Study",
  "Snack",
  "Date Spot",
  "TikTok Trending",
  "Coffee",
  "Samgyup",
  "Inuman",
  "Barbecue",
  "Pastries",
  "Pick for me",
];

type NeedKey = (typeof MORE_NEEDS)[number];

const NEED_ICON: Record<NeedKey, keyof typeof Feather.glyphMap> = {
  // Feather doesn't have a peso glyph, so we render "₱" as text for this one.
  "Budget Meal": "minus" as const,
  "Place to Study": "book-open",
  Snack: "coffee",
  "Date Spot": "heart",
  "TikTok Trending": "trending-up",
  Coffee: "coffee",
  Samgyup: "shopping-bag",
  //Inuman: "wine",
  Barbecue: "activity",
  Pastries: "pie-chart",
  "Pick for me": "shuffle",
};

async function setDontShowNeed(value: boolean) {
  if (Platform.OS === "web") {
    if (value) window.localStorage.setItem(DONT_SHOW_KEY, "1");
    else window.localStorage.removeItem(DONT_SHOW_KEY);
    return;
  }

  if (value) await AsyncStorage.setItem(DONT_SHOW_KEY, "1");
  else await AsyncStorage.removeItem(DONT_SHOW_KEY);
}

export default function NeedScreen() {
  const [showMore, setShowMore] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState<string>(QUICK_NEEDS[0]);

  const { width, height } = useWindowDimensions();

  const maxWidth = 380;
  const horizontalPad = Math.max(20, Math.min(32, Math.round(width * 0.08)));
  const contentWidth = Math.min(width - horizontalPad * 2, maxWidth);

  const topInset = Math.max(14, Math.round(height * 0.08));
  const bottomInset = Math.max(18, Math.round(height * 0.06));

  const displayedNeeds = useMemo<readonly string[]>(
    () => (showMore ? MORE_NEEDS : QUICK_NEEDS),
    [showMore],
  );

  const confirm = async () => {
    try {
      await setDontShowNeed(dontShowAgain);
    } catch {
      // non-blocking
    }

    router.push({
      pathname: "/result",
      params: { need: selectedNeed },
    });
  };

  const renderIcon = (need: string, selected: boolean, size: number) => {
    const color = selected ? accent[600] : colors.text;

    if (need === "Budget Meal") {
      // Peso sign icon (text)
      return (
        <View style={styles.iconWrap}>
          <Text style={[styles.pesoIcon, { color, fontSize: size + 2 }]}>
            ₱
          </Text>
        </View>
      );
    }

    const iconName = NEED_ICON[need as NeedKey] ?? ("help-circle" as const);

    return (
      <View style={styles.iconWrap}>
        <Feather name={iconName} size={size} color={color} />
      </View>
    );
  };

  return (
    <AppScreen>
      <View
        style={[
          styles.centerWrap,
          {
            paddingHorizontal: horizontalPad,
            paddingTop: topInset,
            paddingBottom: bottomInset,
          },
        ]}
      >
        <View style={[styles.content, { width: contentWidth }]}>
          <Text style={styles.title}>What do you need right now?</Text>

          {!showMore ? (
            <View style={styles.grid}>
              {displayedNeeds.map((need) => {
                const isSelected = need === selectedNeed;

                return (
                  <Pressable
                    key={need}
                    style={[
                      styles.gridTile,
                      isSelected && styles.gridTileSelected,
                    ]}
                    onPress={() => setSelectedNeed(need)}
                  >
                    {renderIcon(need, isSelected, 28)}
                    <Text
                      style={[
                        styles.gridTileText,
                        isSelected && styles.gridTileTextSelected,
                      ]}
                    >
                      {need}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.listWrap}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              >
                {displayedNeeds.map((need) => {
                  const isSelected = need === selectedNeed;

                  return (
                    <Pressable
                      key={need}
                      style={[styles.row, isSelected && styles.rowSelected]}
                      onPress={() => setSelectedNeed(need)}
                    >
                      {renderIcon(need, isSelected, 18)}
                      <Text
                        style={[
                          styles.rowText,
                          isSelected && styles.rowTextSelected,
                        ]}
                      >
                        {need}
                      </Text>
                    </Pressable>
                  );
                })}
                <View style={{ height: 110 }} />
              </ScrollView>
            </View>
          )}

          <Pressable
            style={styles.moreBtn}
            onPress={() => setShowMore((v) => !v)}
          >
            <Text style={styles.moreBtnText}>
              {showMore ? "Show Less" : "More Options"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.checkRow}
            onPress={() => setDontShowAgain((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: dontShowAgain }}
          >
            <View
              style={[styles.checkbox, dontShowAgain && styles.checkboxOn]}
            />
            <Text style={styles.checkText}>Don’t Show Again</Text>
          </Pressable>

          <View style={styles.confirmWrap}>
            <AppButton label="Confirm" onPress={confirm} fullWidth />
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },

  title: {
    alignSelf: "flex-start",
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 18,
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    marginBottom: 14,
  },
  gridTile: {
    width: "48%",
    height: 132,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  gridTileSelected: {
    borderColor: accent[600],
    backgroundColor: accent[50],
  },
  gridTileText: {
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    fontSize: 13,
  },
  gridTileTextSelected: {
    color: accent[600],
  },

  listWrap: {
    width: "100%",
    maxHeight: 420,
  },
  listContent: {
    paddingBottom: 12,
    gap: 10,
  },
  row: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  rowSelected: {
    borderColor: accent[600],
    backgroundColor: accent[50],
  },
  rowText: {
    fontWeight: "700",
    color: colors.text,
    fontSize: 14,
  },
  rowTextSelected: {
    color: accent[600],
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pesoIcon: {
    fontWeight: "800",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  moreBtn: {
    width: "100%",
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  moreBtnText: {
    fontWeight: "700",
    color: colors.text,
  },

  checkRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C9C9C9",
    backgroundColor: colors.surface,
  },
  checkboxOn: {
    backgroundColor: accent[600],
    borderColor: accent[600],
  },
  checkText: {
    color: colors.subtext,
    fontSize: type.small,
    fontWeight: "600",
  },

  confirmWrap: {
    width: "100%",
    marginTop: 18,
  },
});

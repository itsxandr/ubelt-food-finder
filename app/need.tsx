import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppCard } from "@/src/components/ui/AppCard";
import { AppChip } from "@/src/components/ui/AppChip";
import {
  getCurrentLocationSafe,
  getTimeBucket,
  saveSession,
} from "@/src/services/sessionService";
import { colors, radius, space, type } from "@/src/theme/tokens";
import {
  BookOpen,
  Coffee,
  DollarSign,
  Heart,
  Zap,
} from "lucide-react-native";
import type { ComponentType } from "react";
import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type NeedOption = {
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  featured?: boolean;
};

const QUICK_NEEDS: NeedOption[] = [
  { label: "I'm broke", icon: DollarSign },
  { label: "Need to study", icon: BookOpen },
  { label: "I want a snack", icon: Coffee },
  { label: "Date spot", icon: Heart },
  { label: "Pick for me", icon: Zap, featured: true },
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
  const [dontShowEveryTime, setDontShowEveryTime] = useState(false);

  const pickNeed = async (need: string) => {
    const lastLocation = await getCurrentLocationSafe();

    await saveSession({
      lastPreference: need,
      dontShowEveryTime,
      lastSeenAt: Date.now(),
      lastTimeBucket: getTimeBucket(),
      lastLocation,
    });

    router.push({
      pathname: "/result",
      params: { need },
    });
  };

  return (
    <AppScreen scroll contentStyle={styles.content}>
      <Text style={styles.title}>What do you need right now?</Text>

      <View style={styles.quickGrid}>
        {QUICK_NEEDS.map(({ label, icon: Icon, featured }) => {
          const isFeatured = Boolean(featured);
          return (
            <Pressable
              key={label}
              style={[
                styles.quickTileWrap,
                isFeatured && styles.quickTileWide,
              ]}
              onPress={() => pickNeed(label)}
            >
              <AppCard
                style={[
                  styles.quickTile,
                  isFeatured && styles.quickTileFeatured,
                ]}
              >
                <Icon
                  size={22}
                  color={isFeatured ? colors.primaryText : colors.text}
                />
                <Text
                  style={[
                    styles.quickTileText,
                    isFeatured && styles.quickTileTextFeatured,
                  ]}
                >
                  {label}
                </Text>
              </AppCard>
            </Pressable>
          );
        })}
      </View>

      <AppButton
        label={showMore ? "Show Less" : "More Options"}
        variant="muted"
        fullWidth
        onPress={() => setShowMore((v) => !v)}
      />

      {showMore ? (
        <View style={styles.listWrap}>
          {MORE_NEEDS.map((need) => (
            <Pressable
              key={need}
              onPress={() => pickNeed(need)}
            >
              <AppChip label={need} size="lg" fullWidth />
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Don&apos;t show me again</Text>
        <Switch value={dontShowEveryTime} onValueChange={setDontShowEveryTime} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.lg,
  },
  title: {
    textAlign: "center",
    fontSize: type.h1,
    fontWeight: "800",
    color: colors.text,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  quickTileWrap: {
    width: "48%",
    minHeight: 92,
  },
  quickTileWide: {
    width: "100%",
    minHeight: 64,
  },
  quickTile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    backgroundColor: colors.mutedBtn,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
  },
  quickTileFeatured: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickTileText: {
    textAlign: "center",
    color: colors.text,
    fontWeight: "700",
  },
  quickTileTextFeatured: {
    color: colors.primaryText,
  },

  listWrap: {
    gap: space.sm,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
  },
  toggleText: {
    color: colors.mutedText,
    fontSize: type.small,
    fontWeight: "600",
  },
});

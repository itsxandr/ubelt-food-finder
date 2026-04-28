import { colors, radius } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export function AppCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: 12,
  },
});

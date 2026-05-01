import { colors, radius, space } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export function AppStage({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return <View style={[styles.stage, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  stage: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: space.md,
  },
});

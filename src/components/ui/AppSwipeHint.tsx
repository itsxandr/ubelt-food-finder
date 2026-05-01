import { colors, space } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

export function AppSwipeHint({
  children,
  style,
}: {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
}) {
  return <Text style={[styles.hint, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  hint: {
    textAlign: "center",
    marginTop: space.sm,
    marginBottom: space.md,
    color: colors.mutedText,
    fontWeight: "600",
  },
});

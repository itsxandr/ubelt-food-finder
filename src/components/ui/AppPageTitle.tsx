import { colors, type } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

export function AppPageTitle({
  children,
  style,
}: {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
}) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: type.hero,
    fontWeight: "800",
    color: colors.text,
  },
});

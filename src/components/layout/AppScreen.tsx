import { colors } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

export function AppScreen({
  children,
  scroll = false,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle | ViewStyle[];
}) {
  if (scroll) {
    return (
      <ScrollView contentContainerStyle={[styles.scrollContent, contentStyle]}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.container, contentStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  scrollContent: {
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
  },
});

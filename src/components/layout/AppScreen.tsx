import { colors, space } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + space.lg;

  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { paddingTop }, contentStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: space.xl,
    paddingBottom: space.xl,
  },
  scrollContent: {
    backgroundColor: colors.bg,
    paddingHorizontal: space.xl,
    paddingBottom: space.xl,
  },
});

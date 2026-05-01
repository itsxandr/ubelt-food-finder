import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppPageTitle } from "@/src/components/ui/AppPageTitle";
import { colors, space, type } from "@/src/theme/tokens";
import { StyleSheet, Text } from "react-native";

export default function ExploreScreen() {
  return (
    <AppScreen contentStyle={styles.container}>
      <AppPageTitle>Explore</AppPageTitle>
      <Text style={styles.body}>Explore content is coming soon.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    color: colors.mutedText,
    fontSize: type.body,
    textAlign: "center",
  },
});

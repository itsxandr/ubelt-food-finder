import { AppScreen } from "@/src/components/layout/AppScreen";
import { colors, space, type } from "@/src/theme/tokens";
import { StyleSheet, Text } from "react-native";

export default function ExploreScreen() {
  return (
    <AppScreen contentStyle={styles.container}>
      <Text style={styles.title}>Explore</Text>
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
  title: {
    fontSize: type.h1,
    fontWeight: "800",
    color: colors.text,
  },
  body: {
    color: colors.mutedText,
    fontSize: type.body,
    textAlign: "center",
  },
});

import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppCard } from "@/src/components/ui/AppCard";
import { AppPageTitle } from "@/src/components/ui/AppPageTitle";
import { colors, space, type } from "@/src/theme/tokens";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <AppScreen contentStyle={styles.container}>
      <AppPageTitle style={styles.title}>Quick Tip</AppPageTitle>
      <AppCard style={styles.card}>
        <Text style={styles.body}>
          Use the Need screen to pick a vibe and get fresh recommendations.
        </Text>
      </AppCard>
      <View style={styles.actions}>
        <AppButton
          label="Back to Home"
          variant="muted"
          onPress={() => router.back()}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.lg,
  },
  title: {
    marginBottom: 0,
  },
  card: {
    width: "100%",
  },
  body: {
    color: colors.subtext,
    fontSize: type.body,
    textAlign: "center",
  },
  actions: {
    width: "100%",
  },
});

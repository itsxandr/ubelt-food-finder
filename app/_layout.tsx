import { Stack } from "expo-router";
import { SpotSelectionProvider } from "@/src/context/SpotSelectionContext";

export default function RootLayout() {
  return (
    <SpotSelectionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SpotSelectionProvider>
  );
}

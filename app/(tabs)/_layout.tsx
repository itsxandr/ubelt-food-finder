import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // This is the "Magic Line" to hide the bar on the web
        tabBarStyle:
          Platform.OS === "web"
            ? { display: "none" }
            : {
                backgroundColor: "#000",
                height: 60,
                borderTopWidth: 0,
              },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
    </Tabs>
  );
}

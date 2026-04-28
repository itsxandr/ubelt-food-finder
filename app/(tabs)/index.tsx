import { shouldShowNeedScreen } from "@/src/services/sessionService";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const decision = await shouldShowNeedScreen();

      if (decision.showNeed) {
        setTarget("/need");
      } else {
        const encoded = encodeURIComponent(
          decision.lastPreference || "Pick for me",
        );
        setTarget(`/result?need=${encoded}`);
      }
    })();
  }, []);

  if (!target) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={target as any} />;
}

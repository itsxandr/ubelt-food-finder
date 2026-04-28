import MapComponent from "@/src/components/MapComponent";
import { useHomeController } from "@/src/features/home/hooks/useHomeController";
import React from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";

export default function HomeScreen() {
  const { loading, allSpots, filteredSpots, activeFilter, webCenter, mapKey } =
    useHomeController();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading Campus Food Finder...</Text>
        <ActivityIndicator style={{ marginTop: 12 }} />
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <MapComponent
          key={mapKey}
          mapKey={mapKey}
          allSpots={allSpots}
          filteredSpots={filteredSpots}
          activeFilter={activeFilter}
          center={webCenter}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Mobile view here (keep your old mobile UI for now)</Text>
    </View>
  );
}

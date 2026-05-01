import MapComponent from "@/src/components/MapComponent";
import { useMapController } from "@/src/features/home/hooks/useMapController";
import { colors, space, type } from "@/src/theme/tokens";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { loading, allSpots, filteredSpots, activeFilter, webCenter, mapKey } =
    useMapController();

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading Campus Food Finder...</Text>
        <ActivityIndicator style={styles.loadingSpinner} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginBottom: space.md,
    color: colors.text,
    fontSize: type.body,
  },
  loadingSpinner: { marginTop: 0 },
});

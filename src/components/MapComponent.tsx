import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MapComponent({ allSpots }: any) {
  return (
    <View style={styles.webContainer}>
      <Text style={styles.title}>U-Belt Food Finder (Web)</Text>
      <ScrollView style={{ width: "100%" }}>
        {allSpots.map((spot: any) => (
          <View key={spot.id} style={styles.spotListItem}>
            <Text style={styles.spotName}>{spot.name}</Text>
            <Text style={styles.spotAddress}>{spot.address}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  spotListItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  spotName: { fontSize: 18, fontWeight: "600" },
  spotAddress: { color: "#666" },
});

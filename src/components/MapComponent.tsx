import { Map, Marker as WebMarker } from "pigeon-maps";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MapComponent({
  allSpots,
  filteredSpots,
  activeFilter,
}: any) {
  const center: [number, number] = [14.6041, 120.9882];
  const displaySpots = activeFilter === "All" ? allSpots : filteredSpots;

  // This function fetches the "Voyager" theme which looks like Google/Apple Maps
  const voyagerTiles = (x: number, y: number, z: number) =>
    `https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${window.devicePixelRatio > 1 ? "@2x" : ""}.png`;

  return (
    <View style={styles.webContainer}>
      <View style={styles.mapWrapper}>
        <Map
          height={400}
          defaultCenter={center}
          defaultZoom={15}
          provider={voyagerTiles} // This is the secret for the "Pro" look
        >
          {displaySpots.map((spot: any) => (
            <WebMarker
              key={spot.id}
              width={40}
              anchor={[spot.latitude, spot.longitude]}
              color="#FF5A5F"
              onClick={() => alert(`${spot.name}\n${spot.address}`)}
            />
          ))}
        </Map>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.title}>U-Belt Food Finder</Text>
        <Text style={styles.subtitle}>
          Instant Access • {displaySpots.length} {activeFilter} spots found
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: { flex: 1, backgroundColor: "#FFF" },
  mapWrapper: {
    height: 400,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  infoSection: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#FF5A5F", fontWeight: "600", marginTop: 5 },
});

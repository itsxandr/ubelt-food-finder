import { Map, Marker as WebMarker } from "pigeon-maps";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function MapComponent({
  allSpots,
  filteredSpots,
  activeFilter,
  center, // ADDED: This receives the coordinates from your Locate Me button
}: any) {
  const [zoom, setZoom] = useState(15);

  // Use filteredSpots so the top buttons work on the web too
  const displaySpots = activeFilter === "All" ? allSpots : filteredSpots;

  // Professional "Voyager" map theme
  const voyagerTiles = (x: number, y: number, z: number) =>
    `https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${window.devicePixelRatio > 1 ? "@2x" : ""}.png`;

  const handleBoundsChanged = ({ zoom: newZoom }: { zoom: number }) => {
    setZoom(newZoom);
  };

  return (
    <View style={styles.mapWrapper}>
      <Map
        height={400}
        center={center}
        zoom={zoom}
        onBoundsChanged={handleBoundsChanged}
        provider={voyagerTiles}
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
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    height: 400,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#F5F5F5", // Light grey background while map tiles load
  },
});

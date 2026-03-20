import { Map, Marker as WebMarker } from "pigeon-maps";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function MapComponent({
  allSpots,
  filteredSpots,
  activeFilter,
  center,
}: any) {
  const [internalCenter, setInternalCenter] = useState(center);
  const [zoom, setZoom] = useState(15);
  const isUserInteractingRef = useRef(false);

  const displaySpots = activeFilter === "All" ? allSpots : filteredSpots;

  const voyagerTiles = (x: number, y: number, z: number) =>
    `https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${window.devicePixelRatio > 1 ? "@2x" : ""}.png`;

  // When user zooms/drags, update internal state
  const handleBoundsChanged = ({ center: newCenter, zoom: newZoom }: any) => {
    isUserInteractingRef.current = true;
    setInternalCenter(newCenter);
    setZoom(newZoom);
  };

  // When center prop changes (from Locate Me), reset to that location
  React.useEffect(() => {
    if (!isUserInteractingRef.current) {
      setInternalCenter(center);
    }
    isUserInteractingRef.current = false;
  }, [center]);

  return (
    <View style={styles.mapWrapper}>
      <Map
        height={400}
        center={internalCenter}
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
    backgroundColor: "#F5F5F5",
  },
});

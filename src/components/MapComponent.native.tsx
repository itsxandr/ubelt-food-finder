import { MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function MapComponent({
  mapRef,
  filteredSpots,
  activeFilter,
}: any) {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: 14.6041,
        longitude: 120.9882,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }}
      showsUserLocation={true}
      provider={PROVIDER_GOOGLE}
    >
      {filteredSpots.map((spot: any) => (
        <Marker
          key={spot.id}
          coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
        >
          <View style={styles.pinContainer}>
            <MapPin
              size={24}
              color="#FF5A5F"
              fill={activeFilter === "All" ? "white" : "#FF5A5F"}
            />
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: "100%" },
  pinContainer: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF5A5F",
  },
});

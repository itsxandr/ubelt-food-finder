import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

export default function MapComponent({
  allSpots,
  filteredSpots,
  activeFilter,
  center,
  mapKey, // NEW: will force remount when Locate Me is clicked
}: any) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const displaySpots = activeFilter === "All" ? allSpots : filteredSpots;

  // OSM vector tiles (free, no API key needed)
  const styleUrl = "https://demotiles.maplibre.org/style.json";

  useEffect(() => {
    if (!mapContainer.current) return;

    // Clean up previous map instance
    if (map.current) {
      map.current.remove();
    }

    // Create new map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [center[1], center[0]], // [lng, lat]
      zoom: 15,
      minZoom: 12,
      maxZoom: 19,
    });

    // Add markers when map loads
    map.current.on("load", () => {
      displaySpots.forEach((spot: any) => {
        // Create popup
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px;">${spot.name || spot.Name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${spot.address || spot.Address}</p>
          </div>
          `,
        );

        // Create marker
        const el = document.createElement("div");
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.backgroundImage =
          "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNPCIBDST0iMTYiIENZPSIxMiIgUj0iOCIgZmlsbD0iI0ZGNUE1RiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==)";
        el.style.backgroundSize = "contain";
        el.style.backgroundRepeat = "no-repeat";
        el.style.cursor = "pointer";

        new maplibregl.Marker({ element: el })
          .setLngLat([
            spot.longitude || spot.Longitude,
            spot.latitude || spot.Latitude,
          ])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapKey, displaySpots]); // mapKey forces remount when Locate Me is clicked

  return (
    <View style={styles.mapWrapper}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
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

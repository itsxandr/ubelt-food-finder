import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

export default function MapComponent({
  allSpots,
  filteredSpots,
  activeFilter,
  center, // Expected as [lat, lng] from index.tsx
  mapKey,
}: any) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const displaySpots = activeFilter === "All" ? allSpots : filteredSpots;

  // Modern "Voyager" style tiles (Free)
  const styleUrl =
    "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

  useEffect(() => {
    if (!mapContainer.current) return;

    // 1. Clean up previous instance to prevent memory leaks
    if (map.current) {
      map.current.remove();
    }

    // 2. MapLibre uses [lng, lat]. Since index.tsx sends [lat, lng], we swap them here.
    const lngLatCenter: [number, number] = [center[1], center[0]];

    // 3. Initialize Map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: lngLatCenter,
      zoom: 15,
      minZoom: 12,
      maxZoom: 19,
    });

    // 4. Add markers once the style is loaded
    map.current.on("load", () => {
      displaySpots.forEach((spot: any) => {
        // Create professional popup
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
        }).setHTML(
          `
          <div style="padding: 10px; font-family: sans-serif;">
            <strong style="display: block; font-size: 14px; color: #1A1A1A;">${spot.name}</strong>
            <span style="font-size: 12px; color: #666;">${spot.address}</span>
            ${spot.vibe_tags.length > 0 ? `<div style="margin-top: 5px; color: #FF5A5F; font-size: 10px; font-weight: bold;">${spot.vibe_tags[0]}</div>` : ""}
          </div>
          `,
        );

        // Custom Pin element
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.backgroundImage =
          "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxMiIgcj0iOCIgZmlsbD0iI0ZGNUE1RiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==)";
        el.style.backgroundSize = "contain";
        el.style.cursor = "pointer";

        new maplibregl.Marker({ element: el })
          .setLngLat([spot.longitude, spot.latitude]) // Data is now flat! No more NaN.
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [mapKey, displaySpots]); // Triggers on Locate Me click or Filter change

  return (
    <View style={styles.mapWrapper}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
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

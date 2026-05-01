import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef } from "react";
import { colors, space } from "@/src/theme/tokens";
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
  const popupNameColor = colors.text;
  const popupMetaColor = colors.mutedText;
  const popupTagColor = colors.accent;
  const popupPadding = space.sm;
  const pinSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="12" r="8" fill="${colors.accent}" stroke="${colors.surface}" stroke-width="2"/></svg>`;
  const pinUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(pinSvg)}")`;

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
          <div style="padding: ${popupPadding}px; font-family: sans-serif;">
            <strong style="display: block; font-size: 14px; color: ${popupNameColor};">${spot.name}</strong>
            <span style="font-size: 12px; color: ${popupMetaColor};">${spot.address}</span>
            ${
              spot.vibe_tags.length > 0
                ? `<div style="margin-top: 5px; color: ${popupTagColor}; font-size: 10px; font-weight: bold;">${spot.vibe_tags[0]}</div>`
                : ""
            }
          </div>
          `,
        );

        // Custom Pin element
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.backgroundImage = pinUrl;
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
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
});

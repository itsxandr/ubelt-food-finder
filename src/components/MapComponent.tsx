import { Map, Marker as WebMarker } from "pigeon-maps";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

// Threshold for detecting a zoom gesture vs. rounding noise
const ZOOM_CHANGE_THRESHOLD = 0.1;
// Delay after last zoom event before updating map center on touch devices
const ZOOM_SETTLE_DELAY_MS = 300;

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export default function MapComponent({
  allSpots,
  filteredSpots,
  activeFilter,
  center,
}: any) {
  const [internalCenter, setInternalCenter] = useState(center);
  const [zoom, setZoom] = useState(15);
  const isUserInteractingRef = useRef(false);
  const lastZoomRef = useRef(15);
  const zoomSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displaySpots = activeFilter === "All" ? allSpots : filteredSpots;

  const voyagerTiles = (x: number, y: number, z: number) =>
    `https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${window.devicePixelRatio > 1 ? "@2x" : ""}.png`;

  // When user zooms/drags, update internal state
  const handleBoundsChanged = useCallback(
    ({ center: newCenter, zoom: newZoom }: any) => {
      isUserInteractingRef.current = true;
      const isZooming =
        Math.abs(newZoom - lastZoomRef.current) > ZOOM_CHANGE_THRESHOLD;
      lastZoomRef.current = newZoom;
      setZoom(newZoom);

      if (isTouchDevice() && isZooming) {
        // On mobile, debounce center updates during pinch-zoom to prevent drift
        if (zoomSettleTimerRef.current) {
          clearTimeout(zoomSettleTimerRef.current);
        }
        zoomSettleTimerRef.current = setTimeout(() => {
          setInternalCenter(newCenter);
        }, ZOOM_SETTLE_DELAY_MS);
      } else {
        setInternalCenter(newCenter);
      }
    },
    [],
  );

  // Clear pending zoom-settle timer on unmount to avoid state updates on
  // an unmounted component.
  useEffect(() => {
    return () => {
      if (zoomSettleTimerRef.current) {
        clearTimeout(zoomSettleTimerRef.current);
      }
    };
  }, []);

  // When center prop changes (from Locate Me), reset to that location
  useEffect(() => {
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
        minZoom={10}
        maxZoom={19}
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

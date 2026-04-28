import { getUbeltSpots } from "@/src/services/dataService";
import type { Spot } from "@/src/types/spot";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export function useHomeController() {
  const [allSpots, setAllSpots] = useState<Spot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // web map state
  const [webCenter, setWebCenter] = useState<[number, number]>([
    14.6041, 120.9882,
  ]);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied");
        }

        const data = (await getUbeltSpots()) as Spot[];
        setAllSpots(data);
        setFilteredSpots(data);

        // optional: center map from first spot if available
        if (data.length > 0 && Platform.OS === "web") {
          setWebCenter([data[0].latitude, data[0].longitude]);
        }
      } catch (e) {
        console.error("Init error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilter = useCallback(
    (filterId: string) => {
      setActiveFilter(filterId);

      if (filterId === "All") {
        setFilteredSpots(allSpots);
        return;
      }

      const filtered = allSpots.filter((spot) =>
        spot.vibe_tags?.includes(filterId),
      );
      setFilteredSpots(filtered);
    },
    [allSpots],
  );

  const goToMyLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location to find food near you!");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    if (Platform.OS === "web") {
      setWebCenter([latitude, longitude]);
      setMapKey((prev) => prev + 1);
    }
  }, []);

  return {
    loading,
    allSpots,
    filteredSpots,
    activeFilter,
    webCenter,
    mapKey,
    handleFilter,
    goToMyLocation,
  };
}

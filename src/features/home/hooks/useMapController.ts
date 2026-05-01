import { useSpotLoader } from "@/src/features/home/hooks/useSpotLoader";
import type { Spot } from "@/src/types/spot";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export function useMapController() {
  const { allSpots, loading } = useSpotLoader();
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const [webCenter, setWebCenter] = useState<[number, number]>([
    14.6041, 120.9882,
  ]);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied");
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredSpots(allSpots);
    if (allSpots.length > 0 && Platform.OS === "web") {
      setWebCenter([allSpots[0].latitude, allSpots[0].longitude]);
    }
  }, [allSpots]);

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

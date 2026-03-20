import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import {
  Dumbbell,
  Info,
  MapPin,
  Navigation,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapComponent from "../../src/components/MapComponent";
import { getUbeltSpots } from "../../src/services/dataService";

// Standardized filters for the top bar
const FILTERS = [
  { id: "All", icon: <Zap size={16} color="white" /> },
  { id: "Gym Bro Approved", icon: <Dumbbell size={16} color="white" /> },
  { id: "Petsa de Peligro", icon: <Wallet size={16} color="white" /> },
  { id: "Pang-Bulking", icon: <Utensils size={16} color="white" /> },
];

export default function MapScreen() {
  const mapRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [allSpots, setAllSpots] = useState<any[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [webCenter, setWebCenter] = useState<[number, number]>([
    14.6041, 120.9882,
  ]);
  const [mapKey, setMapKey] = useState(0); // ← NEW: for MapLibre remount
  const snapPoints = useMemo(() => ["28%", "50%", "90%"], []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") Alert.alert("Permission Denied");
      const data = await getUbeltSpots();
      setAllSpots(data);
      setFilteredSpots(data);
      setLoading(false);
    })();
  }, []);

  const handleFilter = useCallback(
    (filterId: string) => {
      setActiveFilter(filterId);
      if (filterId === "All") {
        setFilteredSpots(allSpots);
      } else {
        const filtered = allSpots.filter((spot) =>
          spot.vibe_tags.includes(filterId),
        );
        setFilteredSpots(filtered);
      }
    },
    [allSpots],
  );

  const goToMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location to find food near you!");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    if (Platform.OS === "web") {
      setWebCenter([latitude, longitude]);
      setMapKey((prev) => prev + 1); // ← NEW: force map remount on web
    } else {
      mapRef.current?.animateToRegion(
        {
          // Original smooth mobile glide
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        {/* Your logo would go here */}
        <View style={styles.logoPlaceholder}>
          <MapPin size={60} color="white" fill="#FF5A5F" />
        </View>
        <Text style={styles.splashTitle}>Campus Food Finder</Text>
        <ActivityIndicator
          size="small"
          color="#FF5A5F"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        {/* TOP: Floating Filter Bar (Identical to Mobile) */}
        <View style={[styles.filterWrapper, { top: 20 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => handleFilter(filter.id)}
                style={[
                  styles.filterChip,
                  activeFilter === filter.id && styles.activeChip,
                ]}
              >
                {filter.icon}
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter.id && styles.activeText,
                  ]}
                >
                  {filter.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* MIDDLE: The Interactive Map with Locate Button */}
        <View style={styles.mapContainer}>
          <MapComponent
            key={mapKey} // ← NEW
            mapKey={mapKey} // ← NEW
            allSpots={allSpots}
            filteredSpots={filteredSpots}
            activeFilter={activeFilter}
            center={webCenter}
          />
        </View>

        {/* BOTTOM: Feature Panel (Mimicking the Bottom Sheet) */}
        <View style={styles.webPanel}>
          <Text style={styles.sheetTitle}>Where are we eating, Dex?</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => handleFilter("Gym Bro Approved")}
            >
              <Dumbbell size={28} color="#FF5A5F" />
              <Text style={styles.actionLabel}>High Protein</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => handleFilter("Petsa de Peligro")}
            >
              <Wallet size={28} color="#FF5A5F" />
              <Text style={styles.actionLabel}>Budget Gems</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>Nearest to you</Text>
          {allSpots.slice(0, 3).map((spot: any) => (
            <View key={spot.id} style={styles.spotListItem}>
              <View style={styles.spotIconBg}>
                <MapPin size={20} color="#666" />
              </View>
              <View style={styles.spotInfo}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <Text style={styles.spotAddress}>{spot.address}</Text>
              </View>
            </View>
          ))}
          {/* Floating Web Locate Button - anchored inside the map area */}
          <TouchableOpacity
            style={[styles.locateButton, styles.webLocateButton]}
            onPress={goToMyLocation}
          >
            <Navigation size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapComponent
          key={mapKey} // ← NEW
          mapKey={mapKey} // ← NEW
          mapRef={mapRef}
          filteredSpots={filteredSpots}
          activeFilter={activeFilter}
          allSpots={allSpots}
          center={webCenter}
        />

        {/* Floating Filter Bar */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => handleFilter(filter.id)}
                style={[
                  styles.filterChip,
                  activeFilter === filter.id && styles.activeChip,
                ]}
              >
                {filter.icon}
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter.id && styles.activeText,
                  ]}
                >
                  {filter.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.locateButton} onPress={goToMyLocation}>
          <Navigation size={24} color="white" />
        </TouchableOpacity>

        <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
          <BottomSheetView style={styles.sheetContent}>
            <Text style={styles.sheetTitle}>Where are we eating?</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => handleFilter("Gym Bro Approved")}
              >
                <Dumbbell size={28} color="#FF5A5F" />
                <Text style={styles.actionLabel}>High Protein</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => handleFilter("Petsa de Peligro")}
              >
                <Wallet size={28} color="#FF5A5F" />
                <Text style={styles.actionLabel}>Budget Gems</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionHeader}>Nearest to you</Text>
            {allSpots.slice(0, 3).map((spot: any) => (
              <View key={spot.id} style={styles.spotListItem}>
                <View style={styles.spotIconBg}>
                  <MapPin size={20} color="#666" />
                </View>
                <View style={styles.spotInfo}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotAddress}>{spot.address}</Text>
                </View>
                <Info size={18} color="#CCC" />
              </View>
            ))}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  pinContainer: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF5A5F",
  },
  mapContainer: {
    position: "relative",
  },
  locateButton: {
    position: "absolute",
    bottom: "31%", // Lifted higher to stay above the new 28% sheet height
    right: 20,
    backgroundColor: "#FF5A5F",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  webLocateButton: {
    position: "absolute",
    right: 20,
    // Use a fixed pixel value instead of 35%.
    // This places it exactly 20px above your bottom panel.
    bottom: 320,
    zIndex: 999, // Forces it to the front "layer"
    backgroundColor: "#FF5A5F",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  filterWrapper: { position: "absolute", top: 60, left: 0, right: 0 },
  filterScroll: { paddingHorizontal: 15 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    elevation: 3,
  },
  activeChip: { backgroundColor: "#FF5A5F" },
  filterText: { color: "#333", marginLeft: 8, fontWeight: "600", fontSize: 12 },
  activeText: { color: "white" },
  sheetContent: {
    padding: 20,
    paddingBottom: 40, // Adds extra space at the bottom for home-bar iPhones
  },
  sheetTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  actionCard: {
    backgroundColor: "#FFF1F1",
    width: "48%",
    paddingVertical: 15, // Switched to vertical padding for better scaling
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE0E0",
    // Added a fixed aspect ratio or min-height for consistency
    minHeight: 100,
  },
  actionLabel: { fontWeight: "700", marginTop: 8, color: "#333" },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
    marginBottom: 15,
  },
  spotListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  spotIconBg: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  spotInfo: { flex: 1 },
  spotName: { fontSize: 16, fontWeight: "600" },
  spotAddress: { fontSize: 13, color: "#888" },
  webContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  webFooter: {
    backgroundColor: "#FF5A5F",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    width: "100%",
  },
  webBadge: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255, 90, 95, 0.9)", // Your signature Red
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  webBadgeText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1A1A1A",
    marginTop: 20,
    letterSpacing: -1,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
  },
  webPanel: {
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "white",
    marginTop: -25, // Overlaps the map slightly for a modern look
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});

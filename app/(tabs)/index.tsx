import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { Dumbbell, Info, MapPin, Navigation, Rice, Wallet, Zap } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getUbeltSpots } from '../../src/services/dataService';

// Standardized filters for the top bar
const FILTERS = [
  { id: 'All', icon: <Zap size={16} color="white" /> },
  { id: 'Gym Bro Approved', icon: <Dumbbell size={16} color="white" /> },
  { id: 'Petsa de Peligro', icon: <Wallet size={16} color="white" /> },
  { id: 'Pang-Bulking', icon: <Rice size={16} color="white" /> },
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // States
  const [allSpots, setAllSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Bottom Sheet configuration
  const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is needed to find nearby food.');
      }

      const data = await getUbeltSpots();
      setAllSpots(data);
      setFilteredSpots(data);
      setLoading(false);
    })();
  }, []);

  const handleFilter = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === 'All') {
      setFilteredSpots(allSpots);
    } else {
      const filtered = allSpots.filter(spot => spot.vibe_tags.includes(filterId));
      setFilteredSpots(filtered);
    }
  };

  const goToMyLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#FF5A5F" /></View>;

  return (
    <View style={styles.container}>
      {/* LAYER 1: MAP */}
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
            title={spot.name}
          >
            <View style={styles.pinContainer}>
              <MapPin size={24} color="#FF5A5F" fill={activeFilter === 'All' ? "white" : "#FF5A5F"} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* LAYER 2: FLOATING FILTERS (Top) */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((filter) => (
            <TouchableOpacity 
              key={filter.id} 
              onPress={() => handleFilter(filter.id)}
              style={[styles.filterChip, activeFilter === filter.id && styles.activeChip]}
            >
              {filter.icon}
              <Text style={[styles.filterText, activeFilter === filter.id && styles.activeText]}>
                {filter.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LAYER 3: LOCATE ME BUTTON */}
      <TouchableOpacity style={styles.locateButton} onPress={goToMyLocation}>
        <Navigation size={24} color="white" />
      </TouchableOpacity>

      {/* LAYER 4: MOVE IT STYLE BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Where are we eating, Dex?</Text>
          
          {/* Quick Action Cards (Inspiration from MoveIt's MotoTaxi/Jeepney) */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={() => handleFilter('Gym Bro Approved')}>
              <Dumbbell size={28} color="#FF5A5F" />
              <Text style={styles.actionLabel}>High Protein</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={() => handleFilter('Petsa de Peligro')}>
              <Wallet size={28} color="#FF5A5F" />
              <Text style={styles.actionLabel}>Budget Gems</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentHeader}>
            <Text style={styles.sectionHeader}>Nearest to you</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>

          {/* Map through a slice of spots to show nearest ones */}
          {allSpots.slice(0, 3).map((spot: any) => (
            <TouchableOpacity key={spot.id} style={styles.spotListItem}>
              <View style={styles.spotIconBg}>
                <MapPin size={20} color="#666" />
              </View>
              <View style={styles.spotInfo}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <Text style={styles.spotAddress}>{spot.address}</Text>
              </View>
              <Info size={18} color="#CCC" />
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  map: { width: '100%', height: '100%' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Pin Styles
  pinContainer: { 
    padding: 4, 
    backgroundColor: 'white', 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#FF5A5F',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },

  // Floating Elements
  locateButton: { 
    position: 'absolute', 
    bottom: '18%', // Positioned above the collapsed bottom sheet
    right: 20, 
    backgroundColor: '#FF5A5F', 
    padding: 15, 
    borderRadius: 30, 
    elevation: 5 
  },
  filterWrapper: { position: 'absolute', top: 60, left: 0, right: 0 },
  filterScroll: { paddingHorizontal: 15 },
  filterChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 25, 
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  activeChip: { backgroundColor: '#FF5A5F' },
  filterText: { color: '#333', marginLeft: 8, fontWeight: '600', fontSize: 13 },
  activeText: { color: 'white' },

  // Bottom Sheet Styles
  sheetContent: { padding: 20 },
  sheetTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionCard: {
    backgroundColor: '#FFF1F1',
    width: '48%',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  actionLabel: { fontWeight: '700', marginTop: 8, color: '#333' },
  
  // List Styles
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#666' },
  seeAllText: { color: '#FF5A5F', fontWeight: '600' },
  spotListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  spotIconBg: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 12,
    marginRight: 15
  },
  spotInfo: { flex: 1 },
  spotName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  spotAddress: { fontSize: 13, color: '#888', marginTop: 2 }
});
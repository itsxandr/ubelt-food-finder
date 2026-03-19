import * as Location from 'expo-location'; // Added this
import { MapPin, Navigation } from 'lucide-react-native'; // Added Navigation icon
import React, { useEffect, useRef, useState } from 'react'; // Added useRef
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getUbeltSpots } from '../../src/services/dataService';

export default function MapScreen() {
  const mapRef = useRef(null); // Reference to the map
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // 1. Request Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location to see food near you!');
      }

      // 2. Load Spot Data
      const data = await getUbeltSpots();
      setSpots(data);
      setLoading(false);
    })();
  }, []);

  // Function to zoom into the user's current location
  const goToMyLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
    
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
      <MapView
        ref={mapRef} // Attach the reference
        style={styles.map}
        initialRegion={{
          latitude: 14.6041,
          longitude: 120.9882,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation={true} // Shows the blue dot
        provider={PROVIDER_GOOGLE}
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
          >
             <View style={styles.pinContainer}>
              <MapPin size={24} color="#FF5A5F" fill="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Locate Me Floating Button */}
      <TouchableOpacity style={styles.locateButton} onPress={goToMyLocation}>
        <Navigation size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pinContainer: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF5A5F',
  },
  locateButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FF5A5F',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  }
});
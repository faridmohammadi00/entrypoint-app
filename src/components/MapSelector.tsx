import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MapSelectorProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (latitude: number, longitude: number) => void;
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const MapSelector: React.FC<MapSelectorProps> = ({ latitude, longitude, onLocationSelect }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: latitude || 35.6892,
    longitude: longitude || 51.3890,
  });

  useEffect(() => {
    if (latitude !== selectedLocation.latitude || longitude !== selectedLocation.longitude) {
      setSelectedLocation({ latitude, longitude });
    }
  }, [latitude, longitude, selectedLocation.latitude, selectedLocation.longitude]);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onMapReady={() => setIsLoading(false)}
        >
          <Marker
            coordinate={selectedLocation}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setSelectedLocation({ latitude, longitude });
              onLocationSelect(latitude, longitude);
            }}
          />
        </MapView>
      </View>

      <View style={styles.overlay}>
        <Text style={styles.coordinatesText}>
          Selected: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mapContainer: {
    height: 400, // Increased height
    width: '100%',
    minHeight: 300, // Prevent collapsing
    backgroundColor: '#f0f0f0', // Debugging visibility
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#000',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 2,
  },
});

export default MapSelector;

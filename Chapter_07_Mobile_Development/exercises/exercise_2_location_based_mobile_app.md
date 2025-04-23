# Exercise: Location-Based Mobile Application (2025 Edition)

<div align="center">

**[⬅️ Back to Chapter](../Chapter_07_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">
  <h1>Building a Location-Aware Mobile Experience</h1>
  
  <p><i>"Leveraging device location capabilities to create context-aware applications"</i></p>
</div>

<hr/>

## Overview

In this exercise, you will build a location-based mobile application that demonstrates how to utilize modern device location capabilities, mapping interfaces, and spatial awareness. You'll learn how to create applications that respond to a user's physical context and provide relevant, location-based information. This exercise combines geolocation, mapping, and data visualization to create a rich mobile experience.

## Learning Objectives

- Implement precise location tracking in a mobile application
- Integrate interactive maps using popular mapping SDKs
- Create and manage geofences for location-based triggers
- Utilize modern location APIs including background location updates
- Apply spatial data visualization techniques
- Implement location-based search and filtering
- Understand privacy and battery optimization considerations

## Prerequisites

- Completion of Exercise 1 (React Native Basics) or equivalent experience
- Understanding of state management in React Native
- Familiarity with asynchronous JavaScript operations
- Node.js and npm installed on your computer
- React Native development environment set up

## Project Requirements

### Core Features

1. **Location Tracking**
   - Obtain and display the user's current location
   - Track location changes with appropriate accuracy settings
   - Implement background location updates with proper battery optimization

2. **Interactive Map Interface**
   - Display an interactive map with the user's location
   - Add custom markers and overlays to the map
   - Implement map interactions (pan, zoom, rotate)

3. **Geofencing**
   - Create virtual boundaries (geofences) around specific locations
   - Trigger notifications when entering or exiting a geofence
   - Manage multiple geofences simultaneously

4. **Location-Based Data**
   - Fetch and display data relevant to the user's location
   - Implement distance-based search and filtering
   - Visualize spatial data on the map

5. **Privacy Considerations**
   - Implement proper permission requests with clear explanations
   - Provide user controls for location sharing preferences
   - Follow best practices for location data storage and handling

## Implementation Steps

### Step 1: Set Up Your Project

Create a new React Native project with the necessary dependencies:

```bash
npx react-native init LocationAwareApp --template react-native-template-typescript

# Install required dependencies
cd LocationAwareApp
npm install react-native-maps
npm install @react-native-community/geolocation
npm install react-native-geolocation-service
npm install react-native-permissions
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-vector-icons
npm install @react-native-async-storage/async-storage
```

### Step 2: Set Up Location Permissions

Configure your app to request and handle location permissions:

**For iOS (in `ios/LocationAwareApp/Info.plist`):**

```xml
<dict>
  <!-- Add these keys for location permissions -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>We need your location to show you nearby points of interest</string>
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>We need your location to notify you of interesting places nearby</string>
  <key>NSLocationAlwaysUsageDescription</key>
  <string>We need your location in the background to notify you of interesting places nearby</string>
</dict>
```

**For Android (in `android/app/src/main/AndroidManifest.xml`):**

```xml
<manifest>
  <!-- Add these permissions for location access -->
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
  <!-- Rest of your manifest -->
</manifest>
```

### Step 3: Create a Location Service

Build a service to handle location-related operations:

```typescript
// src/services/LocationService.ts

import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

export interface LocationSubscription {
  remove: () => void;
}

export interface GeofenceRegion {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;  // in meters
  notifyOnEnter?: boolean;
  notifyOnExit?: boolean;
}

class LocationService {
  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to show nearby places.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
  }

  // Get current location once
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
        }
      );
    });
  }

  // Watch location continuously
  watchLocation(callback: (location: Location) => void): LocationSubscription {
    const watchId = Geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error(error);
      },
      { 
        enableHighAccuracy: true, 
        distanceFilter: 10, // minimum distance (meters) before updates
        interval: 5000, // Minimum time between updates (ms)
        fastestInterval: 2000, // Fastest rate app can handle updates (ms)
        forceRequestLocation: true,
      }
    );

    return {
      remove: () => Geolocation.clearWatch(watchId),
    };
  }

  // Calculate distance between two points in kilometers
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // In a full implementation, you would add methods for:
  // - Managing geofences
  // - Handling background location updates
  // - Optimizing for battery usage
}

export default new LocationService();
```

### Step 4: Create the Map Screen

Implement a main screen with map integration:

```typescript
// src/screens/MapScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import LocationService, { Location, LocationSubscription } from '../services/LocationService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Sample points of interest data
const POINTS_OF_INTEREST = [
  { id: '1', title: 'Coffee Shop', description: 'Artisanal coffee and pastries', latitude: 37.78825, longitude: -122.4324, category: 'food' },
  { id: '2', title: 'City Park', description: 'Urban green space with playgrounds', latitude: 37.78525, longitude: -122.4354, category: 'recreation' },
  { id: '3', title: 'Tech Museum', description: 'Interactive technology exhibits', latitude: 37.78925, longitude: -122.4284, category: 'culture' },
  // Add more POIs as needed
];

const MapScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [activeGeofence, setActiveGeofence] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState(['food', 'recreation', 'culture']);
  
  const mapRef = useRef<MapView>(null);
  const locationSubscriptionRef = useRef<LocationSubscription | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Request location permissions when component mounts
    const setupLocation = async () => {
      const granted = await LocationService.requestPermissions();
      setLocationPermissionGranted(granted);
      
      if (granted) {
        try {
          const location = await LocationService.getCurrentLocation();
          setCurrentLocation(location);
          centerMapOnLocation(location);
        } catch (error) {
          Alert.alert('Location Error', 'Unable to get your current location.');
        }
        
        // Setup continuous location updates
        locationSubscriptionRef.current = LocationService.watchLocation((location) => {
          setCurrentLocation(location);
          // If we're actively tracking (e.g., in navigation mode), update the map
          // This is just a placeholder - you'd implement actual tracking logic
          if (false /* isInTrackingMode */) {
            centerMapOnLocation(location);
          }
        });
      }
    };
    
    setupLocation();
    
    // Cleanup subscription on unmount
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, []);
  
  const centerMapOnLocation = (location: Location) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };
  
  const handleMarkerPress = (poi) => {
    setSelectedPOI(poi);
  };
  
  const createGeofence = (poi) => {
    setActiveGeofence({
      ...poi,
      radius: 100, // 100 meters radius
    });
    
    // In a full implementation, you would register this geofence
    // with a native geofencing service
    
    Alert.alert(
      'Geofence Created',
      `You'll be notified when you enter or exit the area around ${poi.title}.`
    );
  };
  
  const toggleCategoryVisibility = (category) => {
    setVisibleCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <View style={styles.container}>
      {!locationPermissionGranted ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Location permission is required to use this app.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => LocationService.requestPermissions()}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            showsScale
          >
            {/* Render POI markers */}
            {POINTS_OF_INTEREST.filter(poi => 
              visibleCategories.includes(poi.category)
            ).map(poi => (
              <Marker
                key={poi.id}
                coordinate={{
                  latitude: poi.latitude,
                  longitude: poi.longitude,
                }}
                title={poi.title}
                description={poi.description}
                onPress={() => handleMarkerPress(poi)}
              />
            ))}
            
            {/* Render active geofence if any */}
            {activeGeofence && (
              <Circle
                center={{
                  latitude: activeGeofence.latitude,
                  longitude: activeGeofence.longitude,
                }}
                radius={activeGeofence.radius}
                fillColor="rgba(0, 150, 255, 0.2)"
                strokeColor="rgba(0, 150, 255, 0.5)"
                strokeWidth={2}
              />
            )}
          </MapView>
          
          {/* Category filter buttons */}
          <View style={[styles.categoryFilters, { top: insets.top + 10 }]}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                visibleCategories.includes('food') && styles.activeCategoryButton
              ]}
              onPress={() => toggleCategoryVisibility('food')}
            >
              <Icon name="restaurant" size={20} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                visibleCategories.includes('recreation') && styles.activeCategoryButton
              ]}
              onPress={() => toggleCategoryVisibility('recreation')}
            >
              <Icon name="park" size={20} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                visibleCategories.includes('culture') && styles.activeCategoryButton
              ]}
              onPress={() => toggleCategoryVisibility('culture')}
            >
              <Icon name="museum" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Location controls */}
          <View style={[styles.locationControls, { bottom: insets.bottom + 20 }]}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => {
                if (currentLocation) {
                  centerMapOnLocation(currentLocation);
                }
              }}
            >
              <Icon name="my-location" size={24} color="#0066cc" />
            </TouchableOpacity>
          </View>
          
          {/* Selected POI info card */}
          {selectedPOI && (
            <View style={[styles.poiCard, { bottom: insets.bottom + 80 }]}>
              <View style={styles.poiCardContent}>
                <Text style={styles.poiTitle}>{selectedPOI.title}</Text>
                <Text style={styles.poiDescription}>{selectedPOI.description}</Text>
                {currentLocation && (
                  <Text style={styles.poiDistance}>
                    {LocationService.calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      selectedPOI.latitude,
                      selectedPOI.longitude
                    ).toFixed(2)} km away
                  </Text>
                )}
              </View>
              
              <View style={styles.poiCardActions}>
                <TouchableOpacity
                  style={styles.poiActionButton}
                  onPress={() => navigation.navigate('PoiDetails', { poi: selectedPOI })}
                >
                  <Icon name="info" size={20} color="#0066cc" />
                  <Text style={styles.poiActionText}>Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.poiActionButton}
                  onPress={() => createGeofence(selectedPOI)}
                >
                  <Icon name="add-alert" size={20} color="#0066cc" />
                  <Text style={styles.poiActionText}>Alert Me</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.poiActionButton}
                  onPress={() => {
                    // Here you would integrate with a navigation app or service
                    Alert.alert('Navigation', `Starting navigation to ${selectedPOI.title}...`);
                  }}
                >
                  <Icon name="directions" size={20} color="#0066cc" />
                  <Text style={styles.poiActionText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryFilters: {
    position: 'absolute',
    left: 16,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  activeCategoryButton: {
    backgroundColor: '#0066cc',
  },
  locationControls: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poiCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  poiCardContent: {
    padding: 16,
  },
  poiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  poiDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  poiDistance: {
    fontSize: 12,
    color: '#0066cc',
  },
  poiCardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  poiActionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  poiActionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#0066cc',
  },
});

export default MapScreen;
```

## Expansion Ideas

After implementing the core functionality, consider these extensions:

1. **Augmented Reality View**
   - Add an AR view that overlays POI information on the camera feed

2. **Offline Map Support**
   - Implement map tile caching for offline use
   - Allow saving of POI data for offline access

3. **User-Generated Content**
   - Let users add their own points of interest
   - Implement a rating and review system

4. **Advanced Location Tracking**
   - Add activity recognition to adjust tracking precision
   - Implement trip recording functionality

5. **Social Features**
   - Allow users to share their location with friends
   - Create location-based check-ins or posts

## Challenge: Optimizing for Battery Life

Location services can significantly impact battery life. Research and implement strategies to minimize battery drain while maintaining a good user experience:

1. Adjust location request parameters based on app state (foreground/background)
2. Implement intelligent geofencing that adapts to user movement patterns
3. Use significant location change monitoring instead of continuous updates when appropriate
4. Implement a power-saving mode that reduces location updates frequency

## Submission Guidelines

For this exercise, create a GitHub repository with your implementation and submit the link. Include:

1. Complete source code with proper documentation
2. A README with:
   - Setup instructions
   - App features description
   - Location permission handling details
   - Battery optimization strategies implemented
3. Screenshots or screen recordings demonstrating the app's functionality
4. A brief case study explaining how you approached:
   - Permission handling and privacy considerations
   - Battery optimization strategies
   - Technical challenges and solutions

## Resources

- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [React Native Geolocation Service](https://github.com/Agontuk/react-native-geolocation-service)
- [React Native Permissions](https://github.com/zoontek/react-native-permissions)
- [MapBox Documentation](https://docs.mapbox.com/android/maps/guides/)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/android-sdk/overview)
- [Location Best Practices for Android](https://developer.android.com/guide/topics/location/battery)
- [iOS Location Best Practices](https://developer.apple.com/documentation/corelocation/getting_the_user_s_location/using_the_standard_location_service)

---

<div align="center">

**[⬅️ Back to Chapter](../Chapter_07_Main.md) | [📚 All Exercises](./)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>

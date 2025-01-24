import { ScrollView } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';

import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { View, Pressable, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import Mapbox, {
  Camera,
  UserLocation,
  MapView,
  PointAnnotation,
  MarkerView,
  Callout,
} from '@rnmapbox/maps';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import { FontAwesome } from '@expo/vector-icons';
import SearchAttractions from '~/components/SearchAttractions';
import { usePlanStore } from '~/lib/store/usePlanStore';
import * as Location from 'expo-location';

Mapbox.setAccessToken(
  'pk.eyJ1IjoicGV5dTVoIiwiYSI6ImNtNG9mMms2NjA5NXQyanF6aWFoamlneHAifQ.5dT1m_VXoPx77m_nUAc6VQ'
);

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoicGV5dTVoIiwiYSI6ImNtNG9mMms2NjA5NXQyanF6aWFoamlneHAifQ.5dT1m_VXoPx77m_nUAc6VQ';

interface Attraction {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  rating?: string;
  distance?: string;
  category?: string;
  isSelected?: boolean;
}

const Attraction = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const cameraRef = useRef<Camera>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { addLocation, removeLocation, currentPlan, updatePlanDetails } = usePlanStore();

  const markerPin = 'https://res.cloudinary.com/dkysrpdi6/image/upload/v1737659497/pin_wlbyn7.png';
  const markerSelectedPin =
    'https://res.cloudinary.com/dkysrpdi6/image/upload/v1737659497/selected-pin_kiliid.png';
  const markerAttractionPin =
    'https://res.cloudinary.com/dkysrpdi6/image/upload/v1737659497/attraction-pin_vmlana.png';

  const points = attractions.map((attraction) =>
    point(attraction.coordinates, {
      id: attraction.id,
      name: attraction.name,
      description: attraction.description,
    })
  );

  const fetchAttractions = async (lat: number, lng: number) => {
    try {
      const categories = 'tourism.attraction,tourism,tourism.sights';
      const radius = 5000; // 5km radius

      const response = await fetch(
        `https://api.geoapify.com/v2/places?` +
          `categories=${categories}&` +
          `filter=circle:${lng},${lat},${radius}&` +
          `bias=proximity:${lng},${lat}&` +
          `limit=20&` +
          `apiKey=f43620fbf30d4f22b821be7a0a977b8c`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const newAttractions: Attraction[] = data.features
          .filter((feature: any) => feature.properties.name)
          .map((feature: any) => ({
            id: feature.properties.place_id,
            name: feature.properties.name,
            description: feature.properties.formatted,
            coordinates: [feature.properties.lon, feature.properties.lat],
            rating: (Math.random() * 2 + 3).toFixed(1),
            distance: `${(Math.random() * 5).toFixed(1)} km`,
            category: feature.properties.categories[0],
            isSelected: false,
          }));

        const updatedAttractions = newAttractions.map((attraction) => ({
          ...attraction,
          isSelected: currentPlan.selectedLocations.some((loc) => loc.id === attraction.id),
        }));

        setAttractions(updatedAttractions);
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      console.log('Selected location:', lat, lng);

      updatePlanDetails({
        selectedLocations: [],
        currentLocation: { latitude: lat, longitude: lng },
      });

      setSelectedLocation({ latitude: lat, longitude: lng });
      await fetchAttractions(lat, lng);

      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [lng, lat],
          zoomLevel: 13,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error('Error handling location select:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttractionPress = (attraction: Attraction) => {
    setSelectedAttraction(selectedAttraction?.id === attraction.id ? null : attraction);

    if (bottomSheetRef.current) {
      bottomSheetRef.current.collapse();
    }

    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: attraction.coordinates,
        zoomLevel: 15,
        animationDuration: 500,
      });
    }
  };

  useEffect(() => {
    if (attractions.length > 0) {
      const updatedAttractions = attractions.map((attraction) => ({
        ...attraction,
        isSelected: currentPlan.selectedLocations.some((loc) => loc.id === attraction.id),
      }));
      setAttractions(updatedAttractions);
    }
  }, [currentPlan.selectedLocations, attractions.length]);

  const toggleAttractionSelection = (attraction: Attraction) => {
    if (attraction.isSelected) {
      removeLocation(attraction.id);
    } else {
      addLocation({
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        coordinates: attraction.coordinates,
        rating: attraction.rating,
        distance: attraction.distance,
        category: attraction.category,
        isSelected: true,
      });
    }

    setAttractions((prevAttractions) =>
      prevAttractions.map((a) => ({
        ...a,
        isSelected: a.id === attraction.id ? !a.isSelected : a.isSelected,
      }))
    );

    setSelectedAttraction(null);
  };

  useEffect(() => {
    const loadInitialLocation = async () => {
      setIsLoading(true);
      try {
        if (currentPlan.currentLocation) {
          setSelectedLocation(currentPlan.currentLocation);
          await fetchAttractions(
            currentPlan.currentLocation.latitude,
            currentPlan.currentLocation.longitude
          );

          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: [
                currentPlan.currentLocation.longitude,
                currentPlan.currentLocation.latitude,
              ],
              zoomLevel: 13,
              animationDuration: 1000,
            });
          }
        } else {
          updatePlanDetails({
            selectedLocations: [],
            currentLocation: undefined,
          });

          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setSelectedLocation(newLocation);
            updatePlanDetails({ currentLocation: newLocation });
            await fetchAttractions(newLocation.latitude, newLocation.longitude);
          }
        }
      } catch (error) {
        console.error('Error loading initial location:', error);
        updatePlanDetails({
          selectedLocations: [],
          currentLocation: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialLocation();
  }, []);

  useEffect(() => {
    return () => {
      updatePlanDetails({
        selectedLocations: [],
        currentLocation: undefined,
      });
    };
  }, []);

  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading attractions...</Text>
        </View>
      ) : (
        <>
          <View
            style={{ zIndex: 1000 }}
            className="absolute top-0 left-0 right-0 z-10 bg-background p-4 "
          >
            <View className="flex-row justify-between items-center">
              <Button
                style={{ height: 50, width: 50 }}
                variant="outline"
                onPress={() => router.back()}
                className="items-center justify-center"
              >
                <ArrowLeft color="white" size={20} />
              </Button>

              <Button
                // disabled={!selectedTransport}
                onPress={() => {
                  router.push('/(tabs)/(user)/plan/attraction');
                }}
                // className={`px-6 py-3 ${!selectedTransport ? 'opacity-50' : ''}`}
              >
                <Text className="text-black font-semibold">Next</Text>
              </Button>
            </View>
          </View>

          {/* <View style={{ zIndex: 1000 }} className="absolute top-10 left-4 right-4 z-10">
            <SearchAttractions
              onLocationSelect={handleLocationSelect}
              MAPBOX_ACCESS_TOKEN={MAPBOX_ACCESS_TOKEN}
            />
          </View> */}

          {selectedLocation ? (
            <MapView
              style={{ flex: 1 }}
              styleURL="mapbox://styles/mapbox/dark-v11"
              scaleBarEnabled={false}
              logoEnabled={false}
              compassEnabled={true}
              attributionEnabled={false}
            >
              <Camera
                ref={cameraRef}
                zoomLevel={13}
                centerCoordinate={[selectedLocation.longitude, selectedLocation.latitude]}
              />

              <UserLocation visible={true} />

              <MarkerView
                id="selectedLocation"
                coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
                allowOverlap={true}
              >
                <Image source={{ uri: markerPin }} style={{ width: 64, height: 64 }} />
              </MarkerView>

              {attractions.map((attraction) => (
                // @ts-ignore
                <MarkerView
                  key={attraction.id}
                  id={attraction.id}
                  coordinate={attraction.coordinates}
                  allowOverlap={true}
                >
                  <Pressable onPress={() => handleAttractionPress(attraction)}>
                    <View>
                      <Image
                        source={{
                          uri: attraction.isSelected ? markerSelectedPin : markerAttractionPin,
                        }}
                        style={{
                          width: attraction.isSelected ? 48 : 24,
                          height: attraction.isSelected ? 48 : 24,
                        }}
                      />
                    </View>
                  </Pressable>

                  {selectedAttraction?.id === attraction.id && (
                    <View className="">
                      <View className="bg-white p-4 rounded-lg w-64" style={{ zIndex: 1000 }}>
                        <Text className="text-black font-bold text-lg">{attraction.name}</Text>
                        <Text className="text-gray-600 mt-1">{attraction.description}</Text>
                        <View className="flex-row items-center mt-2">
                          <FontAwesome
                            style={{ marginRight: 2 }}
                            name="star"
                            size={16}
                            color="#FFD700"
                          />
                          <Text className="text-black mr-4">{attraction.rating}</Text>
                          <Text className="text-gray-600 ml-4">{attraction.distance}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => toggleAttractionSelection(attraction)}
                          className={`mt-4 p-2 rounded-xl ${
                            attraction.isSelected ? 'bg-destructive' : 'bg-primary'
                          }`}
                        >
                          <Text className="text-white text-center">
                            {attraction.isSelected ? 'Remove Location' : 'Add Location'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </MarkerView>
              ))}
            </MapView>
          ) : null}

          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={['25%', '50%', '90%']}
            backgroundStyle={{ backgroundColor: '#414442' }}
          >
            <BottomSheetScrollView className="p-4 pb-24">
              {attractions.map((spot) => (
                <Pressable
                  key={spot.id}
                  style={{
                    backgroundColor: spot.isSelected ? 'rgba(33, 196, 93, 0.2)' : '#27272a',
                  }}
                  className={`flex-row items-center p-4 mb-2 rounded-lg ${
                    spot.isSelected ? ' border-2  border-primary' : 'bg-border'
                  }`}
                  onPress={() => handleAttractionPress(spot)}
                >
                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold">{spot.name}</Text>
                    <Text className="text-gray-400">{spot.description}</Text>
                    <View className="flex-row items-center mt-1">
                      <FontAwesome
                        style={{ marginRight: 2 }}
                        name="star"
                        size={16}
                        color="#FFD700"
                      />
                      <Text className="text-white mr-4">{spot.rating}</Text>
                      <Text className="text-gray-400 ml-4">{spot.distance}</Text>
                    </View>
                  </View>
                  <FontAwesome name="chevron-right" size={16} color="#FFFFFF" />
                </Pressable>
              ))}
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      )}
    </View>
  );
};

export default Attraction;

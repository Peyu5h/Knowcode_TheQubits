import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Location from 'expo-location';

interface MapboxSuggestion {
  name?: string;
  full_address?: string;
  place_formatted?: string;
  mapbox_id: string;
  coordinates?: number[];
}

interface Props {
  onLocationSelect: (lat: number, lng: number, attractions?: any[]) => void;
  MAPBOX_ACCESS_TOKEN: string;
}

export default function SearchAttractions({ onLocationSelect, MAPBOX_ACCESS_TOKEN }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [toAddressList, setToAddressList] = useState<MapboxSuggestion[]>([]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (inputValue && inputValue !== selectedAddress) {
      timeoutId = setTimeout(() => {
        getAddress(inputValue);
      }, 500);
    } else {
      setToAddressList([]);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [inputValue, selectedAddress]);

  const getAddress = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?` +
          `country=in&` +
          `types=place,district,locality&` +
          `limit=5&` +
          `access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();

      if (!data.features) {
        setToAddressList([]);
        return;
      }

      const suggestions = data.features
        .filter((feature: any) =>
          feature.place_type.some((type: string) =>
            ['place', 'district', 'locality'].includes(type)
          )
        )
        .map((feature: any) => ({
          name: feature.text,
          place_formatted: feature.place_name,
          mapbox_id: feature.id,
          coordinates: feature.center,
        }));

      setToAddressList(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setToAddressList([]);
    }
  };

  const handleToAddressClick = async (address: MapboxSuggestion) => {
    const addressText = address.name || address.place_formatted || '';
    setSelectedAddress(addressText);
    setInputValue(addressText);
    setToAddressList([]);

    if (address.coordinates) {
      try {
        console.log('Selected coordinates:', address.coordinates);

        const [longitude, latitude] = address.coordinates;
        const radius = 5000; // 5km radius

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/tourist%20attraction.json?` +
            `proximity=${longitude},${latitude}&` +
            `types=poi&` +
            `limit=10&` +
            `country=IN&` +
            `access_token=${MAPBOX_ACCESS_TOKEN}`
        );

        const data = await response.json();
        console.log('Tourist attractions response:', data);

        if (data.features && data.features.length > 0) {
          const attractions = data.features.map((feature: any) => ({
            id: feature.id,
            name: feature.text,
            description: feature.place_name,
            coordinates: feature.center,
            rating: (Math.random() * 2 + 3).toFixed(1), //random
            distance: `${(Math.random() * 5).toFixed(1)} km`, //random
            category: 'Tourist Attraction',
          }));

          console.log('Processed attractions:', attractions);
          onLocationSelect(latitude, longitude, attractions);
        } else {
          console.log('No attractions found');
          onLocationSelect(latitude, longitude, []);
        }
      } catch (error) {
        console.error('Error fetching tourist attractions:', error);
        onLocationSelect(address.coordinates[1], address.coordinates[0], []);
      }
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (text !== selectedAddress) {
      setSelectedAddress('');
    }
    if (!text) {
      setToAddressList([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder="Enter your location"
        />
      </View>

      {toAddressList && toAddressList.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            style={styles.resultsList}
            data={toAddressList.filter((item) => item?.name || item?.full_address)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              const mainText = item.name || item.place_formatted || '';
              const subText = item.place_formatted !== mainText ? item.place_formatted : '';

              return (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleToAddressClick(item)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={styles.mainText}>{mainText}</Text>
                    {subText ? <Text style={styles.subText}>{subText}</Text> : null}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    backgroundColor: 'white',
    maxHeight: 200,
    borderRadius: 8,
    marginTop: 5,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mainText: {
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
  resultsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

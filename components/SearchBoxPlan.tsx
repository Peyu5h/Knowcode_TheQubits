import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Settings, Settings2 } from 'lucide-react-native';

interface MapboxSuggestion {
  name?: string;
  full_address?: string;
  place_formatted?: string;
  mapbox_id: string;
  coordinates?: number[];
}

interface Props {
  onLocationSelect: (lat: number, lng: number, attractions?: any[], searchQuery?: string) => void;
  MAPBOX_ACCESS_TOKEN: string;
}

export default function SearchBoxPlan({ onLocationSelect, MAPBOX_ACCESS_TOKEN }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [toAddressList, setToAddressList] = useState<MapboxSuggestion[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    onLocationSelect(currentLocation.coords.latitude, currentLocation.coords.longitude, [], '');
  };

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
      const [longitude, latitude] = address.coordinates;
      onLocationSelect(latitude, longitude, [], address.place_formatted || address.name || '');
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
          placeholder="Search destinations"
          className="placeholder:text-gray-500"
        />
      </View>

      {toAddressList.length > 0 && (
        <View style={styles.resultsContainer}>
          {toAddressList
            .filter((item) => item?.name || item?.full_address)
            .map((item, index) => {
              const mainText = item.name || item.place_formatted || '';
              const subText = item.place_formatted !== mainText ? item.place_formatted : '';

              return (
                <TouchableOpacity
                  key={index}
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
            })}
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
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor: '#27272a',
    color: '#FEFEFE',
    backgroundColor: '#0c0a09',
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#0c0a09',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    maxHeight: 200,
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 0.5,
    zIndex: 1000,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#27272a',
    borderWidth: 0.5,
    borderColor: '#27272a',
  },
  mainText: {
    fontWeight: '500',
    color: '#FEFEFE',
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
  resultsContainer: {
    position: 'absolute',
    zIndex: 1000,
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#0c0a09',
    borderColor: '#fff',
    borderRadius: 8,
    borderWidth: 0.2,
    maxHeight: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

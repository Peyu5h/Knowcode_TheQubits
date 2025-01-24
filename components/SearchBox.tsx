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

export default function SearchBox({ onLocationSelect, MAPBOX_ACCESS_TOKEN }: Props) {
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
      onLocationSelect(latitude, longitude, [], addressText);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-12 w-12  bg-background border border-border"
              variant="default"
              size="icon"
            >
              <View className="flex-row items-center justify-center ">
                <Settings2 color="gray" className="h-6 w-6" />
              </View>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            portalHost="dropdown"
            className="w-48 border border-border bg-background"
          >
            <DropdownMenuLabel className="text-foreground">Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {['Popular', 'Recent', 'Rating', 'Distance'].map((option) => (
                <DropdownMenuItem
                  key={option}
                  onPress={() => console.log(option)}
                  className="flex-row items-center  border-b border-border"
                >
                  <Text className="text-foreground text-md py-2 px-2 ">{option}</Text>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>

      {toAddressList.length > 0 && (
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
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
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
    borderBottomColor: 'gray',
    borderWidth: 0.5,
    borderColor: 'gray',
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
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

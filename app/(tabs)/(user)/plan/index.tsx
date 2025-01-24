import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Label } from '~/components/ui/label';
import SearchBox from '~/components/SearchBox';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Input } from '~/components/ui/input';
import { useState, useEffect } from 'react';
import SearchBoxPlan from '~/components/SearchBoxPlan';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { LucideLoader2, X } from 'lucide-react-native';

const formSchema = Yup.object().shape({
  fromLocation: Yup.object().shape({
    lat: Yup.number().required(),
    lng: Yup.number().required(),
    name: Yup.string().required(),
  }),
  toLocation: Yup.object().shape({
    lat: Yup.number().required(),
    lng: Yup.number().required(),
    name: Yup.string().required(),
  }),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().when('tripType', {
    is: 'roundTrip',
    then: (schema) => schema.required('End date is required'),
  }),
  passengers: Yup.number().required('Number of passengers is required'),
  class: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required(),
    })
    .required('Class is required'),
  tripType: Yup.string().oneOf(['oneWay', 'roundTrip']).required(),
});

export default function Plan() {
  const { location } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('oneWay');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [hasFromLocation, setHasFromLocation] = useState(false);

  const formik = useFormik({
    initialValues: {
      fromLocation: { lat: 0, lng: 0, name: '' },
      toLocation: { lat: 0, lng: 0, name: '' },
      startDate: new Date(),
      endDate: new Date(),
      passengers: 1,
      class: 'economy',
      tripType: 'oneWay',
    },
    validationSchema: Yup.object().shape({
      fromLocation: Yup.object().shape({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
        name: Yup.string().required(),
      }),
      toLocation: Yup.object().shape({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
        name: Yup.string().required(),
      }),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date(),
      passengers: Yup.number().required('Number of passengers is required'),
      class: Yup.string().required('Class is required'),
      tripType: Yup.string().oneOf(['oneWay', 'roundTrip']).required(),
    }),
    onSubmit: (values) => {
      router.push({
        pathname: '/(tabs)/(user)/plan/travel',
        params: {
          fromLocation: values.fromLocation.name,
          toLocation: values.toLocation.name,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          passengers: values.passengers,
          class: values.class,
          tripType: activeTab,
        },
      });
      setIsLoading(true);

      setTimeout(() => {
        setSearchResults([
          { id: 1, airline: 'Sample Air', price: '$299', duration: '2h 30m' },
          { id: 2, airline: 'Test Airways', price: '$349', duration: '2h 45m' },
          { id: 3, airline: 'Test Airways', price: '$349', duration: '2h 45m' },
          { id: 4, airline: 'Test Airways', price: '$349', duration: '2h 45m' },
        ]);
        setIsLoading(false);
      }, 2000);
    },
  });

  useEffect(() => {
    checkLocationPermission();
    if (location) {
      getLocationDetails(location as string);
    }
  }, [location]);

  const router = useRouter();

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');

    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.coords.longitude},${location.coords.latitude}.json?access_token=your_mapbox_token`
      );
      const data = await response.json();
      const locationName = data.features[0]?.place_name || '';
      setCurrentLocation(locationName);
      formik.setFieldValue('fromLocation', {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        name: locationName,
      });
    }
  };

  const getLocationDetails = async (locationName: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationName}.json?access_token=pk.eyJ1IjoicGV5dTVoIiwiYSI6ImNtNG9mMms2NjA5NXQyanF6aWFoamlneHAifQ.5dT1m_VXoPx77m_nUAc6VQ`
      );
      const data = await response.json();
      if (data.features && data.features[0]) {
        const feature = data.features[0];
        formik.setFieldValue('toLocation', {
          lat: feature.center[1],
          lng: feature.center[0],
          name: feature.place_name,
        });
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setIsLocationLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');

    if (status === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.coords.longitude},${location.coords.latitude}.json?access_token=pk.eyJ1IjoicGV5dTVoIiwiYSI6ImNtNG9mMms2NjA5NXQyanF6aWFoamlneHAifQ.5dT1m_VXoPx77m_nUAc6VQ`
        );
        const data = await response.json();
        const locationName = data.features[0]?.place_name || '';
        setCurrentLocation(locationName);
        setHasFromLocation(true);
        formik.setFieldValue('fromLocation', {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          name: locationName,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      } finally {
        setIsLocationLoading(false);
      }
    } else {
      setIsLocationLoading(false);
    }
  };

  const onDateChange = (
    event: any,
    selectedDate: Date | undefined,
    dateType: 'startDate' | 'endDate'
  ) => {
    if (event.type === 'set' && selectedDate) {
      formik.setFieldValue(dateType, selectedDate);
    }
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  return (
    <ScrollView style={{ padding: 10, paddingTop: 50 }} className="flex-1 bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-col gap-1.5">
        <TabsList className="flex-row w-full bg-muted mb-6">
          <TabsTrigger
            value="oneWay"
            className="flex-1 p-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Text className="text-sm font-medium">Regular User</Text>
          </TabsTrigger>
          <TabsTrigger
            value="roundTrip"
            className="flex-1 p-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Text className="text-sm font-medium">Round Trip</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="oneWay" className="mt-2">
          <View className="mb-4">
            <Label>Date</Label>
            <Button
              onPress={() => setShowStartDatePicker(true)}
              variant="outline"
              className="w-full justify-start"
            >
              <Text>{formik.values.startDate.toLocaleDateString()}</Text>
            </Button>
            {showStartDatePicker && (
              <DateTimePicker
                value={formik.values.startDate}
                mode="date"
                onChange={(event, date) => onDateChange(event, date, 'startDate')}
                minimumDate={new Date()}
              />
            )}
          </View>
        </TabsContent>
        <TabsContent value="roundTrip" className="mt-2">
          <View className="mb-4 w-full flex-row gap-2 px-4">
            <View className="mb-4 w-1/2">
              <Label>Start Date</Label>
              <Button
                onPress={() => setShowStartDatePicker(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <Text>{formik.values.startDate.toLocaleDateString()}</Text>
              </Button>
            </View>
            <View className="w-1/2">
              <Label>End Date</Label>
              <Button
                onPress={() => setShowEndDatePicker(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <Text>{formik.values.endDate.toLocaleDateString()}</Text>
              </Button>
            </View>
            {showStartDatePicker && (
              <DateTimePicker
                value={formik.values.startDate}
                mode="date"
                onChange={(event, date) => onDateChange(event, date, 'startDate')}
                minimumDate={new Date()}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={formik.values.endDate}
                mode="date"
                onChange={(event, date) => onDateChange(event, date, 'endDate')}
                minimumDate={formik.values.startDate}
              />
            )}
          </View>
        </TabsContent>
      </Tabs>

      <View className="p-4 gap-4">
        <View className="mb-4">
          <Label>From</Label>
          <View className="relative">
            <Input
              editable={false}
              value={formik.values.fromLocation.name || currentLocation || 'Select location'}
              className="pr-24"
            />
            {!hasFromLocation && (
              <Button
                onPress={getUserLocation}
                className="absolute right-1 w-36 top-1 h-8 px-2"
                disabled={isLocationLoading}
              >
                <Text className="text-xs text-white">
                  {isLocationLoading ? (
                    <ActivityIndicator color="white" />
                  ) : locationPermission ? (
                    'Get Location'
                  ) : (
                    'Enable Location'
                  )}
                </Text>
              </Button>
            )}
          </View>
        </View>

        <View className="mb-4">
          <Label>To</Label>
          {formik.values.toLocation.name ? (
            <View>
              <Input
                value={formik.values.toLocation.name || ''}
                editable={false}
                className="mb-2"
              />
              <View className="flex-row gap-2 absolute right-1 top-1">
                <Button onPress={() => formik.setFieldValue('toLocation', {})} variant="ghost">
                  <X color="white" size={20} />
                </Button>
              </View>
            </View>
          ) : (
            <SearchBoxPlan
              MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoicGV5dTVoIiwiYSI6ImNtNG9mMms2NjA5NXQyanF6aWFoamlneHAifQ.5dT1m_VXoPx77m_nUAc6VQ"
              onLocationSelect={(lat, lng, _, name) =>
                formik.setFieldValue('toLocation', { lat, lng, name })
              }
            />
          )}
        </View>

        <View className="mb-4">
          <Label>Passengers</Label>
          <View className="flex-row gap-2">
            <Input
              className="flex-1"
              placeholder="Passengers"
              value={String(formik.values.passengers)}
              onChangeText={(value) => formik.setFieldValue('passengers', parseInt(value) || 1)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Button
          onPress={() => formik.handleSubmit()}
          disabled={!formik.isValid || isLoading}
          className="mt-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black">Search Now</Text>
          )}
        </Button>

        {/* Loading State */}
        {isLoading && (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" />
            <Text className="mt-2">Searching for flights...</Text>
          </View>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View className="mt-4">
            <Text className="text-xl mb-2">Available Flights</Text>
            {searchResults.map((flight) => (
              <View key={flight.id} className="p-4 bg-card rounded-lg mb-2">
                <Text className="font-bold">{flight.airline}</Text>
                <Text>
                  {flight.price} - {flight.duration}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

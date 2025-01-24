import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Text } from '~/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAllTransportData } from '~/lib/dummyData';
import FlightCard from '~/components/travelCards/FlightCard';
import TrainCard from '~/components/travelCards/TrainCard';
import BusCard from '~/components/travelCards/BusCard';
import CarCard from '~/components/travelCards/CarCard';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react-native';

const Hotel = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background relative">
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

      <ScrollView style={{ paddingTop: 80 }} className="flex-1 p-4 ">
        <Text className="text-lg font-semibold mb-2">Flights</Text>
      </ScrollView>
    </View>
  );
};

export default Hotel;

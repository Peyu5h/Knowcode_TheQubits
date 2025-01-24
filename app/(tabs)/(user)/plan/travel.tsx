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

const Travel = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    fromLocation,
    toLocation,
    startDate,
    endDate,
    passengers,
    tripType,
    class: travelClass,
  } = params;
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);

  const { flights, trains, buses, cars } = getAllTransportData();

  const handleSelect = (type: string, id: number) => {
    setSelectedTransport(`${type}-${id}`);
  };

  console.log('Travel params:', {
    fromLocation,
    toLocation,
    startDate,
    endDate,
    passengers,
    tripType,
    travelClass,
  });

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

          <Text className="text-white text-xl font-semibold">Select Transport</Text>

          <Button
            disabled={!selectedTransport}
            onPress={() => {
              console.log('Selected transport:', selectedTransport);
              router.push('/(tabs)/(user)/plan/hotel');
            }}
            className={`px-6 py-3 ${!selectedTransport ? 'opacity-50' : ''}`}
          >
            <Text className="text-black font-semibold">Next</Text>
          </Button>
        </View>
      </View>

      <ScrollView style={{ paddingTop: 80 }} className="flex-1 p-4 ">
        <Text className="text-lg font-semibold mb-2">Flights</Text>
        {flights.map((flight, index) => (
          // @ts-ignore
          <FlightCard
            key={`flight-${index}`}
            {...flight}
            isSelected={selectedTransport === `flight-${index}`}
            onSelect={(isSelected) => handleSelect('flight', index)}
          />
        ))}

        <Text className="text-lg font-semibold mb-2 mt-6">Trains</Text>
        {trains.map((train, index) => (
          // @ts-ignore

          <TrainCard
            key={`train-${index}`}
            {...train}
            isSelected={selectedTransport === `train-${index}`}
            onSelect={(isSelected) => handleSelect('train', index)}
          />
        ))}

        <Text className="text-lg font-semibold mb-2 mt-6">Buses</Text>
        {buses.map((bus, index) => (
          // @ts-ignore

          <BusCard
            key={`bus-${index}`}
            {...bus}
            isSelected={selectedTransport === `bus-${index}`}
            onSelect={(isSelected) => handleSelect('bus', index)}
          />
        ))}

        <Text className="text-lg font-semibold mb-2 mt-6">Cars</Text>
        {cars.map((car, index) => (
          // @ts-ignore

          <CarCard
            key={`car-${index}`}
            {...car}
            isSelected={selectedTransport === `car-${index}`}
            onSelect={(isSelected) => handleSelect('car', index)}
          />
        ))}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default Travel;

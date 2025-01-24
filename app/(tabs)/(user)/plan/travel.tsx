import { View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text } from '~/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAllTransportData } from '~/lib/dummyData';
import FlightCard from '~/components/travelCards/FlightCard';
import TrainCard from '~/components/travelCards/TrainCard';
import BusCard from '~/components/travelCards/BusCard';
import CarCard from '~/components/travelCards/CarCard';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react-native';
import api from '~/lib/api';

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
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { flights: dummyFlights, trains, buses, cars } = getAllTransportData();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await api.post('transport/find', {
          class: params.class,
          endDate: params.endDate,
          fromLocation: JSON.parse(params.fromLocation as string),
          toLocation: JSON.parse(params.toLocation as string),
          passengers: Number(params.passengers),
          startDate: params.startDate,
          tripType: params.tripType,
        });

        if (response.success) {
          setFlights(response.result as any);
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [params]);

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
        {/* {isLoading ? (
          <ActivityIndicator size="large" className="mt-4" />
        ) : (
          flights.map((flight, index) => (
            <FlightCard
              key={`flight-${index}`}
              from={params.fromLocation.name}
              to={params.toLocation.name}
              date={params.startDate}
              price_inr={parseInt(flight.price.replace(/[^\d]/g, ''))}
              airline={flight.airlineName}
              flight_number={`${flight.sourceAirport}-${flight.destinationAirport}`}
              duration={flight.journeyTime}
              eco={false}
              co2="0"
              isSelected={selectedTransport === `flight-${index}`}
              onSelect={() => handleSelect('flight', index)}
              departureTime={flight.departureTime}
              arrivalTime={flight.arrivalTime}
              stops={flight.stops}
              airlineLogo={flight.airlineLogo}
            />
          ))
        )} */}

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

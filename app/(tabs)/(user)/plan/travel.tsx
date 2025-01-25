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
import { Skeleton } from '~/components/ui/skeleton';

interface ApiTrain {
  trainNumber: string;
  trainName: string;
  departureTime: string;
  fromStation: string;
  arrivalTime: string;
  toStation: string;
  price: string;
}

interface ApiFlight {
  airlineLogo: string;
  airlineName: string;
  departureTime: string;
  arrivalTime: string;
  arrivalDate?: string;
  sourceAirport: string;
  destinationAirport: string;
  journeyTime: string;
  stops: number;
  price: string;
}

interface ApiResponse {
  flights: ApiFlight[] | null;
  trains: ApiTrain[] | null;
}

const Travel = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<ApiResponse>({ flights: null, trains: null });
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);

  const { flights: dummyFlights, trains, buses, cars } = getAllTransportData();

  const parseLocationName = (locationString: string) => {
    try {
      const location = JSON.parse(locationString);
      return location.name.split(',')[0].trim().split(' ')[0];
    } catch (error) {
      console.error('Error parsing location:', error);
      return locationString;
    }
  };

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const requestBody = {
          class: 'economy',
          fromLocation: {
            lat: JSON.parse(params.fromLocation as string).lat,
            lng: JSON.parse(params.fromLocation as string).lng,
            name: parseLocationName(params.fromLocation as string),
          },
          passengers: Number(params.passengers),
          startDate: params.startDate,
          toLocation: {
            lat: JSON.parse(params.toLocation as string).lat,
            lng: JSON.parse(params.toLocation as string).lng,
            name: parseLocationName(params.toLocation as string),
          },
          tripType: params.tripType,
        };

        if (params.tripType === 'roundTrip') {
          requestBody.startDate = params.endDate;
        }

        const response = await api.post('transport/find', requestBody);

        if (response.success) {
          setApiData(response.result as ApiResponse);
        }
      } catch (error) {
        console.error('Error fetching transport:', error);
        setApiData({ flights: null, trains: null });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransport();
  }, []);

  const handleSelect = (type: string, id: number) => {
    setSelectedTransport(`${type}-${id}`);
  };

  console.log('Travel params:', {
    fromLocation: params.fromLocation,
    toLocation: params.toLocation,
    startDate: params.startDate,
    endDate: params.endDate,
    passengers: params.passengers,
    tripType: params.tripType,
    travelClass: params.travelClass,
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
        {isLoading ? (
          <View>
            <View className="space-y-4">
              <Skeleton className="h-40 my-2 w-full" />
              <Skeleton className="h-40 my-2 w-full" />
              <Skeleton className="h-40 my-2 w-full" />
            </View>
            <View className="space-y-4">
              <Skeleton className="h-40 my-2 w-full" />
              <Skeleton className="h-40 my-2 w-full" />
              <Skeleton className="h-40 my-2 w-full" />
            </View>
          </View>
        ) : (
          <>
            {apiData.flights &&
              apiData.flights.map((flight, index) => (
                <FlightCard
                  key={`flight-${index}`}
                  type="flight"
                  distance_km={0}
                  from={parseLocationName(params.fromLocation as string)}
                  to={parseLocationName(params.toLocation as string)}
                  date={new Date(params.startDate as string).toLocaleDateString('en-IN')}
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
              ))}
          </>
        )}

        {!isLoading && (
          <>
            {apiData.trains && (
              <>
                <Text className="text-lg font-semibold mb-2 mt-6">Trains</Text>
                {apiData.trains.map((train, index) => (
                  <TrainCard
                    key={`train-${index}`}
                    type="train"
                    distance_km={0}
                    from={train.fromStation.split(' (')[0]}
                    to={train.toStation.split(' (')[0]}
                    date={new Date(params.startDate as string).toLocaleDateString('en-IN')}
                    price_inr={parseInt(train.price || '0')}
                    train_name={train.trainName}
                    train_number={train.trainNumber}
                    duration={`${train.departureTime} - ${train.arrivalTime}`}
                    eco={false}
                    co2="0"
                    isSelected={selectedTransport === `train-${index}`}
                    onSelect={() => handleSelect('train', index)}
                  />
                ))}
              </>
            )}
          </>
        )}

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

import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { Clock } from 'lucide-react-native';
import { TransportData } from '~/lib/types';

interface FlightCardProps extends TransportData {
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  co2: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  airlineLogo?: string;
}

const FlightCard = ({
  from,
  to,
  date,
  price_inr,
  airline,
  flight_number,
  duration,
  eco,
  co2,
  isSelected,
  onSelect,
  departureTime,
  arrivalTime,
  stops,
  airlineLogo,
}: FlightCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(!isSelected)}
      className={`mb-4 p-4 rounded-lg border ${
        isSelected ? 'bg-primary/10 border-primary' : 'border-border bg-card'
      }`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">
          {from} → {to}
        </Text>
        <Text className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</Text>
      </View>

      <View className="mb-2">
        <View className="flex-row items-center gap-2">
          {airlineLogo && (
            <Image
              source={{ uri: airlineLogo }}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          )}
          <Text className="text-primary font-bold">{airline}</Text>
        </View>
        <Text className="text-sm text-muted-foreground">Flight: {flight_number}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <Text className="text-lg">{departureTime}</Text>
          <View className="flex-row items-center gap-1">
            <View className="h-[1px] w-12 bg-muted-foreground" />
            <Text className="text-xs text-muted-foreground">
              {stops} stop{stops !== 1 ? 's' : ''}
            </Text>
            <View className="h-[1px] w-12 bg-muted-foreground" />
          </View>
          <Text className="text-lg">{arrivalTime}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row gap-2 items-center">
          <Clock color="white" size={16} />
          <Text>{duration}</Text>
        </View>
        <Text className="text-lg font-medium">₹{price_inr}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FlightCard;

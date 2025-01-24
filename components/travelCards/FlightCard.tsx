import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Clock, Plane } from 'lucide-react-native';
import { TransportData } from '~/lib/types';

interface FlightCardProps extends TransportData {
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  co2: string;
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
        <Text className="text-sm text-muted-foreground">{date}</Text>
      </View>

      <View className="mb-2">
        <Text className="text-primary font-bold">{airline}</Text>
        <Text className="text-sm text-muted-foreground">Flight: {flight_number}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-2 items-center">
          <Clock color="white" size={16} className="mr-2" />
          <Text>{duration}</Text>
        </View>
        <Text className="font-semibold">CO2: {co2}kg</Text>
      </View>

      <View className="mt-2 flex-row justify-between items-center">
        <Text className="text-lg font-medium">₹{price_inr}</Text>
        {eco && (
          <View className="bg-primary px-2 py-1 rounded">
            <Text className="text-xs text-primary-foreground">Eco-friendly</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FlightCard;

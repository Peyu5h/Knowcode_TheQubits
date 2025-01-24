import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Bus, Clock } from 'lucide-react-native';
import { TransportData } from '~/lib/types';

interface BusCardProps extends TransportData {
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  co2: string;
}

const BusCard = ({
  from,
  to,
  date,
  price_inr,
  bus_name,
  bus_number,
  duration,
  fuel,
  eco,
  co2,
  isSelected,
  onSelect,
}: BusCardProps) => {
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
        <Text className="text-primary font-bold">{bus_name}</Text>
        <Text className="text-sm text-muted-foreground">Bus: {bus_number}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-2 items-center">
          <Clock color="white" size={16} className="mr-2" />
          <Text>{duration}</Text>
          <Text className="ml-2 text-sm">{fuel}</Text>
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

export default BusCard;

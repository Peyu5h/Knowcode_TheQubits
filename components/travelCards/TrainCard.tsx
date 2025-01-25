import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Clock, Train } from 'lucide-react-native';
import { TransportData } from '~/lib/types';

interface TrainCardProps extends TransportData {
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  co2: string;
}

const formatTime = (time: string) => {
  if (!time) return '';
  const [timeStr, meridiem] = time.split(/(?=[AP]M)/);
  if (meridiem) return time;
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const TrainCard = ({
  from,
  to,
  date,
  price_inr,
  train_name,
  train_number,
  duration,
  eco,
  co2,
  isSelected,
  onSelect,
}: TrainCardProps) => {
  const [departureTime, arrivalTime] = duration.split(' - ');

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
        <Text className="text-primary font-bold">{train_name}</Text>
        <Text className="text-sm text-muted-foreground">Train: {train_number}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <View className="items-center">
            <Text className="text-lg font-medium">{formatTime(departureTime)}</Text>
            <Text className="text-xs text-muted-foreground">Departure</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="h-[1px] w-12 bg-muted-foreground" />
            <Train size={16} color="white" />
            <View className="h-[1px] w-12 bg-muted-foreground" />
          </View>
          <View className="items-center">
            <Text className="text-lg font-medium">{formatTime(arrivalTime)}</Text>
            <Text className="text-xs text-muted-foreground">Arrival</Text>
          </View>
        </View>
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

export default TrainCard;

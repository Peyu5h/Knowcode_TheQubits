import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { Clock } from 'lucide-react-native';
import { TransportData } from '~/lib/types';
import { SvgUri } from 'react-native-svg';

interface FlightCardProps extends TransportData {
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  co2: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  airlineLogo?: string;
}

const formatTime = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

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
        <Text className="text-lg font-semibold">Mumbai → {to}</Text>
        <Text className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</Text>
      </View>

      <View className="mb-2">
        <View className="flex-row items-center gap-2">
          {airlineLogo &&
            (airlineLogo.endsWith('.svg') ? (
              <SvgUri width={20} height={20} uri={airlineLogo} />
            ) : (
              <Image
                source={{ uri: airlineLogo }}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            ))}
          <Text className="text-primary font-bold">{airline}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <View className="items-center">
            <Text className="text-lg font-medium">{formatTime(departureTime)}</Text>
            <Text className="text-xs text-muted-foreground">Departure</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="h-[1px] w-12 bg-muted-foreground" />
            <Text className="text-xs text-muted-foreground">{duration}</Text>
            <View className="h-[1px] w-12 bg-muted-foreground" />
          </View>
          <View className="items-center">
            <Text className="text-lg font-medium">{formatTime(arrivalTime) || 'N/A'}</Text>
            <Text className="text-xs text-muted-foreground">Arrival</Text>
          </View>
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

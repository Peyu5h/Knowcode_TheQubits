import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Check, Leaf } from 'lucide-react-native';
import Carousel from 'react-native-reanimated-carousel';
import { HotelCardProps } from '~/lib/types';

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isHighestEcoScore,
  onSelect,
  isSelected,
}) => {
  return (
    <View
      className={`relative rounded-lg bg-card shadow-md overflow-hidden ${
        isSelected ? 'border-2 border-primary' : ''
      }`}
    >
      {isHighestEcoScore && (
        <View className="absolute right-2 top-2 z-10 rounded-lg bg-secondary p-2">
          <Leaf size={24} color="#22c55e" />
        </View>
      )}

      <Image
        source={{ uri: hotel.images[0] }}
        style={{ width: '100%', height: 200 }}
        resizeMode="cover"
      />

      <View className="p-4">
        <Text className="text-xl font-bold">{hotel.hotelName}</Text>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-gray-400">{hotel.city}</Text>
          <View>
            <Text className="text-lg font-semibold">₹{hotel.pricePerNight}/night</Text>
            <Text className="text-green-600">Rating: {hotel.rating}/10</Text>
          </View>
        </View>

        <View className="mb-2 flex-row flex-wrap gap-2">
          {hotel.ecofriendly_certificates.map((cert, index) => (
            <View key={index} className="rounded bg-green-100 px-2 py-1">
              <Text className="text-xs text-green-800">{cert}</Text>
            </View>
          ))}
        </View>

        <View className="mb-2">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} className="flex-row items-center gap-2">
              <Check color="#22c55e" size={16} />
              <Text className="text-gray-400">{amenity}</Text>
            </View>
          ))}
        </View>

        <Button className="mt-2 w-full" onPress={onSelect}>
          <Text className="text-primary-foreground">See details</Text>
        </Button>
      </View>
    </View>
  );
};

export default HotelCard;

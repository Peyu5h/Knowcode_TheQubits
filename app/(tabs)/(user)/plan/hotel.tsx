import { View, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';
import { Button } from '~/components/ui/button';
import { ArrowLeft, Minus, Plus } from 'lucide-react-native';
import HotelCard from '~/components/travelCards/HotelCard';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { usePlanStore } from '~/lib/store/usePlanStore';
import { dummyHotels } from '~/lib/dummyData';
import Carousel from 'react-native-reanimated-carousel';
import { Input } from '~/components/ui/input';
import { HotelCardProps } from '~/lib/types';

const Hotel = () => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelCardProps['hotel'] | null>(null);
  const { currentPlan } = usePlanStore();
  const [nights, setNights] = useState(1);
  const width = Dimensions.get('window').width;

  const handleHotelSelect = (hotel: any) => {
    setSelectedHotel(hotel);
    bottomSheetRef.current?.expand();
  };

  const incrementNights = () => setNights((prev) => prev + 1);
  const decrementNights = () => setNights((prev) => Math.max(1, prev - 1));

  return (
    <View className="flex-1 bg-background relative">
      <View
        style={{ zIndex: 1000 }}
        className="absolute top-0 left-0 right-0 z-10 bg-background p-4"
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
            onPress={() => {
              router.push('/(tabs)/(user)/plan/attraction');
            }}
          >
            <Text className="text-black font-semibold">Next</Text>
          </Button>
        </View>
      </View>

      <ScrollView style={{ paddingTop: 80 }} className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">Hotels near Delhi</Text>

        <View style={{ marginBottom: 150 }} className="space-y-4">
          {dummyHotels.map((hotel) => (
            <Pressable className="mb-6" key={hotel.id} onPress={() => handleHotelSelect(hotel)}>
              <HotelCard
                hotel={hotel}
                isHighestEcoScore={hotel.eco >= 0.9}
                onSelect={() => handleHotelSelect(hotel)}
                isSelected={selectedHotel?.id === hotel.id}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['90%']}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: '#27272a' }}
      >
        <BottomSheetScrollView className="p-4">
          {selectedHotel && (
            <View>
              <Carousel
                loop
                width={width - 32}
                height={200}
                autoPlay={true}
                data={selectedHotel.images}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{ width: '100%', height: '100%', borderRadius: 8 }}
                    resizeMode="cover"
                  />
                )}
              />

              <Text className="text-xl font-bold text-white mt-4 mb-2">
                {selectedHotel.hotelName}
              </Text>

              <View className="flex-row justify-between items-center mb-4">
                <View>
                  {/* <Text className="text-gray-200">{selectedHotel.city}</Text> */}
                  <Text className="text-gray-400">{selectedHotel.address}</Text>
                </View>
                <Text className="text-lg mr-2 text-white font-semibold">
                  ₹{selectedHotel.pricePerNight}/night
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2 mb-4">
                {selectedHotel.ecofriendly_certificates.map((cert: string, index: number) => (
                  <View key={index} className="bg-green-100 rounded-full px-3 py-1">
                    <Text className="text-green-800 text-xs">{cert}</Text>
                  </View>
                ))}
              </View>

              <Text className="text-white font-semibold mb-2">Amenities:</Text>
              <View className="mb-4">
                {selectedHotel.amenities.map((amenity: string, index: number) => (
                  <Text key={index} className="text-gray-400 mb-1">
                    • {amenity}
                  </Text>
                ))}
              </View>

              <View className="flex-row items-center gap-4 mb-4">
                <Button
                  onPress={decrementNights}
                  variant="outline"
                  className="h-10 w-10 items-center justify-center"
                >
                  <Minus size={20} color="white" />
                </Button>
                <Text className="text-white text-lg">{nights}</Text>
                <Button
                  onPress={incrementNights}
                  variant="outline"
                  className="h-10 w-10 items-center justify-center"
                >
                  <Plus size={20} color="white" />
                </Button>
                <Text className="text-white">nights</Text>
              </View>

              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg">Total Cost:</Text>
                <Text className="text-white text-2xl font-bold">
                  ₹{selectedHotel.pricePerNight * nights}
                </Text>
              </View>

              <Button
                className="mt-4"
                onPress={() => {
                  const totalCost = selectedHotel.pricePerNight * nights;
                  bottomSheetRef.current?.close();
                }}
              >
                <Text className="text-black font-semibold">Add to budget</Text>
              </Button>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Hotel;

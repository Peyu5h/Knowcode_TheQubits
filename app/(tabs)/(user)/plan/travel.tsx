import { View } from 'react-native';
import React from 'react';
import { Text } from '~/components/ui/text';

const travel = ({
  fromLocation,
  toLocation,
  startDate,
  endDate,
  passengers,
  tripType,
}: {
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate: string;
  passengers: number;
  class: string;
  tripType: string;
}) => {
  console.log(fromLocation, toLocation, startDate, endDate, passengers, tripType);

  return (
    <View className="flex-1 bg-background">
      <Text>travel</Text>
    </View>
  );
};

export default travel;

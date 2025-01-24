import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';

const driver = () => {
  return (
    // <View className="flex-1 items-center justify-center bg-background">
    //   <Text>Driver</Text>
    // </View>
    <Redirect href={'/(tabs)/(user)/plan/travel'} />
  );
};

export default driver;

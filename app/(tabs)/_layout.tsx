import '~/global.css';

import React from 'react';

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(driver)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(hotel)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(user)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

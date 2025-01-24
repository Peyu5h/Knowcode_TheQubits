import '~/global.css';

import React from 'react';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="travel"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="hotel"
        options={{
          headerShown: false,
        }}
      />
      <PortalHost />
    </Stack>
  );
}

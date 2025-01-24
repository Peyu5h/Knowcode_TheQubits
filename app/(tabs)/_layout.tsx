import '~/global.css';

import React from 'react';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';

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
          statusBarStyle: 'dark',
          statusBarHidden: true,
        }}
      />
      <Stack.Screen
        name="(user)"
        options={{
          headerShown: false,
        }}
      />
      <PortalHost />
    </Stack>
  );
}

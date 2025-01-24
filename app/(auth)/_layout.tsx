import '~/global.css';

import React from 'react';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { ToastProvider } from '~/components/ui/toast';

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />

        <PortalHost />
      </Stack>
    </ToastProvider>
  );
}

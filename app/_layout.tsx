import '~/global.css';
import { Tabs } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { Pressable, StatusBar, View } from 'react-native';
import { cn } from '~/lib/utils';
import { PortalHost } from '@rn-primitives/portal';
import { ToastProvider } from '~/components/ui/toast';

import { ReactQueryProvider } from '~/lib/ReactQueryProvider';
import React from 'react';

import { Slot, Stack, useSegments, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type UserType = 'regular' | 'hotel' | 'driver';

const AuthContext = React.createContext<{
  isLoggedIn: boolean;
  userType: UserType;
  signIn: (type: UserType) => void;
  signOut: () => void;
}>({
  isLoggedIn: false,
  userType: 'regular',
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();

  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [userType, setUserType] = React.useState<UserType>('regular');

  const authContext = React.useMemo(
    () => ({
      isLoggedIn,
      userType,
      signIn: (type: UserType) => {
        setIsLoggedIn(true);
        setUserType(type);
        switch (type) {
          case 'hotel':
            router.replace('/(tabs)/(hotel)/hotel');
            break;
          case 'driver':
            router.replace('/(tabs)/(driver)/driver');
            break;
          case 'regular':
            router.replace('/(tabs)/(user)');
            break;
        }
      },
      signOut: () => {
        setIsLoggedIn(false);
        setUserType('regular');
        router.replace('/(auth)/sign-in');
      },
    }),
    [isLoggedIn, userType]
  );

  React.useEffect(() => {
    if (!segments) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isLoggedIn && inAuthGroup) {
      switch (userType) {
        case 'hotel':
          router.replace('/(tabs)/(hotel)/hotel');
          break;
        case 'driver':
          router.replace('/(tabs)/(driver)/driver');
          break;
        default:
          router.replace('/(tabs)/(user)');
      }
    }
  }, [isLoggedIn, segments, userType]);

  if (!segments) {
    return null;
  }

  if (segments[0] === '(auth)') {
    return (
      <AuthContext.Provider value={authContext}>
        <View className={cn('flex-1', isDarkColorScheme ? 'dark' : '')}>
          <Slot />
        </View>
      </AuthContext.Provider>
    );
  }

  return (
    <ToastProvider>
      <GestureHandlerRootView>
        <AuthContext.Provider value={authContext}>
          <ReactQueryProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                statusBarHidden: false,
                statusBarStyle: 'light',
                statusBarBackgroundColor: '#0c0a09',
              }}
            >
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </ReactQueryProvider>
        </AuthContext.Provider>
      </GestureHandlerRootView>
      <PortalHost />
    </ToastProvider>
  );
}

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
import { usePlanStore } from '~/lib/store/usePlanStore';

type UserType = 'regular';

const AuthContext = React.createContext<{
  signIn: (type: UserType) => void;
  signOut: () => void;
}>({
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();

  const user = usePlanStore((state) => state.user);
  const clearUser = usePlanStore((state) => state.clearUser);

  const authContext = React.useMemo(
    () => ({
      signIn: () => {
        router.replace('/(tabs)/(user)');
      },
      signOut: () => {
        clearUser();
        router.replace('/(auth)/sign-in');
      },
    }),
    []
  );

  React.useEffect(() => {
    if (!segments) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/(user)');
    }
  }, [user, segments]);

  if (!segments) return null;

  return (
    <AuthContext.Provider value={authContext}>
      <View className={cn('flex-1', isDarkColorScheme ? 'dark' : '')}>
        {!user ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        )}
      </View>
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <ToastProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ReactQueryProvider>
          <RootLayoutNav />
        </ReactQueryProvider>
      </GestureHandlerRootView>
      <PortalHost />
    </ToastProvider>
  );
}

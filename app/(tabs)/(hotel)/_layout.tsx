import '~/global.css';
import { Tabs } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { Pressable, View } from 'react-native';
import { cn } from '~/lib/utils';
import { ThemeToggle } from '~/components/ThemeToggle';
import { getColor, getMemoizedColor } from '~/lib/utils';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../_layout';

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const getThemeColor = React.useMemo(
    () => getMemoizedColor(isDarkColorScheme ? 'dark' : 'light'),
    [isDarkColorScheme]
  );

  return (
    <View className={cn('flex-1', isDarkColorScheme ? 'dark' : '')}>
      <Tabs
        screenOptions={{
          headerRight: () => <ThemeToggle />,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 65,
            elevation: 0,
            position: 'absolute',
            left: 16,
            right: 16,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderTopWidth: 0,
            backgroundColor: getThemeColor('background'),
            borderColor: getThemeColor('border'),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            paddingHorizontal: 16,
          },
          tabBarBackground: () => (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: getThemeColor('muted'),
              }}
            />
          ),
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            // borderTopWidth: 1,
            // borderTopColor: COLORS.searchBg[isDarkColorScheme ? 'dark' : 'light'],
          },

          tabBarActiveTintColor: getThemeColor('primary'),
          tabBarInactiveTintColor: getThemeColor('muted-foreground'),
          tabBarButton: (props) => (
            <Pressable {...props} style={({ pressed }) => [props.style, { opacity: 0 }]} />
          ),
          headerShown: false,
          headerStyle: {
            backgroundColor: getThemeColor('background'),
          },
          headerTintColor: getThemeColor('foreground'),
        }}
      >
        <Tabs.Screen
          name="hotel"
          options={{
            title: 'Hotel',
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                <Ionicons name="home-outline" size={28} color={color} />
              ) : (
                <Ionicons name="home-outline" size={28} color={color} />
              ),
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{
                  color: getThemeColor('muted-foreground'),
                  borderless: true,
                  radius: 28,
                }}
                style={({ pressed }) => [
                  props.style,
                  {
                    opacity: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color }) =>
              focused ? (
                <Ionicons name="person" size={28} color={color} />
              ) : (
                <Ionicons name="person-outline" size={28} color={color} />
              ),
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{
                  color: getThemeColor('muted-foreground'),
                  borderless: true,
                  radius: 28,
                }}
                style={({ pressed }) => [
                  props.style,
                  {
                    opacity: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              />
            ),
          }}
        />

        <Tabs.Screen name="+not-found" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

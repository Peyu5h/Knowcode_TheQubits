import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="gap-4">
        <Text className="text-foreground">This screen doesn't exist.</Text>
        <Link href="/(tabs)/(user)/plan" asChild>
          <Text className="text-blue-500">Go to home screen!</Text>
        </Link>
      </View>
    </View>
  );
}

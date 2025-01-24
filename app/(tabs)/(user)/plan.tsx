import { useRouter, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Plan() {
  const router = useRouter();
  const { location } = useLocalSearchParams<{ location: string }>();

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground text-xl mb-4">
        {location ? `Planning for ${location}` : 'No location selected'}
      </Text>
      <Button onPress={() => router.back()}>
        <Text>Go Back</Text>
      </Button>
    </View>
  );
}

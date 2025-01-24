import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Plan() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground">Plan Page</Text>
      <Button onPress={() => router.push('/(tabs)/(user)/plan')}>
        <Text>go to</Text>
      </Button>
    </View>
  );
}

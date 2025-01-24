import { SafeAreaView, View } from 'react-native';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Text } from '~/components/ui/text';

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 items-center bg-background justify-center">
      <Text className="text-foreground">Profile Page</Text>
      <View className="flex-1 items-center bg-background justify-center">
        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
}

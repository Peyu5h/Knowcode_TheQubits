import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/app/_layout';

export default function Profile() {
  const { signOut } = useAuth();
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground">Bookings Page</Text>
      <Button onPress={() => signOut()}>
        <Text className="text-primary-foreground">Sign Out</Text>
      </Button>
    </View>
  );
}

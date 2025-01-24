import { Redirect } from 'expo-router';
import { useAuth } from './_layout';

export default function NotFoundScreen() {
  const { userType } = useAuth();

  switch (userType) {
    case 'hotel':
      return <Redirect href="/(tabs)/(hotel)/hotel" />;
    case 'driver':
      return <Redirect href="/(tabs)/(driver)/driver" />;
    case 'regular':
      return <Redirect href="/(tabs)/(user)" />;
    default:
      return <Redirect href="/(tabs)/(user)" />;
  }
}

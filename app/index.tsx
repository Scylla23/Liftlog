import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to LiftLog!</Text>
      {/* Example of linking to another page */}
      <Link href="/profile">Go to Profile</Link>
    </View>
  );
}

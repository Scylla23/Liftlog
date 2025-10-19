import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function ProfilePage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the Profile Page</Text>
      <Link href="/">Go to Home</Link>
    </View>
  );
}

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* This screen was already here */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />

      {/* You need to add this line.
        It tells the Stack navigator that "profile" is a valid screen.
      */}
      <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
    </Stack>
  );
}

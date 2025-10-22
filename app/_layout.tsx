import { Stack, useRouter, useSegments } from 'expo-router';
import { colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { commonStyles } from '@/constants/styles';
import { useLanguage } from '@/hooks/useLanguage';
import '@/i18n';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { t } = useLanguage();
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      // User is logged in redirect them
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      // User is logged out
      router.replace('/(auth)/landing');
    }
  }, [session, loading, segments, router]);

  // While loading, we can return null or a loading spinner
  // TODO: add a loading spinner here
  if (loading) {
    return null;
  }

  return (
    <View style={commonStyles.container}>
      <StatusBar style="light" backgroundColor={colors.background} />

      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

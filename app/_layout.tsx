import { Stack, useRouter, useSegments } from 'expo-router';
import { colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { commonStyles } from '@/constants/styles';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import '@/i18n';

export default function RootLayout() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inAuthGroup) {
      // User is authenticated but not in the protected area, redirect to tabs
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inAuthGroup) {
      // User is not authenticated but trying to access protected area, redirect to landing
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar style="light" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
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
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

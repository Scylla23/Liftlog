import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { commonStyles } from '@/constants/styles';
import en from '@/i18n/en';

export default function RootLayout() {
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
          name="login"
          options={{
            title: en.signIn,
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

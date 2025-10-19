import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Calendar, Dumbbell, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AuthGuard from '@/components/AuthGuard';
import { commonStyles } from '@/constants/styles';
import { spacing } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';
import { useLanguage } from '@/hooks/useLanguage';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={commonStyles.container} edges={['bottom']}>
      <AuthGuard>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: colors.card,
              borderTopColor: colors.cardBorder,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: spacing.sm,
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: {
              fontSize: fontSize.sm,
              fontWeight: fontWeight.medium,
              marginTop: spacing.xsm,
            },
            tabBarIconStyle: {
              marginBottom: spacing.xsm,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: fontWeight.semibold,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t('home') ,
              tabBarIcon: ({ color, size, focused }) => (
                <Home 
                  color={color} 
                  size={size} 
                  strokeWidth={focused ? 2.5 : 2}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="calendar"
            options={{
              title: t('calendar'),
              tabBarIcon: ({ color, size, focused }) => (
                <Calendar 
                  color={color} 
                  size={size} 
                  strokeWidth={focused ? 2.5 : 2}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="exercises"
            options={{
              title: t('exercises'),
              tabBarIcon: ({ color, size, focused }) => (
                <Dumbbell 
                  color={color} 
                  size={size} 
                  strokeWidth={focused ? 2.5 : 2}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: t('profile'),
              tabBarIcon: ({ color, size, focused }) => (
                <User 
                  color={color} 
                  size={size} 
                  strokeWidth={focused ? 2.5 : 2}
                />
              ),
            }}
          />
        </Tabs>
      </AuthGuard>
    </SafeAreaView>
  );
}

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';
import { useLanguage } from '@/hooks/useLanguage';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function landing() {
  const { t } = useLanguage();
  const router = useRouter();

  // Redirect user to login page
  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/liftlog-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Liftlog</Text>
        <Text style={styles.subtitle}>{t('trackWorkoutsStayConsistent')}</Text>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>{t('getStarted')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    minWidth: 200,
  },
  getStartedButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
});

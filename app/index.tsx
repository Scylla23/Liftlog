import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthButtons } from '@/components/AuthButtons';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';

export default function LandingPage() {
  const { t } = useLanguage();
  const { signInWithGoogle, signInWithApple, signInAnonymously, isLoading, isAuthenticated } =
    useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const handleGetStarted = () => {
    setShowAuthOptions(true);
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert(t('authError'), error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleAppleAuth = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert(t('authError'), error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleGuestAccess = async () => {
    try {
      await signInAnonymously();
    } catch (error) {
      Alert.alert(t('authError'), error instanceof Error ? error.message : 'Guest access failed');
    }
  };

  if (showAuthOptions) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/liftlog-logo.svg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Liftlog</Text>
          <Text style={styles.subtitle}>{t('trackWorkoutsStayConsistent')}</Text>

          <View style={styles.authContainer}>
            <AuthButtons
              onGooglePress={handleGoogleAuth}
              onApplePress={handleAppleAuth}
              isLoading={isLoading}
            />

            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestAccess}
              disabled={isLoading}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/liftlog-logo.svg')}
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
    color: 'white',
    width: 80,
    height: 80,
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
  authContainer: {
    width: '100%',
    maxWidth: 300,
  },
  guestButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  guestButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

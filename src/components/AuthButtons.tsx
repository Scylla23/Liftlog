import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/hooks/useLanguage';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';

interface AuthButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  isLoading?: boolean;
}

export function AuthButtons({ onGooglePress, onApplePress, isLoading = false }: AuthButtonsProps) {
  const { t } = useLanguage();

  const handleError = (error: string) => {
    Alert.alert(t('authError'), error, [{ text: t('tryAgain'), style: 'default' }]);
  };

  const handleGooglePress = () => {
    try {
      onGooglePress();
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const handleApplePress = () => {
    try {
      onApplePress();
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={handleGooglePress}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} />
            <Text style={[styles.buttonText, styles.googleButtonText]}>
              {t('continueWithGoogle')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.appleButton]}
        onPress={handleApplePress}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : (
          <>
            <Ionicons name="logo-apple" size={20} />
            <Text style={[styles.buttonText, styles.appleButtonText]}>
              {t('continueWithApple')}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.sm,
    minHeight: 52,
  },
  googleButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  appleButton: {
    backgroundColor: colors.text,
    borderWidth: 1,
    borderColor: colors.text,
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  googleButtonText: {
    color: colors.background,
  },
  appleButtonText: {
    color: colors.background,
  },
});

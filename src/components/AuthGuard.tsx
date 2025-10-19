import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { fontSize, fontWeight, lineHeight } from '@/constants/typography';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  const { t } = useLanguage();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t('loading')}...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return fallback || <LoginScreen />;
  }

  return <>{children}</>;
}

function LoginScreen() {
  const { login } = useAuth();

  const { t } = useLanguage();

  const handleLogin = () => {
    login('demo@example.com', 'password');
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginCard}>
        <Text style={styles.loginTitle}>{t('welcomeToLiftLog')}</Text>
        <Text style={styles.loginSubtitle}>{t('yourPersonalGymCompanion')}</Text>

        <View style={styles.loginButton} onTouchEnd={handleLogin}>
          <Text style={styles.loginButtonText}>{t('signIn')}</Text>
        </View>

        <Text style={styles.loginNote}>
          This is a demo login. In a real app, you'd have proper authentication.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  loginCard: {
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  loginTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  loginSubtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  loginNote: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: lineHeight.relaxed * fontSize.sm,
  },
});

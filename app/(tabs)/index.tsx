import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import { commonStyles } from '@/constants/styles';
import CustomScrollView from '@/components/CustomScrollView';
import { useLanguage } from '@/hooks/useLanguage';
import { fontSize, fontWeight } from '@/constants/typography';

export default function HomeScreen() {
  const { t } = useLanguage();

  return (
    <CustomScrollView>
      <View style={styles.header}>
        <Text style={styles.greeting}>{t('welcomeBack')}!</Text>
        <Text style={commonStyles.subtitle}>{t('readyForYourNextWorkout')}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>{t('todayStats')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('workouts')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('exercises')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('minutes')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
        <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>{t('startNewWorkout')}</Text>
        </View>
        <View style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>{t('viewProgress')}</Text>
        </View>
        </View>
      </View>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statsContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  quickActions: {
    marginBottom: spacing.xl,
  },
  actionButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  actionButtonsContainer: {},
});

import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import { commonStyles } from '@/constants/styles';
import CustomScrollView from '@/components/CustomScrollView';
import { fontSize, fontWeight } from '@/constants/typography';
import { useLanguage } from '@/hooks/useLanguage';

export default function CalendarScreen() {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const { t } = useLanguage();

  return (
    <CustomScrollView>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>{t('workoutCalendar')}</Text>
        <Text style={commonStyles.subtitle}>{t('trackYourFitnessJourney')}</Text>
      </View> 

      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>{t('thisWeek')}</Text>
        <View style={styles.weekGrid}>
          {daysOfWeek.map((day, index) => (
            <View key={day} style={styles.dayCard}>
              <Text style={styles.dayLabel}>{day}</Text>
              <Text style={styles.dayNumber}>{index + 1}</Text>
              <View style={styles.workoutIndicator} />
            </View>
          ))}
        </View>
      </View>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCard: {
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  dayLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dayNumber: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workoutIndicator: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
});

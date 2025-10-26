import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import { commonStyles } from '@/constants/styles';
import CustomScrollView from '@/components/CustomScrollView';
import { useLanguage } from '@/hooks/useLanguage';
import { fontSize, fontWeight } from '@/constants/typography';
import { Calendar, Play, Flame, Activity, Heart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getRecentWorkouts } from '@/lib/workout';
import WorkoutModal from '@/components/WorkoutModal';

interface RecentWorkout {
  id: string;
  name: string;
  sets: string;
  updated_at: string;
  created_at: string;
}

const iconComponents: any[] = [Flame, Activity, Heart];

export default function HomeScreen() {
  const [recentWorkout, setRecentWorkout] = useState<RecentWorkout[]>([]);
  const [isWorkoutModalVisible, setIsWorkoutModalVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      const response = await getRecentWorkouts();
      setRecentWorkout(response);
    };
    fetchRecentWorkouts();
  }, []);

  // Get workout duration in minutes
  const getWorkoutDuration = (created_at: string, updated_at: string): number => {
    const createdDate = new Date(created_at);
    const updatedDate = new Date(updated_at);
    const diffMs = Math.abs(updatedDate.getTime() - createdDate.getTime());
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // convert ms → minutes
    return diffMinutes;
  };

  // Get today's date in format "Mon, Oct 13"
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateString = today.toLocaleDateString('en-US', options);

  return (
    <CustomScrollView>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.todayText}>{t('welcomeBack')}</Text>
          <Text style={commonStyles.subtitle}>{t('readyForYourNextWorkout')}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
      </View>

      {/* Today's Workout Card */}
      <View style={styles.todayWorkoutCard}>
        <View style={styles.todayWorkoutHeader}>
          <Text style={styles.todayWorkoutTitle}>Today's Workout</Text>
          <Calendar size={24} color={colors.text} strokeWidth={2} />
        </View>
        <Text style={styles.noSessionText}>No session in progress</Text>

        <Pressable style={styles.startButton} onPress={() => setIsWorkoutModalVisible(true)}>
          <Play size={20} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
      </View>

      {/* Workout Modal */}
      <WorkoutModal
        visible={isWorkoutModalVisible}
        onClose={() => setIsWorkoutModalVisible(false)}
      />

      {/* Recent Workouts Section */}
      <Text style={styles.sectionTitle}>Recent Workouts</Text>

      {recentWorkout.map((workout, index) => {
        const IconComponent = iconComponents[index];
        return (
          <Pressable key={workout.id} style={styles.workoutCard}>
            <View style={styles.workoutIconContainer}>
              <IconComponent size={24} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDetails}>
                {`${getWorkoutDuration(workout.created_at, workout.updated_at)}  min`} •{' '}
                {workout.sets}
              </Text>
            </View>
            <View style={styles.workoutDateBadge}>
              <Text style={styles.workoutDateText}>
                {new Date(workout.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  todayText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  dateBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  todayWorkoutCard: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  todayWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  todayWorkoutTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  noSessionText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  startButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  sectionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  workoutIconContainer: {
    marginRight: spacing.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workoutDetails: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  workoutDateBadge: {
    backgroundColor: colors.input,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  workoutDateText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
});

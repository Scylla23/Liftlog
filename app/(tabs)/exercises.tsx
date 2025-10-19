import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import { commonStyles } from '@/constants/styles';
import CustomScrollView from '@/components/CustomScrollView';
import en from '@/i18n/en';
import { fontSize, fontWeight } from '@/constants/typography';

export default function ExercisesScreen() {
  const exerciseCategories = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];
  return (
    <CustomScrollView>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>{en.exerciseLibrary}</Text>
        <Text style={commonStyles.subtitle}>{en.buildYourPerfectWorkout}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={en.searchExercises}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>{en.categories}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryChips}>
            {exerciseCategories.map((category) => (
              <View key={category} style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>{category}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.exercisesList}>
        <Text style={styles.sectionTitle}>{en.popularExercises}</Text>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.benchPress}</Text>
          <Text style={styles.exerciseCategory}>{en.chest}</Text>
        </View>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.squat}</Text>
          <Text style={styles.exerciseCategory}>{en.legs}</Text>
        </View>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.deadlift}</Text>
          <Text style={styles.exerciseCategory}>{en.back}</Text>
        </View>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.overheadPress}</Text>
          <Text style={styles.exerciseCategory}>{en.shoulders}</Text>
        </View>

        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.overheadPress}</Text>
          <Text style={styles.exerciseCategory}>{en.shoulders}</Text>
        </View>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.overheadPress}</Text>
          <Text style={styles.exerciseCategory}>{en.shoulders}</Text>
        </View>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.overheadPress}</Text>
          <Text style={styles.exerciseCategory}>{en.shoulders}</Text>
        </View>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{en.overheadPress}</Text>
          <Text style={styles.exerciseCategory}>{en.shoulders}</Text>
        </View>
      </View>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.input,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  categoriesContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  categoryChips: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xxl,
    marginRight: spacing.sm,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  exercisesList: {
    marginBottom: spacing.xl,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  exerciseCategory: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

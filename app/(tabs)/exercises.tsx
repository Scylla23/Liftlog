import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import { commonStyles } from '@/constants/styles';
import CustomScrollView from '@/components/CustomScrollView';
import { useLanguage } from '@/hooks/useLanguage';
import { fontSize, fontWeight } from '@/constants/typography';
import { useEffect, useState } from 'react';
import { getExercises } from '@/lib/exercises';
import { getUserId } from '@/lib/supabase';
import { Exercise } from '@/types';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseCategories, setExerciseCategories] = useState(['All']);

  // Get all exercises for user
  const getExercisesData = async () => {
    const userId = await getUserId();
    console.log(userId);
    const response = await getExercises(userId || '');
    console.log(response);
    setExercises(response);
    const allCats = response.flatMap((ex) => ex.categories || []);
    const uniqueCategories = ['All', ...new Set(allCats)];
    console.log(uniqueCategories);
    setExerciseCategories(uniqueCategories);
  };

  useEffect(() => {
    getExercisesData();
  }, []);

  const { t } = useLanguage();

  return (
    <CustomScrollView>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>{t('exerciseLibrary')}</Text>
        <Text style={commonStyles.subtitle}>{t('buildYourPerfectWorkout')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchExercises')}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>{t('categories')}</Text>
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
        <Text style={styles.sectionTitle}>{t('popularExercises')}</Text>
        {exercises.map((exercise) => (
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseCategory}>{exercise.categories.join(' • ')}</Text>
          </View>
        ))}
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
  exercisesList: {},
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

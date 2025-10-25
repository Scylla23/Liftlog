import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import { commonStyles } from '@/constants/styles';
import CustomScrollView from '@/components/CustomScrollView';
import AddExerciseModal from '@/components/AddExerciseModal';
import { useLanguage } from '@/hooks/useLanguage';
import { fontSize, fontWeight } from '@/constants/typography';
import { useEffect, useState } from 'react';
import { addExercise, getExercises } from '@/lib/exercises';
import { Exercise } from '@/types';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseCategories, setExerciseCategories] = useState(['All']);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get all exercises for user
  const getExercisesData = async () => {
    const response = await getExercises();
    setExercises(response);
    const allCats = response.flatMap((ex) => ex.categories || []);
    const uniqueCategories = ['All', ...new Set(allCats)];
    setExerciseCategories(uniqueCategories);
  };

  // Useeffect to get the exercise data on page mount
  useEffect(() => {
    getExercisesData();
  }, []);

  const { t } = useLanguage();

  const handleAddExercise = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveExercise = async (data: { name: string; categories: string[] }) => {
    // Save exercise to database
    const resposne = await addExercise(data.name, data.categories);
    setExercises((prev) => [resposne, ...prev]);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
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
            <View key={exercise.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseCategory}>{exercise.categories.join(' • ')}</Text>
            </View>
          ))}
        </View>
      </CustomScrollView>
      <Pressable style={styles.fab} onPress={handleAddExercise}>
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
      <AddExerciseModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveExercise}
        existingCategories={exerciseCategories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '300',
  },
});

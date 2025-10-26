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
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [exerciseCategories, setExerciseCategories] = useState(['All']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get all exercises for user
  const getExercisesData = async () => {
    const response = await getExercises();
    setExercises(response);
    setFilteredExercises(response);
    const allCats = response.flatMap((ex) => ex.categories || []);
    const uniqueCategories = ['All', ...new Set(allCats)];
    setExerciseCategories(uniqueCategories);
  };

  // Filter exercises based on search term and category
  const filterExercises = () => {
    let filtered = exercises;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (exercise) => exercise.categories && exercise.categories.includes(selectedCategory),
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (exercise.categories &&
            exercise.categories.some((cat) =>
              cat.toLowerCase().includes(searchTerm.toLowerCase()),
            )),
      );
    }

    setFilteredExercises(filtered);
  };

  // Useeffect to get the exercise data on page mount
  useEffect(() => {
    getExercisesData();
  }, []);

  // Filter exercises when search term or category changes
  useEffect(() => {
    filterExercises();
  }, [searchTerm, selectedCategory, exercises]);

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

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
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
            value={searchTerm}
            onChangeText={handleSearchChange}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>{t('categories')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryChips}>
              {exerciseCategories.map((category) => (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.selectedCategoryChip,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category && styles.selectedCategoryChipText,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.exercisesList}>
          <Text style={styles.sectionTitle}>{t('popularExercises')}</Text>
          {filteredExercises.map((exercise) => (
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
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  selectedCategoryChipText: {
    color: colors.white,
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

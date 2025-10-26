import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Pressable, FlatList } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';
import { getExercises, addExercise } from '@/lib/exercises';
import { Plus, X } from 'lucide-react-native';
import { Exercise } from '@/types';

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}

export default function ExerciseSelectionModal({
  visible,
  onClose,
  onSelect,
}: ExerciseSelectionModalProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategories, setNewExerciseCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    if (visible) {
      loadExercises();
    }
  }, [visible]);

  const loadExercises = async () => {
    const data = await getExercises();
    setExercises(data);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategories =
      selectedCategories.length === 0 ||
      exercise.categories.some((cat) => selectedCategories.includes(cat));
    return matchesSearch && matchesCategories;
  });

  const allCategories = Array.from(new Set(exercises.flatMap((e) => e.categories)));

  const handleAddCategory = () => {
    const trimmedCategory = categoryInput.trim();
    if (trimmedCategory && !newExerciseCategories.includes(trimmedCategory)) {
      setNewExerciseCategories([...newExerciseCategories, trimmedCategory]);
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setNewExerciseCategories(newExerciseCategories.filter((cat) => cat !== category));
  };

  const handleCategorySelect = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    }
  };

  const handleSaveNewExercise = async () => {
    if (!newExerciseName.trim()) return;

    const newExercise = await addExercise(newExerciseName, newExerciseCategories);
    if (newExercise) {
      onSelect(newExercise);
      setShowAddExercise(false);
      setNewExerciseName('');
      setNewExerciseCategories([]);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setShowAddExercise(false);
    setNewExerciseName('');
    setNewExerciseCategories([]);
    setCategoryInput('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            <Pressable onPress={handleClose}>
              <X size={24} color={colors.text} strokeWidth={2} />
            </Pressable>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Categories Filter */}
          <View style={styles.categoriesContainer}>
            <FlatList
              horizontal
              data={['All', ...allCategories]}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected =
                  item === 'All'
                    ? selectedCategories.length === 0
                    : selectedCategories.includes(item);
                return (
                  <Pressable
                    style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                    onPress={() => {
                      if (item === 'All') {
                        setSelectedCategories([]);
                      } else {
                        handleCategorySelect(item);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>

          {/* Exercise List */}
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            style={styles.exerciseList}
            renderItem={({ item }) => (
              <Pressable style={styles.exerciseItem} onPress={() => onSelect(item)}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <View style={styles.categoriesRow}>
                  {item.categories.map((cat) => (
                    <View key={cat} style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{cat}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No exercises found. Create a new one below.</Text>
            }
          />

          {/* Add Exercise Section */}
          {showAddExercise ? (
            <View style={styles.addExerciseSection}>
              <Text style={styles.sectionTitle}>Add New Exercise</Text>
              <TextInput
                style={styles.input}
                placeholder="Exercise name"
                placeholderTextColor={colors.textMuted}
                value={newExerciseName}
                onChangeText={setNewExerciseName}
              />
              <TextInput
                style={styles.input}
                placeholder="Add category (press enter)"
                placeholderTextColor={colors.textMuted}
                value={categoryInput}
                onChangeText={setCategoryInput}
                onSubmitEditing={handleAddCategory}
                returnKeyType="done"
              />
              <View style={styles.tagsContainer}>
                {newExerciseCategories.map((cat) => (
                  <View key={cat} style={styles.tag}>
                    <Text style={styles.tagText}>{cat}</Text>
                    <Pressable
                      onPress={() => handleRemoveCategory(cat)}
                      style={styles.removeButton}
                    >
                      <X size={14} color={colors.white} strokeWidth={2.5} />
                    </Pressable>
                  </View>
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.cancelButton} onPress={() => setShowAddExercise(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={handleSaveNewExercise}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={() => setShowAddExercise(true)}>
              <Plus size={20} color={colors.primary} strokeWidth={2.5} />
              <Text style={styles.addButtonText}>Add New Exercise</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  searchInput: {
    backgroundColor: colors.input,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  categoryChipTextSelected: {
    color: colors.white,
  },
  exerciseList: {
    maxHeight: 300,
    marginBottom: spacing.md,
  },
  exerciseItem: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: fontSize.xs,
    color: colors.primary,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  addButtonText: {
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  addExerciseSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.input,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xxl,
  },
  tagText: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: fontWeight.medium,
    marginRight: spacing.xs,
  },
  removeButton: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  saveButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: fontSize.base,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
});

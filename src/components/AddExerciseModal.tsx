import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; categories: string[] }) => void;
  existingCategories: string[];
}

export default function AddExerciseModal({
  visible,
  onClose,
  onSave,
  existingCategories,
}: AddExerciseModalProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');

  const handleAddCategory = () => {
    const trimmedCategory = categoryInput.trim();
    if (trimmedCategory && !selectedCategories.includes(trimmedCategory)) {
      setSelectedCategories([...selectedCategories, trimmedCategory]);
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  const handleCategorySelect = (category: string) => {
    if (category !== 'All' && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSave = () => {
    onSave({
      name: exerciseName,
      categories: selectedCategories,
    });
    // Reset form
    setExerciseName('');
    setSelectedCategories([]);
    setCategoryInput('');
  };

  const handleClose = () => {
    setExerciseName('');
    setSelectedCategories([]);
    setCategoryInput('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Exercise</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise name"
              placeholderTextColor={colors.textMuted}
              value={exerciseName}
              onChangeText={setExerciseName}
            />
          </View>

          {/* Categories Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Categories</Text>
            <View style={styles.categoryInputWrapper}>
              <TextInput
                style={styles.categoryInput}
                placeholder="Type and press enter to add"
                placeholderTextColor={colors.textMuted}
                value={categoryInput}
                onChangeText={setCategoryInput}
                onSubmitEditing={handleAddCategory}
                returnKeyType="done"
              />
            </View>

            {/* Selected Category Tags */}
            {selectedCategories.length > 0 && (
              <View style={styles.tagsContainer}>
                {selectedCategories.map((category) => (
                  <View key={category} style={styles.tag}>
                    <Text style={styles.tagText}>{category}</Text>
                    <Pressable
                      onPress={() => handleRemoveCategory(category)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Existing Categories Chips */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Existing Categories</Text>
            <View style={styles.existingCategoriesContainer}>
              {existingCategories
                .filter((cat) => cat !== 'All')
                .map((category) => (
                  <Pressable
                    key={category}
                    style={[
                      styles.existingCategoryChip,
                      selectedCategories.includes(category) && styles.existingCategoryChipSelected,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text
                      style={[
                        styles.existingCategoryChipText,
                        selectedCategories.includes(category) &&
                          styles.existingCategoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
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
  },
  categoryInputWrapper: {
    flexDirection: 'row',
  },
  categoryInput: {
    flex: 1,
    backgroundColor: colors.input,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xxl,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
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
  removeButtonText: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  existingCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  existingCategoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  existingCategoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  existingCategoryChipText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  existingCategoryChipTextSelected: {
    color: colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
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

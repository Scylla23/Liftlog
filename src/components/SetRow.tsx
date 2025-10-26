import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';
import { Check, Trash2 } from 'lucide-react-native';

interface SetRowProps {
  setNumber: number;
  weight: number;
  reps: number;
  isDone: boolean;
  onUpdate: (weight: number, reps: number) => void;
  onDelete: () => void;
  onToggleDone: () => void;
}

export default function SetRow({
  setNumber,
  weight,
  reps,
  isDone,
  onUpdate,
  onDelete,
  onToggleDone,
}: SetRowProps) {
  const [localWeight, setLocalWeight] = useState(weight.toString());
  const [localReps, setLocalReps] = useState(reps.toString());

  const handleWeightChange = (text: string) => {
    setLocalWeight(text);
    const numWeight = parseFloat(text);
    if (!isNaN(numWeight)) {
      onUpdate(numWeight, reps);
    }
  };

  const handleRepsChange = (text: string) => {
    setLocalReps(text);
    const numReps = parseInt(text, 10);
    if (!isNaN(numReps)) {
      onUpdate(weight, numReps);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setInfo}>
        <Pressable
          style={[styles.setButton, isDone && styles.setButtonDone]}
          onPress={onToggleDone}
        >
          <Text style={[styles.setButtonText, isDone && styles.setButtonTextDone]}>
            Set {setNumber}: {weight} kg
          </Text>
        </Pressable>

        <Pressable
          style={[styles.setButton, isDone && styles.setButtonDone]}
          onPress={onToggleDone}
        >
          <Text style={[styles.setButtonText, isDone && styles.setButtonTextDone]}>
            {reps} reps
          </Text>
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isDone && styles.inputDone]}
            value={localWeight}
            onChangeText={handleWeightChange}
            keyboardType="numeric"
            placeholder="Weight"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isDone && styles.inputDone]}
            value={localReps}
            onChangeText={handleRepsChange}
            keyboardType="numeric"
            placeholder="Reps"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>

      {isDone && (
        <View style={styles.doneContainer}>
          <Check size={20} color={colors.success} strokeWidth={3} />
          <Text style={styles.doneText}>Done</Text>
        </View>
      )}

      <Pressable style={styles.deleteButton} onPress={onDelete}>
        <Trash2 size={18} color={colors.error} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  setInfo: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  setButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  setButtonDone: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  setButtonText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  setButtonTextDone: {
    color: colors.success,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.text,
    minWidth: 60,
    textAlign: 'center',
  },
  inputDone: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  inputLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  doneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  doneText: {
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: fontWeight.medium,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});

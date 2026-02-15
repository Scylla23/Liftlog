import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';
import SetRow from './SetRow';
import { WorkoutExercise, WorkoutSet } from '@/types';
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react-native';

interface WorkoutExerciseCardProps {
  workoutExercise: WorkoutExercise;
  onUpdateSet: (setId: string, weight: number, reps: number) => void;
  onDeleteSet: (setId: string) => void;
  onAddSet: () => void;
  onDeleteExercise: () => void;
}

export default function WorkoutExerciseCard({
  workoutExercise,
  onUpdateSet,
  onDeleteSet,
  onAddSet,
  onDeleteExercise,
}: WorkoutExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getSetSummary = () => {
    if (workoutExercise.sets.length === 0) return 'No sets yet';

    const totalSets = workoutExercise.sets.length;
    const avgReps = Math.round(
      workoutExercise.sets.reduce((sum, set) => sum + set.reps, 0) / totalSets,
    );
    const avgWeight = Math.round(
      workoutExercise.sets.reduce((sum, set) => sum + set.weight, 0) / totalSets,
    );

    return `${totalSets} sets • ${avgReps} reps • ${avgWeight} kg`;
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <Pressable style={styles.header} onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.exerciseInfo}>
          {/* Exercise thumbnail placeholder */}
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailText}>
              {workoutExercise.exercise.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.exerciseDetails}>
            <Text style={styles.exerciseName}>{workoutExercise.exercise.name}</Text>
            <Text style={styles.exerciseSummary}>{getSetSummary()}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {isExpanded ? (
            <ChevronUp size={20} color={colors.textSecondary} strokeWidth={2} />
          ) : (
            <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
          )}
        </View>
      </Pressable>

      {/* Sets */}
      {isExpanded && (
        <View style={styles.setsContainer}>
          {workoutExercise.sets.map((set) => (
            <SetRow
              key={set.id}
              setNumber={set.set_number}
              weight={set.weight}
              reps={set.reps}
              isDone={false}
              onUpdate={(weight, reps) => onUpdateSet(set.id, weight, reps)}
              onDelete={() => onDeleteSet(set.id)}
              onToggleDone={() => {
                // Mark as done functionality can be added later
              }}
            />
          ))}

          <Pressable style={styles.addSetButton} onPress={onAddSet}>
            <Plus size={18} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.addSetText}>Add Set</Text>
          </Pressable>

          <Pressable style={styles.deleteExerciseButton} onPress={onDeleteExercise}>
            <Trash2 size={18} color={colors.error} strokeWidth={2} />
            <Text style={styles.deleteExerciseText}>Remove Exercise</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  thumbnailText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exerciseSummary: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  headerActions: {
    padding: spacing.xs,
  },
  setsContainer: {
    padding: spacing.md,
    paddingTop: 0,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.input,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  addSetText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  deleteExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  deleteExerciseText: {
    fontSize: fontSize.sm,
    color: colors.error,
    fontWeight: fontWeight.medium,
  },
});

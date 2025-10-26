import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Modal } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';
import { X, Plus } from 'lucide-react-native';
import {
  createWorkout,
  addWorkoutExercise,
  addSet,
  updateSet,
  deleteSet,
  deleteWorkoutExercise,
  updateWorkoutName,
  finishWorkout,
} from '@/lib/workout';
import { WorkoutExercise, WorkoutSet } from '@/types';
import WorkoutExerciseCard from './WorkoutExerciseCard';
import ExerciseSelectionModal from './ExerciseSelectionModal';
import { Exercise } from '@/types';

interface WorkoutModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function WorkoutModal({ visible, onClose }: WorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState('My Workout');
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      initializeWorkout();
      setElapsedTime(0);

      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visible]);

  const initializeWorkout = async () => {
    const workout = await createWorkout(workoutName);
    if (workout) {
      setWorkoutId(workout.id);
    }
  };

  const handleExerciseSelect = async (exercise: Exercise) => {
    if (!workoutId) return;

    const workoutExercise = await addWorkoutExercise(workoutId, exercise.id);
    if (workoutExercise) {
      setExercises([...exercises, { ...workoutExercise, sets: [], exercise }]);
    }
    setIsExerciseModalVisible(false);
  };

  const handleAddSet = async (workoutExerciseId: string) => {
    const setNumber = exercises.find((e) => e.id === workoutExerciseId)?.sets.length + 1 || 1;
    const newSet = await addSet(workoutExerciseId, 0, 0, setNumber);
    if (newSet) {
      setExercises(
        exercises.map((e) =>
          e.id === workoutExerciseId ? { ...e, sets: [...e.sets, newSet] } : e,
        ),
      );
    }
  };

  const handleUpdateSet = async (setId: string, weight: number, reps: number) => {
    const updatedSet = await updateSet(setId, weight, reps);
    if (updatedSet) {
      setExercises(
        exercises.map((e) => ({
          ...e,
          sets: e.sets.map((s) => (s.id === setId ? updatedSet : s)),
        })),
      );
    }
  };

  const handleDeleteSet = async (setId: string, workoutExerciseId: string) => {
    const success = await deleteSet(setId);
    if (success) {
      const exercise = exercises.find((e) => e.id === workoutExerciseId);
      if (exercise) {
        const filteredSets = exercise.sets.filter((s) => s.id !== setId);
        const reorderedSets = filteredSets.map((set, index) => ({
          ...set,
          set_number: index + 1,
        }));

        setExercises(
          exercises.map((e) => (e.id === workoutExerciseId ? { ...e, sets: reorderedSets } : e)),
        );

        for (const set of reorderedSets) {
          if (set.id !== setId) {
            await updateSet(set.id, set.weight, set.reps);
          }
        }
      }
    }
  };

  const handleDeleteExercise = async (workoutExerciseId: string) => {
    const success = await deleteWorkoutExercise(workoutExerciseId);
    if (success) {
      setExercises(exercises.filter((e) => e.id !== workoutExerciseId));
    }
  };

  const handleWorkoutNameChange = async (text: string) => {
    setWorkoutName(text);
    if (workoutId) {
      await updateWorkoutName(workoutId, text);
    }
  };

  const handleFinish = async () => {
    if (!workoutId) return;
    await finishWorkout(workoutId);
    // Reset state
    setExercises([]);
    setWorkoutName('My Workout');
    setWorkoutId(null);
    setElapsedTime(0);
    onClose();
  };

  const handleClose = async () => {
    if (!workoutId) {
      onClose();
      return;
    }
    await updateWorkoutName(workoutId, workoutName);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={handleClose}>
              <X size={24} color={colors.text} strokeWidth={2} />
            </Pressable>

            <Text style={styles.headerTitle}>Workout</Text>

            <Pressable onPress={handleFinish}>
              <Text style={styles.finishButton}>Finish</Text>
            </Pressable>
          </View>

          {/* Workout Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>📅</Text>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Today</Text>
                <Text style={styles.summaryValue}>
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>⏱️</Text>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{formatTime(elapsedTime)}</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💪</Text>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Exercises</Text>
                <Text style={styles.summaryValue}>{exercises.length}</Text>
              </View>
            </View>
          </View>

          {/* Workout Name Input */}
          <TextInput
            style={styles.workoutNameInput}
            value={workoutName}
            onChangeText={handleWorkoutNameChange}
            placeholder="Workout name"
            placeholderTextColor={colors.textMuted}
          />

          {/* Exercises List */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {exercises.map((exercise) => (
              <WorkoutExerciseCard
                key={exercise.id}
                workoutExercise={exercise}
                onUpdateSet={handleUpdateSet}
                onDeleteSet={(setId) => handleDeleteSet(setId, exercise.id)}
                onAddSet={() => handleAddSet(exercise.id)}
                onDeleteExercise={() => handleDeleteExercise(exercise.id)}
              />
            ))}

            {exercises.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No exercises yet</Text>
                <Text style={styles.emptyStateSubtext}>Add an exercise to get started</Text>
              </View>
            )}
          </ScrollView>

          {/* Add Exercise Button */}
          <Pressable
            style={styles.addExerciseButton}
            onPress={() => setIsExerciseModalVisible(true)}
          >
            <Plus size={20} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
          </Pressable>

          {/* Exercise Selection Modal */}
          <ExerciseSelectionModal
            visible={isExerciseModalVisible}
            onClose={() => setIsExerciseModalVisible(false)}
            onSelect={handleExerciseSelect}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  finishButton: {
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryIcon: {
    fontSize: 24,
  },
  summaryInfo: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  workoutNameInput: {
    backgroundColor: colors.card,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  addExerciseButtonText: {
    fontSize: fontSize.base,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
});

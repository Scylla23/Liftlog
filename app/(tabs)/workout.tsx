import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { fontSize, fontWeight } from '@/constants/typography';
import { ArrowLeft, Check, Plus } from 'lucide-react-native';
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
import { Workout, WorkoutExercise, WorkoutSet } from '@/types';
import WorkoutExerciseCard from '@/components/WorkoutExerciseCard';
import ExerciseSelectionModal from '@/components/ExerciseSelectionModal';
import { Exercise } from '@/types';

export default function WorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState('My Workout');
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeWorkout();

    // Start timer
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
      // Update set numbers for remaining sets
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

        // Update set numbers in database
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
    router.back();
  };

  const handleBack = async () => {
    if (!workoutId) return;
    await updateWorkoutName(workoutId, workoutName);
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <View style={styles.headerButton}>
            <ArrowLeft size={20} color={colors.text} strokeWidth={2.5} />
            <Text style={styles.headerButtonText}>Back</Text>
          </View>
        </Pressable>

        <Text style={styles.headerTitle}>Workout</Text>

        <Pressable onPress={handleFinish}>
          <View style={styles.headerButton}>
            <Check size={20} color={colors.primary} strokeWidth={2.5} />
            <Text style={[styles.headerButtonText, styles.finishButtonText]}>Finish</Text>
          </View>
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
      <Pressable style={styles.addExerciseButton} onPress={() => setIsExerciseModalVisible(true)}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerButtonText: {
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  finishButtonText: {
    color: colors.primary,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
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

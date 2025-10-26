import { supabase, getUserId } from './supabase';
import { Workout, WorkoutExercise, WorkoutSet, ActiveWorkout } from '@/types';

/**
 * Fetches the 3 most recent workouts for the current user,
 * including a total count of all sets performed in each workout.
 *
 * RELIES ON THE 'get_recent_workouts_with_set_count' SQL function (RPC)
 *
 * @returns {Promise<Array>} An array of workout objects.
 * Each object looks like: { workout_id, name, date, total_sets }
 */
export const getRecentWorkouts = async () => {
  // 1. Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error: User must be logged in.');
    return [];
  }
  const userId = user.id;

  // 2. Call the RPC function
  //    (p_user_id is the argument name we defined in the SQL function)
  const { data, error } = await supabase.rpc('get_recent_workouts_with_set_count', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching recent workouts:', error.message);
    // This will likely fail if the SQL function from Step 1 wasn't created.
    return [];
  }

  // 3. Return the clean data
  console.log('Recent Workouts:', data);
  return data;
};

/**
 * Creates a new workout in the database
 * @param name - The name of the workout
 * @returns The created workout object or null on error
 */
export const createWorkout = async (name: string): Promise<Workout | null> => {
  const userId = await getUserId();
  if (!userId) {
    console.error('Error: User must be logged in to create a workout.');
    return null;
  }

  const { data, error } = await supabase
    .from('workouts')
    .insert({ name, created_by: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating workout:', error.message);
    return null;
  }

  return data;
};

/**
 * Adds an exercise to a workout
 * @param workoutId - The workout ID
 * @param exerciseId - The exercise ID
 * @returns The created workout_exercise object or null on error
 */
export const addWorkoutExercise = async (
  workoutId: string,
  exerciseId: string,
): Promise<WorkoutExercise | null> => {
  const userId = await getUserId();
  if (!userId) {
    console.error('Error: User must be logged in.');
    return null;
  }

  const { data, error } = await supabase
    .from('workout_exercises')
    .insert({
      workout_id: workoutId,
      exercise_id: exerciseId,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding workout exercise:', error.message);
    return null;
  }

  return data;
};

/**
 * Adds a set to a workout exercise
 * @param workoutExerciseId - The workout exercise ID
 * @param weight - The weight lifted
 * @param reps - The number of reps
 * @param setNumber - The set number
 * @returns The created set object or null on error
 */
export const addSet = async (
  workoutExerciseId: string,
  weight: number,
  reps: number,
  setNumber: number,
): Promise<WorkoutSet | null> => {
  const userId = await getUserId();
  if (!userId) {
    console.error('Error: User must be logged in.');
    return null;
  }

  const { data, error } = await supabase
    .from('sets')
    .insert({
      workout_exercise_id: workoutExerciseId,
      weight,
      reps,
      set_number: setNumber,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding set:', error.message);
    return null;
  }

  return data;
};

/**
 * Updates an existing set
 * @param setId - The set ID
 * @param weight - The new weight
 * @param reps - The new reps
 * @returns The updated set or null on error
 */
export const updateSet = async (
  setId: string,
  weight: number,
  reps: number,
): Promise<WorkoutSet | null> => {
  const { data, error } = await supabase
    .from('sets')
    .update({ weight, reps })
    .eq('id', setId)
    .select()
    .single();

  if (error) {
    console.error('Error updating set:', error.message);
    return null;
  }

  return data;
};

/**
 * Deletes a set
 * @param setId - The set ID
 * @returns True if successful, false otherwise
 */
export const deleteSet = async (setId: string): Promise<boolean> => {
  const { error } = await supabase.from('sets').delete().eq('id', setId);

  if (error) {
    console.error('Error deleting set:', error.message);
    return false;
  }

  return true;
};

/**
 * Deletes a workout exercise and all its sets
 * @param workoutExerciseId - The workout exercise ID
 * @returns True if successful, false otherwise
 */
export const deleteWorkoutExercise = async (workoutExerciseId: string): Promise<boolean> => {
  // First delete all sets for this exercise
  const { error: setsError } = await supabase
    .from('sets')
    .delete()
    .eq('workout_exercise_id', workoutExerciseId);

  if (setsError) {
    console.error('Error deleting sets:', setsError.message);
    return false;
  }

  // Then delete the workout exercise
  const { error } = await supabase.from('workout_exercises').delete().eq('id', workoutExerciseId);

  if (error) {
    console.error('Error deleting workout exercise:', error.message);
    return false;
  }

  return true;
};

/**
 * Updates workout name
 * @param workoutId - The workout ID
 * @param name - The new workout name
 * @returns True if successful, false otherwise
 */
export const updateWorkoutName = async (workoutId: string, name: string): Promise<boolean> => {
  const { error } = await supabase.from('workouts').update({ name }).eq('id', workoutId);

  if (error) {
    console.error('Error updating workout name:', error.message);
    return false;
  }

  return true;
};

/**
 * Fetches the active workout with all exercises and sets
 * @param workoutId - The workout ID
 * @returns The active workout with populated exercises and sets
 */
export const getActiveWorkout = async (workoutId: string): Promise<ActiveWorkout | null> => {
  // Fetch the workout
  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .single();

  if (workoutError || !workout) {
    console.error('Error fetching workout:', workoutError?.message);
    return null;
  }

  // Fetch workout exercises with exercise details
  const { data: workoutExercises, error: exercisesError } = await supabase
    .from('workout_exercises')
    .select('*, exercise:exercises(*)')
    .eq('workout_id', workoutId);

  if (exercisesError || !workoutExercises) {
    console.error('Error fetching workout exercises:', exercisesError?.message);
    return null;
  }

  // Fetch sets for each workout exercise
  const workoutExercisesWithSets: WorkoutExercise[] = [];
  for (const we of workoutExercises) {
    const { data: sets } = await supabase
      .from('sets')
      .select('*')
      .eq('workout_exercise_id', we.id)
      .order('set_number', { ascending: true });

    workoutExercisesWithSets.push({
      ...we,
      sets: sets || [],
      exercise: we.exercise as any,
    });
  }

  return {
    id: workout.id,
    name: workout.name,
    created_at: workout.created_at,
    updated_at: workout.updated_at,
    exercises: workoutExercisesWithSets,
  };
};

/**
 * Finishes a workout (marks as complete)
 * @param workoutId - The workout ID
 * @returns True if successful, false otherwise
 */
export const finishWorkout = async (workoutId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('workouts')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', workoutId);

  if (error) {
    console.error('Error finishing workout:', error.message);
    return false;
  }

  return true;
};

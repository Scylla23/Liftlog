import { getUserId, supabase } from './supabase';

/**
 * Get all the exercises for user
 * @param userId
 * @returns
 */
export const getExercises = async () => {
  // 1. Get the current user's ID
  const userId = await getUserId();
  if (!userId) {
    return [];
  }
  const { data, error } = await supabase.from('exercises').select('*');
  if (error) {
    console.error('Error fetching exercises:', error.message);
    return [];
  }
  return data;
};

/**
 * Adds a new custom exercise to the database for the current user.
 * @param {string} name - The name of the new exercise (e.g., "Incline Dumbbell Press")
 * @param {string[]} categories - An array of category strings (e.g., ["Chest", "Shoulders"])
 * @returns {Promise<object|null>} The newly created exercise object, or null on error.
 */
export const addExercise = async (name: string, categories: string[]) => {
  // 1. Get the current user's ID
  const userId = await getUserId();
  if (!userId) {
    console.error('Error: User must be logged in to add an exercise.');
    return null;
  }

  // 2. Define the new exercise object
  const newExercise = {
    name: name,
    categories: categories,
    created_by: userId,
  };

  // 3. Insert the new exercise into the 'exercises' table
  //    .select() returns the new row so we can add it to our state
  const { data, error } = await supabase.from('exercises').insert(newExercise).select().single();

  if (error) {
    console.error('Error adding exercise:', error.message);
    return null;
  }

  // 4. Return the new exercise object
  return data;
};

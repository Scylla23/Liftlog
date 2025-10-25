import { supabase } from './supabase';

export const getExercises = async (userId: string) => {
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

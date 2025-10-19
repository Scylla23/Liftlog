export interface Profile {
  name: string;
  email: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  preferredUnits: 'kg' | 'lb';
}

export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  duration: number;
  notes: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  notes?: string;
  isCustom?: boolean;
}

import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export interface AuthError {
  message: string;
  code?: string;
}

export type OAuthProvider = 'google' | 'apple';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

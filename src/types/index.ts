export interface Profile {
  name: string;
  email: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  preferredUnits: 'kg' | 'lb';
}

export interface WorkoutSet {
  id: string;
  set_number: number;
  weight: number;
  reps: number;
  workout_exercise_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ActiveWorkout {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  exercises: WorkoutExercise[];
}

export interface Exercise {
  id: string;
  name: string;
  categories: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

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
  categories: [string];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

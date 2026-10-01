export interface MockUser {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN';
  patientId?: string;
  therapistId?: string;
}

export interface MockPatient {
  _id: string;
  userId: string;
  fullName: string;
  condition: string;
  status: string;
  startDate: string;
  recoveryGoals: string[];
}

export interface MockTherapist {
  _id: string;
  userId: string;
  fullName: string;
  specialization: string;
  licenseNumber: string;
}

export interface MockExercise {
  _id: string;
  name: string;
  category: 'Mobility' | 'Strength' | 'Flexibility' | 'Balance' | 'Recovery';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetArea: string;
  recommendedSets: number;
  recommendedReps: number;
  restDurationSeconds: number;
  instructions: string[];
  safetyNotes: string;
}

export const initialMockUsers: MockUser[] = [];
export const initialMockPatients: MockPatient[] = [];
export const initialMockTherapists: MockTherapist[] = [];
export const initialMockExercises: MockExercise[] = [];
export const initialMockMilestones: any[] = [];

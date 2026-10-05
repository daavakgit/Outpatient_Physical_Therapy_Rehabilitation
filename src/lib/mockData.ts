import { hashPassword } from './auth';

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

const defaultDemoHash = hashPassword('Password123!');

export const initialMockUsers: MockUser[] = [
  {
    _id: 'usr_admin',
    email: 'admin@rehab.com',
    passwordHash: defaultDemoHash,
    name: 'Clinical Admin System',
    role: 'ADMIN',
  },
  {
    _id: 'usr_therapist',
    email: 'dr.sarah@rehab.com',
    passwordHash: defaultDemoHash,
    name: 'Dr. Sarah Jenkins, DPT',
    role: 'THERAPIST',
    therapistId: 'tp_1',
  },
  {
    _id: 'usr_patient',
    email: 'alex.morgan@rehab.com',
    passwordHash: defaultDemoHash,
    name: 'Alex Morgan',
    role: 'PATIENT',
    patientId: 'pat_1',
  },
  {
    _id: 'usr_patient_2',
    email: 'marcus.vance@rehab.com',
    passwordHash: defaultDemoHash,
    name: 'Marcus Vance',
    role: 'PATIENT',
    patientId: 'pat_2',
  },
];

export const initialMockPatients: MockPatient[] = [
  {
    _id: 'pat_1',
    userId: 'usr_patient',
    fullName: 'Alex Morgan',
    condition: 'ACL Reconstruction & Meniscus Repair',
    status: 'ACTIVE',
    startDate: '2026-08-15',
    recoveryGoals: ['Phase I: Initial Assessment & Pain Control', 'Phase II: Dynamic ROM & Loading'],
  },
  {
    _id: 'pat_2',
    userId: 'usr_patient_2',
    fullName: 'Marcus Vance',
    condition: 'Rotator Cuff Repair',
    status: 'ACTIVE',
    startDate: '2026-09-01',
    recoveryGoals: ['Scapular Mobilization', 'Overhead Mobility'],
  },
];

export const initialMockTherapists: MockTherapist[] = [
  {
    _id: 'tp_1',
    userId: 'usr_therapist',
    fullName: 'Dr. Sarah Jenkins, DPT',
    specialization: 'Orthopedic & Sports Physical Therapy',
    licenseNumber: 'PT-884920',
  },
];

export const initialMockExercises: MockExercise[] = [];
export const initialMockMilestones: any[] = [];


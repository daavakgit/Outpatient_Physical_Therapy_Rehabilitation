import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name is required'),
  role: z.enum(['PATIENT', 'THERAPIST', 'ADMIN']),
  phone: z.string().optional(),
  condition: z.string().optional(),
  specialization: z.string().optional(),
});

export const startSessionSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise ID is required'),
  targetSets: z.number().min(1),
  targetRepetitions: z.number().min(1),
});

export const updateSessionSchema = z.object({
  sessionId: z.string().min(1),
  action: z.enum(['PAUSE', 'RESUME', 'END', 'CANCEL']),
  completedSets: z.number().optional(),
  completedRepetitions: z.number().optional(),
  notes: z.string().optional(),
});

export const planSchema = z.object({
  title: z.string().min(3, 'Plan title required'),
  patientId: z.string().min(1),
  expectedDurationWeeks: z.number().min(1),
  currentPhase: z.enum([
    'Phase 1: Pain Management',
    'Phase 2: Mobility Improvement',
    'Phase 3: Strength Development',
    'Phase 4: Functional Recovery',
  ]),
  exercises: z.array(
    z.object({
      exerciseId: z.string(),
      exerciseName: z.string(),
      targetSets: z.number(),
      targetReps: z.number(),
      frequencyPerWeek: z.number(),
      notes: z.string().optional(),
    })
  ),
  therapistNotes: z.string().optional(),
});

export const exerciseSchema = z.object({
  name: z.string().min(2, 'Exercise name required'),
  category: z.enum(['Mobility', 'Strength', 'Flexibility', 'Balance', 'Recovery']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  targetArea: z.string().min(2),
  recommendedSets: z.number().min(1),
  recommendedReps: z.number().min(1),
  restDurationSeconds: z.number().min(5),
  description: z.string().min(5),
  instructions: z.array(z.string()).min(1),
  safetyNotes: z.string().optional(),
});

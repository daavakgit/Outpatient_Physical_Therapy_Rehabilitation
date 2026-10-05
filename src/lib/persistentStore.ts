import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'persistent_store.json');

const defaultExercises = [
  {
    _id: 'ex_1',
    name: 'Knee Extension Isometric Hold',
    category: 'Mobility',
    difficulty: 'Beginner',
    targetArea: 'Knee Quadriceps',
    description: 'Strengthen the quad muscle with controlled isometric contraction.',
    recommendedSets: 3,
    recommendedReps: 10,
    holdDurationSeconds: 5,
    restDurationSeconds: 45,
    instructions: [
      'Sit comfortably with your back upright.',
      'Place a towel roll under the affected knee.',
      'Tighten quad muscles and straighten your knee.',
      'Hold for 5 seconds.',
      'Slowly lower back to starting position.',
    ],
    safetyNotes: 'Stop immediately if sharp knee pain occurs.',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'ex_2',
    name: 'Prone Hamstring Curl',
    category: 'Strength',
    difficulty: 'Intermediate',
    targetArea: 'Hamstrings',
    description: 'Isolate hamstring muscular strength in prone anatomical position.',
    recommendedSets: 3,
    recommendedReps: 12,
    holdDurationSeconds: 2,
    restDurationSeconds: 60,
    instructions: [
      'Lie flat on your abdomen with legs fully extended.',
      'Slowly flex your knee, lifting your heel toward glutes.',
      'Pause at peak flexion for 2 seconds.',
      'Lower foot back to table with controlled cadence.',
    ],
    safetyNotes: 'Avoid hyper-extending lumbar spine during knee flexion.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'ex_3',
    name: 'Terminal Knee Extension (TKE)',
    category: 'Strength',
    difficulty: 'Beginner',
    targetArea: 'Knee VMO',
    description: 'Isolate VMO quad activation using elastic band resistance.',
    recommendedSets: 3,
    recommendedReps: 12,
    holdDurationSeconds: 3,
    restDurationSeconds: 30,
    instructions: [
      'Attach resistance band securely around post.',
      'Loop band around the back of your knee.',
      'Step back to create gentle tension.',
      'Extend your knee straight against resistance.',
      'Hold for 3 seconds then ease forward with control.',
    ],
    safetyNotes: 'Control eccentric return to starting knee flexion.',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'ex_4',
    name: 'Single Leg Stance Balance',
    category: 'Balance',
    difficulty: 'Beginner',
    targetArea: 'Ankle & Proprioception',
    description: 'Proprioceptive neuromuscular re-education for single leg stability.',
    recommendedSets: 3,
    recommendedReps: 1,
    holdDurationSeconds: 30,
    restDurationSeconds: 30,
    instructions: [
      'Stand near wall support with feet hip-width apart.',
      'Lift non-injured foot slightly off the floor.',
      'Maintain balance on target leg for 30 seconds.',
    ],
    safetyNotes: 'Keep fingertips near support bar for safety.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
  },
];

const defaultAssignments = [
  {
    _id: 'assign_1',
    exerciseId: defaultExercises[0],
    patientId: 'pat_1',
    phaseName: 'Phase 2: Mobility & Strength',
    sets: 3,
    repetitions: 10,
    frequencyDaysPerWeek: 5,
    holdDurationSeconds: 5,
    restDurationSeconds: 45,
    startDate: '2026-10-01',
    status: 'ACTIVE',
    therapistNotes: 'Maintain smooth quad contraction during hold.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'assign_2',
    exerciseId: defaultExercises[2],
    patientId: 'pat_1',
    phaseName: 'Phase 2: Mobility & Strength',
    sets: 3,
    repetitions: 12,
    frequencyDaysPerWeek: 4,
    holdDurationSeconds: 3,
    restDurationSeconds: 30,
    startDate: '2026-10-02',
    status: 'ACTIVE',
    therapistNotes: 'Focus on full terminal extension range.',
    createdAt: new Date().toISOString(),
  },
];

const defaultPatients = [
  {
    _id: 'pat_1',
    fullName: 'Alex Morgan',
    email: 'alex.morgan@rehab.com',
    phone: '+1 (555) 019-2834',
    age: 30,
    gender: 'Female',
    condition: 'ACL Reconstruction & Meniscus Repair',
    phase: 'Phase 2: Mobility Improvement',
    adherence: 90,
    recoveryGoal: 75,
    status: 'ON TRACK',
    statusType: 'success',
    mrn: 'MRN-84920',
    notes: 'Post-op week 6. Progressive weight bearing tolerated.',
    lastSession: 'Today, 8:15 AM',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'pat_2',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@rehab.com',
    phone: '+1 (555) 345-6789',
    age: 42,
    gender: 'Male',
    condition: 'Rotator Cuff Repair',
    phase: 'Phase 1: Initial Assessment',
    adherence: 85,
    recoveryGoal: 60,
    status: 'ON TRACK',
    statusType: 'success',
    mrn: 'MRN-91204',
    notes: 'Passive ROM focus for supraspinatus tendon healing.',
    lastSession: 'Yesterday, 3:30 PM',
    createdAt: new Date().toISOString(),
  },
];

const defaultPlans = [
  {
    _id: 'plan_1',
    patientId: 'pat_1',
    patientName: 'Alex Morgan',
    title: 'Post-ACL Reconstruction Mobility & Quad Activation Protocol',
    startDate: '2026-09-15',
    expectedDurationWeeks: 12,
    currentPhase: 'Phase 2: Mobility Improvement',
    overallCompletionPercentage: 68,
    status: 'ACTIVE',
    exercisesCount: 4,
    therapistNotes: 'Aim for 0 to 125 degrees knee flexion with active VMO contraction.',
    createdAt: new Date().toISOString(),
  },
];

const defaultMilestones = [
  {
    _id: 'ms_1',
    patientId: 'pat_1',
    patientName: 'Alex Morgan',
    title: 'Full Active Knee Extension (0°)',
    category: 'Mobility',
    targetDate: '2026-10-15',
    status: 'COMPLETED',
    notes: 'Achieved 0 degrees active extension without lag on goniometer.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'ms_2',
    patientId: 'pat_1',
    patientName: 'Alex Morgan',
    title: 'Knee Flexion to 120°',
    category: 'Mobility',
    targetDate: '2026-10-30',
    status: 'IN_PROGRESS',
    notes: 'Currently measured at 112 degrees with mild end-range tension.',
    createdAt: new Date().toISOString(),
  },
];

const defaultAppointments = [
  {
    _id: 'app_1',
    patientId: 'pat_1',
    patientName: 'Alex Morgan',
    therapistName: 'Dr. Sarah Jenkins, DPT',
    appointmentDate: new Date(Date.now() + 86400000).toISOString(),
    appointmentType: 'In-Clinic Progress Evaluation',
    status: 'SCHEDULED',
    location: 'Main Rehab Clinic, Suite 300',
    notes: 'Evaluate quad peak force and knee ROM progression.',
    createdAt: new Date().toISOString(),
  },
];

const defaultNotifications = [
  {
    _id: 'notif_1',
    userId: 'pat_1',
    role: 'PATIENT',
    title: 'New Exercise Assignment',
    message: 'Dr. Sarah Jenkins assigned Knee Extension Isometric Hold to your rehabilitation plan.',
    isRead: false,
    timestamp: new Date().toISOString(),
  },
];

export interface StoreSchema {
  exercises: any[];
  assignments: any[];
  patients: any[];
  sessions: any[];
  plans: any[];
  milestones: any[];
  appointments: any[];
  notifications: any[];
}

function getInitialStore(): StoreSchema {
  return {
    exercises: defaultExercises,
    assignments: defaultAssignments,
    patients: defaultPatients,
    sessions: [],
    plans: defaultPlans,
    milestones: defaultMilestones,
    appointments: defaultAppointments,
    notifications: defaultNotifications,
  };
}

export function readStore(): StoreSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initial = getInitialStore();
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const data = JSON.parse(raw);
    return {
      exercises: Array.isArray(data.exercises) ? data.exercises : defaultExercises,
      assignments: Array.isArray(data.assignments) ? data.assignments : defaultAssignments,
      patients: Array.isArray(data.patients) ? data.patients : defaultPatients,
      sessions: Array.isArray(data.sessions) ? data.sessions : [],
      plans: Array.isArray(data.plans) ? data.plans : defaultPlans,
      milestones: Array.isArray(data.milestones) ? data.milestones : defaultMilestones,
      appointments: Array.isArray(data.appointments) ? data.appointments : defaultAppointments,
      notifications: Array.isArray(data.notifications) ? data.notifications : defaultNotifications,
    };
  } catch (err) {
    console.error('Error reading persistent store:', err);
    return getInitialStore();
  }
}

export function writeStore(data: StoreSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing persistent store:', err);
  }
}

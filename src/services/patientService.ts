import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Patient } from '@/models/Patient';
import { RehabilitationPlan } from '@/models/RehabilitationPlan';
import { Milestone } from '@/models/Milestone';
import { ProgressLog } from '@/models/ProgressLog';
import { ExerciseSession } from '@/models/ExerciseSession';
import { Appointment } from '@/models/Appointment';
import { Therapist } from '@/models/Therapist';
import { hashPassword } from '@/lib/auth';
import { sendPatientCredentialEmail } from '@/lib/emailService';
import { initialMockPatients, initialMockExercises, initialMockMilestones, initialMockUsers } from '@/lib/mockData';

export async function getPatientDashboardData(patientId: string) {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    const mockPatient = initialMockPatients[0];
    const mockPlan = {
      _id: 'plan_01',
      title: 'ACL Reconstruction Protocol',
      currentPhase: 'Phase 2: Mobility Improvement',
      expectedDurationWeeks: 8,
      overallCompletionPercentage: 62,
      therapistNotes: 'Patient is demonstrating excellent quadriceps activation. Keep maintaining 3 sets daily.',
      exercises: initialMockExercises.map((ex) => ({
        exerciseId: ex._id,
        exerciseName: ex.name,
        targetSets: ex.recommendedSets,
        targetReps: ex.recommendedReps,
        frequencyPerWeek: 5,
        notes: ex.safetyNotes,
      })),
    };

    const recentLogs = [
      { date: '2026-09-24', flexDegrees: 100, painScale: 4, adherenceRate: 80 },
      { date: '2026-09-25', flexDegrees: 102, painScale: 4, adherenceRate: 85 },
      { date: '2026-09-26', flexDegrees: 105, painScale: 3, adherenceRate: 90 },
      { date: '2026-09-27', flexDegrees: 108, painScale: 3, adherenceRate: 90 },
      { date: '2026-09-28', flexDegrees: 110, painScale: 2, adherenceRate: 100 },
      { date: '2026-09-29', flexDegrees: 112, painScale: 2, adherenceRate: 100 },
      { date: '2026-09-30', flexDegrees: 115, painScale: 2, adherenceRate: 100 },
    ];

    const nextAppointment = {
      _id: 'apt_01',
      patientName: mockPatient.fullName,
      therapistName: 'Dr. Sarah Jenkins, DPT',
      appointmentDate: '2026-10-02',
      timeSlot: '10:30 AM',
      type: '1-on-1 Clinical Review',
      status: 'SCHEDULED',
      notes: 'Progress evaluation for Phase 2 mobility milestones.',
    };

    return {
      patient: mockPatient,
      plan: mockPlan,
      milestones: initialMockMilestones,
      currentMilestone: initialMockMilestones[2],
      recentSessions: [],
      nextAppointment,
      recentLogs,
      todayProgress: {
        completedCount: 3,
        totalCount: 5,
        completionPercentage: 60,
      },
    };
  }

  try {
    const patient = await Patient.findById(patientId).populate('primaryTherapistId');
    const plan = await RehabilitationPlan.findOne({ patientId, status: 'ACTIVE' });
    const milestones = await Milestone.find({ patientId }).sort({ order: 1 });
    const recentSessions = await ExerciseSession.find({ patientId }).sort({ createdAt: -1 }).limit(5);
    const nextAppointment = await Appointment.findOne({ patientId, status: 'SCHEDULED' }).sort({ appointmentDate: 1 });
    const recentLogs = await ProgressLog.find({ patientId }).sort({ date: 1 }).limit(7);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = await ExerciseSession.find({
      patientId,
      createdAt: { $gte: today },
      status: 'COMPLETED',
    });

    const totalTodayExercises = plan?.exercises.length || 5;
    const completedTodayCount = todaySessions.length;
    const dailyCompletion = Math.min(100, Math.round((completedTodayCount / totalTodayExercises) * 100));
    const currentMilestone = milestones.find((m) => m.status === 'IN_PROGRESS') || milestones[0];

    return {
      patient: patient ? JSON.parse(JSON.stringify(patient)) : initialMockPatients[0],
      plan: plan ? JSON.parse(JSON.stringify(plan)) : null,
      milestones: JSON.parse(JSON.stringify(milestones)),
      currentMilestone: JSON.parse(JSON.stringify(currentMilestone || null)),
      recentSessions: JSON.parse(JSON.stringify(recentSessions)),
      nextAppointment: JSON.parse(JSON.stringify(nextAppointment || null)),
      recentLogs: JSON.parse(JSON.stringify(recentLogs)),
      todayProgress: {
        completedCount: completedTodayCount,
        totalCount: totalTodayExercises,
        completionPercentage: dailyCompletion,
      },
    };
  } catch (e) {
    console.error('Database query error in patientService, returning mock fallback:', e);
    return {
      patient: initialMockPatients[0],
      plan: null,
      milestones: initialMockMilestones,
      currentMilestone: initialMockMilestones[2],
      recentSessions: [],
      nextAppointment: null,
      recentLogs: [],
      todayProgress: { completedCount: 3, totalCount: 5, completionPercentage: 60 },
    };
  }
}

export async function getAllPatients(search?: string) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    if (search) {
      return initialMockPatients.filter((p) => p.fullName.toLowerCase().includes(search.toLowerCase()));
    }
    return initialMockPatients;
  }

  try {
    const query: any = {};
    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }
    const patients = await Patient.find(query).populate('primaryTherapistId').sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(patients));
  } catch (e) {
    return initialMockPatients;
  }
}

export async function createPatientData(patientData: any) {
  const { isFallback } = await connectToDatabase();
  const mrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;

  const defaultPassword = 'Password123!';
  const cleanEmail = (patientData.email || `${patientData.fullName.toLowerCase().replace(/\s+/g, '.')}@rehabtrack.com`).toLowerCase().trim();

  // Send email credential notification
  await sendPatientCredentialEmail({
    recipientEmail: cleanEmail,
    patientName: patientData.fullName,
    loginEmail: cleanEmail,
    temporaryPassword: defaultPassword,
    condition: patientData.condition,
  });

  const newPatientObj = {
    _id: `patient_${Date.now()}`,
    fullName: patientData.fullName,
    email: cleanEmail,
    phone: patientData.phone || '+1 (555) 019-2834',
    age: Number(patientData.age) || 30,
    gender: patientData.gender || 'Female',
    condition: patientData.condition || 'Post-Op Rehabilitation',
    phase: patientData.phase || 'Phase I: Initial Assessment',
    adherence: Number(patientData.adherence) || 90,
    recoveryGoal: Number(patientData.recoveryGoal) || 75,
    status: patientData.status || 'ON TRACK',
    statusType: patientData.status === 'NEEDS ATTENTION' ? 'error' : patientData.status === 'DELAYED' ? 'warning' : 'success',
    mrn,
    notes: patientData.notes || '',
    lastSession: 'Just registered',
    lastSessionNotes: 'Initial onboarding evaluation scheduled',
    avatar: patientData.gender === 'Male'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
    credentials: {
      email: cleanEmail,
      password: defaultPassword,
    },
    emailSent: true,
  };

  if (isFallback) {
    // Add mock user so patient can log in
    initialMockUsers.push({
      _id: `usr_${Date.now()}`,
      email: cleanEmail,
      passwordHash: hashPassword(defaultPassword),
      name: patientData.fullName,
      role: 'PATIENT',
      patientId: newPatientObj._id,
    } as any);

    initialMockPatients.unshift(newPatientObj as any);
    return newPatientObj;
  }

  try {
    const defaultTherapist = await Therapist.findOne();

    // 1. Check or Create User Account
    let userDoc = await User.findOne({ email: cleanEmail });
    if (!userDoc) {
      userDoc = await User.create({
        email: cleanEmail,
        passwordHash: hashPassword(defaultPassword),
        name: patientData.fullName,
        role: 'PATIENT',
        phone: patientData.phone,
      });
    }

    // 2. Create Patient Record
    const createdPatient = await Patient.create({
      userId: userDoc._id,
      fullName: patientData.fullName,
      gender: patientData.gender,
      dateOfBirth: patientData.age ? `Age: ${patientData.age}` : undefined,
      primaryTherapistId: defaultTherapist?._id,
      condition: patientData.condition,
      medicalHistory: patientData.notes,
      recoveryGoals: [patientData.phase || 'Phase I: Initial Assessment'],
      status: 'ACTIVE',
    });

    // 3. Link PatientId back to User
    userDoc.patientId = createdPatient._id as any;
    await userDoc.save();

    const result = JSON.parse(JSON.stringify(createdPatient));
    result.email = cleanEmail;
    result.credentials = {
      email: cleanEmail,
      password: defaultPassword,
    };
    result.emailSent = true;

    return result;
  } catch (e) {
    console.error('Database patient creation error, fallback to mock:', e);
    initialMockPatients.unshift(newPatientObj as any);
    return newPatientObj;
  }
}

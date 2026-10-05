import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Patient } from '@/models/Patient';
import { RehabilitationPlan } from '@/models/RehabilitationPlan';
import { Milestone } from '@/models/Milestone';
import { ProgressLog } from '@/models/ProgressLog';
import { ExerciseSession } from '@/models/ExerciseSession';
import { Appointment } from '@/models/Appointment';
import { Therapist } from '@/models/Therapist';
import { Exercise } from '@/models/Exercise';
import { hashPassword } from '@/lib/auth';
import { sendPatientCredentialEmail } from '@/lib/emailService';
import { readStore, writeStore } from '@/lib/persistentStore';

export async function getPatientDashboardData(patientIdentifier: string) {
  const store = readStore();
  let dbPatient: any = null;
  let dbPlan: any = null;
  let dbMilestones: any[] = [];
  let dbSessions: any[] = [];
  let dbAppointment: any = null;

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      if (patientIdentifier && patientIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
        dbPatient = await Patient.findById(patientIdentifier).populate('primaryTherapistId').populate('userId');
      }
      if (!dbPatient && patientIdentifier) {
        dbPatient = await Patient.findOne({
          $or: [
            { userId: patientIdentifier },
            { email: patientIdentifier.toLowerCase() },
            { fullName: new RegExp(`^${patientIdentifier}$`, 'i') },
          ],
        }).populate('primaryTherapistId').populate('userId');
      }

      if (dbPatient) {
        const pId = dbPatient._id;
        dbPlan = await RehabilitationPlan.findOne({ patientId: pId, status: 'ACTIVE' });
        dbMilestones = await Milestone.find({ patientId: pId }).sort({ order: 1 });
        dbSessions = await ExerciseSession.find({ patientId: pId }).sort({ createdAt: -1 }).limit(5);
        dbAppointment = await Appointment.findOne({ patientId: pId, status: 'SCHEDULED' }).sort({ appointmentDate: 1 });
      }
    }
  } catch (e) {
    console.error('Database query error in patientService:', e);
  }

  // Find patient in store matching identifier by _id, id, email, or fullName
  const storePatient = store.patients.find(
    (p) =>
      String(p._id) === String(patientIdentifier) ||
      String(p.id) === String(patientIdentifier) ||
      (p.email && p.email.toLowerCase() === patientIdentifier.toLowerCase()) ||
      (p.fullName && p.fullName.toLowerCase() === patientIdentifier.toLowerCase())
  );

  const patientObj = dbPatient ? JSON.parse(JSON.stringify(dbPatient)) : storePatient;

  if (!patientObj) {
    // If no specific patient record exists yet, build a clean personal record matching the identifier
    const isEmail = patientIdentifier.includes('@');
    const defaultName = isEmail ? patientIdentifier.split('@')[0] : patientIdentifier;
    return {
      patient: {
        _id: patientIdentifier,
        fullName: defaultName,
        email: isEmail ? patientIdentifier : `${defaultName.toLowerCase()}@rehab.com`,
        condition: 'General Physical Therapy',
        phase: 'Phase 1: Assessment',
        adherence: 95,
        status: 'ON TRACK',
        mrn: `MRN-${Date.now().toString().slice(-5)}`,
      },
      plan: null,
      milestones: [],
      currentMilestone: null,
      recentSessions: [],
      nextAppointment: null,
      recentLogs: [],
      todayProgress: { completedCount: 0, totalCount: 0, completionPercentage: 0 },
    };
  }

  const pId = String(patientObj._id || patientObj.id || patientIdentifier);

  // Resolve Plan strictly for this patient
  const storePlan = store.plans.find(
    (p) => String(p.patientId) === pId || p.patientName?.toLowerCase() === patientObj.fullName?.toLowerCase()
  );
  const finalPlan = dbPlan ? JSON.parse(JSON.stringify(dbPlan)) : storePlan || null;

  // Resolve Milestones strictly for this patient
  const storeMilestones = store.milestones.filter(
    (m) => String(m.patientId) === pId || m.patientName?.toLowerCase() === patientObj.fullName?.toLowerCase()
  );
  const finalMilestones = dbMilestones.length > 0 ? JSON.parse(JSON.stringify(dbMilestones)) : storeMilestones;

  // Resolve Sessions strictly for this patient
  const storeSessions = store.sessions.filter(
    (s) => String(s.patientId) === pId || String(s.patientId?._id) === pId
  );
  const finalSessions = dbSessions.length > 0 ? JSON.parse(JSON.stringify(dbSessions)) : storeSessions;

  // Resolve Appointment strictly for this patient
  const storeAppointment = store.appointments.find(
    (a) => String(a.patientId) === pId || a.patientName?.toLowerCase() === patientObj.fullName?.toLowerCase()
  );
  const finalAppointment = dbAppointment ? JSON.parse(JSON.stringify(dbAppointment)) : storeAppointment || null;

  if (!patientObj.mrn) {
    patientObj.mrn = `MRN-${(patientObj._id || '84920').toString().slice(-5).toUpperCase()}`;
  }
  if (!patientObj.primaryTherapist) {
    patientObj.primaryTherapist = 'Dr. Sarah Jenkins, DPT';
  }
  if (!patientObj.phase && finalPlan?.currentPhase) {
    patientObj.phase = finalPlan.currentPhase;
  } else if (!patientObj.phase) {
    patientObj.phase = 'Phase 1: Mobility & Assessment';
  }
  if (patientObj.adherence === undefined || patientObj.adherence === null) {
    patientObj.adherence = 90;
  }

  const currentMilestone = finalMilestones.find((m: any) => m.status === 'IN_PROGRESS') || finalMilestones[0] || null;
  const totalTodayExercises = finalPlan?.exercises?.length || 3;
  const completedTodayCount = finalSessions.filter((s: any) => s.status === 'COMPLETED').length;
  const dailyCompletion = Math.min(100, Math.round((completedTodayCount / Math.max(totalTodayExercises, 1)) * 100));

  return {
    patient: patientObj,
    plan: finalPlan,
    milestones: finalMilestones,
    currentMilestone,
    recentSessions: finalSessions,
    nextAppointment: finalAppointment,
    recentLogs: [],
    todayProgress: {
      completedCount: completedTodayCount,
      totalCount: totalTodayExercises,
      completionPercentage: dailyCompletion,
    },
  };
}

export async function getAllPatients(search?: string) {
  const store = readStore();
  let dbPatients: any[] = [];

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const query: any = {};
      if (search) {
        query.fullName = { $regex: search, $options: 'i' };
      }
      const res = await Patient.find(query).populate('primaryTherapistId').sort({ updatedAt: -1 });
      dbPatients = JSON.parse(JSON.stringify(res));
    }
  } catch (e) {
    console.error('getAllPatients error:', e);
  }

  const merged = [...store.patients];
  for (const dbP of dbPatients) {
    if (!merged.some((m) => (m._id || m.id) === (dbP._id || dbP.id))) {
      merged.push(dbP);
    }
  }

  if (search) {
    const q = search.toLowerCase();
    return merged.filter(
      (p) => p.fullName?.toLowerCase().includes(q) || p.mrn?.toLowerCase().includes(q)
    );
  }

  return merged;
}

export async function createPatientData(patientData: any) {
  const mrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;
  const defaultPassword = 'Password123!';
  const cleanEmail = (patientData.email || `${patientData.fullName.toLowerCase().replace(/\s+/g, '.')}@rehabtrack.com`).toLowerCase().trim();

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
    phase: patientData.phase || 'Phase 1: Initial Assessment',
    adherence: Number(patientData.adherence) || 90,
    recoveryGoal: Number(patientData.recoveryGoal) || 75,
    status: patientData.status || 'ON TRACK',
    statusType: patientData.status === 'NEEDS ATTENTION' ? 'error' : patientData.status === 'DELAYED' ? 'warning' : 'success',
    mrn,
    notes: patientData.notes || '',
    lastSession: 'Just registered',
    lastSessionNotes: 'Initial onboarding evaluation scheduled',
    createdAt: new Date().toISOString(),
    credentials: {
      email: cleanEmail,
      password: defaultPassword,
    },
    emailSent: true,
  };

  const store = readStore();
  store.patients.unshift(newPatientObj);
  writeStore(store);

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const defaultTherapist = await Therapist.findOne();
      const defaultExercise = await Exercise.findOne();
      const exId = defaultExercise?._id || new mongoose.Types.ObjectId();
      const tpId = defaultTherapist?._id || new mongoose.Types.ObjectId();

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

      const createdPatient = await Patient.create({
        userId: userDoc._id,
        fullName: patientData.fullName,
        email: cleanEmail,
        phone: patientData.phone || '+1 (555) 019-2834',
        mrn,
        age: Number(patientData.age) || 30,
        gender: patientData.gender || 'Male',
        dateOfBirth: patientData.age ? `Age: ${patientData.age}` : undefined,
        primaryTherapistId: tpId,
        condition: patientData.condition,
        phase: patientData.phase || 'Phase 1: Mobility',
        adherence: Number(patientData.adherence) || 90,
        medicalHistory: patientData.notes,
        recoveryGoals: [patientData.phase || 'Phase 1: Mobility'],
        status: 'ACTIVE',
      });

      userDoc.patientId = createdPatient._id as any;
      await userDoc.save();

      const createdPlan = await RehabilitationPlan.create({
        title: `${patientData.condition || 'Physical Therapy'} Protocol`,
        patientId: createdPatient._id,
        therapistId: tpId,
        startDate: new Date(),
        expectedDurationWeeks: 8,
        currentPhase: 'Phase 2: Mobility Improvement',
        overallCompletionPercentage: 0,
        therapistNotes: patientData.notes || 'Patient onboarded for physical therapy rehabilitation.',
        exercises: [
          {
            exerciseId: exId,
            exerciseName: 'Isometric Quad Set & Knee Extension',
            targetSets: 3,
            targetReps: 10,
            frequencyPerWeek: 5,
            notes: 'Focus on terminal extension hold for 3 seconds.',
          },
        ],
        status: 'ACTIVE',
      });

      await Milestone.create({
        patientId: createdPatient._id,
        planId: createdPlan._id,
        title: 'Phase 1: Acute Recovery & Pain Control',
        description: 'Reduce edema, manage acute pain, and achieve baseline mobility.',
        status: 'IN_PROGRESS',
        progress: 25,
        order: 1,
      });

      const result = JSON.parse(JSON.stringify(createdPatient));
      result.email = cleanEmail;
      result.credentials = {
        email: cleanEmail,
        password: defaultPassword,
      };
      result.emailSent = true;
      return result;
    }
  } catch (e) {
    console.error('Database patient creation error:', e);
  }

  return newPatientObj;
}

export async function updatePatientData(id: string, data: any) {
  const store = readStore();
  const idx = store.patients.findIndex((p) => p._id === id || p.id === id);
  if (idx !== -1) {
    store.patients[idx] = { ...store.patients[idx], ...data };
    writeStore(store);
  }

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      const updated = await Patient.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );
      if (updated) return JSON.parse(JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Error updating patient in Mongo:', e);
  }

  return idx !== -1 ? store.patients[idx] : null;
}

export async function deletePatientData(id: string) {
  const store = readStore();
  const idx = store.patients.findIndex((p) => p._id === id || p.id === id);
  if (idx !== -1) {
    store.patients.splice(idx, 1);
    writeStore(store);
  }

  try {
    const { isFallback } = await connectToDatabase();
    if (!isFallback) {
      await Patient.findByIdAndDelete(id);
    }
  } catch (e) {
    console.error('Error deleting patient in Mongo:', e);
  }

  return true;
}

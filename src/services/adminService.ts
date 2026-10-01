import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Patient } from '@/models/Patient';
import { Therapist } from '@/models/Therapist';
import { RehabilitationPlan } from '@/models/RehabilitationPlan';
import { Exercise } from '@/models/Exercise';
import { ExerciseSession } from '@/models/ExerciseSession';
import { initialMockUsers, initialMockPatients, initialMockTherapists, initialMockExercises } from '@/lib/mockData';

export async function getAdminSystemStats() {
  const { isFallback } = await connectToDatabase();

  if (isFallback) {
    return {
      totalUsers: initialMockUsers.length,
      totalPatients: initialMockPatients.length,
      totalTherapists: initialMockTherapists.length,
      activePlans: 1,
      totalExercises: initialMockExercises.length,
      totalSessions: 18,
      recentUsers: initialMockUsers,
    };
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalTherapists = await Therapist.countDocuments();
    const activePlans = await RehabilitationPlan.countDocuments({ status: 'ACTIVE' });
    const totalExercises = await Exercise.countDocuments();
    const totalSessions = await ExerciseSession.countDocuments();

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);

    return {
      totalUsers,
      totalPatients,
      totalTherapists,
      activePlans,
      totalExercises,
      totalSessions,
      recentUsers: JSON.parse(JSON.stringify(recentUsers)),
    };
  } catch (e) {
    return {
      totalUsers: initialMockUsers.length,
      totalPatients: initialMockPatients.length,
      totalTherapists: initialMockTherapists.length,
      activePlans: 1,
      totalExercises: initialMockExercises.length,
      totalSessions: 18,
      recentUsers: initialMockUsers,
    };
  }
}

export async function getAdminUsers() {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    return initialMockUsers;
  }
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (e) {
    return initialMockUsers;
  }
}

export async function getAdminTherapists() {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    return initialMockTherapists;
  }
  try {
    const therapists = await Therapist.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(therapists));
  } catch (e) {
    return initialMockTherapists;
  }
}

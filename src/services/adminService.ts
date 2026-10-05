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

export async function createAdminUser(data: any) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    const newUser = {
      _id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      passwordHash: 'Password123!',
      role: data.role || 'PATIENT',
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    initialMockUsers.unshift(newUser as any);
    return newUser;
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash: data.password ? require('@/lib/auth').hashPassword(data.password) : require('@/lib/auth').hashPassword('Password123!'),
    role: data.role || 'PATIENT',
  });
  return JSON.parse(JSON.stringify(user));
}

export async function updateAdminUser(id: string, data: any) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    const index = initialMockUsers.findIndex((u) => u._id === id);
    if (index !== -1) {
      initialMockUsers[index] = { ...initialMockUsers[index], ...data, updatedAt: new Date().toISOString() };
      return initialMockUsers[index];
    }
    return null;
  }

  const updated = await User.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
  return updated ? JSON.parse(JSON.stringify(updated)) : null;
}

export async function deleteAdminUser(id: string) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    const idx = initialMockUsers.findIndex((u) => u._id === id);
    if (idx !== -1) {
      initialMockUsers.splice(idx, 1);
    }
    return true;
  }

  await User.findByIdAndDelete(id);
  return true;
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

export async function createAdminTherapist(data: any) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    const newTp = {
      _id: `tp_${Date.now()}`,
      userId: `usr_${Date.now()}`,
      fullName: data.fullName || data.name,
      email: data.email,
      department: data.department || 'Physical Therapy',
      specialization: data.specialization || 'Orthopedics',
      licenseNumber: data.licenseNumber || `PT-${Math.floor(10000 + Math.random() * 90000)}`,
      phone: data.phone || '+1 (555) 345-6789',
      activePatientsCount: Number(data.activePatientsCount) || 0,
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    initialMockTherapists.unshift(newTp as any);
    return newTp;
  }

  const created = await Therapist.create({
    fullName: data.fullName || data.name,
    specialization: data.specialization || 'Orthopedics',
    licenseNumber: data.licenseNumber || `PT-${Math.floor(10000 + Math.random() * 90000)}`,
  });
  return JSON.parse(JSON.stringify(created));
}

export async function updateAdminTherapist(id: string, data: any) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    const index = initialMockTherapists.findIndex((t) => t._id === id);
    if (index !== -1) {
      initialMockTherapists[index] = { ...initialMockTherapists[index], ...data };
      return initialMockTherapists[index];
    }
    return null;
  }

  const updated = await Therapist.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
  return updated ? JSON.parse(JSON.stringify(updated)) : null;
}

export async function deleteAdminTherapist(id: string) {
  const { isFallback } = await connectToDatabase();
  if (isFallback) {
    const idx = initialMockTherapists.findIndex((t) => t._id === id);
    if (idx !== -1) {
      initialMockTherapists.splice(idx, 1);
    }
    return true;
  }

  await Therapist.findByIdAndDelete(id);
  return true;
}


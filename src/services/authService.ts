import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Patient } from '@/models/Patient';
import { Therapist } from '@/models/Therapist';
import { comparePassword, hashPassword, signToken, UserSession } from '@/lib/auth';
import { seedDatabaseIfEmpty } from '@/lib/seed';
import { initialMockUsers } from '@/lib/mockData';

// Shared state for in-memory mock fallback when MongoDB is offline
const mockUsersList = [...initialMockUsers];

export async function loginUser(email: string, password: string): Promise<{ token: string; user: UserSession } | null> {
  const { isFallback } = await connectToDatabase();

  const formattedEmail = email.toLowerCase().trim();

  if (isFallback) {
    const mockUser = mockUsersList.find((u) => u.email.toLowerCase() === formattedEmail);
    if (!mockUser) return null;

    const isMatch = comparePassword(password, mockUser.passwordHash);
    if (!isMatch) return null;

    const session: UserSession = {
      id: mockUser._id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      patientId: mockUser.patientId,
      therapistId: mockUser.therapistId,
    };

    const token = signToken(session);
    return { token, user: session };
  }

  try {
    await seedDatabaseIfEmpty();
    const userDoc = await User.findOne({ email: formattedEmail });
    if (!userDoc) return null;

    const isMatch = comparePassword(password, userDoc.passwordHash);
    if (!isMatch) return null;

    const session: UserSession = {
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
      role: userDoc.role,
      patientId: userDoc.patientId?.toString(),
      therapistId: userDoc.therapistId?.toString(),
    };

    const token = signToken(session);
    return { token, user: session };
  } catch (err) {
    console.error('Login database error, trying fallback user match:', err);
    const mockUser = mockUsersList.find((u) => u.email.toLowerCase() === formattedEmail);
    if (!mockUser) return null;

    const isMatch = comparePassword(password, mockUser.passwordHash);
    if (!isMatch) return null;

    const session: UserSession = {
      id: mockUser._id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      patientId: mockUser.patientId,
      therapistId: mockUser.therapistId,
    };

    const token = signToken(session);
    return { token, user: session };
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN';
  phone?: string;
  condition?: string;
  specialization?: string;
}): Promise<{ token: string; user: UserSession }> {
  const { isFallback } = await connectToDatabase();
  const formattedEmail = data.email.toLowerCase().trim();

  if (isFallback) {
    const existing = mockUsersList.find((u) => u.email.toLowerCase() === formattedEmail);
    if (existing) throw new Error('User with this email already exists.');

    const newId = `usr_${Date.now()}`;
    const passwordHash = hashPassword(data.password);
    const mockUser = {
      _id: newId,
      email: formattedEmail,
      passwordHash,
      name: data.name,
      role: data.role,
      patientId: data.role === 'PATIENT' ? `pat_${Date.now()}` : undefined,
      therapistId: data.role === 'THERAPIST' ? `tp_${Date.now()}` : undefined,
    };
    mockUsersList.push(mockUser);

    const session: UserSession = {
      id: mockUser._id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      patientId: mockUser.patientId,
      therapistId: mockUser.therapistId,
    };

    const token = signToken(session);
    return { token, user: session };
  }

  await seedDatabaseIfEmpty();

  const existing = await User.findOne({ email: formattedEmail });
  if (existing) {
    throw new Error('User with this email already exists.');
  }

  const passwordHash = hashPassword(data.password);
  const newUser = new User({
    email: formattedEmail,
    passwordHash,
    name: data.name,
    role: data.role,
    phone: data.phone,
  });

  await newUser.save();

  if (data.role === 'PATIENT') {
    const defaultTherapist = await Therapist.findOne();
    const patientDoc = await Patient.create({
      userId: newUser._id,
      fullName: data.name,
      primaryTherapistId: defaultTherapist?._id,
      condition: data.condition || 'General Post-Op Physical Therapy',
      startDate: new Date(),
      status: 'ACTIVE',
    });
    newUser.patientId = patientDoc._id as any;
    await newUser.save();
  } else if (data.role === 'THERAPIST') {
    const therapistDoc = await Therapist.create({
      userId: newUser._id,
      fullName: data.name,
      specialization: data.specialization || 'Orthopedic Rehabilitation',
      licenseNumber: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    newUser.therapistId = therapistDoc._id as any;
    await newUser.save();
  }

  const session: UserSession = {
    id: newUser._id.toString(),
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    patientId: newUser.patientId?.toString(),
    therapistId: newUser.therapistId?.toString(),
  };

  const token = signToken(session);
  return { token, user: session };
}

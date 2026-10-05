import mongoose from 'mongoose';
import { connectToDatabase } from './db';
import { User } from '@/models/User';
import { Patient } from '@/models/Patient';
import { Therapist } from '@/models/Therapist';
import { RehabilitationPlan } from '@/models/RehabilitationPlan';
import { Milestone } from '@/models/Milestone';
import { Exercise } from '@/models/Exercise';
import { hashPassword } from './auth';

export async function seedDatabaseIfEmpty() {
  const { isFallback } = await connectToDatabase();
  if (isFallback) return;

  try {
    const defaultPassword = 'Password123!';

    // 1. Seed Admin Account
    let adminUser = await User.findOne({ email: 'admin@rehab.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Administrator',
        email: 'admin@rehab.com',
        passwordHash: hashPassword(defaultPassword),
        role: 'ADMIN',
        phone: '+1 (555) 000-1122',
      });
      console.log('Default Admin account created: admin@rehab.com / Password123!');
    } else {
      adminUser.passwordHash = hashPassword(defaultPassword);
      await adminUser.save();
    }

    // 2. Seed Therapist Account
    let therapistUser = await User.findOne({ email: 'dr.sarah@rehab.com' });
    let therapistDoc = await Therapist.findOne({ fullName: /Sarah/i });

    if (!therapistDoc) {
      therapistDoc = await Therapist.create({
        fullName: 'Dr. Sarah Jenkins, DPT',
        specialization: 'Orthopedic & Sports Physical Therapy',
        licenseNumber: 'PT-884920',
      });
    }

    if (!therapistUser) {
      therapistUser = await User.create({
        name: 'Dr. Sarah Jenkins, DPT',
        email: 'dr.sarah@rehab.com',
        passwordHash: hashPassword(defaultPassword),
        role: 'THERAPIST',
        phone: '+1 (555) 234-5678',
        therapistId: therapistDoc._id,
      });
      therapistDoc.userId = therapistUser._id;
      await therapistDoc.save();
      console.log('Default Therapist account created: dr.sarah@rehab.com / Password123!');
    } else {
      therapistUser.passwordHash = hashPassword(defaultPassword);
      if (!therapistUser.therapistId) {
        therapistUser.therapistId = therapistDoc._id;
      }
      await therapistUser.save();
    }

    // 3. Seed Patient Account
    let patientUser = await User.findOne({ email: 'alex.morgan@rehab.com' });
    let patientDoc = await Patient.findOne({ fullName: /Alex Morgan/i });

    if (!patientDoc) {
      patientDoc = await Patient.create({
        fullName: 'Alex Morgan',
        gender: 'Female',
        primaryTherapistId: therapistDoc._id,
        condition: 'ACL Reconstruction & Meniscus Repair',
        status: 'ACTIVE',
        recoveryGoals: ['Phase I: Initial Assessment & Mobility', 'Phase II: Dynamic ROM'],
      });
    }

    if (!patientUser) {
      patientUser = await User.create({
        name: 'Alex Morgan',
        email: 'alex.morgan@rehab.com',
        passwordHash: hashPassword(defaultPassword),
        role: 'PATIENT',
        phone: '+1 (555) 019-2834',
        patientId: patientDoc._id,
      });
      patientDoc.userId = patientUser._id;
      await patientDoc.save();
      console.log('Default Patient account created: alex.morgan@rehab.com / Password123!');
    } else {
      patientUser.passwordHash = hashPassword(defaultPassword);
      if (!patientUser.patientId) {
        patientUser.patientId = patientDoc._id;
      }
      await patientUser.save();
    }

    // Ensure default exercise exists
    let defaultExercise = await Exercise.findOne();
    if (!defaultExercise) {
      defaultExercise = await Exercise.create({
        name: 'Isometric Quad Set & Hold',
        category: 'Mobility',
        difficulty: 'Beginner',
        targetArea: 'Knee',
        recommendedSets: 3,
        recommendedReps: 10,
        restDurationSeconds: 45,
        description: 'Tighten thigh muscles while holding knee straight.',
        instructions: ['Sit with leg extended', 'Contract quad muscle for 5 seconds', 'Release and repeat'],
        safetyNotes: 'Stop if sharp knee pain occurs.',
      });
    }

    // 4. Ensure Rehabilitation Plan and Milestones for Alex Morgan exist
    if (patientDoc) {
      let plan = await RehabilitationPlan.findOne({ patientId: patientDoc._id, status: 'ACTIVE' });
      if (!plan) {
        plan = await RehabilitationPlan.create({
          title: 'ACL Recovery & Knee Stability Protocol',
          patientId: patientDoc._id,
          therapistId: therapistDoc._id,
          startDate: new Date(),
          expectedDurationWeeks: 12,
          currentPhase: 'Phase 2: Mobility Improvement',
          overallCompletionPercentage: 45,
          therapistNotes: 'Patient demonstrates good progress in knee extension ROM.',
          exercises: [
            {
              exerciseId: defaultExercise._id,
              exerciseName: 'Isometric Quad Set & Hold',
              targetSets: 3,
              targetReps: 10,
              frequencyPerWeek: 5,
              notes: 'Hold quad contraction for 5 seconds.',
            },
            {
              exerciseId: defaultExercise._id,
              exerciseName: 'Passive Knee Extension Stretch',
              targetSets: 3,
              targetReps: 12,
              frequencyPerWeek: 5,
              notes: 'Maintain comfortable range of motion without pain.',
            },
          ],
          status: 'ACTIVE',
        });
      }


      const existingMilestone = await Milestone.findOne({ patientId: patientDoc._id });
      if (!existingMilestone) {
        await Milestone.create([
          {
            patientId: patientDoc._id,
            planId: plan._id,
            title: 'Phase 1: Full Terminal Knee Extension',
            description: 'Achieve 0 degrees extension and manage postoperative swelling.',
            status: 'COMPLETED',
            progress: 100,
            order: 1,
          },
          {
            patientId: patientDoc._id,
            planId: plan._id,
            title: 'Phase 2: Active Flexion to 120° & Single Leg Stance',
            description: 'Progressive range of motion and weight-bearing stability exercises.',
            status: 'IN_PROGRESS',
            progress: 60,
            order: 2,
          },
          {
            patientId: patientDoc._id,
            planId: plan._id,
            title: 'Phase 3: Dynamic Plyometrics & Sport Return',
            description: 'Agility drills, quad strength ratio testing, and return-to-sport protocols.',
            status: 'PENDING',
            progress: 0,
            order: 3,
          },
        ]);
      }
    }
  } catch (err) {
    console.error('Error seeding default users:', err);
  }
}


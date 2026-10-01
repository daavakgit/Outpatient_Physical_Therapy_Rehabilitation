import { connectToDatabase } from '@/lib/db';
import { Therapist } from '@/models/Therapist';
import { Patient } from '@/models/Patient';
import { RehabilitationPlan } from '@/models/RehabilitationPlan';
import { Appointment } from '@/models/Appointment';
import { ExerciseSession } from '@/models/ExerciseSession';
import { initialMockTherapists, initialMockPatients } from '@/lib/mockData';

export async function getTherapistDashboardData(therapistId?: string) {
  const { isFallback } = await connectToDatabase();

  const emptyKpis = {
    totalPatients: 0,
    activePatients: 0,
    maintPatients: 0,
    activePlansCount: 0,
    complianceRate: 0,
    todaySched: 0,
    todayCompleted: 0,
    todayRemaining: 0,
    workoutsDone: 0,
    remoteWorkouts: 0,
    inClinicWorkouts: 0,
    clinicAdherence: 0,
    triageCasesCount: 0,
  };

  if (isFallback) {
    return {
      therapist: null,
      patients: [],
      todayAppointments: [],
      recentSessions: [],
      activePlansCount: 0,
      totalSessionsCompleted: 0,
      kpis: emptyKpis,
      triagePatients: [],
    };
  }

  try {
    let filter: any = {};
    if (therapistId && therapistId.match(/^[0-9a-fA-F]{24}$/)) {
      filter.primaryTherapistId = therapistId;
    }

    const therapist = therapistId && therapistId.match(/^[0-9a-fA-F]{24}$/)
      ? await Therapist.findById(therapistId)
      : await Therapist.findOne();

    const patients = await Patient.find(filter).sort({ updatedAt: -1 });
    const plans = await RehabilitationPlan.find(filter.primaryTherapistId ? { therapistId: filter.primaryTherapistId } : {});
    const allSessions = await ExerciseSession.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsFilter: any = {
      appointmentDate: { $gte: today, $lt: tomorrow },
    };
    if (filter.primaryTherapistId) appointmentsFilter.therapistId = filter.primaryTherapistId;

    const todayAppointments = await Appointment.find(appointmentsFilter).sort({ appointmentDate: 1 });

    const totalPatients = patients.length;
    const activePatients = patients.filter((p) => p.status === 'ACTIVE').length;
    const maintPatients = patients.filter((p) => p.status === 'COMPLETED' || p.status === 'ON_HOLD').length;

    const activePlans = plans.filter((p) => p.status === 'ACTIVE');
    const activePlansCount = activePlans.length;
    const totalCompletion = plans.reduce((acc, p) => acc + (p.overallCompletionPercentage || 0), 0);
    const complianceRate = plans.length > 0 ? Math.round(totalCompletion / plans.length) : 0;

    const todaySched = todayAppointments.length;
    const todayCompleted = todayAppointments.filter((a) => a.status === 'COMPLETED').length;
    const todayRemaining = todayAppointments.filter((a) => a.status === 'SCHEDULED').length;

    const workoutsDone = allSessions.filter((s) => s.status === 'COMPLETED').length;
    const remoteWorkouts = allSessions.filter((s) => s.notes?.toLowerCase().includes('remote')).length;
    const inClinicWorkouts = Math.max(0, workoutsDone - remoteWorkouts);

    const clinicAdherence = totalPatients > 0 ? Math.round((activePatients / totalPatients) * 1000) / 10 : 0;

    // Triage patients calculation
    const triagePatients: any[] = [];
    for (const p of patients) {
      const pSessions = allSessions.filter((s) => s.patientId?.toString() === p._id.toString());
      const incomplete = pSessions.filter(
        (s) => s.status === 'PARTIALLY_COMPLETED' || (s.targetRepetitions && s.completedRepetitions / s.targetRepetitions < 0.6)
      );
      if (incomplete.length > 0) {
        triagePatients.push({
          id: p._id.toString(),
          name: p.fullName,
          condition: p.condition || 'General Rehab',
          alertType: 'Low Activity',
          adherence: Math.max(30, Math.round(100 - (incomplete.length / Math.max(pSessions.length, 1)) * 50)),
          lastSession: 'Recent session logged',
          notes: 'Missed repetitions or incomplete sessions flagged by system.',
        });
      }
    }

    return {
      therapist: therapist ? JSON.parse(JSON.stringify(therapist)) : null,
      patients: JSON.parse(JSON.stringify(patients)),
      todayAppointments: JSON.parse(JSON.stringify(todayAppointments)),
      activePlansCount,
      totalSessionsCompleted: workoutsDone,
      kpis: {
        totalPatients,
        activePatients,
        maintPatients,
        activePlansCount,
        complianceRate,
        todaySched,
        todayCompleted,
        todayRemaining,
        workoutsDone,
        remoteWorkouts,
        inClinicWorkouts,
        clinicAdherence,
        triageCasesCount: triagePatients.length,
      },
      triagePatients,
    };
  } catch (e) {
    return {
      therapist: null,
      patients: [],
      todayAppointments: [],
      activePlansCount: 0,
      totalSessionsCompleted: 0,
      kpis: emptyKpis,
      triagePatients: [],
    };
  }
}

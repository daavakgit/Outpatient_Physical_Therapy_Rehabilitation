import { NextResponse } from 'next/server';
import { getTherapistDashboardData } from '@/services/therapistService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get('therapistId') || undefined;
    const data = await getTherapistDashboardData(therapistId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch therapist dashboard data' }, { status: 500 });
  }
}

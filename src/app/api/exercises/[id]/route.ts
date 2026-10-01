import { NextResponse } from 'next/server';
import { getExerciseById } from '@/services/exerciseService';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const exercise = await getExerciseById(id);
    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }
    return NextResponse.json({ exercise });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getExercises, createExercise } from '@/services/exerciseService';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const exercises = await getExercises({ category, search });
    return NextResponse.json({ exercises });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session && session.role === 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Exercise name is required' }, { status: 400 });
    }

    const exercise = await createExercise(body);
    return NextResponse.json({ exercise }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Milestone } from '@/models/Milestone';
import { connectToDatabase } from '@/lib/db';
import { readStore, writeStore } from '@/lib/persistentStore';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') || (session?.role === 'PATIENT' ? session.patientId : undefined);

    const store = readStore();
    let dbMilestones: any[] = [];

    try {
      const { isFallback } = await connectToDatabase();
      if (!isFallback) {
        const query = patientId ? { patientId } : {};
        const res = await Milestone.find(query).sort({ updatedAt: -1 });
        dbMilestones = JSON.parse(JSON.stringify(res));
      }
    } catch (err) {
      console.error('Milestone GET error:', err);
    }

    // Merge store & db milestones
    const merged = [...store.milestones];
    for (const dbM of dbMilestones) {
      if (!merged.some((m) => (m._id || m.id) === (dbM._id || dbM.id))) {
        merged.push(dbM);
      }
    }

    const filtered = patientId
      ? merged.filter(
          (m) =>
            m.patientId === patientId ||
            (m.patientId && m.patientId._id === patientId) ||
            m.patientName?.toLowerCase() === 'alex morgan' // Default fallback for demonstration patient
        )
      : merged;

    return NextResponse.json({ milestones: filtered.length > 0 ? filtered : store.milestones });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (session && session.role === 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const store = readStore();

    const milestoneId = body._id || body.id || `ms_${Date.now()}`;
    const newMsObj = {
      _id: milestoneId,
      id: milestoneId,
      patientId: body.patientId || 'pat_1',
      patientName: body.patientName || 'Alex Morgan',
      title: body.title || 'Rehabilitation Milestone',
      category: body.category || 'Mobility',
      targetDate: body.targetDate || new Date().toISOString().split('T')[0],
      status: body.status || 'IN_PROGRESS',
      notes: body.notes || '',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const idx = store.milestones.findIndex((m) => (m._id || m.id) === milestoneId);
    if (idx >= 0) {
      store.milestones[idx] = { ...store.milestones[idx], ...newMsObj };
    } else {
      store.milestones.unshift(newMsObj);
    }
    writeStore(store);

    try {
      const { isFallback } = await connectToDatabase();
      if (!isFallback) {
        if (body._id && body._id.length === 24) {
          await Milestone.findByIdAndUpdate(body._id, body, { new: true });
        } else {
          await Milestone.create(body);
        }
      }
    } catch (err) {
      console.error('Milestone POST DB error:', err);
    }

    return NextResponse.json({ success: true, milestone: newMsObj });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

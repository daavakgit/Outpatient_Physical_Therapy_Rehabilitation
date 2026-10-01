import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminTherapists } from '@/services/adminService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin Access Required' }, { status: 403 });
    }

    const therapists = await getAdminTherapists();
    return NextResponse.json({ therapists });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

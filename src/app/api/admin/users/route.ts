import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminUsers } from '@/services/adminService';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin Access Required' }, { status: 403 });
    }

    const users = await getAdminUsers();
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

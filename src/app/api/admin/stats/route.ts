import { NextResponse } from 'next/server';
import { getAdminSystemStats } from '@/services/adminService';

export async function GET() {
  try {
    const stats = await getAdminSystemStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

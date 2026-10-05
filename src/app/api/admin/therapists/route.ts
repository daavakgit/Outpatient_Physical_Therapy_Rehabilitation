import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminTherapists, createAdminTherapist, updateAdminTherapist, deleteAdminTherapist } from '@/services/adminService';

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

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin Access Required' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.fullName && !body.name) {
      return NextResponse.json({ error: 'Therapist name is required.' }, { status: 400 });
    }

    const newTherapist = await createAdminTherapist(body);
    return NextResponse.json({ success: true, therapist: newTherapist }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin Access Required' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: 'Therapist ID is required for editing.' }, { status: 400 });
    }

    const updatedTherapist = await updateAdminTherapist(id, updateData);
    return NextResponse.json({ success: true, therapist: updatedTherapist });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin Access Required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Therapist ID is required for deletion.' }, { status: 400 });
    }

    await deleteAdminTherapist(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


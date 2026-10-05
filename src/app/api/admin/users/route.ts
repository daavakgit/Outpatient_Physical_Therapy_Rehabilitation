import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/services/adminService';

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

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin Access Required' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const newUser = await createAdminUser(body);
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
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
      return NextResponse.json({ error: 'User ID is required for editing.' }, { status: 400 });
    }

    const updatedUser = await updateAdminUser(id, updateData);
    return NextResponse.json({ success: true, user: updatedUser });
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
      return NextResponse.json({ error: 'User ID is required for deletion.' }, { status: 400 });
    }

    await deleteAdminUser(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'THERAPIST' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: 'Invalid file type. Supported formats: JPG, JPEG, PNG, WEBP' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `ex_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/${fileName}`;
        return NextResponse.json({ success: true, url: fileUrl });
      } catch (fsErr) {
        // Fallback to Data URI if filesystem write fails
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;
        return NextResponse.json({ success: true, url: dataUri });
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      const { imageBase64, mimeType = 'image/jpeg' } = body;
      if (!imageBase64) {
        return NextResponse.json({ error: 'imageBase64 required' }, { status: 400 });
      }
      const dataUri = imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${imageBase64}`;
      return NextResponse.json({ success: true, url: dataUri });
    }

    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Notification } from '@/models/Notification';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ notifications: [], unreadCount: 0 });

    const { isFallback } = await connectToDatabase();
    if (isFallback) {
      return NextResponse.json({
        notifications: [
          {
            _id: 'notif_01',
            title: 'Welcome to RehabPulse',
            message: 'Your Phase 2 rehabilitation plan is ready. Review prescribed daily exercises.',
            type: 'INFO',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'notif_02',
            title: 'Upcoming Assessment',
            message: 'Physical therapy review scheduled with Dr. Sarah Jenkins on Friday at 10:30 AM.',
            type: 'REMINDER',
            isRead: true,
            createdAt: new Date().toISOString(),
          },
        ],
        unreadCount: 1,
      });
    }

    const notifications = await Notification.find({ userId: session.id }).sort({ createdAt: -1 }).limit(20);
    const unreadCount = await Notification.countDocuments({ userId: session.id, isRead: false });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err: any) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { isFallback } = await connectToDatabase();
    if (isFallback) {
      return NextResponse.json({ success: true });
    }

    const { notificationId, markAll } = await req.json();

    if (markAll) {
      await Notification.updateMany({ userId: session.id }, { isRead: true });
    } else if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: true });
  }
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Notification } from '@/models/Notification';
import { connectToDatabase } from '@/lib/db';
import { readStore, writeStore } from '@/lib/persistentStore';

export async function GET() {
  try {
    const session = await getSession();
    const store = readStore();
    let dbNotifs: any[] = [];

    try {
      const { isFallback } = await connectToDatabase();
      if (!isFallback && session?.id) {
        const notifs = await Notification.find({ userId: session.id }).sort({ createdAt: -1 }).limit(20);
        dbNotifs = JSON.parse(JSON.stringify(notifs));
      }
    } catch (err) {
      console.error('Notifications GET error:', err);
    }

    const merged = [...store.notifications];
    for (const dbN of dbNotifs) {
      if (!merged.some((m) => (m._id || m.id) === (dbN._id || dbN.id))) {
        merged.push(dbN);
      }
    }

    const unreadCount = merged.filter((n) => !n.isRead).length;
    return NextResponse.json({ notifications: merged, unreadCount });
  } catch (err: any) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    const store = readStore();
    const { notificationId, markAll } = await req.json();

    if (markAll) {
      store.notifications = store.notifications.map((n) => ({ ...n, isRead: true }));
    } else if (notificationId) {
      const target = store.notifications.find((n) => (n._id || n.id) === notificationId);
      if (target) target.isRead = true;
    }
    writeStore(store);

    try {
      const { isFallback } = await connectToDatabase();
      if (!isFallback && session?.id) {
        if (markAll) {
          await Notification.updateMany({ userId: session.id }, { isRead: true });
        } else if (notificationId) {
          await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        }
      }
    } catch (err) {
      console.error('Notifications PUT DB error:', err);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: true });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const store = readStore();

    const notifId = body._id || body.id || `notif_${Date.now()}`;
    const newNotif = {
      _id: notifId,
      id: notifId,
      userId: body.userId || body.patientId || 'pat_1',
      title: body.title || 'Clinical Notification',
      message: body.message || 'Notification details',
      type: body.type || 'INFO',
      isRead: false,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    store.notifications.unshift(newNotif);
    writeStore(store);

    try {
      const { isFallback } = await connectToDatabase();
      if (!isFallback) {
        await Notification.create(newNotif);
      }
    } catch (err) {
      console.error('Notifications POST DB error:', err);
    }

    return NextResponse.json({ success: true, notification: newNotif });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

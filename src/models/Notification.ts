import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'REMINDER' | 'MILESTONE' | 'APPOINTMENT' | 'ALERT' | 'SYSTEM';
  isRead: boolean;
  linkUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['REMINDER', 'MILESTONE', 'APPOINTMENT', 'ALERT', 'SYSTEM'],
      default: 'REMINDER',
    },
    isRead: { type: Boolean, default: false },
    linkUrl: { type: String },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

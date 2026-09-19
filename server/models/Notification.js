import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String },
  message: { type: String },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  readBy: { type: [String], default: [] }, // userIds who have marked this notification as read
  role: { type: String }, // 'alumni', 'student', 'college_admin'
  userId: { type: String },
  collegeId: { type: String },
  link: { type: String },
  type: { type: String }
});

export default mongoose.model('Notification', notificationSchema);

import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  recipientEmail: { type: String, required: true },
  recipientName: { type: String, default: '' },
  memberId: { type: String },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, default: 'Delivered' },
  sentAt: { type: Date, default: Date.now },
  collegeId: { type: String },
  type: { type: String, default: 'verification' },
  tempCredentials: { type: String, default: '' }
});

export default mongoose.model('EmailLog', emailLogSchema);

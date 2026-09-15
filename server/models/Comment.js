import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  eventId: { type: String, required: true },
  userId: { type: String },
  userName: { type: String },
  userRole: { type: String },
  authorId: { type: String },
  authorName: { type: String },
  authorAvatar: { type: String, default: null },
  role: { type: String },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now }
});

// Index for faster queries
commentSchema.index({ eventId: 1 });

export default mongoose.model('Comment', commentSchema);

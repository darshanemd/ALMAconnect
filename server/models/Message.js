import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, default: '' },
  image: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

// Index to quickly fetch messages between two specific members
messageSchema.index({ from: 1, to: 1, timestamp: 1 });

export default mongoose.model('Message', messageSchema);

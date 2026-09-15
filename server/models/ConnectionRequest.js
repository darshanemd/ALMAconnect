import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('ConnectionRequest', connectionRequestSchema);

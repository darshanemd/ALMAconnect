import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  blockerId: { type: String, required: true },
  blockedId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

export default mongoose.model('Block', blockSchema);

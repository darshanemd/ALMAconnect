import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  eventId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  members: [{
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true }
  }],
  openRoles: [{ type: String }]
});

// Indexes for faster lookups
teamSchema.index({ eventId: 1 });
teamSchema.index({ creatorId: 1 });

export default mongoose.model('Team', teamSchema);

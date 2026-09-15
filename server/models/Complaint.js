import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['misconduct', 'Academic', 'Infrastructure', 'Faculty', 'Administration', 'Hostel', 'Canteen', 'Other']
  },
  description: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['open', 'under_review', 'resolved', 'closed'],
    default: 'open'
  },
  collegeId: { type: String, required: true },
  proofImage: { type: String, default: null }, // base64 data URL, optional

  // Stored server-side ONLY — never returned in student-facing responses
  submitterMemberId: { type: String, required: true },

  adminResponse: { type: String, default: '' },
  respondedAt: { type: Date, default: null },

  // Upvotes stored as hashed tokens — not member IDs
  upvoteTokens: [{ type: String }],

  submittedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

complaintSchema.index({ collegeId: 1, status: 1 });
complaintSchema.index({ collegeId: 1, submittedAt: -1 });

export default mongoose.model('Complaint', complaintSchema);

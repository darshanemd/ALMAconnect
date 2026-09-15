import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  targetAudience: { type: String, enum: ['all', 'alumni', 'student'], default: 'all' },
  anonymous: { type: Boolean, default: false },
  createdBy: { type: String, default: 'College Admin' },
  questions: [{
    id: { type: String },
    type: { type: String }, // 'text', 'mcq', 'rating'
    question: { type: String },
    options: [{ type: String }],
    required: { type: Boolean, default: false }
  }],
  createdDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  responses: { type: Number, default: 0 },
  collegeId: { type: String, required: true },
  deadline: { type: Date }
});

export default mongoose.model('Survey', surveySchema);

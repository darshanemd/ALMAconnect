import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  experience: { type: String, default: '0-2 years' },
  salary: { type: String, default: '' },
  description: { type: String, default: '' },
  requirements: [{ type: String }],
  postedBy: { type: String },
  postedDate: { type: Date, default: Date.now },
  applicants: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'rejected', 'closed'], default: 'pending' },
  deadline: { type: Date },
  applyUrl: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  pdfName: { type: String, default: '' },
  collegeId: { type: String, default: 'col-1' }
});

jobSchema.index({
  title: 'text',
  company: 'text',
  location: 'text',
  description: 'text',
  requirements: 'text'
});

export default mongoose.model('Job', jobSchema);

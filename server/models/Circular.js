import mongoose from 'mongoose';

const circularSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Placements', 'Exams', 'Events', 'General'], 
    default: 'General' 
  },
  targetAudience: { 
    type: String, 
    enum: ['All', 'Students', 'Alumni'], 
    default: 'All' 
  },
  attachmentName: { type: String, default: '' },
  attachmentUrl: { type: String, default: '' },
  postedBy: { type: String, required: true },
  postedByCollegeId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

circularSchema.index({ targetAudience: 1, createdAt: -1 });

export default mongoose.model('Circular', circularSchema);

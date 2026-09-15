import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' }, // 'text' | 'select' | 'number' | 'checkbox'
  options: [{ type: String }],
  required: { type: Boolean, default: true }
});

const registrationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  userRole: { type: String, default: '' },
  rollNumber: { type: String, default: '' },
  department: { type: String, default: '' },
  category: { type: String, default: '' },
  entryType: { type: String, default: 'Individual Entry' },
  roleOrPosition: { type: String, default: '' },
  teamName: { type: String, default: '' },
  teamMembers: { type: mongoose.Schema.Types.Mixed, default: [] },
  guestOption: { type: String, default: '' },
  companyOrRole: { type: String, default: '' },
  degreeOrBatch: { type: String, default: '' },
  experienceLevel: { type: String, default: '' },
  workstationOption: { type: String, default: '' },
  answers: { type: mongoose.Schema.Types.Mixed, default: {} },
  registeredSports: [{ type: String }],
  registeredCategories: [{ type: mongoose.Schema.Types.Mixed }],
  registeredAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  organizer: { type: String, required: true },
  maxAttendees: { type: Number, required: true },
  currentAttendees: { type: Number, default: 0 },
  rsvps: [{ type: String }],
  image: { type: String, default: null },
  isPast: { type: Boolean, default: false },
  fee: { type: Number, default: 0 },
  problemStatementName: { type: String, default: null },
  problemStatementUrl: { type: String, default: null },
  reminderSent: { type: Boolean, default: false },
  
  // Registration Configuration
  registrationMode: { 
    type: String, 
    enum: ['1click', 'custom_form', 'hackathon', 'external_link'], 
    default: '1click' 
  },
  customQuestions: [questionSchema],
  externalUrl: { type: String, default: null },
  registrations: [registrationSchema]
});

// Indexes for faster lookups
eventSchema.index({ date: -1 });

export default mongoose.model('Event', eventSchema);

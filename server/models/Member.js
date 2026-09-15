import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, default: 'demo123' },
  avatar: { type: String, default: null },
  collegeId: { type: String, required: true },
  department: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  degree: { type: String, required: true },
  currentCompany: { type: String, default: null },
  currentRole: { type: String, default: null },
  location: { type: String, default: '' },
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isMentor: { type: Boolean, default: false },
  mentorTopics: [{ type: String }],
  connections: [{ type: String }],
  joinedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
  role: { type: String, enum: ['alumni', 'student', 'college_admin'], default: 'alumni' },
  rollNumber: { type: String, default: '' },
  targetRole: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  resumeType: { type: String, default: 'pdf' },
  resumeName: { type: String, default: '' },
  idProofUrl: { type: String, default: '' },
  idProofName: { type: String, default: '' },
  
  // Extended Skill Gap & Roadmap tracking fields
  careerTarget: { type: String, default: '' },
  roadmapProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
  completedSkills: [{ type: String }],
  learningResources: { type: mongoose.Schema.Types.Mixed, default: {} },
  resourceBookmarks: [{ type: String }],
  resourceProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
  weeklyPlanner: { type: mongoose.Schema.Types.Mixed, default: {} },
  projects: { type: mongoose.Schema.Types.Mixed, default: {} },
  codingProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
  interviewProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
  resumeHistory: { type: mongoose.Schema.Types.Mixed, default: [] },
  analytics: { type: mongoose.Schema.Types.Mixed, default: {} },
  lastVisitedRoadmapNode: { type: String, default: '' },
  learningStreak: { type: Number, default: 0 },
  estimatedCompletion: { type: String, default: '' },
  
  // Security & Password Reset fields
  resetPasswordToken: { type: String, default: null },
  resetPasswordOTP: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  twoFactorEnabled: { type: Boolean, default: false },

  // User Preferences & Privacy Settings
  privacy: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      directoryVisibility: 'public',
      hidePhone: false,
      hideEmail: false,
      openToMentor: true,
      openToJobs: true
    }
  },
  notifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      directMessages: true,
      connectionRequests: true,
      circulars: true,
      jobAlerts: true,
      eventReminders: true
    }
  },
  connectedAccounts: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      linkedin: '',
      github: '',
      googleCalendar: false
    }
  }
});

// Indexes for faster queries
memberSchema.index({ role: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({
  firstName: 'text',
  lastName: 'text',
  currentCompany: 'text',
  currentRole: 'text',
  location: 'text',
  department: 'text',
  skills: 'text'
});

// Pre-save hook to hash password
memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
memberSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Member', memberSchema);

import mongoose from 'mongoose';

const preVerifiedStudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  expectedGraduationYear: { type: Number, required: true },
  degree: { type: String, required: true },
  collegeId: { type: String, required: true }
});

export default mongoose.model('PreVerifiedStudent', preVerifiedStudentSchema);

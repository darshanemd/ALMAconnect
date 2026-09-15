import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  location: { type: String, required: true },
  departments: [{ type: String }]
});

export default mongoose.model('College', collegeSchema);

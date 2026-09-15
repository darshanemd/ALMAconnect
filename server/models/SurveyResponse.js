import mongoose from 'mongoose';

const surveyResponseSchema = new mongoose.Schema({
  surveyId: { type: String, required: true },
  responses: { type: mongoose.Schema.Types.Mixed, required: true },
  submittedBy: { type: String, default: 'anonymous' },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('SurveyResponse', surveyResponseSchema);

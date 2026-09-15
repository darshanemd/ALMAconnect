import express from 'express';
import Survey from '../models/Survey.js';
import SurveyResponse from '../models/SurveyResponse.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET all surveys
router.get('/', async (req, res) => {
  try {
    const { role, collegeId } = req.query;
    const filter = {};
    if (collegeId) filter.collegeId = collegeId;
    if (role === 'student') {
      filter.targetAudience = { $in: ['student', 'all', null] };
    } else if (role === 'alumni') {
      filter.targetAudience = { $in: ['alumni', 'all', null] };
    }
    const surveys = await Survey.find(filter).sort({ createdDate: -1 });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create survey
router.post('/', async (req, res) => {
  try {
    const targetAudience = ['student', 'alumni'].includes(req.body.targetAudience) 
      ? req.body.targetAudience 
      : 'all';

    const newSurvey = new Survey({
      id: `survey-${Date.now()}`,
      createdDate: new Date(),
      status: 'active',
      responses: 0,
      ...req.body,
      targetAudience
    });
    const saved = await newSurvey.save();

    // Create targeted survey notification for college members
    try {
      const targetRole = targetAudience === 'all' ? undefined : targetAudience;
      const audienceLabel = targetAudience === 'student' ? ' (Students Only)' : (targetAudience === 'alumni' ? ' (Alumni Only)' : '');
      const surveyNotif = new Notification({
        id: `notif-survey-${Date.now()}`,
        title: `📋 New Feedback Survey${audienceLabel}`,
        content: `A new survey "${saved.title}" is ready for your input.`,
        message: `A new survey "${saved.title}" is ready for your input.`,
        collegeId: req.body.collegeId || '',
        role: targetRole,
        link: '/surveys',
        type: 'survey',
        date: new Date(),
        read: false
      });
      await surveyNotif.save();
    } catch (notifErr) {
      console.error('Failed to create survey notification:', notifErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update survey (e.g. targetAudience, status, deadline, title)
router.put('/:id', async (req, res) => {
  try {
    const survey = await Survey.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE survey
router.delete('/:id', async (req, res) => {
  try {
    const survey = await Survey.findOneAndDelete({ id: req.params.id });
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    await SurveyResponse.deleteMany({ surveyId: req.params.id });
    res.json({ message: 'Survey deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST submit survey response
router.post('/:id/respond', async (req, res) => {
  const { responses, submittedBy } = req.body;
  try {
    const survey = await Survey.findOne({ id: req.params.id });
    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    const newResponse = new SurveyResponse({
      surveyId: req.params.id,
      responses,
      submittedBy: submittedBy || 'anonymous',
      date: new Date()
    });

    await newResponse.save();

    // Increment responses count
    survey.responses = (survey.responses || 0) + 1;
    await survey.save();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET survey responses
router.get('/:id/responses', async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ surveyId: req.params.id });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

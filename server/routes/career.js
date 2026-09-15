import express from 'express';
import Member from '../models/Member.js';

const router = express.Router();

// Helper to get member and handle error
const getMemberOrError = async (userId, res) => {
  const member = await Member.findOne({ id: userId });
  if (!member) {
    res.status(404).json({ message: 'User not found' });
    return null;
  }
  return member;
};

// GET career profile for a student
router.get('/profile/:userId', async (req, res) => {
  try {
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;
    
    // Return all skill gap related fields
    res.json({
      careerTarget: member.careerTarget || member.targetRole || '',
      roadmapProgress: member.roadmapProgress || {},
      completedSkills: member.completedSkills || [],
      learningResources: member.learningResources || {},
      resourceBookmarks: member.resourceBookmarks || [],
      resourceProgress: member.resourceProgress || {},
      weeklyPlanner: member.weeklyPlanner || {},
      projects: member.projects || {},
      codingProgress: member.codingProgress || {},
      interviewProgress: member.interviewProgress || {},
      resumeHistory: member.resumeHistory || [],
      analytics: member.analytics || {},
      lastVisitedRoadmapNode: member.lastVisitedRoadmapNode || '',
      learningStreak: member.learningStreak || 0,
      estimatedCompletion: member.estimatedCompletion || '',
      skills: member.skills || [],
      bio: member.bio || '',
      degree: member.degree || '',
      department: member.department || ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update career target role
router.put('/target/:userId', async (req, res) => {
  try {
    const { targetRole } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    member.careerTarget = targetRole;
    member.targetRole = targetRole;
    member.markModified('careerTarget');
    member.markModified('targetRole');

    // Optionally reset/initialize roadmap state on career change
    member.roadmapProgress = {};
    member.weeklyPlanner = {};
    member.projects = {};
    member.codingProgress = {};
    member.interviewProgress = {};
    member.lastVisitedRoadmapNode = '';
    member.markModified('roadmapProgress');
    member.markModified('weeklyPlanner');
    member.markModified('projects');
    member.markModified('codingProgress');
    member.markModified('interviewProgress');
    member.markModified('lastVisitedRoadmapNode');

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update completed skills
router.put('/skills/:userId', async (req, res) => {
  try {
    const { completedSkills, skills } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (completedSkills) {
      member.completedSkills = completedSkills;
      member.markModified('completedSkills');
    }
    if (skills) {
      member.skills = skills;
      member.markModified('skills');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update learning resources progress / bookmarks
router.put('/resources/:userId', async (req, res) => {
  try {
    const { learningResources, resourceBookmarks, resourceProgress } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (learningResources) {
      member.learningResources = learningResources;
      member.markModified('learningResources');
    }
    if (resourceBookmarks) {
      member.resourceBookmarks = resourceBookmarks;
      member.markModified('resourceBookmarks');
    }
    if (resourceProgress) {
      member.resourceProgress = resourceProgress;
      member.markModified('resourceProgress');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update weekly planner checklist
router.put('/planner/:userId', async (req, res) => {
  try {
    const { weeklyPlanner } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (weeklyPlanner) {
      member.weeklyPlanner = weeklyPlanner;
      member.markModified('weeklyPlanner');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update projects state
router.put('/projects/:userId', async (req, res) => {
  try {
    const { projects } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (projects) {
      member.projects = projects;
      member.markModified('projects');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update coding schedule / solved problems
router.put('/coding/:userId', async (req, res) => {
  try {
    const { codingProgress } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (codingProgress) {
      member.codingProgress = codingProgress;
      member.markModified('codingProgress');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update interview center status
router.put('/interview/:userId', async (req, res) => {
  try {
    const { interviewProgress } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (interviewProgress) {
      member.interviewProgress = interviewProgress;
      member.markModified('interviewProgress');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update resume scanning history
router.put('/resume/:userId', async (req, res) => {
  try {
    const { resumeHistory, bio } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (resumeHistory) {
      member.resumeHistory = resumeHistory;
      member.markModified('resumeHistory');
    }
    if (bio !== undefined) {
      member.bio = bio;
      member.markModified('bio');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update general analytics, streaking, completion estimates, and nodes
router.put('/analytics/:userId', async (req, res) => {
  try {
    const { analytics, lastVisitedRoadmapNode, learningStreak, estimatedCompletion } = req.body;
    const member = await getMemberOrError(req.params.userId, res);
    if (!member) return;

    if (analytics) {
      member.analytics = analytics;
      member.markModified('analytics');
    }
    if (lastVisitedRoadmapNode !== undefined) {
      member.lastVisitedRoadmapNode = lastVisitedRoadmapNode;
      member.markModified('lastVisitedRoadmapNode');
    }
    if (learningStreak !== undefined) {
      member.learningStreak = learningStreak;
      member.markModified('learningStreak');
    }
    if (estimatedCompletion !== undefined) {
      member.estimatedCompletion = estimatedCompletion;
      member.markModified('estimatedCompletion');
    }

    const saved = await member.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

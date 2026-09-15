import express from 'express';
import Circular from '../models/Circular.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateCircularPayload } from '../middleware/validator.js';

const router = express.Router();

// GET circulars filtered by role and optionally collegeId
router.get('/', async (req, res) => {
  const { role, collegeId } = req.query;
  try {
    const query = {};
    
    if (role === 'college_admin') {
      if (collegeId) query.postedByCollegeId = collegeId;
    } else {
      const audiences = ['All'];
      if (role === 'student') audiences.push('Students');
      if (role === 'alumni') audiences.push('Alumni');
      
      query.targetAudience = { $in: audiences };
      if (collegeId) query.postedByCollegeId = collegeId;
    }

    const circulars = await Circular.find(query).sort({ createdAt: -1 });
    res.json(circulars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new circular (College Admin only)
router.post('/', authenticateToken, requireRole(['college_admin']), validateCircularPayload, async (req, res) => {
  const { title, content, category, targetAudience, attachmentName, attachmentUrl, postedBy, postedByCollegeId } = req.body;
  try {
    const newCircular = new Circular({
      id: `circ-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category: category || 'Academic',
      targetAudience: targetAudience || 'All',
      attachmentName: attachmentName ? attachmentName.trim() : '',
      attachmentUrl: attachmentUrl ? attachmentUrl.trim() : '',
      postedBy: postedBy ? postedBy.trim() : req.user.name,
      postedByCollegeId: postedByCollegeId || req.user.collegeId || ''
    });

    const saved = await newCircular.save();

    // Create a notification for the target audience
    let notifRole = null;
    if (targetAudience === 'Students') notifRole = 'student';
    else if (targetAudience === 'Alumni') notifRole = 'alumni';

    const notifMsg = `New Notice: ${title}`;
    const newNotif = new Notification({
      id: `notif-${Date.now()}`,
      title: '📢 Official Announcement',
      content: notifMsg,
      message: notifMsg,
      date: new Date(),
      read: false,
      role: notifRole,
      collegeId: postedByCollegeId || req.user.collegeId || ''
    });

    await newNotif.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a circular (College Admin only)
router.delete('/:id', authenticateToken, requireRole(['college_admin']), async (req, res) => {
  try {
    const deleted = await Circular.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Circular not found' });
    res.json({ message: 'Circular deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

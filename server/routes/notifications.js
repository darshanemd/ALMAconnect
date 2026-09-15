import express from 'express';
import Notification from '../models/Notification.js';
import Member from '../models/Member.js';

const router = express.Router();

// GET notifications with filters
router.get('/', async (req, res) => {
  const { role, userId, collegeId } = req.query;
  try {
    // If requesting as college_admin, ensure all pending members have notifications
    if (role === 'college_admin' || !role) {
      try {
        const pendingMembers = await Member.find({ status: 'pending' });
        for (const pm of pendingMembers) {
          const candidateName = `${pm.firstName || ''} ${pm.lastName || ''}`.trim() || 'New Member';
          const exists = await Notification.findOne({
            role: 'college_admin',
            $or: [
              { content: new RegExp(pm.firstName, 'i') },
              { message: new RegExp(pm.firstName, 'i') },
              { id: `notif-verify-req-${pm.id}` }
            ]
          });
          if (!exists) {
            const adminNotif = new Notification({
              id: `notif-verify-req-${pm.id}`,
              title: 'Verification Request',
              content: `${candidateName} applied for registration. Needs verification.`,
              message: `${candidateName} applied for registration. Needs verification.`,
              date: pm.joinedDate || new Date(),
              read: false,
              role: 'college_admin',
              collegeId: pm.collegeId || collegeId || 'col-1',
              link: '/verification',
              type: 'verification'
            });
            await adminNotif.save();
          }
        }
      } catch (syncErr) {
        console.warn('Auto-sync pending notifications error:', syncErr);
      }
    }

    const userDoc = userId ? await Member.findOne({ id: userId }) : null;
    const userNotifs = userDoc?.notifications || {};

    const notifications = await Notification.find({});
    
    const filtered = notifications.filter(n => {
      // Channel preference filter
      if (userNotifs.directMessages === false && (n.type === 'message' || n.title?.includes('Message') || n.title?.includes('💬'))) {
        return false;
      }
      if (userNotifs.connectionRequests === false && (n.type === 'networking' || n.title?.includes('Connection') || n.title?.includes('Mentorship'))) {
        return false;
      }
      if (userNotifs.circulars === false && (n.type === 'circular' || n.title?.includes('Announcement') || n.title?.includes('Notice'))) {
        return false;
      }
      if (userNotifs.jobAlerts === false && (n.type === 'job' || n.title?.includes('Job'))) {
        return false;
      }
      if (userNotifs.eventReminders === false && (n.type === 'event' || n.title?.includes('Event'))) {
        return false;
      }

      // 1. If notification has a specific userId target:
      if (n.userId && n.userId.trim() !== '') {
        return n.userId === userId;
      }
      
      // 2. If notification is targeted to a specific college:
      if (n.collegeId && n.collegeId.trim() !== '' && collegeId && collegeId.trim() !== '') {
        if (n.collegeId !== collegeId && n.collegeId !== 'all') {
          return false;
        }
      }
      
      // 3. If notification is targeted to a specific role:
      if (n.role && n.role.trim() !== '' && role && role.trim() !== '') {
        if (n.role !== role && n.role !== 'all') {
          return false;
        }
      }
      
      return true;
    });

    // Sort newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add notification
router.post('/', async (req, res) => {
  try {
    const { content, message } = req.body;
    const finalContent = content || message || '';
    const finalMessage = message || content || '';
    
    const newNotif = new Notification({
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date(),
      read: false,
      ...req.body,
      content: finalContent,
      message: finalMessage
    });
    const saved = await newNotif.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const { userId, role, collegeId } = req.body;
    const filter = {};
    if (userId) filter.userId = userId;
    else if (role) {
      filter.role = role;
      if (collegeId) filter.collegeId = collegeId;
    }
    
    // Update all matching notifications to read: true
    await Notification.updateMany(
      filter,
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT mark single notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { $set: { read: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

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

    // Map read status based on per-user readBy or global read
    const formatted = filtered.map(n => {
      const doc = n.toObject ? n.toObject() : { ...n };
      const isRead = Boolean(doc.read || (userId && Array.isArray(doc.readBy) && doc.readBy.includes(userId)));
      return {
        ...doc,
        read: isRead
      };
    });

    // Sort newest first
    formatted.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(formatted);
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
      readBy: [],
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

    // 1. Directly target notifications assigned to this user
    if (userId) {
      await Notification.updateMany(
        { userId },
        { 
          $set: { read: true },
          $addToSet: { readBy: userId }
        }
      );
    }

    // 2. Mark broadcast / group / college notifications visible to this user
    const broadcastConditions = [
      { userId: { $exists: false } },
      { userId: null },
      { userId: '' }
    ];

    if (userId) {
      broadcastConditions.push({ userId });
    }

    const query = { $or: broadcastConditions };

    if (collegeId && collegeId !== 'all') {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { collegeId: { $exists: false } },
          { collegeId: null },
          { collegeId: '' },
          { collegeId: 'all' },
          { collegeId: collegeId }
        ]
      });
    }

    if (role && role !== 'all') {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { role: { $exists: false } },
          { role: null },
          { role: '' },
          { role: 'all' },
          { role: role }
        ]
      });
    }

    if (userId) {
      await Notification.updateMany(query, {
        $addToSet: { readBy: userId }
      });
    } else {
      await Notification.updateMany(query, {
        $set: { read: true }
      });
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT mark single notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { userId } = req.body || {};
    const notif = await Notification.findOne({ id: req.params.id });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });

    notif.read = true;
    if (userId) {
      if (!Array.isArray(notif.readBy)) notif.readBy = [];
      if (!notif.readBy.includes(userId)) {
        notif.readBy.push(userId);
      }
    }
    const updated = await notif.save();
    res.json({
      ...(updated.toObject ? updated.toObject() : updated),
      read: true
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

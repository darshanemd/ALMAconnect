import express from 'express';
import crypto from 'crypto';
import Complaint from '../models/Complaint.js';
import Member from '../models/Member.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Helper: strip submitter identity from complaint objects for student-facing responses
function redactComplaint(complaint) {
  const obj = complaint.toObject ? complaint.toObject() : { ...complaint };
  delete obj.submitterMemberId;
  delete obj.upvoteTokens;
  obj.upvoteCount = (complaint.upvoteTokens || []).length;
  return obj;
}

// POST /api/complaints — submit a new complaint (student, alumni, or report)
router.post('/', async (req, res) => {
  try {
    const { title, category, description, submitterMemberId, proofImage, collegeId: reqCollegeId } = req.body;

    if (!title || !category || !description || !submitterMemberId) {
      return res.status(400).json({ message: 'title, category, description, and submitterMemberId are required.' });
    }

    const member = await Member.findOne({ id: submitterMemberId });
    const collegeId = member?.collegeId || reqCollegeId || '';

    const newComplaint = new Complaint({
      id: `complaint-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      category,
      description,
      proofImage: proofImage || null,
      status: 'open',
      collegeId: collegeId,
      submitterMemberId,
      submittedAt: new Date()
    });

    const saved = await newComplaint.save();

    // Create notification for College Admin
    try {
      const adminNotif = new Notification({
        id: `notif-comp-${Date.now()}`,
        title: '⚠️ New Complaint Filed',
        content: `A student submitted a complaint: "${title}".`,
        message: `A student submitted a complaint: "${title}".`,
        role: 'college_admin',
        collegeId: collegeId,
        link: '/college/complaints',
        type: 'complaint',
        date: new Date(),
        read: false
      });
      await adminNotif.save();
    } catch (notifErr) {
      console.error('Failed to create complaint notification:', notifErr);
    }

    res.status(201).json(redactComplaint(saved));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints?collegeId=xxx&status=open&category=misconduct&submitterMemberId=xyz
router.get('/', async (req, res) => {
  try {
    const { collegeId, status, category, submitterMemberId, excludeMisconduct } = req.query;

    const filter = {};
    if (collegeId) {
      filter.$or = [{ collegeId }, { collegeId: '' }, { collegeId: null }];
    }
    if (status) filter.status = status;
    if (submitterMemberId) filter.submitterMemberId = submitterMemberId;
    
    if (category) {
      filter.category = category;
    } else if (excludeMisconduct === 'true') {
      filter.category = { $ne: 'misconduct' };
    }

    const complaints = await Complaint.find(filter).sort({ submittedAt: -1 });
    res.json(complaints.map(redactComplaint));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints/:id — single complaint (redacted)
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
    res.json(redactComplaint(complaint));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/complaints/:id/status — college_admin updates status & response
router.patch('/:id/status', authenticateToken, requireRole(['college_admin']), async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const validStatuses = ['open', 'under_review', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    if (status) complaint.status = status;
    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
      complaint.respondedAt = new Date();
    }
    if (status === 'resolved' || status === 'closed') {
      complaint.resolvedAt = new Date();
    }

    const updated = await complaint.save();

    // Create notification for student submitter
    try {
      if (complaint.submitterMemberId) {
        const statusText = status ? status.replace('_', ' ') : 'updated';
        const notif = new Notification({
          id: `notif-compupd-${Date.now()}`,
          title: '🔔 Complaint Status Updated',
          content: `Your complaint "${complaint.title}" status is now ${statusText}.`,
          message: `Your complaint "${complaint.title}" status is now ${statusText}.`,
          userId: complaint.submitterMemberId,
          link: '/student/complaints',
          type: 'complaint',
          date: new Date(),
          read: false
        });
        await notif.save();
      }
    } catch (notifErr) {
      console.error('Failed to create complaint status notification:', notifErr);
    }

    res.json(redactComplaint(updated));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/complaints/:id/upvote — toggle upvote using anonymous session token
router.post('/:id/upvote', async (req, res) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) return res.status(400).json({ message: 'sessionToken is required.' });

    // Hash the token so it's not reversible
    const hashed = crypto.createHash('sha256').update(sessionToken + req.params.id).digest('hex');

    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    if (!Array.isArray(complaint.upvoteTokens)) {
      complaint.upvoteTokens = [];
    }

    const idx = complaint.upvoteTokens.indexOf(hashed);
    if (idx === -1) {
      complaint.upvoteTokens.push(hashed);
    } else {
      complaint.upvoteTokens.splice(idx, 1);
    }

    const updated = await complaint.save();
    res.json({ upvoteCount: updated.upvoteTokens.length, upvoted: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

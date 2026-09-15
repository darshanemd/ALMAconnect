import express from 'express';
import College from '../models/College.js';
import Member from '../models/Member.js';
import Job from '../models/Job.js';
import Event from '../models/Event.js';
import Complaint from '../models/Complaint.js';

const router = express.Router();

// GET all colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find({});
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/colleges/:id/analytics — Aggregation pipeline for college overview statistics
router.get('/:id/analytics', async (req, res) => {
  const collegeId = req.params.id;
  try {
    const [memberStats, deptStats, jobCount, eventCount, complaintStats] = await Promise.all([
      // 1. Member distribution (students, alumni, verified)
      Member.aggregate([
        { $match: { collegeId } },
        {
          $group: {
            _id: '$role',
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            verified: { $sum: { $cond: ['$isVerified', 1, 0] } }
          }
        }
      ]),

      // 2. Department breakdown
      Member.aggregate([
        { $match: { collegeId } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),

      // 3. Jobs posted for college
      Job.countDocuments({ $or: [{ collegeId }, { collegeId: { $exists: false } }] }),

      // 4. Events count
      Event.countDocuments({ $or: [{ collegeId }, { collegeId: { $exists: false } }] }),

      // 5. Complaints breakdown
      Complaint.aggregate([
        { $match: { collegeId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const stats = {
      students: memberStats.find(m => m._id === 'student')?.total || 0,
      alumni: memberStats.find(m => m._id === 'alumni')?.total || 0,
      pendingVerifications: memberStats.reduce((acc, m) => acc + (m.pending || 0), 0),
      verifiedCount: memberStats.reduce((acc, m) => acc + (m.verified || 0), 0),
      departments: deptStats.map(d => ({ name: d._id || 'General', count: d.count })),
      totalJobs: jobCount,
      totalEvents: eventCount,
      complaints: {
        open: complaintStats.find(c => c._id === 'open')?.count || 0,
        underReview: complaintStats.find(c => c._id === 'under_review')?.count || 0,
        resolved: complaintStats.find(c => c._id === 'resolved')?.count || 0
      }
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update college profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await College.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'College not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

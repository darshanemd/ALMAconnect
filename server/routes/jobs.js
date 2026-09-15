import express from 'express';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateJobPayload } from '../middleware/validator.js';

const router = express.Router();

// GET jobs with search, filters & optional pagination
router.get('/', async (req, res) => {
  try {
    const { search, type, experience, status, collegeId, page, limit } = req.query;
    const filter = {};

    if (collegeId) filter.collegeId = collegeId;
    if (type) filter.type = type;
    if (experience) filter.experience = experience;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { $text: { $search: search } },
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 0;

    if (limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      const total = await Job.countDocuments(filter);
      const jobs = await Job.find(filter).sort({ postedDate: -1 }).skip(skip).limit(limitNum);
      return res.json({
        data: jobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    }

    const jobs = await Job.find(filter).sort({ postedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add job (Alumni submit pending requests, College Admin can publish directly)
router.post('/', authenticateToken, requireRole(['alumni', 'college_admin']), validateJobPayload, async (req, res) => {
  try {
    const isSuperOrAdmin = req.user.role === 'college_admin';
    const initialStatus = isSuperOrAdmin ? (req.body.status || 'active') : 'pending';

    const newJob = new Job({
      id: `job-${Date.now()}`,
      postedDate: new Date(),
      status: initialStatus,
      applicants: 0,
      postedBy: req.user.id,
      postedByName: req.user.name || (req.user.firstName ? `${req.user.firstName} ${req.user.lastName}` : 'Alumni Member'),
      postedByRole: req.user.role,
      collegeId: req.body.collegeId || req.user.collegeId || 'col-1',
      ...req.body
    });
    const saved = await newJob.save();

    // If job is pending approval, notify college admin and give confirmation to poster
    if (initialStatus === 'pending') {
      try {
        const posterName = req.user.name || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'An alumnus';
        const adminNotif = new Notification({
          id: `notif-job-req-${saved.id}`,
          title: '📋 Job Approval Request',
          content: `${posterName} submitted a job posting "${saved.title}" at "${saved.company}". Needs approval.`,
          message: `${posterName} submitted a job posting "${saved.title}" at "${saved.company}". Needs approval.`,
          role: 'college_admin',
          collegeId: saved.collegeId,
          link: '/jobs',
          type: 'job',
          date: new Date(),
          read: false
        });
        await adminNotif.save();

        const posterNotif = new Notification({
          id: `notif-job-confirm-${saved.id}`,
          title: 'Job Posting Submitted',
          content: `Your job posting for "${saved.title}" at "${saved.company}" has been submitted for administrative verification and approval.`,
          message: `Your job posting for "${saved.title}" at "${saved.company}" has been submitted for administrative verification and approval.`,
          userId: req.user.id,
          role: req.user.role,
          collegeId: saved.collegeId,
          link: '/jobs',
          type: 'job',
          date: new Date(),
          read: false
        });
        await posterNotif.save();
      } catch (notifErr) {
        console.error('Failed to create pending job notifications:', notifErr);
      }
    } else {
      // If posted directly by admin as active, broadcast to college members
      try {
        const alumNotif = new Notification({
          id: `notif-job-alum-${Date.now()}`,
          title: '💼 New Job Opportunity',
          content: `A new job "${saved.title}" at "${saved.company}" was posted.`,
          message: `A new job "${saved.title}" at "${saved.company}" was posted.`,
          role: 'alumni',
          collegeId: saved.collegeId,
          link: '/jobs',
          type: 'job',
          date: new Date(),
          read: false
        });
        await alumNotif.save();

        const studentNotif = new Notification({
          id: `notif-job-stud-${Date.now()}`,
          title: '💼 New Job Opportunity',
          content: `A new job "${saved.title}" at "${saved.company}" was posted.`,
          message: `A new job "${saved.title}" at "${saved.company}" was posted.`,
          role: 'student',
          collegeId: saved.collegeId,
          link: '/jobs',
          type: 'job',
          date: new Date(),
          read: false
        });
        await studentNotif.save();
      } catch (notifErr) {
        console.error('Failed to create job notifications:', notifErr);
      }
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT approve job (College Admin only)
router.put('/:id/approve', authenticateToken, requireRole(['college_admin']), async (req, res) => {
  try {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = 'active';
    const saved = await job.save();

    // Mark admin job approval notification as read
    await Notification.updateMany(
      { 
        role: 'college_admin',
        $or: [
          { id: `notif-job-req-${job.id}` },
          { content: new RegExp(job.title, 'i') }
        ]
      },
      { $set: { read: true } }
    ).catch(() => {});

    // Notify the submitter that their job is approved
    if (job.postedBy) {
      try {
        const approvedNotif = new Notification({
          id: `notif-job-appr-${Date.now()}`,
          title: '✅ Job Posting Approved',
          content: `Your job posting for "${job.title}" at "${job.company}" was approved and is now live!`,
          message: `Your job posting for "${job.title}" at "${job.company}" was approved and is now live!`,
          userId: job.postedBy,
          link: '/jobs',
          type: 'job',
          date: new Date(),
          read: false
        });
        await approvedNotif.save();
      } catch (e) {
        console.error('Failed to send approval notification to poster:', e);
      }
    }

    // Broadcast live notification to students and alumni
    try {
      const studentNotif = new Notification({
        id: `notif-job-stud-${Date.now()}`,
        title: '💼 New Job Opportunity',
        content: `A new job "${job.title}" at "${job.company}" was approved and published live!`,
        message: `A new job "${job.title}" at "${job.company}" was approved and published live!`,
        role: 'student',
        collegeId: job.collegeId,
        link: '/jobs',
        type: 'job',
        date: new Date(),
        read: false
      });
      await studentNotif.save();
    } catch (e) {
      console.error('Failed to broadcast job notification:', e);
    }

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT reject job (College Admin only)
router.put('/:id/reject', authenticateToken, requireRole(['college_admin']), async (req, res) => {
  try {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = 'rejected';
    const saved = await job.save();

    // Mark admin request notification as read
    await Notification.updateMany(
      { 
        role: 'college_admin',
        $or: [
          { id: `notif-job-req-${job.id}` },
          { content: new RegExp(job.title, 'i') }
        ]
      },
      { $set: { read: true } }
    ).catch(() => {});

    // Notify submitter of rejection
    if (job.postedBy) {
      try {
        const rejNotif = new Notification({
          id: `notif-job-rej-${Date.now()}`,
          title: '❌ Job Posting Update',
          content: `Your job posting for "${job.title}" at "${job.company}" was reviewed and not approved.`,
          message: `Your job posting for "${job.title}" at "${job.company}" was reviewed and not approved.`,
          userId: job.postedBy,
          link: '/jobs',
          type: 'job',
          date: new Date(),
          read: false
        });
        await rejNotif.save();
      } catch (e) {
        console.error('Failed to send rejection notification to poster:', e);
      }
    }

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT apply for job
router.put('/:id/apply', async (req, res) => {
  const { userId } = req.body;
  try {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.applicants = (job.applicants || 0) + 1;
    const saved = await job.save();

    if (userId) {
      try {
        const appNotif = new Notification({
          id: `notif-jobapp-${Date.now()}`,
          title: '💼 Application Received',
          content: `Your application for "${job.title}" at "${job.company}" was submitted successfully.`,
          message: `Your application for "${job.title}" at "${job.company}" was submitted successfully.`,
          userId,
          link: '/jobs',
          type: 'job',
          date: new Date(),
          read: false
        });
        await appNotif.save();
      } catch (notifErr) {
        console.error('Failed to create job application notification:', notifErr);
      }
    }

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

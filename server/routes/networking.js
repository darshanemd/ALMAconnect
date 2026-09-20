import express from 'express';
import ConnectionRequest from '../models/ConnectionRequest.js';
import ResumeRequest from '../models/ResumeRequest.js';
import Member from '../models/Member.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET connection requests for a user
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const requests = await ConnectionRequest.find({
      $or: [{ from: userId }, { to: userId }]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST send connection request
router.post('/', async (req, res) => {
  const { fromId, toId } = req.body;
  try {
    const newReq = new ConnectionRequest({
      id: `req-${Date.now()}`,
      from: fromId,
      to: toId,
      status: 'pending',
      date: new Date()
    });
    const saved = await newReq.save();

    // Create notification for receiver
    try {
      const sender = await Member.findOne({ id: fromId });
      const receiver = await Member.findOne({ id: toId });
      if (sender && receiver) {
        const newNotif = new Notification({
          id: `notif-conn-${Date.now()}`,
          title: 'Connection Request Received',
          content: `${sender.firstName} ${sender.lastName} wants to connect with you.`,
          message: `${sender.firstName} ${sender.lastName} wants to connect with you.`,
          userId: toId,
          role: receiver.role,
          date: new Date(),
          read: false
        });
        await newNotif.save();
      }
    } catch (notifErr) {
      console.error('Failed to create request notification:', notifErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT respond to connection request
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const request = await ConnectionRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // Add connections to both members
      await Member.findOneAndUpdate(
        { id: request.from },
        { $addToSet: { connections: request.to } }
      );
      await Member.findOneAndUpdate(
        { id: request.to },
        { $addToSet: { connections: request.from } }
      );

      // Create notification for sender
      try {
        const sender = await Member.findOne({ id: request.from });
        const receiver = await Member.findOne({ id: request.to });
        if (sender && receiver) {
          const newNotif = new Notification({
            id: `notif-accept-${Date.now()}`,
            title: 'Connection Request Accepted',
            content: `${receiver.firstName} ${receiver.lastName} accepted your connection request.`,
            message: `${receiver.firstName} ${receiver.lastName} accepted your connection request.`,
            userId: request.from,
            role: sender.role,
            date: new Date(),
            read: false
          });
          await newNotif.save();
        }
      } catch (notifErr) {
        console.error('Failed to create accept notification:', notifErr);
      }
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── RESUME REQUESTS ENDPOINTS ───────────────────────────────────────

// GET /api/networking/resume-requests
router.get('/resume-requests', async (req, res) => {
  const { userId, studentId, alumniId } = req.query;
  try {
    const query = {};
    if (userId) {
      query.$or = [{ studentId: userId }, { alumniId: userId }];
    } else {
      if (studentId) query.studentId = studentId;
      if (alumniId) query.alumniId = alumniId;
    }
    const requests = await ResumeRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/networking/resume-requests - Send a resume request
router.post('/resume-requests', async (req, res) => {
  const { studentId, studentName, alumniId } = req.body;
  if (!studentId || !alumniId) {
    return res.status(400).json({ message: 'studentId and alumniId are required' });
  }

  try {
    const [student, alumni] = await Promise.all([
      Member.findOne({ id: studentId }),
      Member.findOne({ id: alumniId })
    ]);

    const finalStudentName = studentName || (student ? `${student.firstName} ${student.lastName}`.trim() : 'Student');

    // Upsert or find existing request
    let request = await ResumeRequest.findOne({ studentId, alumniId });
    if (request) {
      request.status = 'pending';
      request.studentName = finalStudentName;
      request.updatedAt = new Date();
      await request.save();
    } else {
      request = new ResumeRequest({
        id: `rr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentId,
        studentName: finalStudentName,
        studentEmail: student?.email || '',
        studentDepartment: student?.department || '',
        alumniId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await request.save();
    }

    // Create notification for alumni in MongoDB
    try {
      const newNotif = new Notification({
        id: `notif-rr-${Date.now()}`,
        title: '📄 Resume Access Request',
        content: `${finalStudentName} requested access to view your resume.`,
        message: `${finalStudentName} requested access to view your resume.`,
        userId: alumniId,
        role: alumni?.role || 'alumni',
        collegeId: alumni?.collegeId || student?.collegeId || '',
        date: new Date(),
        read: false,
        type: 'resume_request',
        link: '/dashboard?tab=guidance'
      });
      await newNotif.save();
    } catch (notifErr) {
      console.error('Failed to create resume request notification:', notifErr);
    }

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/networking/resume-requests/:id - Respond to a resume request
router.put('/resume-requests/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const request = await ResumeRequest.findOne({ id: req.params.id });
    if (!request) return res.status(404).json({ message: 'Resume request not found' });

    request.status = status;
    request.updatedAt = new Date();
    await request.save();

    if (status === 'accepted') {
      try {
        const alumni = await Member.findOne({ id: request.alumniId });
        const alumniName = alumni ? `${alumni.firstName} ${alumni.lastName}`.trim() : 'Alumni';
        const newNotif = new Notification({
          id: `notif-rr-acc-${Date.now()}`,
          title: '📄 Resume Request Approved',
          content: `${alumniName} approved your resume access request. You can now view their resume in the Alumni Directory.`,
          message: `${alumniName} approved your resume access request. You can now view their resume in the Alumni Directory.`,
          userId: request.studentId,
          role: 'student',
          collegeId: alumni?.collegeId || '',
          date: new Date(),
          read: false,
          type: 'resume_approved',
          link: '/directory'
        });
        await newNotif.save();
      } catch (notifErr) {
        console.error('Failed to create resume approval notification:', notifErr);
      }
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

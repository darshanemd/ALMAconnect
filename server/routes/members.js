import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Member from '../models/Member.js';
import Notification from '../models/Notification.js';
import EmailLog from '../models/EmailLog.js';
import { sendMemberApprovalEmail } from '../services/emailService.js';
import { autoGraduateStudents, checkAndGraduateStudent } from '../services/graduationService.js';

const router = express.Router();
let lastAutoGraduationRun = 0;
const GRADUATION_CHECK_INTERVAL_MS = 60 * 1000;

// GET all members with filters & optional pagination
router.get('/', async (req, res) => {
  try {
    if (Date.now() - lastAutoGraduationRun > GRADUATION_CHECK_INTERVAL_MS) {
      lastAutoGraduationRun = Date.now();
      await autoGraduateStudents().catch(err => console.error('Auto graduation error in GET /members:', err));
    }

    const { role, status, collegeId, search, department, graduationYear, skills, page, limit } = req.query;
    const filter = {};

    if (collegeId) filter.collegeId = collegeId;
    if (status) filter.status = status;
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (graduationYear) filter.graduationYear = Number(graduationYear);
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillList };
    }

    if (search) {
      filter.$or = [
        { $text: { $search: search } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { currentCompany: { $regex: search, $options: 'i' } },
        { currentRole: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 0;

    if (limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      const total = await Member.countDocuments(filter);
      const members = await Member.find(filter)
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .skip(skip)
        .limit(limitNum);

      return res.json({
        data: members,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    }

    const members = await Member.find(filter).select('-password -resetPasswordToken -resetPasswordExpires');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.params.id });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST register manual alumni
router.post('/manual-alumni', async (req, res) => {
  console.log('Incoming manual-alumni body:', req.body);
  try {
    const emailLower = req.body.email ? req.body.email.toLowerCase().trim() : '';
    if (emailLower) {
      const existing = await Member.findOne({ email: emailLower });
      if (existing) {
        return res.status(400).json({ message: `A member with email "${req.body.email}" already exists.` });
      }
    }
    const newAlum = new Member({
      id: `alum-${Date.now()}`,
      joinedDate: new Date(),
      status: req.body.status || 'pending',
      role: 'alumni',
      ...req.body,
      ...(emailLower && { email: emailLower })
    });
    const saved = await newAlum.save();

    // Create Registration Confirmation Email Log
    try {
      const emailLog = new EmailLog({
        id: `email-reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recipientEmail: saved.email,
        recipientName: `${saved.firstName || ''} ${saved.lastName || ''}`.trim(),
        memberId: saved.id,
        subject: 'Registration Confirmation - AlumniConnect Portal',
        body: `Dear ${saved.firstName},\n\nThank you for registering on AlumniConnect! Your registration has been received and submitted to your institution administrator for credential verification.\n\nYou will receive an automated access email as soon as your profile is verified.\n\nBest regards,\nAlumniConnect Administration Team`,
        status: 'Delivered',
        sentAt: new Date(),
        collegeId: saved.collegeId || '',
        type: 'registration_received',
        tempCredentials: `Email: ${saved.email}`
      });
      await emailLog.save();
    } catch (eErr) {
      console.warn('Failed to record registration email log:', eErr);
    }

    // Create Notification for College Admin
    try {
      const candidateName = `${saved.firstName || ''} ${saved.lastName || ''}`.trim() || 'New Alumni';
      const adminNotif = new Notification({
        id: `notif-verify-req-${saved.id}`,
        title: 'Verification Request',
        content: `${candidateName} applied for registration. Needs verification.`,
        message: `${candidateName} applied for registration. Needs verification.`,
        date: new Date(),
        read: false,
        role: 'college_admin',
        collegeId: saved.collegeId || 'col-1',
        link: '/verification',
        type: 'verification'
      });
      await adminNotif.save();
    } catch (notifErr) {
      console.warn('Failed to create admin notification for alumni registration:', notifErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('Error in manual-alumni:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: `A member with email "${req.body.email}" already exists.` });
    }
    res.status(400).json({ message: err.message });
  }
});

// POST register manual student
router.post('/manual-student', async (req, res) => {
  try {
    const emailLower = req.body.email ? req.body.email.toLowerCase().trim() : '';
    if (emailLower) {
      const existing = await Member.findOne({ email: emailLower });
      if (existing) {
        return res.status(400).json({ message: `A member with email "${req.body.email}" already exists.` });
      }
    }
    const gradYearNum = req.body.graduationYear ? Number(req.body.graduationYear) : null;
    const isGraduated = gradYearNum && gradYearNum <= new Date().getFullYear();
    const assignedRole = isGraduated ? 'alumni' : (req.body.role || 'student');

    const newStudent = new Member({
      id: isGraduated ? `alum-${Date.now()}` : `stud-${Date.now()}`,
      joinedDate: new Date(),
      status: req.body.status || 'pending',
      ...req.body,
      role: assignedRole,
      ...(gradYearNum && { graduationYear: gradYearNum }),
      ...(emailLower && { email: emailLower })
    });
    const saved = await newStudent.save();

    // Create Registration Confirmation Email Log
    try {
      const isAutoActive = saved.status === 'active';
      const emailLog = new EmailLog({
        id: `email-reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recipientEmail: saved.email,
        recipientName: `${saved.firstName || ''} ${saved.lastName || ''}`.trim(),
        memberId: saved.id,
        subject: isAutoActive ? 'Welcome to AlumniConnect - Account Activated!' : 'Registration Confirmation - AlumniConnect Portal',
        body: isAutoActive 
          ? `Dear ${saved.firstName},\n\nYour institutional student record has been automatically pre-verified! Your account is now active.\n\nYou can log in directly at http://localhost:5173/login.\n\nBest regards,\nAlumniConnect Team`
          : `Dear ${saved.firstName},\n\nThank you for registering on AlumniConnect! Your registration has been received and submitted for verification.\n\nYou will receive a notification email once verified.\n\nBest regards,\nAlumniConnect Team`,
        status: 'Delivered',
        sentAt: new Date(),
        collegeId: saved.collegeId || '',
        type: isAutoActive ? 'verification' : 'registration_received',
        tempCredentials: `Roll Number: ${saved.rollNumber || 'N/A'}`
      });
      await emailLog.save();
    } catch (eErr) {
      console.warn('Failed to record student registration email log:', eErr);
    }

    // Create Notification for College Admin if pending
    if (saved.status === 'pending') {
      try {
        const candidateName = `${saved.firstName || ''} ${saved.lastName || ''}`.trim() || 'New Student';
        const adminNotif = new Notification({
          id: `notif-verify-req-${saved.id}`,
          title: 'Verification Request',
          content: `${candidateName} applied for registration. Needs verification.`,
          message: `${candidateName} applied for registration. Needs verification.`,
          date: new Date(),
          read: false,
          role: 'college_admin',
          collegeId: saved.collegeId || 'col-1',
          link: '/verification',
          type: 'verification'
        });
        await adminNotif.save();
      } catch (notifErr) {
        console.warn('Failed to create admin notification for student registration:', notifErr);
      }
    }

    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: `A member with email "${req.body.email}" already exists.` });
    }
    res.status(400).json({ message: err.message });
  }
});

// POST bulk import alumni
router.post('/bulk-alumni', async (req, res) => {
  try {
    const formatted = await Promise.all(req.body.map(async (a, i) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(a.password || 'demo123', salt);
      return {
        id: `alum-bulk-${Date.now()}-${i}`,
        joinedDate: new Date(),
        avatar: null,
        isMentor: false,
        mentorTopics: [],
        connections: [],
        ...a,
        password: hashedPassword
      };
    }));
    const saved = await Member.insertMany(formatted);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Helper to construct query for ID or ObjectId
function buildIdQuery(id) {
  const isObjId = mongoose.Types.ObjectId.isValid(id);
  return isObjId ? { $or: [{ id: id }, { _id: new mongoose.Types.ObjectId(id) }] } : { id: id };
}

function buildBulkIdQuery(ids) {
  const objectIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));
  return {
    $or: [
      { id: { $in: ids } },
      { _id: { $in: objectIds } }
    ]
  };
}

// PUT bulk verify members
router.put('/bulk-verify', async (req, res) => {
  try {
    const { ids, emailOptions } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No member IDs provided' });
    }

    const query = buildBulkIdQuery(ids);

    await Member.updateMany(
      query,
      { $set: { isVerified: true, status: 'active' } }
    );

    const updatedMembers = await Member.find(query);

    // Create notifications for each verified member
    const notifs = updatedMembers.map((m, idx) => ({
      id: `notif-verify-${Date.now()}-${idx}`,
      title: 'Account Verified',
      content: 'Your profile has been successfully verified! Welcome to AlumniConnect.',
      message: 'Your profile has been successfully verified! Welcome to AlumniConnect.',
      userId: m.id,
      role: m.role,
      date: new Date(),
      read: false
    }));

    if (notifs.length > 0) {
      await Notification.insertMany(notifs).catch(err => console.error('Bulk notif insert error:', err));
    }

    // Dispatch real Gmail verification emails with credentials
    const emailLogs = [];
    if (emailOptions?.sendEmail !== false) {
      for (const m of updatedMembers) {
        try {
          const emailResult = await sendMemberApprovalEmail({
            to: m.email,
            name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Member',
            collegeName: 'AlumniConnect',
            tempPassword: m.password || 'demo123',
            rollNumber: m.rollNumber || '',
            loginUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`,
            customSubject: emailOptions?.subject,
            customBody: emailOptions?.body
          });
          if (emailResult?.log) emailLogs.push(emailResult.log);
        } catch (emErr) {
          console.error(`[BulkVerify] Error sending email to ${m.email}:`, emErr.message);
        }
      }
    }

    // Mark admin verification request notifications as read
    await Notification.updateMany(
      { 
        role: 'college_admin',
        $or: [
          { id: { $in: ids.map(id => `notif-verify-req-${id}`) } },
          ...updatedMembers.map(m => ({ content: new RegExp(m.firstName, 'i') }))
        ]
      },
      { $set: { read: true } }
    ).catch(() => {});

    res.json({ 
      message: `Successfully verified ${updatedMembers.length} members`, 
      members: updatedMembers,
      emailLogs 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT bulk reject members
router.put('/bulk-reject', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No member IDs provided' });
    }

    const query = buildBulkIdQuery(ids);

    await Member.updateMany(
      query,
      { $set: { status: 'rejected' } }
    );

    const updatedMembers = await Member.find(query);
    res.json({ message: `Successfully rejected ${updatedMembers.length} members`, members: updatedMembers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update member details
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    const updated = await Member.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: updateData },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Member not found' });
    const finalMember = await checkAndGraduateStudent(updated);
    res.json(finalMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT verify member
router.put('/:id/verify', async (req, res) => {
  try {
    const updated = await Member.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: { isVerified: true, status: 'active' } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Member not found' });

    // Create verification notification & email log
    try {
      const newNotif = new Notification({
        id: `notif-verify-${Date.now()}`,
        title: 'Account Verified',
        content: 'Your profile has been successfully verified! Welcome to AlumniConnect.',
        message: 'Your profile has been successfully verified! Welcome to AlumniConnect.',
        userId: updated.id,
        role: updated.role,
        date: new Date(),
        read: false
      });
      await newNotif.save();

      // Dispatch real Gmail verification email
      try {
        await sendMemberApprovalEmail({
          to: updated.email,
          name: `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || 'Member',
          collegeName: 'AlumniConnect',
          tempPassword: updated.password || 'demo123',
          rollNumber: updated.rollNumber || '',
          loginUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`
        });
      } catch (eErr) {
        console.error(`[Verify] Failed to dispatch email to ${updated.email}:`, eErr.message);
      }

      // Mark admin verification request notification as read
      await Notification.updateMany(
        { 
          role: 'college_admin',
          $or: [
            { id: `notif-verify-req-${updated.id}` },
            { content: new RegExp(updated.firstName, 'i') }
          ]
        },
        { $set: { read: true } }
      ).catch(() => {});
    } catch (notifErr) {
      console.error('Failed to create verification notification/email:', notifErr);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT reject member
router.put('/:id/reject', async (req, res) => {
  try {
    const updated = await Member.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: { status: 'rejected' } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Member not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE member
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Member.findOneAndDelete(buildIdQuery(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

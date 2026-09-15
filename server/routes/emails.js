import express from 'express';
import EmailLog from '../models/EmailLog.js';
import { getSmtpStatus, sendTestEmail, sendMemberApprovalEmail } from '../services/emailService.js';

const router = express.Router();

// GET Gmail SMTP Configuration Status
router.get('/smtp-status', (req, res) => {
  try {
    const status = getSmtpStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Live Test Email via Gmail SMTP
router.post('/test-smtp', async (req, res) => {
  const { to } = req.body;
  if (!to || !to.includes('@')) {
    return res.status(400).json({ message: 'Valid recipient email address is required for test dispatch.' });
  }

  try {
    const result = await sendTestEmail({ to: to.trim() });
    res.json({
      success: true,
      message: `Test email successfully sent to ${to} via Gmail SMTP! Check your inbox.`,
      result
    });
  } catch (err) {
    console.error('[Emails Route] SMTP test error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Failed to dispatch test email. Please check your Gmail credentials in server/.env.' 
    });
  }
});

// GET all dispatched emails
router.get('/', async (req, res) => {
  try {
    const { collegeId, memberId, recipientEmail } = req.query;
    const filter = {};
    if (collegeId) filter.collegeId = collegeId;
    if (memberId) filter.memberId = memberId;
    if (recipientEmail) filter.recipientEmail = recipientEmail.toLowerCase();

    const logs = await EmailLog.find(filter).sort({ sentAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST dispatch new confirmation/credentials email log
router.post('/dispatch', async (req, res) => {
  try {
    const { 
      recipientEmail, 
      recipientName, 
      memberId, 
      subject, 
      body, 
      collegeId, 
      type, 
      tempCredentials,
      collegeName,
      loginUrl,
      rollNumber
    } = req.body;

    const result = await sendMemberApprovalEmail({
      to: (recipientEmail || '').toLowerCase().trim(),
      name: recipientName || 'Member',
      collegeName: collegeName || 'AlumniConnect',
      tempPassword: tempCredentials || 'demo123',
      rollNumber: rollNumber || '',
      loginUrl: loginUrl || 'http://localhost:5173/login',
      customSubject: subject,
      customBody: body
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

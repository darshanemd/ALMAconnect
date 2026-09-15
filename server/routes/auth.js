import express from 'express';
import crypto from 'crypto';
import Member from '../models/Member.js';
import { sendTokenResponse } from '../utils/jwt.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import { 
  validateLogin, 
  validateForgotPassword, 
  validateResetPassword 
} from '../middleware/validator.js';
import { checkAndGraduateStudent } from '../services/graduationService.js';

const router = express.Router();
const activeResetRequests = new Map(); // email -> timestamp for synchronous debounce

// POST /api/auth/login
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Member.findOne({ 
      email: email.toLowerCase(), 
      status: 'active' 
    });
    
    if (user && await user.comparePassword(password)) {
      const activeUser = await checkAndGraduateStudent(user);
      return sendTokenResponse(res, activeUser, 200);
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me (Verify active session)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await Member.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activeUser = await checkAndGraduateStudent(user);

    res.json({
      id: activeUser.id,
      email: activeUser.email,
      firstName: activeUser.firstName || '',
      lastName: activeUser.lastName || '',
      name: `${activeUser.firstName || ''} ${activeUser.lastName || ''}`.trim(),
      phone: activeUser.phone || '',
      role: activeUser.role,
      collegeId: activeUser.collegeId,
      department: activeUser.department || '',
      graduationYear: activeUser.graduationYear || null,
      degree: activeUser.degree || '',
      currentCompany: activeUser.currentCompany || '',
      currentRole: activeUser.currentRole || '',
      location: activeUser.location || '',
      skills: activeUser.skills || [],
      bio: activeUser.bio || '',
      linkedin: activeUser.linkedin || '',
      isVerified: activeUser.isVerified || false,
      isMentor: activeUser.isMentor || false,
      rollNumber: activeUser.rollNumber || '',
      twoFactorEnabled: activeUser.twoFactorEnabled || false,
      privacy: activeUser.privacy || {
        directoryVisibility: 'public',
        hidePhone: false,
        hideEmail: false,
        openToMentor: true,
        openToJobs: true
      },
      notifications: activeUser.notifications || {
        directMessages: true,
        connectionRequests: true,
        circulars: true,
        jobAlerts: true,
        eventReminders: true
      },
      avatar: activeUser.avatar,
      avatarUrl: activeUser.avatar || null,
      resumeUrl: activeUser.resumeUrl || '',
      resumeType: activeUser.resumeType || 'pdf',
      resumeName: activeUser.resumeName || ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/forgot-password (Dispatches Gmail OTP or reset token)
router.post('/forgot-password', validateForgotPassword, async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = (email || '').toLowerCase().trim();

  // Synchronous lock: Prevent duplicate emails from rapid / concurrent clicks within 15 seconds
  const lastRequestTime = activeResetRequests.get(normalizedEmail);
  if (lastRequestTime && (Date.now() - lastRequestTime) < 15000) {
    return res.json({
      success: true,
      message: `A 6-digit password reset OTP was already dispatched to ${normalizedEmail}. Please check your inbox.`,
      deliveryStatus: 'Delivered (Gmail SMTP)',
      sentViaGmail: true,
      expiresIn: '15 minutes'
    });
  }
  activeResetRequests.set(normalizedEmail, Date.now());

  try {
    const user = await Member.findOne({ email: normalizedEmail });
    if (!user) {
      activeResetRequests.delete(normalizedEmail);
      return res.status(404).json({ 
        success: false,
        message: `No registered account found with "${email}". Please verify the email address or register first.`
      });
    }

    // If the user has an active OTP issued within the last 5 minutes, reuse the same OTP code
    // so any re-sent emails contain the EXACT SAME 6-digit code without invalidating the previous one.
    let otp;
    let resetToken;
    const isRecentOtp = Boolean(
      user.resetPasswordOTP && 
      user.resetPasswordExpires && 
      user.resetPasswordExpires > new Date() &&
      (user.resetPasswordExpires.getTime() - Date.now() > 10 * 60 * 1000)
    );

    if (isRecentOtp) {
      otp = user.resetPasswordOTP;
      resetToken = user.resetPasswordToken || crypto.randomBytes(32).toString('hex');
    } else {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      resetToken = crypto.randomBytes(32).toString('hex');
    }
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // Refresh 15 mins validity
    await user.save();

    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Member';
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: userName,
      otp,
      resetToken,
      expiresIn: '15 minutes'
    });

    res.json({
      success: true,
      message: emailResult.sent 
        ? `A 6-digit password reset OTP has been dispatched to ${user.email} via Gmail SMTP. Please check your inbox.`
        : `A password reset OTP has been generated for ${user.email}. (Demo Fallback Mode)`,
      deliveryStatus: emailResult.deliveryStatus,
      sentViaGmail: emailResult.sent,
      resetToken: emailResult.sent ? undefined : resetToken,
      otp: emailResult.sent ? undefined : otp, // Only exposed if SMTP is not configured
      expiresIn: '15 minutes'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/verify-otp (Verify 6-digit OTP code)
router.post('/verify-otp', async (req, res) => {
  const { email, otp, token } = req.body;
  try {
    let user;
    if (email && otp) {
      user = await Member.findOne({
        email: email.toLowerCase().trim(),
        resetPasswordOTP: otp.trim(),
        resetPasswordExpires: { $gt: new Date() }
      });
    } else if (token) {
      user = await Member.findOne({
        resetPasswordToken: token.trim(),
        resetPasswordExpires: { $gt: new Date() }
      });
    } else if (otp) {
      user = await Member.findOne({
        resetPasswordOTP: otp.trim(),
        resetPasswordExpires: { $gt: new Date() }
      });
    } else {
      return res.status(400).json({ message: 'Please provide an OTP or reset token to verify.' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired 6-digit OTP code.' });
    }

    res.json({ 
      success: true, 
      message: 'OTP verified successfully.',
      token: user.resetPasswordToken,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/reset-password (Completes reset with OTP/Token + new password)
router.post('/reset-password', validateResetPassword, async (req, res) => {
  const { token, otp, email, newPassword } = req.body;
  try {
    let user;
    const code = (otp || token || '').trim();
    if (!code) {
      return res.status(400).json({ message: 'A valid OTP code or reset token is required.' });
    }

    if (email) {
      user = await Member.findOne({
        email: email.toLowerCase().trim(),
        $or: [
          { resetPasswordOTP: code },
          { resetPasswordToken: code }
        ],
        resetPasswordExpires: { $gt: new Date() }
      });
    } else {
      user = await Member.findOne({
        $or: [
          { resetPasswordOTP: code },
          { resetPasswordToken: code }
        ],
        resetPasswordExpires: { $gt: new Date() }
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired 6-digit OTP code. Please request a new one.' });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully! You can now log in with your new password.' 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/change-password (Authenticated in-app password update)
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
  }

  try {
    const user = await Member.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect. Please try again.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Your password has been changed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
  res.json({ message: 'Logged out successfully.' });
});

export default router;

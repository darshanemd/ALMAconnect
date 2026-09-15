import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_projectalma_jwt_key_2026!#';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate cryptographically signed JWT for a member
 */
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    collegeId: user.collegeId
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token string
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Set secure HttpOnly cookie and return standard JSON response
 */
export function sendTokenResponse(res, user, statusCode = 200, additionalData = {}) {
  const token = generateToken(user);

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(statusCode).json({
    id: user.id,
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    phone: user.phone || '',
    role: user.role,
    collegeId: user.collegeId,
    department: user.department || '',
    graduationYear: user.graduationYear || null,
    degree: user.degree || '',
    currentCompany: user.currentCompany || '',
    currentRole: user.currentRole || '',
    location: user.location || '',
    skills: user.skills || [],
    bio: user.bio || '',
    linkedin: user.linkedin || '',
    isVerified: user.isVerified || false,
    isMentor: user.isMentor || false,
    rollNumber: user.rollNumber || '',
    twoFactorEnabled: user.twoFactorEnabled || false,
    privacy: user.privacy || {
      directoryVisibility: 'public',
      hidePhone: false,
      hideEmail: false,
      openToMentor: true,
      openToJobs: true
    },
    notifications: user.notifications || {
      directMessages: true,
      connectionRequests: true,
      circulars: true,
      jobAlerts: true,
      eventReminders: true
    },
    avatar: user.avatar || null,
    avatarUrl: user.avatar || null,
    resumeUrl: user.resumeUrl || '',
    resumeType: user.resumeType || 'pdf',
    resumeName: user.resumeName || '',
    token,
    ...additionalData
  });
}

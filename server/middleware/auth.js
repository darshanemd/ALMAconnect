import { verifyToken } from '../utils/jwt.js';
import Member from '../models/Member.js';

/**
 * Authentication middleware: verifies JWT from cookie or Bearer token header
 */
export async function authenticateToken(req, res, next) {
  let token = req.cookies?.auth_token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }

  try {
    const member = await Member.findOne({ id: decoded.id, status: 'active' });
    if (!member) {
      return res.status(401).json({ message: 'User account not found or deactivated.' });
    }

    req.user = {
      id: member.id,
      email: member.email,
      role: member.role,
      collegeId: member.collegeId,
      name: `${member.firstName} ${member.lastName}`
    };

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Authentication verification failed: ' + err.message });
  }
}

/**
 * Role-Based Access Control (RBAC) middleware
 * @param {string[]} roles Array of allowed roles (e.g. ['college_admin', 'alumni'])
 */
export function requireRole(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource. Required: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
}

/**
 * Multi-tenant college isolation check
 */
export function requireSameCollege(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const targetCollegeId = req.params.collegeId || req.query.collegeId || req.body.collegeId;
  if (targetCollegeId && req.user.collegeId && req.user.collegeId !== targetCollegeId && req.user.role !== 'college_admin') {
    return res.status(403).json({ message: 'Forbidden. Cross-college access is restricted.' });
  }

  next();
}

/**
 * Optional authentication: decodes user if token is present, but doesn't block unauthenticated requests
 */
export function optionalAuth(req, res, next) {
  let token = req.cookies?.auth_token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
}

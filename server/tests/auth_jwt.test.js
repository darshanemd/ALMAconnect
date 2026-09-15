import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { requireRole } from '../middleware/auth.js';

describe('JWT Authentication & Token Security', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test.student@demo.com',
    role: 'student',
    collegeId: 'college-1'
  };

  it('should generate a valid cryptographically signed JWT token', () => {
    const token = generateToken(mockUser);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // Header.Payload.Signature
  });

  it('should verify and decode valid JWT payload accurately', () => {
    const token = generateToken(mockUser);
    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(mockUser.id);
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
    expect(decoded.collegeId).toBe(mockUser.collegeId);
  });

  it('should return null when attempting to verify a forged or invalid token', () => {
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake_signature';
    const decoded = verifyToken(forgedToken);
    expect(decoded).toBeNull();
  });

  it('should return null for malformed token string', () => {
    const decoded = verifyToken('not_a_jwt_token_at_all');
    expect(decoded).toBeNull();
  });
});

describe('Role-Based Access Control (RBAC) Middleware', () => {
  it('should allow authorized role to pass next()', () => {
    const req = { user: { role: 'college_admin' } };
    let calledNext = false;
    const res = {};
    const next = () => { calledNext = true; };

    const middleware = requireRole(['college_admin']);
    middleware(req, res, next);

    expect(calledNext).toBe(true);
  });

  it('should reject unauthorized role with 403 status code', () => {
    const req = { user: { role: 'student' } };
    let statusSet = null;
    let jsonSent = null;

    const res = {
      status: (code) => {
        statusSet = code;
        return {
          json: (data) => { jsonSent = data; }
        };
      }
    };
    const next = () => {};

    const middleware = requireRole(['college_admin']);
    middleware(req, res, next);

    expect(statusSet).toBe(403);
    expect(jsonSent.message).toContain('Forbidden');
  });
});

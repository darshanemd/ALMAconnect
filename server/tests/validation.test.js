import { describe, it, expect } from 'vitest';
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  jobSchema, 
  circularSchema, 
  complaintSchema 
} from '../middleware/validator.js';

describe('Zod Request Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should pass valid login payload', () => {
      const valid = { email: 'student@demo.com', password: 'password123' };
      const parsed = loginSchema.parse(valid);
      expect(parsed.email).toBe('student@demo.com');
    });

    it('should throw for invalid email format', () => {
      expect(() => loginSchema.parse({ email: 'invalid-email', password: '123' })).toThrow();
    });
  });

  describe('forgotPasswordSchema & resetPasswordSchema', () => {
    it('should pass valid email for forgot password', () => {
      const valid = { email: 'user@alumni.org' };
      const parsed = forgotPasswordSchema.parse(valid);
      expect(parsed.email).toBe('user@alumni.org');
    });

    it('should reject short password in resetPasswordSchema', () => {
      expect(() => resetPasswordSchema.parse({ token: 'abc123token', newPassword: '123' })).toThrow();
    });

    it('should pass strong password in resetPasswordSchema', () => {
      const valid = { token: 'validtoken32bytes', newPassword: 'securepassword123' };
      const parsed = resetPasswordSchema.parse(valid);
      expect(parsed.newPassword).toBe('securepassword123');
    });
  });

  describe('jobSchema', () => {
    it('should pass valid job payload with defaults', () => {
      const payload = {
        title: 'Senior React Developer',
        company: 'TechCorp',
        location: 'Bengaluru, India'
      };
      const parsed = jobSchema.parse(payload);
      expect(parsed.title).toBe('Senior React Developer');
      expect(parsed.type).toBe('Full-time');
    });

    it('should reject empty job title or company', () => {
      expect(() => jobSchema.parse({ title: '', company: '', location: '' })).toThrow();
    });
  });

  describe('circularSchema & complaintSchema', () => {
    it('should validate circular announcement payload', () => {
      const payload = {
        title: 'Campus Placement Drive 2026',
        content: 'Top tier tech companies are visiting campus next Monday.',
        category: 'Placement',
        priority: 'High'
      };
      const parsed = circularSchema.parse(payload);
      expect(parsed.title).toBe('Campus Placement Drive 2026');
      expect(parsed.priority).toBe('High');
    });

    it('should reject complaint description under 10 chars', () => {
      expect(() => complaintSchema.parse({
        title: 'Broken lab equipment',
        category: 'Infrastructure',
        description: 'Broken'
      })).toThrow();
    });
  });
});

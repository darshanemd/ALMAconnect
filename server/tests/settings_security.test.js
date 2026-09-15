import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

describe('Password Security & Change Validation', () => {
  it('should verify current password hashing comparison', async () => {
    const originalPassword = 'demoPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(originalPassword, salt);

    const isMatch = await bcrypt.compare(originalPassword, hash);
    expect(isMatch).toBe(true);

    const wrongMatch = await bcrypt.compare('wrongPassword', hash);
    expect(wrongMatch).toBe(false);
  });

  it('should enforce password length requirement of at least 6 characters', () => {
    const validateNewPassword = (pass) => {
      if (!pass || pass.length < 6) return false;
      return true;
    };

    expect(validateNewPassword('12345')).toBe(false);
    expect(validateNewPassword('123456')).toBe(true);
    expect(validateNewPassword('strongPass2026!')).toBe(true);
  });
});

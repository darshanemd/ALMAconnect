import { z } from 'zod';

/**
 * Generic middleware generator for Zod schemas
 */
export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed; // Use sanitized / coerced values
      next();
    } catch (error) {
      const issues = error?.issues || error?.errors;
      if (Array.isArray(issues) && issues.length > 0) {
        const errorMessages = issues
          .map(err => `${(Array.isArray(err.path) && err.path.length > 0) ? err.path.join('.') : 'field'}: ${err.message}`)
          .join(', ');
        return res.status(400).json({ 
          message: errorMessages || 'Validation error.',
          errors: issues 
        });
      }
      return res.status(400).json({ message: error?.message || 'Invalid request data.' });
    }
  };
}

// ======================== ZOD SCHEMAS ========================

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('A valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long').default('demo123'),
  role: z.enum(['student', 'alumni', 'college_admin'], {
    errorMap: () => ({ message: 'Role must be student, alumni, or college_admin' })
  }),
  collegeId: z.string().optional().default('college-1'),
  department: z.string().optional().default('Computer Science'),
  graduationYear: z.coerce.number().optional().default(new Date().getFullYear()),
  degree: z.string().optional().default('B.Tech'),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  skills: z.array(z.string()).optional().default([]),
  bio: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  rollNumber: z.string().optional().default(''),
  status: z.enum(['pending', 'active', 'rejected']).optional().default('pending'),
  isVerified: z.boolean().optional().default(false)
});

export const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Valid registered email address is required')
});

export const resetPasswordSchema = z.object({
  token: z.string().optional(),
  otp: z.string().optional(),
  email: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long')
}).refine(data => !!(data.token || data.otp), {
  message: 'Either 6-digit OTP code or reset token is required'
});

export const jobSchema = z.object({
  title: z.string().trim().min(2, 'Job title is required'),
  company: z.string().trim().min(1, 'Company name is required'),
  location: z.string().trim().min(1, 'Location is required'),
  type: z.string().optional().default('Full-time'),
  experience: z.string().optional().default('0-2 years'),
  salary: z.string().optional().default(''),
  department: z.string().optional().default('Engineering'),
  description: z.string().optional().default(''),
  requirements: z.array(z.string()).optional().default([]),
  applyUrl: z.string().optional().default(''),
  pdfUrl: z.string().optional().default(''),
  pdfName: z.string().optional().default(''),
  collegeId: z.string().optional().default('col-1'),
  deadline: z.string().optional().default(''),
  contactEmail: z.string().optional().default('')
}).passthrough();

export const eventSchema = z.object({
  title: z.string().trim().min(2, 'Event title is required'),
  date: z.string().min(1, 'Event date is required'),
  location: z.string().trim().min(1, 'Event location is required'),
  description: z.string().optional().default(''),
  category: z.string().optional().default('Networking'),
  type: z.string().optional().default('offline'),
  maxAttendees: z.coerce.number().optional().default(100)
}).passthrough();

export const circularSchema = z.object({
  title: z.string().trim().min(2, 'Circular title is required'),
  content: z.string().trim().min(1, 'Circular content is required'),
  category: z.string().optional().default('General'),
  targetAudience: z.string().optional().default('All'),
  attachmentName: z.string().optional().default(''),
  attachmentUrl: z.string().optional().default(''),
  postedBy: z.string().optional().default('College Admin'),
  postedByCollegeId: z.string().optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional().default('Medium'),
  targetRole: z.string().optional().default('all')
}).passthrough();

export const complaintSchema = z.object({
  title: z.string().trim().min(3, 'Complaint title is required'),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters')
}).passthrough();

export const messageSchema = z.object({
  from: z.string().min(1, 'Sender ID is required'),
  to: z.string().min(1, 'Recipient ID is required'),
  text: z.string().optional().default(''),
  image: z.string().nullable().optional()
});

// Backward-compatible named middleware exports
export const validateRegister = validateRequest(registerSchema);
export const validateLogin = validateRequest(loginSchema);
export const validateForgotPassword = validateRequest(forgotPasswordSchema);
export const validateResetPassword = validateRequest(resetPasswordSchema);
export const validateJobPayload = validateRequest(jobSchema);
export const validateEventPayload = validateRequest(eventSchema);
export const validateCircularPayload = validateRequest(circularSchema);
export const validateComplaintPayload = validateRequest(complaintSchema);
export const validateMessagePayload = validateRequest(messageSchema);

import { z } from 'zod';

/**
 * Simple sanitization functions
 */
const sanitizeString = (input: string): string => {
  if (!input) return '';
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Student validation schemas
 */

// Student ID parameter validation
export const studentIdParamSchema = z.object({
  id: z
    .string()
    .min(1, 'Student ID is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Invalid student ID format'),
});

export type StudentIdParam = z.infer<typeof studentIdParamSchema>;

// Student profile update schema
export const updateStudentProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .transform(sanitizeString)
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .transform(sanitizeString)
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim())
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{8,20}$/, 'Invalid phone number format')
    .optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  parentPhone: z
    .string()
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{8,20}$/, 'Invalid parent phone number')
    .optional(),
  address: z.string().max(255, 'Address too long').transform(sanitizeString).optional(),
  emergencyContact: z
    .object({
      name: z.string().min(2, 'Emergency contact name required').max(50, 'Name too long').transform(sanitizeString),
      phone: z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{8,20}$/, 'Invalid emergency contact phone'),
      relationship: z.string().min(2, 'Relationship required').max(30, 'Relationship too long').transform(sanitizeString),
    })
    .optional(),
});

export type UpdateStudentProfileRequest = z.infer<typeof updateStudentProfileSchema>;

// Student creation schema (admin only)
export const createStudentSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .transform(sanitizeString),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .transform(sanitizeString),
  email: z
    .string()
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
  phoneNumber: z
    .string()
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{8,20}$/, 'Invalid phone number format')
    .optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  parentPhone: z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{8,20}$/, 'Invalid parent phone number'),
  address: z.string().max(255, 'Address too long').transform(sanitizeString),
  grade: z.string().min(1, 'Grade is required').max(20, 'Grade too long').transform(sanitizeString),
  section: z.string().min(1, 'Section is required').max(20, 'Section too long').transform(sanitizeString).optional(),
  rollNumber: z
    .string()
    .min(1, 'Roll number is required')
    .max(50, 'Roll number too long')
    .transform(sanitizeString)
    .optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name required').max(50, 'Name too long').transform(sanitizeString),
    phone: z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{8,20}$/, 'Invalid emergency contact phone'),
    relationship: z.string().min(2, 'Relationship required').max(30, 'Relationship too long').transform(sanitizeString),
  }),
});

export type CreateStudentRequest = z.infer<typeof createStudentSchema>;

// Course enrollment schema
export const enrollCourseSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  sectionId: z.string().min(1, 'Section ID is required').optional(),
  enrollmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .default(new Date().toISOString().split('T')[0]),
});

export type EnrollCourseRequest = z.infer<typeof enrollCourseSchema>;

// Assignment submission schema
export const submitAssignmentSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  submissionText: z.string().max(5000, 'Submission text too long').transform(sanitizeString).optional(),
  attachments: z
    .array(
      z.object({
        fileName: z.string().min(1, 'File name required').max(255, 'File name too long'),
        fileUrl: z.string().url('Invalid file URL'),
        fileSize: z.number().positive('File size must be positive'),
        mimeType: z.string().min(1, 'MIME type required'),
      }),
    )
    .max(10, 'Too many attachments')
    .optional(),
  submissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, 'Invalid date format')
    .optional()
    .default(new Date().toISOString()),
});

export type SubmitAssignmentRequest = z.infer<typeof submitAssignmentSchema>;

// Grade query schema
export const gradeQuerySchema = z.object({
  subject: z.string().min(1, 'Subject is required').transform(sanitizeString).optional(),
  semester: z.string().min(1, 'Semester is required').transform(sanitizeString).optional(),
  year: z.coerce
    .number()
    .int()
    .min(2020)
    .max(new Date().getFullYear() + 1)
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type GradeQueryParams = z.infer<typeof gradeQuerySchema>;

// Attendance query schema
export const attendanceQuerySchema = z.object({
  courseId: z.string().min(1, 'Course ID is required').optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type AttendanceQueryParams = z.infer<typeof attendanceQuerySchema>;

// Student search schema (admin/teacher)
export const studentSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Query too long').transform(sanitizeString),
  grade: z.string().min(1, 'Grade filter').transform(sanitizeString).optional(),
  section: z.string().min(1, 'Section filter').transform(sanitizeString).optional(),
  course: z.string().min(1, 'Course filter').transform(sanitizeString).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['name', 'email', 'grade', 'createdAt', 'lastLogin']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type StudentSearchParams = z.infer<typeof studentSearchSchema>;

// Fee payment schema
export const feePaymentSchema = z.object({
  feeId: z.string().min(1, 'Fee ID is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'online']),
  transactionId: z
    .string()
    .min(1, 'Transaction ID required')
    .max(100, 'Transaction ID too long')
    .transform(sanitizeString)
    .optional(),
  notes: z.string().max(500, 'Notes too long').transform(sanitizeString).optional(),
});

export type FeePaymentRequest = z.infer<typeof feePaymentSchema>;

// Parent communication schema
export const parentCommunicationSchema = z.object({
  parentId: z.string().min(1, 'Parent ID is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long').transform(sanitizeString),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long').transform(sanitizeString),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal'),
  requiresResponse: z.boolean().optional().default(false),
});

export type ParentCommunicationRequest = z.infer<typeof parentCommunicationSchema>;

/**
 * Validation middleware helper for student routes
 */
export const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return async (req: any, res: any, next: any) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.validatedData = validatedData;
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Query parameter validation middleware
 */
export const createQueryValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return async (req: any, res: any, next: any) => {
    try {
      const validatedQuery = await schema.parseAsync(req.query);
      req.validatedQuery = validatedQuery;
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          code: 'QUERY_VALIDATION_ERROR',
          errors,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal query validation error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Parameter validation middleware
 */
export const createParamValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return async (req: any, res: any, next: any) => {
    try {
      const validatedParams = await schema.parseAsync(req.params);
      req.validatedParams = validatedParams;
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
        return res.status(400).json({
          success: false,
          message: 'Parameter validation failed',
          code: 'PARAM_VALIDATION_ERROR',
          errors,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal parameter validation error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

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
 * Teacher validation schemas
 */

// Teacher ID parameter validation
export const teacherIdParamSchema = z.object({
  id: z
    .string()
    .min(1, 'Teacher ID is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Invalid teacher ID format'),
});

export type TeacherIdParam = z.infer<typeof teacherIdParamSchema>;

// Teacher profile update schema
export const updateTeacherProfileSchema = z.object({
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
  department: z
    .string()
    .min(2, 'Department must be specified')
    .max(100, 'Department name too long')
    .transform(sanitizeString)
    .optional(),
  specialization: z.string().max(200, 'Specialization too long').transform(sanitizeString).optional(),
  qualification: z.string().max(300, 'Qualification too long').transform(sanitizeString).optional(),
  experience: z.number().int().min(0, 'Experience cannot be negative').max(50, 'Experience too high').optional(),
  bio: z.string().max(1000, 'Bio too long').transform(sanitizeString).optional(),
  officeHours: z.string().max(500, 'Office hours description too long').transform(sanitizeString).optional(),
  availability: z
    .object({
      monday: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format')).optional(),
      tuesday: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format')).optional(),
      wednesday: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format')).optional(),
      thursday: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format')).optional(),
      friday: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format')).optional(),
      saturday: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format')).optional(),
      sunday: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format')).optional(),
    })
    .optional(),
});

export type UpdateTeacherProfileRequest = z.infer<typeof updateTeacherProfileSchema>;

// Teacher creation schema (admin only)
export const createTeacherSchema = z.object({
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
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{8,20}$/, 'Invalid phone number format'),
  department: z
    .string()
    .min(2, 'Department must be specified')
    .max(100, 'Department name too long')
    .transform(sanitizeString),
  specialization: z.string().max(200, 'Specialization too long').transform(sanitizeString),
  qualification: z.string().min(1, 'Qualification is required').max(300, 'Qualification too long').transform(sanitizeString),
  experience: z.number().int().min(0, 'Experience cannot be negative').max(50, 'Experience too high'),
  employeeId: z.string().min(1, 'Employee ID is required').max(50, 'Employee ID too long').transform(sanitizeString),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Hire date must be in YYYY-MM-DD format'),
  salary: z.number().positive('Salary must be positive').optional(),
});

export type CreateTeacherRequest = z.infer<typeof createTeacherSchema>;

// Course assignment schema
export const assignCourseSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  sectionId: z.string().min(1, 'Section ID is required').optional(),
  semester: z.string().min(1, 'Semester is required').transform(sanitizeString),
  year: z
    .number()
    .int()
    .min(2020)
    .max(new Date().getFullYear() + 2),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
});

export type AssignCourseRequest = z.infer<typeof assignCourseSchema>;

// Grade submission schema
export const submitGradeSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  assessmentType: z.enum(['assignment', 'quiz', 'exam', 'project', 'participation']),
  assessmentTitle: z.string().min(1, 'Assessment title is required').max(200, 'Title too long').transform(sanitizeString),
  score: z.number().min(0, 'Score cannot be negative').max(100, 'Score cannot exceed 100'),
  maxScore: z.number().positive('Max score must be positive').default(100),
  gradingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .default(new Date().toISOString().split('T')[0]),
  comments: z.string().max(1000, 'Comments too long').transform(sanitizeString).optional(),
  weightage: z.number().min(0).max(100, 'Weightage cannot exceed 100%').optional(),
});

export type SubmitGradeRequest = z.infer<typeof submitGradeSchema>;

// Attendance recording schema
export const recordAttendanceSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  attendanceData: z
    .array(
      z.object({
        studentId: z.string().min(1, 'Student ID is required'),
        status: z.enum(['present', 'absent', 'late', 'excused']),
        arrivalTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
          .optional(),
        notes: z.string().max(200, 'Notes too long').transform(sanitizeString).optional(),
      }),
    )
    .min(1, 'At least one attendance record required'),
  sessionType: z.enum(['lecture', 'lab', 'tutorial', 'seminar']).optional().default('lecture'),
  duration: z.number().positive('Duration must be positive').optional(), // in minutes
});

export type RecordAttendanceRequest = z.infer<typeof recordAttendanceSchema>;

// Assignment creation schema
export const createAssignmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(1, 'Assignment title is required').max(200, 'Title too long').transform(sanitizeString),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long').transform(sanitizeString),
  instructions: z.string().max(5000, 'Instructions too long').transform(sanitizeString).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, 'Invalid due date format'),
  maxScore: z.number().positive('Max score must be positive').default(100),
  submissionType: z.enum(['file', 'text', 'link', 'both']).default('file'),
  allowedFileTypes: z.array(z.string()).optional(),
  maxFileSize: z.number().positive('Max file size must be positive').optional(), // in MB
  isGroupAssignment: z.boolean().optional().default(false),
  maxGroupSize: z.number().int().min(2).max(10).optional(),
  rubric: z.string().max(3000, 'Rubric too long').transform(sanitizeString).optional(),
});

export type CreateAssignmentRequest = z.infer<typeof createAssignmentSchema>;

// Teacher search schema (admin)
export const teacherSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Query too long').transform(sanitizeString),
  department: z.string().min(1, 'Department filter').transform(sanitizeString).optional(),
  specialization: z.string().min(1, 'Specialization filter').transform(sanitizeString).optional(),
  experienceMin: z.coerce.number().int().min(0).optional(),
  experienceMax: z.coerce.number().int().min(0).optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['name', 'email', 'department', 'experience', 'hireDate']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type TeacherSearchParams = z.infer<typeof teacherSearchSchema>;

// Class schedule schema
export const scheduleClassSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  classTitle: z.string().min(1, 'Class title is required').max(200, 'Title too long').transform(sanitizeString),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'),
  location: z.string().min(1, 'Location is required').max(100, 'Location name too long').transform(sanitizeString),
  classType: z.enum(['lecture', 'lab', 'tutorial', 'seminar', 'workshop']),
  description: z.string().max(1000, 'Description too long').transform(sanitizeString).optional(),
  resources: z
    .array(
      z.object({
        type: z.enum(['document', 'video', 'link', 'image']),
        name: z.string().min(1, 'Resource name required').max(200, 'Name too long'),
        url: z.string().url('Invalid resource URL'),
      }),
    )
    .optional(),
  isRecurring: z.boolean().optional().default(false),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurringEndDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
});

export type ScheduleClassRequest = z.infer<typeof scheduleClassSchema>;

/**
 * Validation middleware helper for teacher routes
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

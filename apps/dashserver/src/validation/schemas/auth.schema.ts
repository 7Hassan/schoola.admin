import { z } from 'zod';
import { UserRole } from '@schoola/types/src';

/**
 * Simple sanitization functions (without external dependencies)
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
 * Custom Zod refinements for validation
 */

// Email validation refinement
const emailRefinement = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email is too long')
  .refine((email) => {
    // Additional email validation rules
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return false;

    const localPart = emailParts[0];
    const domain = emailParts[1];

    if (!localPart || !domain) return false;

    // Local part validation
    if (localPart.length > 64) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;

    // Domain validation
    if (domain.length > 253) return false;
    if (!domain.includes('.')) return false;

    return true;
  }, 'Invalid email format')
  .transform((email) => email.toLowerCase().trim());

// Password validation with comprehensive rules
const passwordRefinement = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password is too long')
  .refine((password) => /[a-z]/.test(password), 'Password must contain at least one lowercase letter')
  .refine((password) => /[A-Z]/.test(password), 'Password must contain at least one uppercase letter')
  .refine((password) => /\d/.test(password), 'Password must contain at least one number')
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), 'Password must contain at least one special character')
  .refine((password) => {
    // Check for common weak passwords
    const weakPasswords = ['password', '12345678', '123456789', 'qwerty', 'admin', 'letmein'];
    return !weakPasswords.includes(password.toLowerCase());
  }, 'Password is too common and easily guessed')
  .refine((password) => {
    // Check for repeated characters
    return !/(.)\1{2,}/.test(password);
  }, 'Password should not contain repeated characters')
  .refine((password) => {
    // Check for sequential patterns
    return !/012|123|234|345|456|567|678|789|890/.test(password);
  }, 'Password should not contain sequential numbers');

// Name validation with sanitization
const nameRefinement = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name must be less than 50 characters')
  .refine((name) => {
    // Allow only letters, spaces, hyphens, apostrophes, and some international characters
    return /^[a-zA-ZÀ-ÿ\u0100-\u017f\u0180-\u024f\u1e00-\u1eff\s\-']+$/.test(name.trim());
  }, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform((name) => {
    // Sanitize and format name
    const sanitized = sanitizeString(name.trim());
    // Capitalize first letter of each word
    return sanitized.replace(/\b\w/g, (char: string) => char.toUpperCase());
  });

// Phone number validation (optional)
const phoneRefinement = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone) return true; // Optional field

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  }, 'Phone number must be between 10 and 15 digits')
  .refine((phone) => {
    if (!phone) return true;

    // Basic international format validation
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,20}$/;
    return phoneRegex.test(phone);
  }, 'Invalid phone number format')
  .transform((phone) => {
    if (!phone) return undefined;
    return sanitizeString(phone.trim());
  });

// Role validation
const roleRefinement = z
  .nativeEnum(UserRole, {
    message: 'Invalid role specified',
  })
  .optional()
  .default(UserRole.Student);

/**
 * Auth Schema Definitions
 */

// Login request schema
export const loginSchema = z.object({
  email: emailRefinement,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginRequest = z.infer<typeof loginSchema>;

// Registration request schema
export const registerSchema = z.object({
  email: emailRefinement,
  password: passwordRefinement,
  firstName: nameRefinement,
  lastName: nameRefinement,
  phone: phoneRefinement,
  role: roleRefinement,
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms and conditions'),
  agreeToPrivacy: z.boolean().refine((val) => val === true, 'You must agree to the privacy policy'),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

// Password change request schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordRefinement,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

// Forgot password request schema
export const forgotPasswordSchema = z.object({
  email: emailRefinement,
  captchaToken: z.string().optional(), // For captcha verification
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

// Reset password request schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordRefinement,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

// Email validation request schema
export const validateEmailSchema = z.object({
  email: emailRefinement,
});

export type ValidateEmailRequest = z.infer<typeof validateEmailSchema>;

// Email verification request schema
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;

// Check permission request schema
export const checkPermissionSchema = z.object({
  resource: z.string().min(1, 'Resource is required'),
  action: z.enum(['read', 'write', 'delete'], {
    message: 'Action must be one of: read, write, delete',
  }),
});

export type CheckPermissionRequest = z.infer<typeof checkPermissionSchema>;

// Update user role request schema
export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole, {
    message: 'Invalid role specified',
  }),
  reason: z.string().min(1, 'Reason for role change is required').max(500, 'Reason is too long'),
  notifyUser: z.boolean().optional().default(true),
});

export type UpdateUserRoleRequest = z.infer<typeof updateUserRoleSchema>;

// Refresh token request schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;

// Test email request schema (development only)
export const testEmailSchema = z.object({
  email: emailRefinement,
  template: z
    .enum(['welcome', 'verification', 'password_reset', 'password_change', 'test'], {
      message: 'Invalid template specified',
    })
    .optional()
    .default('test'),
});

export type TestEmailRequest = z.infer<typeof testEmailSchema>;

/**
 * Response schemas for type safety
 */

// Base API response schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.string().optional(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
  timestamp: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  code?: string;
  data?: T;
  errors?: string[];
  timestamp?: string;
};

// Auth response data schema
export const authResponseDataSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.nativeEnum(UserRole),
    isVerified: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  tokens: z.object({
    access: z.object({
      token: z.string(),
      expires: z.string(),
    }),
    refresh: z.object({
      token: z.string(),
      expires: z.string(),
    }),
  }),
});

export type AuthResponseData = z.infer<typeof authResponseDataSchema>;

/**
 * Validation middleware helper
 */
export const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return async (req: any, res: any, next: any) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.validatedData = validatedData;
      req.body = validatedData; // Replace body with validated and sanitized data
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
 * Query parameter validation schemas
 */

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').optional().default(1),
  limit: z.coerce.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional().default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

// Search schema
export const searchSchema = z.object({
  q: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long')
    .transform((query) => sanitizeString(query.trim())),
  filters: z.record(z.string(), z.string()).optional(),
});

export type SearchQuery = z.infer<typeof searchSchema>;

/**
 * Password strength validation
 */
export const getPasswordStrength = (
  password: string,
): {
  score: number;
  level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  suggestions: string[];
} => {
  let score = 0;
  const suggestions: string[] = [];

  // Length scoring
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 15;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;

  // Pattern scoring
  if (!/(.)\1{2,}/.test(password)) score += 5; // No repeated characters
  if (!/012|123|234|345|456|567|678|789|890/.test(password)) score += 5; // No sequential numbers

  let level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';

  if (score < 30) {
    level = 'very-weak';
    suggestions.push('Use a longer password (at least 8 characters)');
    suggestions.push('Include uppercase and lowercase letters');
    suggestions.push('Add numbers and special characters');
  } else if (score < 50) {
    level = 'weak';
    suggestions.push('Make your password longer');
    suggestions.push('Add more variety in character types');
  } else if (score < 70) {
    level = 'fair';
    suggestions.push('Consider adding more length or complexity');
  } else if (score < 85) {
    level = 'good';
  } else {
    level = 'strong';
  }

  return { score: Math.min(score, 100), level, suggestions };
};

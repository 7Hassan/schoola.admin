import { UserRole } from '@schoola/types/src';
import { RBACService } from '../services/rbac.service';

/**
 * Authentication Validation Utilities
 * Provides validation functions for auth-related operations
 */
export class AuthValidation {
  /**
   * Validate email format
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!password) {
      return { isValid: false, errors: ['Password is required'] };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '12345678', '123456789', 'qwerty', 'admin', 'letmein'];

    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common and easily guessed');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate user name fields
   */
  static validateName(name: string, fieldName: string): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (name.trim().length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }

    if (name.trim().length > 50) {
      return { isValid: false, error: `${fieldName} must be less than 50 characters` };
    }

    // Allow only letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
      return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }

    return { isValid: true };
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone?: string): { isValid: boolean; error?: string } {
    if (!phone) {
      return { isValid: true }; // Phone is optional
    }

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return { isValid: false, error: 'Phone number must be between 10 and 15 digits' };
    }

    // Basic international format validation
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    return { isValid: true };
  }

  /**
   * Validate user role
   */
  static validateRole(role: string): { isValid: boolean; error?: string } {
    if (!role) {
      return { isValid: false, error: 'Role is required' };
    }

    if (!RBACService.isValidRole(role)) {
      return { isValid: false, error: 'Invalid role specified' };
    }

    return { isValid: true };
  }

  /**
   * Validate role assignment permissions
   */
  static validateRoleAssignment(assignerRole: UserRole, targetRole: UserRole): { isValid: boolean; error?: string } {
    if (!RBACService.canAssignRole(assignerRole, targetRole)) {
      return {
        isValid: false,
        error: `You don't have permission to assign the role: ${RBACService.getRoleDisplayName(targetRole)}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Comprehensive login validation
   */
  static validateLoginRequest(
    email: string,
    password: string,
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    const emailValidation = this.validateEmail(email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    }

    if (!password) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Comprehensive registration validation
   */
  static validateRegistrationRequest(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    }

    // Password validation
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // First name validation
    const firstNameValidation = this.validateName(data.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      errors.push(firstNameValidation.error!);
    }

    // Last name validation
    const lastNameValidation = this.validateName(data.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      errors.push(lastNameValidation.error!);
    }

    // Phone validation (optional)
    if (data.phone) {
      const phoneValidation = this.validatePhone(data.phone);
      if (!phoneValidation.isValid) {
        errors.push(phoneValidation.error!);
      }
    }

    // Role validation (optional)
    if (data.role) {
      const roleValidation = this.validateRole(data.role);
      if (!roleValidation.isValid) {
        errors.push(roleValidation.error!);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate password change request
   */
  static validatePasswordChange(
    currentPassword: string,
    newPassword: string,
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!currentPassword) {
      errors.push('Current password is required');
    }

    const newPasswordValidation = this.validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      errors.push(...newPasswordValidation.errors);
    }

    if (currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize user input
   */
  static sanitizeString(input: string): string {
    if (!input) return '';

    return input
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(email: string): string {
    if (!email) return '';
    return email.toLowerCase().trim();
  }

  /**
   * Validate and sanitize user registration data
   */
  static sanitizeRegistrationData(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
  }): {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
  } {
    const result: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role?: UserRole;
    } = {
      email: this.sanitizeEmail(data.email),
      password: data.password, // Don't sanitize password as it might affect validation
      firstName: this.sanitizeString(data.firstName),
      lastName: this.sanitizeString(data.lastName),
    };

    if (data.phone) {
      result.phone = this.sanitizeString(data.phone);
    }

    if (data.role) {
      result.role = data.role;
    }

    return result;
  }

  /**
   * Check password complexity score (0-100)
   */
  static getPasswordComplexityScore(password: string): number {
    if (!password) return 0;

    let score = 0;

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
    if (!/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password))
      score += 5; // No sequential letters

    return Math.min(score, 100);
  }

  /**
   * Generate password strength feedback
   */
  static getPasswordStrengthFeedback(password: string): {
    score: number;
    level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
    suggestions: string[];
  } {
    const score = this.getPasswordComplexityScore(password);
    const suggestions: string[] = [];

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

    return { score, level, suggestions };
  }
}

/**
 * Request validation middleware helpers
 */
export class AuthValidationMiddleware {
  /**
   * Express middleware for validating login requests
   */
  static validateLogin(req: any, res: any, next: any): void {
    const { email, password } = req.body;
    const validation = AuthValidation.validateLoginRequest(email, password);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    // Sanitize the input
    req.body.email = AuthValidation.sanitizeEmail(email);
    next();
  }

  /**
   * Express middleware for validating registration requests
   */
  static validateRegistration(req: any, res: any, next: any): void {
    const validation = AuthValidation.validateRegistrationRequest(req.body);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    // Sanitize the input
    req.body = AuthValidation.sanitizeRegistrationData(req.body);
    next();
  }

  /**
   * Express middleware for validating password change requests
   */
  static validatePasswordChange(req: any, res: any, next: any): void {
    const { currentPassword, newPassword } = req.body;
    const validation = AuthValidation.validatePasswordChange(currentPassword, newPassword);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    next();
  }
}

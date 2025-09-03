import { UserRole } from '@schoola/types/src';
import { IAccessRight } from '../../config/accessRights';

// ================================
// SERVICE RESPONSE TYPES
// ================================

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  code?: string;
}

// ================================
// AUTH SERVICE TYPES
// ================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  accessRights: IAccessRight[];
  isActive: boolean;
  isVerified?: boolean;
  lastLogin?: Date;
  profilePhoto?: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
  adminProfile?: {
    department: string;
    permissions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenValidationResult {
  isValid: boolean;
  user: AuthenticatedUser | null;
  tokenData?: any;
  error?: string;
  isExpired?: boolean;
}

export interface PasswordResetRequest {
  email: string;
  resetToken?: string;
  newPassword?: string;
}

export interface EmailVerificationRequest {
  email: string;
  verificationToken: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EmailValidationResult {
  isValid: boolean;
  isTaken: boolean;
  error?: string;
}

export interface RoleValidationResult {
  isValid: boolean;
  role: UserRole;
  accessRights: IAccessRight[];
  error?: string;
}

// ================================
// PERMISSION CHECKING TYPES
// ================================

export interface PermissionCheckRequest {
  userId: string;
  resource: string;
  permission: 'read' | 'write' | 'delete';
}

export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
  requiredRole?: UserRole;
}

// ================================
// SESSION MANAGEMENT TYPES
// ================================

export interface SessionInfo {
  userId: string;
  role: UserRole;
  email: string;
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface ActiveSession extends SessionInfo {
  tokenId: string;
  expiresAt: Date;
}

// ================================
// AUTH EVENT TYPES
// ================================

export interface AuthEvent {
  type: 'login' | 'logout' | 'register' | 'password_change' | 'role_change' | 'permission_denied';
  userId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

// ================================
// ROLE MANAGEMENT TYPES
// ================================

export interface RoleChangeRequest {
  userId: string;
  newRole: UserRole;
  changedBy: string;
  reason?: string;
}

export interface RoleChangeResult {
  success: boolean;
  user?: AuthenticatedUser;
  previousRole?: UserRole;
  newRole: UserRole;
  effectiveDate: Date;
  message?: string;
  error?: string;
}

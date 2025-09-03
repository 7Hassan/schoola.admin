import { UserRole } from '@schoola/types/src';
import { UserDocument } from '../user.types';
import { IAccessRight } from '../../config/accessRights';

// ================================
// REQUEST TYPES
// ================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  profilePhoto?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ================================
// RESPONSE TYPES
// ================================

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface AuthTokens {
  access: TokenPayload;
  refresh: TokenPayload;
}

export interface UserProfile extends Omit<UserDocument, 'password'> {
  accessRights: IAccessRight[];
  roleDisplayName: string;
}

export interface LoginResponse {
  success: true;
  data: {
    user: UserProfile;
    tokens: AuthTokens;
  };
  message: string;
}

export interface RegisterResponse {
  success: true;
  data: {
    user: UserProfile;
    tokens: AuthTokens;
    emailVerificationRequired?: boolean;
  };
  message: string;
}

export interface RefreshTokenResponse {
  success: true;
  data: {
    user: UserProfile;
    tokens: AuthTokens;
  };
  message: string;
}

export interface LogoutResponse {
  success: true;
  message: string;
}

export interface ForgotPasswordResponse {
  success: true;
  message: string;
  data?: {
    resetTokenExpires: Date;
  };
}

export interface ResetPasswordResponse {
  success: true;
  message: string;
}

export interface VerifyEmailResponse {
  success: true;
  data: {
    user: UserProfile;
  };
  message: string;
}

// ================================
// ERROR RESPONSE TYPES
// ================================

export interface AuthErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  code?: string;
}

// ================================
// UTILITY TYPES
// ================================

export type AuthResponse<T = any> = (T & { success: true }) | AuthErrorResponse;

export interface AuthContext {
  user: UserProfile;
  accessRights: IAccessRight[];
  isAuthenticated: true;
}

export interface UnauthenticatedContext {
  isAuthenticated: false;
}

export type RequestContext = AuthContext | UnauthenticatedContext;

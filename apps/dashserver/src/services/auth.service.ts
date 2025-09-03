import { UserRole } from '@schoola/types/src';
import { AuthDAO } from '../daos/auth.dao';
import { UserDAO } from '../daos/user.dao';
import { RBACService } from './rbac.service';
import {
  AuthenticatedUser,
  LoginCredentials,
  TokenValidationResult,
  SessionInfo,
  ServiceResponse,
} from '../types/service/auth.service.types';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  UserProfile,
  AuthTokens,
} from '../types/api/auth.api.types';

/**
 * Authentication Service
 * Handles authentication business logic with RBAC integration
 */
export class AuthService {
  /**
   * User login with role-based response filtering
   */
  static async login(loginData: LoginRequest): Promise<ServiceResponse<LoginResponse>> {
    try {
      const credentials: LoginCredentials = {
        email: loginData.email,
        password: loginData.password,
      };

      // Authenticate user
      const authenticatedUser = await AuthDAO.authenticate(credentials);

      if (!authenticatedUser) {
        return {
          success: false,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        };
      }

      // Check if account is active
      if (!authenticatedUser.isActive) {
        return {
          success: false,
          message: 'Account is deactivated. Please contact support.',
          code: 'ACCOUNT_DEACTIVATED',
        };
      }

      // Generate tokens
      const tokens = AuthDAO.generateTokens({
        _id: authenticatedUser.id as any,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
        firstName: authenticatedUser.firstName,
        lastName: authenticatedUser.lastName,
        fullName: authenticatedUser.fullName,
        isActive: authenticatedUser.isActive,
      } as any);

      // Get session info
      const sessionInfo = await AuthDAO.getSessionInfo(authenticatedUser.id);

      // Build role-based user profile
      const userProfile = this.buildUserProfile(authenticatedUser, authenticatedUser.role);

      // Build auth tokens response
      const authTokens: AuthTokens = {
        access: {
          token: tokens.accessToken,
          expires: new Date(Date.now() + 86400 * 1000), // 24 hours
        },
        refresh: {
          token: tokens.refreshToken,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      };

      const response: LoginResponse = {
        success: true,
        data: {
          user: userProfile,
          tokens: authTokens,
        },
        message: 'Login successful',
      };

      return {
        success: true,
        data: response,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        code: 'LOGIN_ERROR',
      };
    }
  }

  /**
   * User registration with role validation
   */
  static async register(
    registerData: RegisterRequest,
    creatorRole: UserRole = UserRole.Student,
  ): Promise<ServiceResponse<RegisterResponse>> {
    try {
      // Validate role assignment if specified
      const targetRole = registerData.role || RBACService.getDefaultRegistrationRole();

      if (!RBACService.canAssignRole(creatorRole, targetRole)) {
        return {
          success: false,
          message: `Insufficient permissions to assign role: ${RBACService.getRoleDisplayName(targetRole)}`,
          code: 'INSUFFICIENT_PERMISSIONS',
        };
      }

      // Check if user already exists
      const existingUser = await UserDAO.existsByEmail(registerData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists with this email address',
          code: 'USER_EXISTS',
        };
      }

      // Create user account
      const userData = {
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: targetRole,
        ...(registerData.phone && { phone: registerData.phone }),
      };

      const authenticatedUser = await AuthDAO.createAccount(userData, creatorRole);

      // Generate tokens
      const tokens = AuthDAO.generateTokens({
        _id: authenticatedUser.id as any,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
        firstName: authenticatedUser.firstName,
        lastName: authenticatedUser.lastName,
        fullName: authenticatedUser.fullName,
        isActive: authenticatedUser.isActive,
      } as any);

      // Build role-based user profile
      const userProfile = this.buildUserProfile(authenticatedUser, targetRole);

      // Build auth tokens response
      const authTokens: AuthTokens = {
        access: {
          token: tokens.accessToken,
          expires: new Date(Date.now() + 86400 * 1000),
        },
        refresh: {
          token: tokens.refreshToken,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      };

      const response: RegisterResponse = {
        success: true,
        data: {
          user: userProfile,
          tokens: authTokens,
          emailVerificationRequired: true,
        },
        message: 'Registration successful. Please verify your email address.',
      };

      return {
        success: true,
        data: response,
        message: 'Registration successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
        code: 'REGISTRATION_ERROR',
      };
    }
  }

  /**
   * Validate JWT token with role-based user data
   */
  static async validateToken(token: string): Promise<ServiceResponse<TokenValidationResult>> {
    try {
      const validationResult = await AuthDAO.validateToken(token);

      if (!validationResult.isValid || !validationResult.user) {
        return {
          success: false,
          data: validationResult,
          message: validationResult.error || 'Invalid token',
          code: 'TOKEN_INVALID',
        };
      }

      return {
        success: true,
        data: validationResult,
        message: 'Token is valid',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token validation failed',
        code: 'TOKEN_VALIDATION_ERROR',
      };
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<ServiceResponse<AuthTokens>> {
    try {
      const newTokens = await AuthDAO.refreshToken(refreshToken);

      if (!newTokens) {
        return {
          success: false,
          message: 'Invalid or expired refresh token',
          code: 'REFRESH_TOKEN_INVALID',
        };
      }

      const authTokens: AuthTokens = {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresIn: 86400,
        tokenType: 'Bearer',
      };

      return {
        success: true,
        data: authTokens,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed',
        code: 'TOKEN_REFRESH_ERROR',
      };
    }
  }

  /**
   * Change user password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<ServiceResponse<{ message: string }>> {
    try {
      const success = await AuthDAO.changePassword(userId, currentPassword, newPassword);

      if (!success) {
        return {
          success: false,
          message: 'Password change failed',
          code: 'PASSWORD_CHANGE_FAILED',
        };
      }

      return {
        success: true,
        data: { message: 'Password changed successfully' },
        message: 'Password changed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Password change failed',
        code: 'PASSWORD_CHANGE_ERROR',
      };
    }
  }

  /**
   * Get user profile with role-based filtering
   */
  static async getUserProfile(userId: string, requesterRole: UserRole): Promise<ServiceResponse<UserProfile>> {
    try {
      const user = await UserDAO.findById(userId, requesterRole, {
        includeAccessRights: true,
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        };
      }

      const authenticatedUser: AuthenticatedUser = {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role as UserRole,
        accessRights: RBACService.getAccessRightsByRole(user.role as UserRole),
        isActive: user.isActive,
        isVerified: (user as any).isVerified || false,
        lastLogin: user.lastLogin,
        profilePhoto: user.profilePhoto,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      const userProfile = this.buildUserProfile(authenticatedUser, requesterRole);

      return {
        success: true,
        data: userProfile,
        message: 'User profile retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user profile',
        code: 'GET_PROFILE_ERROR',
      };
    }
  }

  /**
   * Check user permission for resource and action
   */
  static async checkPermission(
    userId: string,
    resource: string,
    permission: 'read' | 'write' | 'delete',
  ): Promise<ServiceResponse<{ hasPermission: boolean; reason?: string }>> {
    try {
      const hasPermission = await AuthDAO.checkPermission(userId, resource, permission);

      const result = {
        hasPermission,
        reason: hasPermission ? undefined : `Insufficient permissions for ${permission} access to ${resource}`,
      };

      return {
        success: true,
        data: result,
        message: hasPermission ? 'Permission granted' : 'Permission denied',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Permission check failed',
        code: 'PERMISSION_CHECK_ERROR',
      };
    }
  }

  /**
   * Update user role with validation
   */
  static async updateUserRole(
    userId: string,
    newRole: UserRole,
    updaterRole: UserRole,
  ): Promise<ServiceResponse<UserProfile>> {
    try {
      const updatedUser = await AuthDAO.updateUserRole(userId, newRole, updaterRole);

      if (!updatedUser) {
        return {
          success: false,
          message: 'Failed to update user role',
          code: 'ROLE_UPDATE_FAILED',
        };
      }

      const userProfile = this.buildUserProfile(updatedUser, updaterRole);

      return {
        success: true,
        data: userProfile,
        message: `User role updated to ${RBACService.getRoleDisplayName(newRole)}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Role update failed',
        code: 'ROLE_UPDATE_ERROR',
      };
    }
  }

  /**
   * Get session information
   */
  static async getSessionInfo(userId: string): Promise<ServiceResponse<SessionInfo>> {
    try {
      const sessionInfo = await AuthDAO.getSessionInfo(userId);

      if (!sessionInfo) {
        return {
          success: false,
          message: 'Session not found',
          code: 'SESSION_NOT_FOUND',
        };
      }

      return {
        success: true,
        data: sessionInfo,
        message: 'Session info retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get session info',
        code: 'SESSION_INFO_ERROR',
      };
    }
  }

  /**
   * Logout user (invalidate sessions)
   */
  static async logout(userId: string): Promise<ServiceResponse<{ message: string }>> {
    try {
      const success = await AuthDAO.invalidateSessions(userId);

      if (!success) {
        return {
          success: false,
          message: 'Logout failed',
          code: 'LOGOUT_FAILED',
        };
      }

      return {
        success: true,
        data: { message: 'Logged out successfully' },
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
        code: 'LOGOUT_ERROR',
      };
    }
  }

  /**
   * Build role-based user profile with appropriate field filtering
   */
  private static buildUserProfile(authenticatedUser: AuthenticatedUser, viewerRole: UserRole): UserProfile {
    const baseProfile: UserProfile = {
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      fullName: authenticatedUser.fullName,
      role: authenticatedUser.role,
      isActive: authenticatedUser.isActive,
      isVerified: authenticatedUser.isVerified || false,
      createdAt: authenticatedUser.createdAt,
      updatedAt: authenticatedUser.updatedAt,
    };

    // Super admin and admin get full profile access
    if ([UserRole.SuperAdmin, UserRole.Admin].includes(viewerRole)) {
      return {
        ...baseProfile,
        accessRights: authenticatedUser.accessRights,
        lastLogin: authenticatedUser.lastLogin,
        profilePhoto: authenticatedUser.profilePhoto,
        phone: authenticatedUser.phone,
        studentId: authenticatedUser.studentId,
        teacherId: authenticatedUser.teacherId,
        adminProfile: authenticatedUser.adminProfile,
      };
    }

    // Teachers get limited profile access
    if (viewerRole === UserRole.Teacher) {
      return {
        ...baseProfile,
        profilePhoto: authenticatedUser.profilePhoto,
        phone: authenticatedUser.phone,
        studentId: authenticatedUser.studentId,
      };
    }

    // Students and others get minimal profile access
    return {
      ...baseProfile,
      profilePhoto: authenticatedUser.profilePhoto,
    };
  }

  /**
   * Validate email format and availability
   */
  static async validateEmail(email: string): Promise<ServiceResponse<{ isValid: boolean; isAvailable: boolean }>> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);

      if (!isValid) {
        return {
          success: false,
          message: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT',
        };
      }

      const isAvailable = !(await UserDAO.existsByEmail(email));

      return {
        success: true,
        data: { isValid, isAvailable },
        message: isAvailable ? 'Email is available' : 'Email is already taken',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Email validation failed',
        code: 'EMAIL_VALIDATION_ERROR',
      };
    }
  }

  /**
   * Get user capabilities based on role
   */
  static getUserCapabilities(role: UserRole): string[] {
    const resources = RBACService.getAvailableResources(role);
    const capabilities: string[] = [];

    resources.forEach((resource) => {
      const permissions = RBACService.getResourcePermissions(role, resource);
      Object.entries(permissions).forEach(([permission, hasAccess]) => {
        if (hasAccess) {
          capabilities.push(`${resource}:${permission}`);
        }
      });
    });

    return capabilities;
  }
}

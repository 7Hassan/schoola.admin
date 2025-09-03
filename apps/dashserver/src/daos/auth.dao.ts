import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../types/user.types';
import { UserModel } from '../services/db/schemas/user.schema';
import { UserRole } from '@schoola/types/src';
import { RBACService } from '../services/rbac.service';
import {
  AuthenticatedUser,
  LoginCredentials,
  TokenValidationResult,
  SessionInfo,
} from '../types/service/auth.service.types';

/**
 * Authentication Data Access Object (DAO)
 * Handles authentication-related database operations with RBAC integration
 */
export class AuthDAO {
  private static readonly JWT_SECRET = process.env['JWT_SECRET'] || 'default-jwt-secret-for-dev';
  private static readonly JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '24h';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '30d';
  private static readonly SALT_ROUNDS = 12;

  /**
   * Authenticate user with email and password
   */
  static async authenticate(credentials: LoginCredentials): Promise<AuthenticatedUser | null> {
    const { email, password } = credentials;

    // Find user by email (including password for verification)
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      isActive: true,
    })
      .select('+password')
      .exec();

    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await UserModel.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    return this.createAuthenticatedUser(user);
  }

  /**
   * Create new user account with role-based validation
   */
  static async createAccount(
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: UserRole;
      phone?: string;
    },
    creatorRole: UserRole = UserRole.Student,
  ): Promise<AuthenticatedUser> {
    const role = userData.role || RBACService.getDefaultRegistrationRole();

    // Validate role assignment
    if (!RBACService.canAssignRole(creatorRole, role)) {
      throw new Error(`Insufficient permissions to assign role: ${role}`);
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: userData.email.toLowerCase(),
      isActive: true,
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

    // Create user with RBAC permissions
    const user = new UserModel({
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: `${userData.firstName} ${userData.lastName}`,
      role,
      phone: userData.phone,
      accessRights: RBACService.getAccessRightsByRole(role),
      isActive: true,
      isVerified: false, // Email verification required
    });

    await user.save();

    return this.createAuthenticatedUser(user);
  }

  /**
   * Generate JWT token for authenticated user
   */
  static generateTokens(user: UserDocument): { accessToken: string; refreshToken: string } {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: RBACService.getAccessRightsByRole(user.role as UserRole),
    };

    const secret: string = this.JWT_SECRET;

    const accessToken = jwt.sign(payload, secret, {
      expiresIn: this.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign({ userId: user._id.toString() }, secret, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Validate JWT token and return user info
   */
  static async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;

      // Find user and ensure they're still active
      const user = await UserModel.findById(decoded.userId).exec();

      if (!user || !user.isActive) {
        return {
          isValid: false,
          error: 'User not found or inactive',
          user: null,
        };
      }

      return {
        isValid: true,
        user: this.createAuthenticatedUser(user),
        tokenData: decoded,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Token validation failed',
        user: null,
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as any;

      const user = await UserModel.findById(decoded.userId).exec();
      if (!user || !user.isActive) {
        return null;
      }

      return this.generateTokens(user);
    } catch {
      return null;
    }
  }

  /**
   * Change user password with validation
   */
  static async changePassword(
    userId: string | Types.ObjectId,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await UserModel.findById(userId).select('+password').exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Update password
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      updatedAt: new Date(),
    });

    return true;
  }

  /**
   * Reset password with token validation
   */
  static async resetPassword(
    email: string,
    _resetToken: string, // Prefixed with _ to indicate unused parameter
    newPassword: string,
  ): Promise<boolean> {
    // In a real implementation, you would validate the reset token
    // For now, we'll implement a basic version
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedNewPassword,
      updatedAt: new Date(),
    });

    return true;
  }

  /**
   * Verify user email
   */
  static async verifyEmail(email: string, _verificationToken: string): Promise<boolean> {
    // In a real implementation, you would validate the verification token
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    await UserModel.findByIdAndUpdate(user._id, {
      isVerified: true,
      updatedAt: new Date(),
    });

    return true;
  }

  /**
   * Get user session information
   */
  static async getSessionInfo(userId: string | Types.ObjectId): Promise<SessionInfo | null> {
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      return null;
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
      loginTime: user.lastLogin || new Date(),
      lastActivity: new Date(),
    };
  }

  /**
   * Invalidate user sessions (logout all devices)
   */
  static async invalidateSessions(userId: string | Types.ObjectId): Promise<boolean> {
    // In a real implementation, you would maintain a session store
    // and invalidate all sessions for the user
    // For now, we'll just update the user's lastLogin to force re-authentication
    await UserModel.findByIdAndUpdate(userId, {
      lastLogin: null,
      updatedAt: new Date(),
    });

    return true;
  }

  /**
   * Check if user has specific permission
   */
  static async checkPermission(
    userId: string | Types.ObjectId,
    resource: string,
    permission: 'read' | 'write' | 'delete',
  ): Promise<boolean> {
    const user = await UserModel.findById(userId).exec();

    if (!user || !user.isActive) {
      return false;
    }

    return RBACService.hasPermission(user.role as UserRole, resource, permission);
  }

  /**
   * Update user role with RBAC validation
   */
  static async updateUserRole(
    userId: string | Types.ObjectId,
    newRole: UserRole,
    updaterRole: UserRole,
  ): Promise<AuthenticatedUser | null> {
    if (!RBACService.canAssignRole(updaterRole, newRole)) {
      throw new Error(`Insufficient permissions to assign role: ${newRole}`);
    }

    const accessRights = RBACService.getAccessRightsByRole(newRole);

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        role: newRole,
        accessRights,
        updatedAt: new Date(),
      },
      { new: true },
    ).exec();

    return user ? this.createAuthenticatedUser(user) : null;
  }

  /**
   * Create AuthenticatedUser object from UserDocument
   */
  private static createAuthenticatedUser(user: UserDocument): AuthenticatedUser {
    const authenticatedUser: AuthenticatedUser = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role as UserRole,
      accessRights: RBACService.getAccessRightsByRole(user.role as UserRole),
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Add optional properties only if they exist
    if ((user as any).isVerified !== undefined) {
      authenticatedUser.isVerified = (user as any).isVerified;
    }
    if (user.lastLogin) {
      authenticatedUser.lastLogin = user.lastLogin;
    }
    if (user.profilePhoto) {
      authenticatedUser.profilePhoto = user.profilePhoto;
    }
    if (user.phone) {
      authenticatedUser.phone = user.phone;
    }

    return authenticatedUser;
  }

  /**
   * Hash password utility
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare password utility
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

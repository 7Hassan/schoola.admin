import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@schoola/types/src';
import { AuthService } from '../services/auth.service';
import { emailService } from '../services/email.service';
import { LoginRequest, RegisterRequest } from '../types/api/auth.api.types';

/**
 * Check Permission Request interface
 */
export interface CheckPermissionRequest {
  resource: string;
  action: string;
}

/**
 * Authentication Controller
 * Handles HTTP requests for authentication with RBAC integration
 */
export class AuthController {
  /**
   * POST /auth/login
   * User login with role-based response
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;

      // Validate required fields
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
          code: 'MISSING_CREDENTIALS',
        });
        return;
      }

      // Attempt login
      const result = await AuthService.login(loginData);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      // Set secure HTTP-only cookie for auth token
      if (result.data?.data?.tokens?.access?.token) {
        res.cookie('authToken', result.data.data.tokens.access.token, {
          httpOnly: true,
          secure: process.env['NODE_ENV'] === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });
      }

      // Return success with user data and token
      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/register
   * User registration with role validation
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const registerData: RegisterRequest = req.body;

      // Validate required fields
      if (!registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName) {
        res.status(400).json({
          success: false,
          message: 'Email, password, first name, and last name are required',
          code: 'MISSING_REQUIRED_FIELDS',
        });
        return;
      }

      // Default role if not provided
      if (!registerData.role) {
        registerData.role = UserRole.Student; // Default to Student role
      }

      // Attempt registration
      const result = await AuthService.register(registerData);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      // Send welcome email (async, don't wait for completion)
      if (result.success && result.data?.data?.user) {
        const user = result.data.data.user;
        emailService.sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`, user.role).catch((error) => {
          console.error('Failed to send welcome email:', error);
          // Don't fail registration if email fails
        });
      }

      // Set secure HTTP-only cookie for auth token
      if (result.data?.data?.tokens?.access?.token) {
        res.cookie('authToken', result.data.data.tokens.access.token, {
          httpOnly: true,
          secure: process.env['NODE_ENV'] === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });
      }

      // Return success with user data and token
      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   * Refresh authentication token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.['refreshToken'] || req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN',
        });
        return;
      }

      // Attempt token refresh
      const result = await AuthService.refreshToken(refreshToken);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      // Set new auth token cookie
      if (result.data?.access?.token) {
        res.cookie('authToken', result.data.access.token, {
          httpOnly: true,
          secure: process.env['NODE_ENV'] === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Token refresh error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * User logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Clear auth token cookie
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
      });

      // Clear refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
      });

      // If user is authenticated, perform server-side logout
      const user = (req as any).user;
      if (user?.id) {
        await AuthService.logout(user.id);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        code: 'LOGOUT_SUCCESS',
      });
    } catch (error) {
      console.error('Logout error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/change-password
   * Change user password (requires authentication)
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password and new password are required',
          code: 'MISSING_PASSWORDS',
        });
        return;
      }

      // Attempt password change
      const result = await AuthService.changePassword(user.id, currentPassword, newPassword);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      // Send password change confirmation email
      emailService.sendPasswordChangeConfirmation(user.email, `${user.firstName} ${user.lastName}`).catch((error) => {
        console.error('Failed to send password change confirmation email:', error);
        // Don't fail the password change if email fails
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Change password error:', error);
      next(error);
    }
  }

  /**
   * GET /auth/me
   * Get current user profile (requires authentication)
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      // Get user profile with role-based filtering
      const result = await AuthService.getUserProfile(user.id, user.role);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Get profile error:', error);
      next(error);
    }
  }

  /**
   * GET /auth/check-permission
   * Check if user has specific permission (requires authentication)
   */
  static async checkPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      const { resource, action } = req.query as unknown as CheckPermissionRequest;

      if (!resource || !action) {
        res.status(400).json({
          success: false,
          message: 'Resource and action are required',
          code: 'MISSING_PARAMETERS',
        });
        return;
      }

      // Check permission
      const result = await AuthService.checkPermission(user.id, resource as string, action as 'read' | 'write' | 'delete');

      res.status(200).json(result);
    } catch (error) {
      console.error('Check permission error:', error);
      next(error);
    }
  }

  /**
   * PUT /auth/users/:id/role
   * Update user role (SuperAdmin only)
   */
  static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const targetUserId = req.params['id'];
      const { role } = req.body;

      if (!currentUser?.id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      if (!targetUserId || !role) {
        res.status(400).json({
          success: false,
          message: 'User ID and role are required',
          code: 'MISSING_PARAMETERS',
        });
        return;
      }

      // Attempt role update
      const result = await AuthService.updateUserRole(targetUserId, role, currentUser.role);

      if (!result.success) {
        res.status(403).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Update user role error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/validate-email
   * Validate email format and availability
   */
  static async validateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
          code: 'MISSING_EMAIL',
        });
        return;
      }

      // Validate email
      const result = await AuthService.validateEmail(email);

      res.status(200).json(result);
    } catch (error) {
      console.error('Validate email error:', error);
      next(error);
    }
  }

  /**
   * GET /auth/capabilities
   * Get current user's capabilities and permissions (requires authentication)
   */
  static async getUserCapabilities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      // Get user capabilities
      const result = await AuthService.getUserCapabilities(user.id);

      res.status(200).json(result);
    } catch (error) {
      console.error('Get user capabilities error:', error);
      next(error);
    }
  }

  /**
   * GET /auth/session
   * Get current session information (requires authentication)
   */
  static async getSessionInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      // Get session info
      const result = await AuthService.getSessionInfo(user.id);

      res.status(200).json(result);
    } catch (error) {
      console.error('Get session info error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/forgot-password
   * Request password reset email
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
          code: 'MISSING_EMAIL',
        });
        return;
      }

      // Check if user exists (but don't reveal this information)
      const userResult = await AuthService.validateEmail(email);

      if (userResult.success && !userResult.data?.isAvailable) {
        // User exists, generate reset token and send email
        // Note: In production, you'd implement token generation in AuthService
        const resetToken = 'temp-reset-token'; // This should come from AuthService

        // Send password reset email with generic name
        await emailService.sendPasswordResetEmail(
          email,
          'User', // Generic name since we don't want to expose user details
          resetToken,
        );
      }

      // Always return success to prevent email enumeration
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        code: 'RESET_EMAIL_SENT',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/reset-password
   * Reset password with token
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Reset token and new password are required',
          code: 'MISSING_PARAMETERS',
        });
        return;
      }

      // Validate token and reset password
      // Note: You'd need to implement this in AuthService
      const result = { success: false, message: 'Password reset functionality not yet implemented' };

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully',
        code: 'PASSWORD_RESET_SUCCESS',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/send-verification-email
   * Send email verification (requires authentication)
   */
  static async sendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      // Generate verification token (this should be implemented in AuthService)
      const verificationToken = 'temp-verification-token';

      // Send verification email
      await emailService.sendEmailVerification(user.email, `${user.firstName} ${user.lastName}`, verificationToken);

      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully',
        code: 'VERIFICATION_EMAIL_SENT',
      });
    } catch (error) {
      console.error('Send verification email error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/verify-email
   * Verify email with token
   */
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Verification token is required',
          code: 'MISSING_TOKEN',
        });
        return;
      }

      // Verify email token (this should be implemented in AuthService)
      const result = { success: false, message: 'Email verification functionality not yet implemented' };

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        code: 'EMAIL_VERIFIED',
      });
    } catch (error) {
      console.error('Verify email error:', error);
      next(error);
    }
  }

  /**
   * POST /auth/test-email
   * Test email service (development/admin only)
   */
  static async testEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
          code: 'MISSING_EMAIL',
        });
        return;
      }

      // Check if email service is available
      if (!emailService.isEmailServiceAvailable()) {
        res.status(503).json({
          success: false,
          message: 'Email service is currently unavailable',
          code: 'EMAIL_SERVICE_UNAVAILABLE',
        });
        return;
      }

      // Send test email
      const result = await emailService.sendTestEmail(email);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Test email sent successfully',
          code: 'TEST_EMAIL_SENT',
          data: {
            messageId: result.messageId,
            recipients: result.recipients,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send test email',
          code: 'TEST_EMAIL_FAILED',
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      next(error);
    }
  }
}

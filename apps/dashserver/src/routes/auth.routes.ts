import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { RBACMiddleware } from '../middleware/rbac.middleware';
import { AuthValidationMiddleware } from '../validation/auth.validation';
import { UserRole } from '@schoola/types/src';

const router = express.Router();

/**
 * Authentication Routes
 * All auth-related endpoints with proper validation and middleware
 */

// Public routes (no authentication required)

/**
 * @route POST /auth/login
 * @desc User login
 * @access Public
 * @body { email: string, password: string }
 */
router.post('/login', AuthValidationMiddleware.validateLogin, AuthController.login);

/**
 * @route POST /auth/register
 * @desc User registration
 * @access Public (or restricted based on config)
 * @body { email: string, password: string, firstName: string, lastName: string, phone?: string, role?: UserRole }
 */
router.post('/register', AuthValidationMiddleware.validateRegistration, AuthController.register);

/**
 * @route POST /auth/logout
 * @desc User logout
 * @access Public (but requires token if available)
 */
router.post('/logout', AuthController.logout);

// Protected routes (authentication required)

/**
 * @route GET /auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', RBACMiddleware.authenticate as any, AuthController.getProfile);

/**
 * @route POST /auth/change-password
 * @desc Change user password
 * @access Private
 * @body { currentPassword: string, newPassword: string }
 */
router.post(
  '/change-password',
  RBACMiddleware.authenticate as any,
  AuthValidationMiddleware.validatePasswordChange,
  AuthController.changePassword,
);

/**
 * @route POST /auth/refresh
 * @desc Refresh authentication token
 * @access Private (requires valid refresh token)
 */
router.post('/refresh', RBACMiddleware.authenticate as any, AuthController.refreshToken);

// Admin routes (role-based access)

/**
 * @route PUT /auth/users/:id/role
 * @desc Update user role (super admin only)
 * @access Private - SuperAdmin only
 * @params { id: string }
 * @body { role: UserRole }
 */
router.put(
  '/users/:id/role',
  RBACMiddleware.authenticate as any,
  RBACMiddleware.requireRole(UserRole.SuperAdmin) as any,
  AuthController.updateUserRole,
);

/**
 * @route GET /auth/check-permission
 * @desc Check if user has specific permission
 * @access Private
 * @query { resource: string, action: string }
 */
router.get('/check-permission', RBACMiddleware.authenticate as any, AuthController.checkPermission);

/**
 * @route POST /auth/validate-email
 * @desc Validate email format and availability
 * @access Public
 * @body { email: string }
 */
router.post('/validate-email', AuthController.validateEmail);

/**
 * @route GET /auth/capabilities
 * @desc Get current user's capabilities and permissions
 * @access Private
 */
router.get('/capabilities', RBACMiddleware.authenticate as any, AuthController.getUserCapabilities);

/**
 * @route GET /auth/session
 * @desc Get current session information
 * @access Private
 */
router.get('/session', RBACMiddleware.authenticate as any, AuthController.getSessionInfo);

// Developer/Debug routes (only in development)
if (process.env['NODE_ENV'] === 'development') {
  /**
   * @route GET /auth/debug/roles
   * @desc Get all available roles and permissions
   * @access Private - SuperAdmin only (dev mode)
   */
  router.get(
    '/debug/roles',
    RBACMiddleware.authenticate as any,
    RBACMiddleware.requireRole(UserRole.SuperAdmin) as any,
    (_req, res) => {
      // This would be handled by a debug controller
      res.json({
        success: true,
        message: 'Debug endpoint for roles and permissions',
        data: {
          roles: Object.values(UserRole),
          note: 'This endpoint should be implemented in a debug controller',
        },
      });
    },
  );

  /**
   * @route GET /auth/debug/token
   * @desc Debug token information
   * @access Private - SuperAdmin only (dev mode)
   */
  router.get(
    '/debug/token',
    RBACMiddleware.authenticate as any,
    RBACMiddleware.requireRole(UserRole.SuperAdmin) as any,
    (req, res) => {
      const user = (req as any).user;
      res.json({
        success: true,
        message: 'Token debug information',
        data: {
          userId: user?.id,
          role: user?.role,
          permissions: user?.permissions,
          tokenExp: user?.exp,
          tokenIat: user?.iat,
        },
      });
    },
  );
}

export { router as authRoutes };
export default router;

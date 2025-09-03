import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@schoola/types/src';
import { AuthService } from '../services/auth.service';
import { RBACService } from '../services/rbac.service';

/**
 * Extended Request interface with user context
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
}

/**
 * RBAC Middleware
 * Handles authentication and authorization with role-based access control
 */
export class RBACMiddleware {
  /**
   * Authenticate JWT token and attach user to request
   */
  static async authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Authentication token is required',
          code: 'MISSING_TOKEN',
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Validate token
      const result = await AuthService.validateToken(token);

      if (!result.success || !result.data?.user) {
        res.status(401).json({
          success: false,
          message: result.message || 'Invalid authentication token',
          code: 'INVALID_TOKEN',
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: result.data.user.id,
        email: result.data.user.email,
        role: result.data.user.role,
        isActive: result.data.user.isActive,
      };

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authentication error',
        code: 'AUTH_ERROR',
      });
    }
  }

  /**
   * Optional authentication - continues even if no token provided
   */
  static async optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const result = await AuthService.validateToken(token);

        if (result.success && result.data?.user) {
          req.user = {
            id: result.data.user.id,
            email: result.data.user.email,
            role: result.data.user.role,
            isActive: result.data.user.isActive,
          };
        }
      }

      next();
    } catch (error) {
      // Continue without authentication on error
      next();
    }
  }

  /**
   * Require specific role(s) for access
   */
  static requireRole(...allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED',
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${allowedRoles.map((role) => RBACService.getRoleDisplayName(role)).join(', ')}`,
          code: 'INSUFFICIENT_ROLE',
        });
        return;
      }

      next();
    };
  }

  /**
   * Require specific permission for resource and action
   */
  static requirePermission(resource: string, permission: 'read' | 'write' | 'delete') {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED',
        });
        return;
      }

      const hasPermission = RBACService.hasPermission(req.user.role, resource, permission);

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${permission} access to ${resource}`,
          code: 'INSUFFICIENT_PERMISSION',
        });
        return;
      }

      next();
    };
  }

  /**
   * Admin or SuperAdmin access only
   */
  static requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    RBACMiddleware.requireRole(UserRole.Admin, UserRole.SuperAdmin)(req, res, next);
  }

  /**
   * SuperAdmin access only
   */
  static requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    RBACMiddleware.requireRole(UserRole.SuperAdmin)(req, res, next);
  }

  /**
   * Teacher or higher access
   */
  static requireTeacher(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    RBACMiddleware.requireRole(UserRole.Teacher, UserRole.Admin, UserRole.SuperAdmin)(req, res, next);
  }

  /**
   * Check if user can access specific user resource (own data or admin)
   */
  static requireUserAccess(userIdParam: string = 'userId') {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED',
        });
        return;
      }

      const targetUserId = req.params[userIdParam];
      const currentUserId = req.user.id;
      const currentUserRole = req.user.role;

      // Admin and SuperAdmin can access any user
      if ([UserRole.Admin, UserRole.SuperAdmin].includes(currentUserRole)) {
        next();
        return;
      }

      // Users can only access their own data
      if (targetUserId === currentUserId) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own data.',
        code: 'USER_ACCESS_DENIED',
      });
    };
  }

  /**
   * Validate that user can assign/modify specific role
   */
  static requireRoleAssignmentPermission(targetRoleParam: string = 'role') {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED',
        });
        return;
      }

      const targetRole = req.body[targetRoleParam] || req.params[targetRoleParam];

      if (!targetRole) {
        res.status(400).json({
          success: false,
          message: 'Target role is required',
          code: 'MISSING_ROLE',
        });
        return;
      }

      if (!RBACService.isValidRole(targetRole)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role specified',
          code: 'INVALID_ROLE',
        });
        return;
      }

      const canAssign = RBACService.canAssignRole(req.user.role, targetRole);

      if (!canAssign) {
        res.status(403).json({
          success: false,
          message: `Access denied. You cannot assign the role: ${RBACService.getRoleDisplayName(targetRole)}`,
          code: 'ROLE_ASSIGNMENT_DENIED',
        });
        return;
      }

      next();
    };
  }

  /**
   * Development helper to check user context
   */
  static debugUser() {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      if (process.env['NODE_ENV'] === 'development') {
        console.log('User Context:', req.user);

        if (req.user) {
          const capabilities = RBACService.getAvailableResources(req.user.role);
          console.log('User Capabilities:', capabilities);
        }
      }

      next();
    };
  }

  /**
   * Log access attempts for auditing
   */
  static auditLog() {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        user: req.user
          ? {
              id: req.user.id,
              email: req.user.email,
              role: req.user.role,
            }
          : null,
      };

      // In a production environment, you would log this to a proper logging system
      console.log('Access Log:', JSON.stringify(logData));

      next();
    };
  }
}

export { AuthenticatedRequest };

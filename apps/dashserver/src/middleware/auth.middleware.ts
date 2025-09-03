import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@schoola/types/src';
import { AuthService } from '../services/auth.service';
import { RBACService } from '../services/rbac.service';
import { EResource, EPermission } from '../config/accessRights';
import ApiError from '../modules/errors/ApiError';

/**
 * Extended Request interface with user context
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
}

/**
 * Authorization Middleware
 * Provides enhanced authentication and authorization capabilities
 * Integrates with the RBAC system for comprehensive access control
 */
export class AuthorizationMiddleware {
  /**
   * Authenticate JWT token and attach user to request
   * Throws ApiError on authentication failure
   */
  static async authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Authentication token is required');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Validate token using AuthService
      const result = await AuthService.validateToken(token);

      if (!result.success || !result.data?.user) {
        throw new ApiError(401, result.message || 'Invalid authentication token');
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
      next(error);
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
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new ApiError(401, 'Authentication required');
        }

        if (!allowedRoles.includes(req.user.role)) {
          const roleNames = allowedRoles.map((role) => RBACService.getRoleDisplayName(role)).join(', ');
          throw new ApiError(403, `Access denied. Required role(s): ${roleNames}`);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Require specific permission for resource and action
   */
  static requirePermission(resource: EResource, permission: EPermission) {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new ApiError(401, 'Authentication required');
        }

        const hasPermission = RBACService.hasPermission(req.user.role, resource, permission);

        if (!hasPermission) {
          throw new ApiError(403, `Access denied. Required permission: ${permission} access to ${resource}`);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Require multiple permissions (all must be satisfied)
   */
  static requireAllPermissions(permissions: Array<{ resource: EResource; permission: EPermission }>) {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new ApiError(401, 'Authentication required');
        }

        const hasAllPermissions = permissions.every(({ resource, permission }) =>
          RBACService.hasPermission(req.user!.role, resource, permission),
        );

        if (!hasAllPermissions) {
          const permissionStrings = permissions.map(({ resource, permission }) => `${permission} ${resource}`).join(', ');
          throw new ApiError(403, `Access denied. Required permissions: ${permissionStrings}`);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Require any of the specified permissions (at least one must be satisfied)
   */
  static requireAnyPermission(permissions: Array<{ resource: EResource; permission: EPermission }>) {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new ApiError(401, 'Authentication required');
        }

        const hasAnyPermission = permissions.some(({ resource, permission }) =>
          RBACService.hasPermission(req.user!.role, resource, permission),
        );

        if (!hasAnyPermission) {
          const permissionStrings = permissions.map(({ resource, permission }) => `${permission} ${resource}`).join(' or ');
          throw new ApiError(403, `Access denied. Required any of: ${permissionStrings}`);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Admin or SuperAdmin access only
   */
  static requireAdmin = AuthorizationMiddleware.requireRole(UserRole.Admin, UserRole.SuperAdmin);

  /**
   * SuperAdmin access only
   */
  static requireSuperAdmin = AuthorizationMiddleware.requireRole(UserRole.SuperAdmin);

  /**
   * Teacher or higher access
   */
  static requireTeacher = AuthorizationMiddleware.requireRole(UserRole.Teacher, UserRole.Admin, UserRole.SuperAdmin);

  /**
   * Check if user can access specific user resource (own data or admin)
   */
  static requireUserAccess(userIdParam: string = 'userId') {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new ApiError(401, 'Authentication required');
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

        throw new ApiError(403, 'Access denied. You can only access your own data.');
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Validate that user can assign/modify specific role
   */
  static requireRoleAssignmentPermission(targetRoleParam: string = 'role') {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new ApiError(401, 'Authentication required');
        }

        const targetRole = req.body[targetRoleParam] || req.params[targetRoleParam];

        if (!targetRole) {
          throw new ApiError(400, 'Target role is required');
        }

        if (!RBACService.isValidRole(targetRole)) {
          throw new ApiError(400, 'Invalid role specified');
        }

        const canAssign = RBACService.canAssignRole(req.user.role, targetRole);

        if (!canAssign) {
          const roleDisplayName = RBACService.getRoleDisplayName(targetRole);
          throw new ApiError(403, `Access denied. You cannot assign the role: ${roleDisplayName}`);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Resource-specific authorization middleware creators
   */
  static courses = {
    read: AuthorizationMiddleware.requirePermission(EResource.Courses, EPermission.Read),
    write: AuthorizationMiddleware.requirePermission(EResource.Courses, EPermission.Write),
    delete: AuthorizationMiddleware.requirePermission(EResource.Courses, EPermission.Delete),
  };

  static students = {
    read: AuthorizationMiddleware.requirePermission(EResource.Students, EPermission.Read),
    write: AuthorizationMiddleware.requirePermission(EResource.Students, EPermission.Write),
    delete: AuthorizationMiddleware.requirePermission(EResource.Students, EPermission.Delete),
  };

  static teachers = {
    read: AuthorizationMiddleware.requirePermission(EResource.Teachers, EPermission.Read),
    write: AuthorizationMiddleware.requirePermission(EResource.Teachers, EPermission.Write),
    delete: AuthorizationMiddleware.requirePermission(EResource.Teachers, EPermission.Delete),
  };

  static locations = {
    read: AuthorizationMiddleware.requirePermission(EResource.Locations, EPermission.Read),
    write: AuthorizationMiddleware.requirePermission(EResource.Locations, EPermission.Write),
    delete: AuthorizationMiddleware.requirePermission(EResource.Locations, EPermission.Delete),
  };

  static groups = {
    read: AuthorizationMiddleware.requirePermission(EResource.Groups, EPermission.Read),
    write: AuthorizationMiddleware.requirePermission(EResource.Groups, EPermission.Write),
    delete: AuthorizationMiddleware.requirePermission(EResource.Groups, EPermission.Delete),
  };

  static payments = {
    read: AuthorizationMiddleware.requirePermission(EResource.Payments, EPermission.Read),
    write: AuthorizationMiddleware.requirePermission(EResource.Payments, EPermission.Write),
    delete: AuthorizationMiddleware.requirePermission(EResource.Payments, EPermission.Delete),
  };

  static discounts = {
    read: AuthorizationMiddleware.requirePermission(EResource.Discounts, EPermission.Read),
    write: AuthorizationMiddleware.requirePermission(EResource.Discounts, EPermission.Write),
    delete: AuthorizationMiddleware.requirePermission(EResource.Discounts, EPermission.Delete),
  };

  /**
   * Middleware composition helpers
   */
  static compose(...middlewares: Array<(req: AuthenticatedRequest, res: Response, next: NextFunction) => void>) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      let index = 0;

      const dispatch = (i: number): void => {
        if (i <= index) {
          throw new Error('next() called multiple times');
        }
        index = i;

        const middleware = middlewares[i];

        if (!middleware) {
          next();
          return;
        }

        try {
          middleware(req, res, dispatch.bind(null, i + 1));
        } catch (error) {
          next(error);
        }
      };

      dispatch(0);
    };
  }

  /**
   * Development helper to check user context
   */
  static debugUser() {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
      if (process.env['NODE_ENV'] === 'development') {
        console.log('🔐 User Context:', req.user);

        if (req.user) {
          const capabilities = RBACService.getAvailableResources(req.user.role);
          console.log('🛠️ User Capabilities:', capabilities);
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
      console.log('📊 Access Log:', JSON.stringify(logData));

      next();
    };
  }
}

// Convenience exports for easier imports
export const auth = AuthorizationMiddleware.authenticate;
export const optionalAuth = AuthorizationMiddleware.optionalAuth;
export const requireRole = AuthorizationMiddleware.requireRole;
export const requirePermission = AuthorizationMiddleware.requirePermission;
export const requireAdmin = AuthorizationMiddleware.requireAdmin;
export const requireSuperAdmin = AuthorizationMiddleware.requireSuperAdmin;
export const requireTeacher = AuthorizationMiddleware.requireTeacher;
export const requireUserAccess = AuthorizationMiddleware.requireUserAccess;

export default AuthorizationMiddleware;

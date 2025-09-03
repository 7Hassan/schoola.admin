import { UserRole } from '@schoola/types/src';
import {
  IAccessRight,
  EResource,
  EPermission,
  moderationAccessRights,
  readOnlyAccess,
  defaultAccessRights,
} from '../config/accessRights';
import { adminRole, superAdminRole } from '../config/roles';

/**
 * Role-Based Access Control (RBAC) Service
 * Handles role assignment, permission checking, and access right management
 */
export class RBACService {
  /**
   * Get access rights for a specific role
   */
  static getAccessRightsByRole(role: UserRole): IAccessRight[] {
    switch (role) {
      case UserRole.SuperAdmin:
        return superAdminRole.accessRights;
      case UserRole.Admin:
        return adminRole.accessRights;
      case UserRole.Teacher:
        return moderationAccessRights; // Teachers have moderation access
      case UserRole.Student:
        return this.getStudentAccessRights();
      case UserRole.Parent:
        return this.getParentAccessRights();
      case UserRole.Authority:
        return readOnlyAccess; // Authorities have read-only access
      case UserRole.Editor:
        return moderationAccessRights;
      case UserRole.Viewer:
        return readOnlyAccess;
      default:
        return defaultAccessRights;
    }
  }

  /**
   * Check if a role has permission for a specific resource and action
   */
  static hasPermission(role: UserRole, resource: string, permission: 'read' | 'write' | 'delete'): boolean {
    const accessRights = this.getAccessRightsByRole(role);
    const resourceAccess = accessRights.find((access) => access.resource === (resource as EResource));

    if (!resourceAccess) return false;

    return resourceAccess.permissions[permission as EPermission] === true;
  }

  /**
   * Get role display name
   */
  static getRoleDisplayName(role: UserRole): string {
    const roleNames: Record<UserRole, string> = {
      [UserRole.SuperAdmin]: 'Super Administrator',
      [UserRole.Admin]: 'Administrator',
      [UserRole.Editor]: 'Editor',
      [UserRole.Viewer]: 'Viewer',
      [UserRole.Teacher]: 'Teacher',
      [UserRole.Student]: 'Student',
      [UserRole.Parent]: 'Parent',
      [UserRole.Authority]: 'Authority',
    };

    return roleNames[role] || 'User';
  }

  /**
   * Validate if a role is valid and can be assigned
   */
  static isValidRole(role: string): role is UserRole {
    return Object.values(UserRole).includes(role as UserRole);
  }

  /**
   * Check if a role can be assigned by another role
   */
  static canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
    // Super admin can assign any role
    if (assignerRole === UserRole.SuperAdmin) return true;

    // Admin can assign teacher, student, parent, authority roles
    if (assignerRole === UserRole.Admin) {
      return [
        UserRole.Teacher,
        UserRole.Student,
        UserRole.Parent,
        UserRole.Authority,
        UserRole.Editor,
        UserRole.Viewer,
      ].includes(targetRole);
    }

    // Other roles cannot assign roles
    return false;
  }

  /**
   * Get default role for new registrations
   */
  static getDefaultRegistrationRole(): UserRole {
    return UserRole.Student;
  }

  /**
   * Get Student-specific access rights
   */
  private static getStudentAccessRights(): IAccessRight[] {
    return [
      {
        resource: EResource.Courses,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Groups,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Teachers,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Students,
        permissions: {
          [EPermission.Read]: false,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Payments,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Locations,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Authorities,
        permissions: {
          [EPermission.Read]: false,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Discounts,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
    ];
  }

  /**
   * Get Parent-specific access rights
   */
  private static getParentAccessRights(): IAccessRight[] {
    return [
      {
        resource: EResource.Students,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Courses,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Groups,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Teachers,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Payments,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Locations,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Authorities,
        permissions: {
          [EPermission.Read]: false,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
      {
        resource: EResource.Discounts,
        permissions: {
          [EPermission.Read]: true,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        },
      },
    ];
  }

  /**
   * Get all available resources for a role
   */
  static getAvailableResources(role: UserRole): string[] {
    const accessRights = this.getAccessRightsByRole(role);
    return accessRights
      .filter((access) => Object.values(access.permissions).some((permission) => permission === true))
      .map((access) => access.resource);
  }

  /**
   * Get permissions for a specific resource and role
   */
  static getResourcePermissions(role: UserRole, resource: string): Record<string, boolean> {
    const accessRights = this.getAccessRightsByRole(role);
    const resourceAccess = accessRights.find((access) => access.resource === (resource as EResource));

    return resourceAccess
      ? resourceAccess.permissions
      : {
          [EPermission.Read]: false,
          [EPermission.Write]: false,
          [EPermission.Delete]: false,
        };
  }
}

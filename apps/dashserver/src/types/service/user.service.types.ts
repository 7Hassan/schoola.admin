import { UserRole } from '@schoola/types/src';

/**
 * Service layer types for User operations
 */

// Input types for creating users
export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: UserRole;
  phone?: string;
  profilePhoto?: string;
  studentId?: string;
  teacherId?: string;
  adminProfile?: {
    department: string;
    permissions: string[];
  };
}

// Input types for updating users
export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: UserRole;
  phone?: string;
  profilePhoto?: string;
  isActive?: boolean;
  studentId?: string;
  teacherId?: string;
  adminProfile?: {
    department: string;
    permissions: string[];
  };
  accessRights?: any[]; // IAccessRight[] but avoiding circular dependency
}

// Query filter for user searches
export interface UserQueryFilter {
  role?: UserRole;
  isVerified?: boolean;
  searchTerm?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  isActive?: boolean;
}

// Search and pagination options
export interface UserSearchOptions {
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includePassword?: boolean;
  includeAccessRights?: boolean;
}

// User profile for API responses
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  phone?: string;
  profilePhoto?: string;
  studentId?: string;
  teacherId?: string;
  adminProfile?: {
    department: string;
    permissions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// User creation result
export interface UserCreationResult {
  user: UserProfile;
  message: string;
  warnings?: string[];
}

// User update result
export interface UserUpdateResult {
  user: UserProfile;
  message: string;
  changes: string[];
}

// User statistics
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
  recentRegistrations: number;
  lastWeekRegistrations: number;
}

// Bulk operation result
export interface BulkUserOperationResult {
  successful: number;
  failed: number;
  errors: Array<{
    email: string;
    error: string;
  }>;
  users: UserProfile[];
}

// Role change request
export interface RoleChangeRequest {
  userId: string;
  currentRole: UserRole;
  newRole: UserRole;
  reason: string;
  requestedBy: string;
  requestedAt: Date;
}

// User validation result
export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// User search result with pagination
export interface PaginatedUserResult {
  users: UserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: UserQueryFilter;
}

import { Request } from 'express';
import { UserRole } from '@schoola/types/src';

/**
 * Extended Request interface with authenticated user information
 * Used across all controllers that require authentication
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
    name?: string;
  };
}

/**
 * Standard API response format used across all controllers
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
  code?: string;
}

/**
 * Pagination options for list endpoints
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Standard paginated response format
 */
export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Query filter base type
 */
export type QueryFilter = Record<string, any>;

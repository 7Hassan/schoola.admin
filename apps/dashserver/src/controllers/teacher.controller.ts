import { Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../modules/errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../modules/paginate/paginate';
import * as teacherService from '../services/teacher.service';
import { UserRole } from '@schoola/types/src';
import { AuthenticatedRequest } from '../types';

/**
 * POST /teachers
 * Create a new teacher
 */
export const createTeacher = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // Only admins can create teachers
  if (req.user?.role !== UserRole.SuperAdmin && req.user?.role !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to create teacher');
  }

  const teacher = await teacherService.createTeacher(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    data: teacher,
    message: 'Teacher created successfully',
  });
});

/**
 * GET /teachers
 * Get all teachers with pagination and filtering
 */
export const getTeachers = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const filter = pick(req.query, ['firstName', 'lastName', 'email', 'department', 'status', 'employmentType']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await teacherService.queryTeachers(filter, options, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Teachers retrieved successfully',
  });
});

/**
 * GET /teachers/:teacherId
 * Get teacher by ID
 */
export const getTeacher = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const teacherId = req.params['teacherId'];
  if (!teacherId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Teacher ID is required');
  }

  const teacher = await teacherService.getTeacherById(teacherId, req.user.role);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: teacher,
    message: 'Teacher retrieved successfully',
  });
});

/**
 * PATCH /teachers/:teacherId
 * Update teacher by ID
 */
export const updateTeacher = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const teacherId = req.params['teacherId'];
  if (!teacherId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Teacher ID is required');
  }

  const teacher = await teacherService.updateTeacherById(teacherId, req.body, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: teacher,
    message: 'Teacher updated successfully',
  });
});

/**
 * DELETE /teachers/:teacherId
 * Delete teacher by ID (soft delete)
 */
export const deleteTeacher = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const teacherId = req.params['teacherId'];
  if (!teacherId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Teacher ID is required');
  }

  await teacherService.deleteTeacherById(teacherId, req.user.role);
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Teacher deleted successfully',
  });
});

/**
 * GET /teachers/department/:department
 * Get teachers by department
 */
export const getTeachersByDepartment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const department = req.params['department'];
  if (!department) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Department is required');
  }

  const teachers = await teacherService.getTeachersByDepartment(department, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: teachers,
    message: 'Teachers retrieved successfully',
  });
});

/**
 * GET /teachers/stats
 * Get teacher statistics (admin only)
 */
export const getTeacherStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const stats = await teacherService.getTeacherStats(req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: stats,
    message: 'Teacher statistics retrieved successfully',
  });
});

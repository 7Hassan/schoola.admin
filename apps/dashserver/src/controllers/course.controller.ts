import { Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../modules/errors/ApiError';
import pick from '../utils/pick';
import * as courseService from '../services/course.service';
import { UserRole } from '@schoola/types/src';
import { AuthenticatedRequest } from '../types';

/**
 * POST /courses
 * Create a new course
 */
export const createCourse = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const course = await courseService.createCourse(req.body, req.user.role);
  res.status(httpStatus.CREATED).json({
    success: true,
    data: course,
    message: 'Course created successfully',
  });
});

/**
 * GET /courses
 * Get all courses with pagination and filtering
 */
export const getCourses = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const filter = pick(req.query, ['name', 'code', 'level', 'status', 'subject']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await courseService.queryCourses(filter, options, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Courses retrieved successfully',
  });
});

/**
 * GET /courses/:courseId
 * Get course by ID
 */
export const getCourse = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const courseId = req.params['courseId'];
  if (!courseId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course ID is required');
  }

  const course = await courseService.getCourseById(courseId, req.user.role);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: course,
    message: 'Course retrieved successfully',
  });
});

/**
 * PATCH /courses/:courseId
 * Update course by ID
 */
export const updateCourse = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const courseId = req.params['courseId'];
  if (!courseId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course ID is required');
  }

  const course = await courseService.updateCourseById(courseId, req.body, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: course,
    message: 'Course updated successfully',
  });
});

/**
 * DELETE /courses/:courseId
 * Delete course by ID (soft delete)
 */
export const deleteCourse = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const courseId = req.params['courseId'];
  if (!courseId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course ID is required');
  }

  await courseService.deleteCourseById(courseId, req.user.role);
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

/**
 * GET /courses/level/:level
 * Get courses by level
 */
export const getCoursesByLevel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const level = req.params['level'];
  if (!level) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Level is required');
  }

  const courses = await courseService.getCoursesByLevel(level, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: courses,
    message: 'Courses retrieved successfully',
  });
});

/**
 * GET /courses/stats
 * Get course statistics (admin only)
 */
export const getCourseStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const stats = await courseService.getCourseStats(req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: stats,
    message: 'Course statistics retrieved successfully',
  });
});

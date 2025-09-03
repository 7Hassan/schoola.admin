import { Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../modules/errors/ApiError';
import pick from '../utils/pick';
import * as studentService from '../services/student.service';
import { AuthenticatedRequest } from '../types';

/**
 * POST /students
 * Create a new student
 */
export const createStudent = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const student = await studentService.createStudent(req.body, req.user.role);
  res.status(httpStatus.CREATED).json({
    success: true,
    data: student,
    message: 'Student created successfully',
  });
});

/**
 * GET /students
 * Get all students with pagination and filtering
 */
export const getStudents = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const filter = pick(req.query, ['firstName', 'lastName', 'email', 'studentCode', 'status', 'group']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await studentService.queryStudents(filter, options, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Students retrieved successfully',
  });
});

/**
 * GET /students/:studentId
 * Get student by ID
 */
export const getStudent = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const studentId = req.params['studentId'];
  if (!studentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student ID is required');
  }

  const student = await studentService.getStudentById(studentId, req.user.role);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: student,
    message: 'Student retrieved successfully',
  });
});

/**
 * PATCH /students/:studentId
 * Update student by ID
 */
export const updateStudent = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const studentId = req.params['studentId'];
  if (!studentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student ID is required');
  }

  const student = await studentService.updateStudentById(studentId, req.body, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: student,
    message: 'Student updated successfully',
  });
});

/**
 * DELETE /students/:studentId
 * Delete student by ID (soft delete)
 */
export const deleteStudent = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const studentId = req.params['studentId'];
  if (!studentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student ID is required');
  }

  await studentService.deleteStudentById(studentId, req.user.role);
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Student deleted successfully',
  });
});

/**
 * GET /students/group/:groupId
 * Get students by group
 */
export const getStudentsByGroup = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const groupId = req.params['groupId'];
  if (!groupId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Group ID is required');
  }

  const students = await studentService.getStudentsByGroup(groupId, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: students,
    message: 'Students retrieved successfully',
  });
});

/**
 * GET /students/stats
 * Get student statistics (admin only)
 */
export const getStudentStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const stats = await studentService.getStudentStats(req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: stats,
    message: 'Student statistics retrieved successfully',
  });
});

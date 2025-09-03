import { Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../modules/errors/ApiError';
import pick from '../utils/pick';
import * as paymentService from '../services/payment.service';
import { AuthenticatedRequest } from '../types';

/**
 * POST /payments
 * Create a new payment
 */
export const createPayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const payment = await paymentService.createPayment(req.body, req.user.role);
  res.status(httpStatus.CREATED).json({
    success: true,
    data: payment,
    message: 'Payment created successfully',
  });
});

/**
 * GET /payments
 * Get all payments with pagination and filtering
 */
export const getPayments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const filter = pick(req.query, ['amount', 'status', 'method', 'student', 'invoice']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await paymentService.queryPayments(filter, options, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Payments retrieved successfully',
  });
});

/**
 * GET /payments/:paymentId
 * Get payment by ID
 */
export const getPayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const paymentId = req.params['paymentId'];
  if (!paymentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment ID is required');
  }

  const payment = await paymentService.getPaymentById(paymentId, req.user.role);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: payment,
    message: 'Payment retrieved successfully',
  });
});

/**
 * PATCH /payments/:paymentId
 * Update payment by ID
 */
export const updatePayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const paymentId = req.params['paymentId'];
  if (!paymentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment ID is required');
  }

  const payment = await paymentService.updatePaymentById(paymentId, req.body, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: payment,
    message: 'Payment updated successfully',
  });
});

/**
 * DELETE /payments/:paymentId
 * Delete payment by ID (mark as cancelled)
 */
export const deletePayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const paymentId = req.params['paymentId'];
  if (!paymentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment ID is required');
  }

  await paymentService.deletePaymentById(paymentId, req.user.role);
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Payment cancelled successfully',
  });
});

/**
 * GET /payments/student/:studentId
 * Get payments by student
 */
export const getPaymentsByStudent = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const studentId = req.params['studentId'];
  if (!studentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student ID is required');
  }

  const payments = await paymentService.getPaymentsByStudent(studentId, req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: payments,
    message: 'Payments retrieved successfully',
  });
});

/**
 * GET /payments/stats
 * Get payment statistics (admin only)
 */
export const getPaymentStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const stats = await paymentService.getPaymentStats(req.user.role);
  res.status(httpStatus.OK).json({
    success: true,
    data: stats,
    message: 'Payment statistics retrieved successfully',
  });
});

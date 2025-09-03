import httpStatus from 'http-status';
import Payment from './db/models/payment.model';
import ApiError from '../modules/errors/ApiError';
import { PaymentDocument } from '../types';
import { UserRole } from '@schoola/types/src';

/**
 * Create a payment
 * @param {Object} paymentBody
 * @param {UserRole} requesterRole
 * @returns {Promise<PaymentDocument>}
 */
export const createPayment = async (
  paymentBody: Partial<PaymentDocument>,
  requesterRole: UserRole,
): Promise<PaymentDocument> => {
  // Only admins, editors, and teachers can create payments
  if (
    requesterRole !== UserRole.SuperAdmin &&
    requesterRole !== UserRole.Admin &&
    requesterRole !== UserRole.Editor &&
    requesterRole !== UserRole.Teacher
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to create payment');
  }

  return Payment.create(paymentBody);
};

/**
 * Query for payments with role-based filtering
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {UserRole} requesterRole - Role of the user making the request
 * @returns {Promise<Object>}
 */
export const queryPayments = async (
  filter: Record<string, any>,
  options: { limit?: number; page?: number; sortBy?: string },
  requesterRole: UserRole,
): Promise<{ results: PaymentDocument[]; page: number; limit: number; totalPages: number; totalResults: number }> => {
  // Apply role-based filtering
  const roleFilter = { ...filter };

  // Students and parents can only see their own payments
  if (requesterRole === UserRole.Student || requesterRole === UserRole.Parent) {
    // This would require additional context about which payments belong to the user
    // For now, we'll restrict access completely for these roles
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const payments = await Payment.find(roleFilter)
    .populate('student', 'firstName lastName studentCode')
    .populate('invoice', 'invoiceNumber amount');

  // Manual pagination
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const paginatedPayments = payments.slice(skip, skip + limit);

  return {
    results: paginatedPayments,
    page,
    limit,
    totalPages: Math.ceil(payments.length / limit),
    totalResults: payments.length,
  };
};

/**
 * Get payment by id with role-based access control
 * @param {string} id
 * @param {UserRole} requesterRole
 * @returns {Promise<PaymentDocument>}
 */
export const getPaymentById = async (id: string, requesterRole: UserRole): Promise<PaymentDocument | null> => {
  const payment = await Payment.findById(id)
    .populate('student', 'firstName lastName studentCode')
    .populate('invoice', 'invoiceNumber amount');

  if (!payment) {
    return null;
  }

  // Students and parents can only see their own payments
  if (requesterRole === UserRole.Student || requesterRole === UserRole.Parent) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  return payment;
};

/**
 * Update payment by id
 * @param {string} paymentId
 * @param {Object} updateBody
 * @param {UserRole} requesterRole
 * @returns {Promise<PaymentDocument>}
 */
export const updatePaymentById = async (
  paymentId: string,
  updateBody: Partial<PaymentDocument>,
  requesterRole: UserRole,
): Promise<PaymentDocument | null> => {
  const payment = await getPaymentById(paymentId, requesterRole);

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  // Only admins and editors can update payments
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin && requesterRole !== UserRole.Editor) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to update payment');
  }

  // Only admins can update certain fields
  const restrictedFields = ['amount', 'status'];
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    restrictedFields.forEach((field) => {
      if (field in updateBody) {
        delete updateBody[field as keyof PaymentDocument];
      }
    });
  }

  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

/**
 * Delete payment by id
 * @param {string} paymentId
 * @param {UserRole} requesterRole
 * @returns {Promise<PaymentDocument>}
 */
export const deletePaymentById = async (paymentId: string, requesterRole: UserRole): Promise<PaymentDocument | null> => {
  // Only admins can delete payments
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to delete payment');
  }

  const payment = await getPaymentById(paymentId, requesterRole);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  // Payments should not be deleted, but rather marked as cancelled
  payment.status = 'cancelled' as any; // Assuming there's a cancelled status
  await payment.save();
  return payment;
};

/**
 * Get payments by student
 * @param {string} studentId
 * @param {UserRole} requesterRole
 * @returns {Promise<PaymentDocument[]>}
 */
export const getPaymentsByStudent = async (studentId: string, requesterRole: UserRole): Promise<PaymentDocument[]> => {
  // Students and parents can only see their own payments
  if (requesterRole === UserRole.Student || requesterRole === UserRole.Parent) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const payments = await Payment.find({ student: studentId })
    .populate('student', 'firstName lastName studentCode')
    .populate('invoice', 'invoiceNumber amount');

  return payments;
};

/**
 * Get payment statistics
 * @param {UserRole} requesterRole
 * @returns {Promise<Object>}
 */
export const getPaymentStats = async (requesterRole: UserRole): Promise<Record<string, any>> => {
  // Only admins can view statistics
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to view statistics');
  }

  const totalPayments = await Payment.countDocuments();
  const pendingPayments = await Payment.countDocuments({ status: 'pending' });
  const completedPayments = await Payment.countDocuments({ status: 'completed' });
  const failedPayments = await Payment.countDocuments({ status: 'failed' });

  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const paymentMethodStats = await Payment.aggregate([{ $group: { _id: '$paymentDetails.method', count: { $sum: 1 } } }]);

  return {
    total: totalPayments,
    pending: pendingPayments,
    completed: completedPayments,
    failed: failedPayments,
    totalRevenue: totalRevenue[0]?.total || 0,
    byMethod: paymentMethodStats,
  };
};

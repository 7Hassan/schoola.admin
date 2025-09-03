import { Types } from 'mongoose';
import Payment from '../services/db/models/payment.model';
import { PaymentDocument } from '../types';
import { EntityStatus } from '@schoola/types/src';

/**
 * Data Access Object for Payment operations
 * Handles all database interactions for payment management
 */
export class PaymentDAO {
  /**
   * Create a new payment record
   * @param paymentData - Payment creation data
   * @returns Promise<PaymentDocument>
   */
  static async create(paymentData: Partial<PaymentDocument>): Promise<PaymentDocument> {
    const payment = new Payment(paymentData);
    return payment.save();
  }

  /**
   * Find payment by ID
   * @param paymentId - Payment ID
   * @param populate - Fields to populate
   * @returns Promise<PaymentDocument | null>
   */
  static async findById(paymentId: string | Types.ObjectId, populate?: string[]): Promise<PaymentDocument | null> {
    let query = Payment.findById(paymentId);

    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    return query.exec();
  }

  /**
   * Find payment by transaction ID
   * @param transactionId - Transaction ID
   * @returns Promise<PaymentDocument | null>
   */
  static async findByTransactionId(transactionId: string): Promise<PaymentDocument | null> {
    return Payment.findOne({ transactionId }).populate(['userId', 'courseId', 'groupId']);
  }

  /**
   * Find payments with filters
   * @param filter - Query filter
   * @param options - Query options
   * @returns Promise<PaymentDocument[]>
   */
  static async find(
    filter: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      populate?: string[];
    } = {},
  ): Promise<PaymentDocument[]> {
    let query = Payment.find(filter);

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.populate) {
      options.populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    return query.exec();
  }

  /**
   * Update payment by ID
   * @param paymentId - Payment ID
   * @param updateData - Update data
   * @returns Promise<PaymentDocument | null>
   */
  static async updateById(
    paymentId: string | Types.ObjectId,
    updateData: Partial<PaymentDocument>,
  ): Promise<PaymentDocument | null> {
    return Payment.findByIdAndUpdate(
      paymentId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate(['userId', 'courseId', 'groupId']);
  }

  /**
   * Delete payment by ID (soft delete)
   * @param paymentId - Payment ID
   * @returns Promise<PaymentDocument | null>
   */
  static async deleteById(paymentId: string | Types.ObjectId): Promise<PaymentDocument | null> {
    return Payment.findByIdAndUpdate(paymentId, { status: EntityStatus.Inactive, updatedAt: new Date() }, { new: true });
  }

  /**
   * Count payments with filter
   * @param filter - Query filter
   * @returns Promise<number>
   */
  static async count(filter: Record<string, any> = {}): Promise<number> {
    return Payment.countDocuments(filter);
  }

  /**
   * Find payments by user
   * @param userId - User ID
   * @param includeInactive - Include inactive payments
   * @returns Promise<PaymentDocument[]>
   */
  static async findByUser(userId: string | Types.ObjectId, includeInactive: boolean = false): Promise<PaymentDocument[]> {
    const filter: Record<string, any> = { userId };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Payment.find(filter).populate(['courseId', 'groupId']).sort({ createdAt: -1 });
  }

  /**
   * Find payments by course
   * @param courseId - Course ID
   * @param includeInactive - Include inactive payments
   * @returns Promise<PaymentDocument[]>
   */
  static async findByCourse(
    courseId: string | Types.ObjectId,
    includeInactive: boolean = false,
  ): Promise<PaymentDocument[]> {
    const filter: Record<string, any> = { courseId };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Payment.find(filter).populate(['userId', 'groupId']).sort({ createdAt: -1 });
  }

  /**
   * Find payments by group
   * @param groupId - Group ID
   * @param includeInactive - Include inactive payments
   * @returns Promise<PaymentDocument[]>
   */
  static async findByGroup(groupId: string | Types.ObjectId, includeInactive: boolean = false): Promise<PaymentDocument[]> {
    const filter: Record<string, any> = { groupId };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Payment.find(filter).populate(['userId', 'courseId']).sort({ createdAt: -1 });
  }

  /**
   * Find payments by payment status
   * @param paymentStatus - Payment status
   * @param includeInactive - Include inactive payments
   * @returns Promise<PaymentDocument[]>
   */
  static async findByPaymentStatus(paymentStatus: string, includeInactive: boolean = false): Promise<PaymentDocument[]> {
    const filter: Record<string, any> = { paymentStatus };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Payment.find(filter).populate(['userId', 'courseId', 'groupId']).sort({ createdAt: -1 });
  }

  /**
   * Find payments by amount range
   * @param minAmount - Minimum amount
   * @param maxAmount - Maximum amount
   * @param includeInactive - Include inactive payments
   * @returns Promise<PaymentDocument[]>
   */
  static async findByAmountRange(
    minAmount: number,
    maxAmount: number,
    includeInactive: boolean = false,
  ): Promise<PaymentDocument[]> {
    const filter: Record<string, any> = {
      amount: { $gte: minAmount, $lte: maxAmount },
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Payment.find(filter).populate(['userId', 'courseId', 'groupId']).sort({ amount: -1 });
  }

  /**
   * Find payments by date range
   * @param startDate - Start date
   * @param endDate - End date
   * @param includeInactive - Include inactive payments
   * @returns Promise<PaymentDocument[]>
   */
  static async findByDateRange(
    startDate: Date,
    endDate: Date,
    includeInactive: boolean = false,
  ): Promise<PaymentDocument[]> {
    const filter: Record<string, any> = {
      createdAt: { $gte: startDate, $lte: endDate },
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Payment.find(filter).populate(['userId', 'courseId', 'groupId']).sort({ createdAt: -1 });
  }

  /**
   * Get payment statistics
   * @returns Promise<any[]>
   */
  static async getStatistics(): Promise<any[]> {
    return Payment.aggregate([
      {
        $match: { status: EntityStatus.Active },
      },
      {
        $group: {
          _id: '$paymentStatus',
          total: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);
  }

  /**
   * Get revenue analytics by period
   * @param period - Time period ('daily', 'weekly', 'monthly')
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise<any[]>
   */
  static async getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly', startDate: Date, endDate: Date): Promise<any[]> {
    const groupFormat = {
      daily: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      weekly: { $dateToString: { format: '%Y-W%U', date: '$createdAt' } },
      monthly: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
    };

    return Payment.aggregate([
      {
        $match: {
          status: EntityStatus.Active,
          paymentStatus: 'completed',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupFormat[period],
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          avgTransactionValue: { $avg: '$amount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  /**
   * Search payments by text
   * @param searchText - Text to search in transaction ID and user info
   * @param includeInactive - Include inactive payments
   * @returns Promise<PaymentDocument[]>
   */
  static async searchByText(searchText: string, includeInactive: boolean = false): Promise<PaymentDocument[]> {
    const filter: Record<string, any> = {
      $or: [
        { transactionId: { $regex: searchText, $options: 'i' } },
        { 'paymentMethod.last4': { $regex: searchText, $options: 'i' } },
        { notes: { $regex: searchText, $options: 'i' } },
      ],
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }

    return Payment.find(filter).populate(['userId', 'courseId', 'groupId']).sort({ createdAt: -1 });
  }

  /**
   * Get user payment history
   * @param userId - User ID
   * @param limit - Limit results
   * @returns Promise<PaymentDocument[]>
   */
  static async getUserPaymentHistory(userId: string | Types.ObjectId, limit: number = 50): Promise<PaymentDocument[]> {
    return Payment.find({
      userId,
      status: EntityStatus.Active,
    })
      .populate(['courseId', 'groupId'])
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Get course payment statistics
   * @param courseId - Course ID
   * @returns Promise<any>
   */
  static async getCoursePaymentStats(courseId: string | Types.ObjectId): Promise<any> {
    const stats = await Payment.aggregate([
      {
        $match: {
          courseId: new Types.ObjectId(courseId.toString()),
          status: EntityStatus.Active,
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalPayments: { $sum: 1 },
          avgPayment: { $avg: '$amount' },
          maxPayment: { $max: '$amount' },
          minPayment: { $min: '$amount' },
        },
      },
    ]);

    return (
      stats[0] || {
        totalRevenue: 0,
        totalPayments: 0,
        avgPayment: 0,
        maxPayment: 0,
        minPayment: 0,
      }
    );
  }

  /**
   * Check if transaction ID exists
   * @param transactionId - Transaction ID to check
   * @param excludeId - Payment ID to exclude from check
   * @returns Promise<boolean>
   */
  static async transactionIdExists(transactionId: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { transactionId };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Payment.countDocuments(filter);
    return count > 0;
  }

  /**
   * Bulk update payments
   * @param filter - Query filter
   * @param updateData - Update data
   * @returns Promise<any>
   */
  static async updateMany(filter: Record<string, any>, updateData: Partial<PaymentDocument>): Promise<any> {
    return Payment.updateMany(filter, { ...updateData, updatedAt: new Date() });
  }

  /**
   * Get failed payments for retry
   * @param maxAge - Maximum age of failed payments in hours
   * @returns Promise<PaymentDocument[]>
   */
  static async getFailedPaymentsForRetry(maxAge: number = 24): Promise<PaymentDocument[]> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - maxAge);

    return Payment.find({
      paymentStatus: 'failed',
      status: EntityStatus.Active,
      createdAt: { $gte: cutoffDate },
    })
      .populate(['userId', 'courseId', 'groupId'])
      .sort({ createdAt: -1 });
  }
}

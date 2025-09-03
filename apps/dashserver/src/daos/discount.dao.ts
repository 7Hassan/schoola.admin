import { Types } from 'mongoose';
import Discount from '../services/db/models/discount.model';
import { DiscountDocument } from '../types';
import { EntityStatus } from '@schoola/types/src';

/**
 * Data Access Object for Discount operations
 * Handles all database interactions for discount management
 */
export class DiscountDAO {
  /**
   * Create a new discount
   * @param discountData - Discount creation data
   * @returns Promise<DiscountDocument>
   */
  static async create(discountData: Partial<DiscountDocument>): Promise<DiscountDocument> {
    const discount = new Discount(discountData);
    return discount.save();
  }

  /**
   * Find discount by ID
   * @param discountId - Discount ID
   * @param populate - Fields to populate
   * @returns Promise<DiscountDocument | null>
   */
  static async findById(discountId: string | Types.ObjectId, populate?: string[]): Promise<DiscountDocument | null> {
    let query = Discount.findById(discountId);

    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    return query.exec();
  }

  /**
   * Find discount by code
   * @param code - Discount code
   * @returns Promise<DiscountDocument | null>
   */
  static async findByCode(code: string): Promise<DiscountDocument | null> {
    return Discount.findOne({ code: code.toUpperCase() });
  }

  /**
   * Find discounts with filters
   * @param filter - Query filter
   * @param options - Query options
   * @returns Promise<DiscountDocument[]>
   */
  static async find(
    filter: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      populate?: string[];
    } = {},
  ): Promise<DiscountDocument[]> {
    let query = Discount.find(filter);

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
   * Update discount by ID
   * @param discountId - Discount ID
   * @param updateData - Update data
   * @returns Promise<DiscountDocument | null>
   */
  static async updateById(
    discountId: string | Types.ObjectId,
    updateData: Partial<DiscountDocument>,
  ): Promise<DiscountDocument | null> {
    return Discount.findByIdAndUpdate(
      discountId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate('createdBy');
  }

  /**
   * Delete discount by ID (soft delete)
   * @param discountId - Discount ID
   * @returns Promise<DiscountDocument | null>
   */
  static async deleteById(discountId: string | Types.ObjectId): Promise<DiscountDocument | null> {
    return Discount.findByIdAndUpdate(discountId, { status: EntityStatus.Inactive, updatedAt: new Date() }, { new: true });
  }

  /**
   * Count discounts with filter
   * @param filter - Query filter
   * @returns Promise<number>
   */
  static async count(filter: Record<string, any> = {}): Promise<number> {
    return Discount.countDocuments(filter);
  }

  /**
   * Find active discounts
   * @param currentDate - Current date for validity check
   * @returns Promise<DiscountDocument[]>
   */
  static async findActiveDiscounts(currentDate: Date = new Date()): Promise<DiscountDocument[]> {
    const filter = {
      status: EntityStatus.Active,
      isActive: true,
      validFrom: { $lte: currentDate },
      $or: [{ validUntil: { $gte: currentDate } }, { validUntil: null }],
    };

    return Discount.find(filter).populate('createdBy').sort({ createdAt: -1 });
  }

  /**
   * Find discounts by type
   * @param type - Discount type
   * @param includeInactive - Include inactive discounts
   * @returns Promise<DiscountDocument[]>
   */
  static async findByType(type: string, includeInactive: boolean = false): Promise<DiscountDocument[]> {
    const filter: Record<string, any> = { type };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }
    return Discount.find(filter).populate('createdBy');
  }

  /**
   * Check discount validity and usage
   * @param code - Discount code
   * @param userId - User ID (optional)
   * @param currentDate - Current date
   * @returns Promise<{valid: boolean, discount?: DiscountDocument, reason?: string}>
   */
  static async validateDiscount(
    code: string,
    userId?: string | Types.ObjectId,
    currentDate: Date = new Date(),
  ): Promise<{ valid: boolean; discount?: DiscountDocument; reason?: string }> {
    const discount = await Discount.findOne({
      code: code.toUpperCase(),
      status: EntityStatus.Active,
      isActive: true,
    }).populate('createdBy');

    if (!discount) {
      return { valid: false, reason: 'Discount code not found or inactive' };
    }

    // Check date validity
    if (discount.validFrom && discount.validFrom > currentDate) {
      return { valid: false, discount, reason: 'Discount not yet valid' };
    }

    if (discount.validUntil && discount.validUntil < currentDate) {
      return { valid: false, discount, reason: 'Discount has expired' };
    }

    // Check usage limits
    if (discount.maxUsage && discount.currentUsage >= discount.maxUsage) {
      return { valid: false, discount, reason: 'Discount usage limit exceeded' };
    }

    // Check per-user usage limits
    if (userId && discount.maxUsagePerUser) {
      const userUsage = discount.usedByUsers.find((usage) => usage.userId.toString() === userId.toString());
      if (userUsage && userUsage.usageCount >= discount.maxUsagePerUser) {
        return { valid: false, discount, reason: 'User usage limit exceeded' };
      }
    }

    return { valid: true, discount };
  }

  /**
   * Use discount (increment usage counters)
   * @param discountId - Discount ID
   * @param userId - User ID
   * @param transactionId - Transaction ID
   * @returns Promise<DiscountDocument | null>
   */
  static async useDiscount(
    discountId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    transactionId: string | Types.ObjectId,
  ): Promise<DiscountDocument | null> {
    return Discount.findByIdAndUpdate(
      discountId,
      {
        $inc: { currentUsage: 1 },
        $push: {
          usedByUsers: {
            $each: [
              {
                userId,
                usageCount: 1,
                lastUsedAt: new Date(),
                transactionIds: [transactionId],
              },
            ],
          },
        },
        updatedAt: new Date(),
      },
      { new: true, upsert: false },
    );
  }

  /**
   * Get discount statistics
   * @returns Promise<any[]>
   */
  static async getStatistics(): Promise<any[]> {
    return Discount.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $and: [{ $eq: ['$status', EntityStatus.Active] }, { $eq: ['$isActive', true] }] }, 1, 0] },
          },
          totalUsage: { $sum: '$currentUsage' },
          avgValue: { $avg: '$value' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }

  /**
   * Search discounts by text
   * @param searchText - Text to search in name, code, and description
   * @param includeInactive - Include inactive discounts
   * @returns Promise<DiscountDocument[]>
   */
  static async searchByText(searchText: string, includeInactive: boolean = false): Promise<DiscountDocument[]> {
    const filter: Record<string, any> = {
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { code: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
      ],
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }

    return Discount.find(filter).populate('createdBy').sort({ name: 1 });
  }

  /**
   * Check if discount code exists (excluding current discount)
   * @param code - Discount code to check
   * @param excludeId - Discount ID to exclude from check
   * @returns Promise<boolean>
   */
  static async codeExists(code: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { code: code.toUpperCase() };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Discount.countDocuments(filter);
    return count > 0;
  }

  /**
   * Find discounts by value range
   * @param minValue - Minimum discount value
   * @param maxValue - Maximum discount value
   * @param includeInactive - Include inactive discounts
   * @returns Promise<DiscountDocument[]>
   */
  static async findByValueRange(
    minValue: number,
    maxValue: number,
    includeInactive: boolean = false,
  ): Promise<DiscountDocument[]> {
    const filter: Record<string, any> = {
      value: { $gte: minValue, $lte: maxValue },
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
      filter['isActive'] = true;
    }

    return Discount.find(filter).populate('createdBy').sort({ value: 1 });
  }

  /**
   * Bulk update discounts
   * @param filter - Query filter
   * @param updateData - Update data
   * @returns Promise<any>
   */
  static async updateMany(filter: Record<string, any>, updateData: Partial<DiscountDocument>): Promise<any> {
    return Discount.updateMany(filter, { ...updateData, updatedAt: new Date() });
  }
}

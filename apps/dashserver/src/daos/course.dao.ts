import { Types } from 'mongoose';
import Course from '../services/db/models/course.model';
import { CourseDocument } from '../types';
import { EntityStatus } from '@schoola/types/src';

/**
 * Data Access Object for Course operations
 * Handles all database interactions for course management
 */
export class CourseDAO {
  /**
   * Create a new course
   * @param courseData - Course creation data
   * @returns Promise<CourseDocument>
   */
  static async create(courseData: Partial<CourseDocument>): Promise<CourseDocument> {
    const course = new Course(courseData);
    return course.save();
  }

  /**
   * Find course by ID
   * @param courseId - Course ID
   * @returns Promise<CourseDocument | null>
   */
  static async findById(courseId: string | Types.ObjectId): Promise<CourseDocument | null> {
    return Course.findById(courseId);
  }

  /**
   * Find course by code
   * @param code - Course code
   * @returns Promise<CourseDocument | null>
   */
  static async findByCode(code: string): Promise<CourseDocument | null> {
    return Course.findOne({ code: code.toUpperCase() });
  }

  /**
   * Find courses with filters
   * @param filter - Query filter
   * @param options - Query options
   * @returns Promise<CourseDocument[]>
   */
  static async find(
    filter: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      populate?: string;
    } = {},
  ): Promise<CourseDocument[]> {
    let query = Course.find(filter);

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
      query = query.populate(options.populate);
    }

    return query.exec();
  }

  /**
   * Update course by ID
   * @param courseId - Course ID
   * @param updateData - Update data
   * @returns Promise<CourseDocument | null>
   */
  static async updateById(
    courseId: string | Types.ObjectId,
    updateData: Partial<CourseDocument>,
  ): Promise<CourseDocument | null> {
    return Course.findByIdAndUpdate(courseId, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true });
  }

  /**
   * Delete course by ID (soft delete)
   * @param courseId - Course ID
   * @returns Promise<CourseDocument | null>
   */
  static async deleteById(courseId: string | Types.ObjectId): Promise<CourseDocument | null> {
    return Course.findByIdAndUpdate(courseId, { status: EntityStatus.Inactive, updatedAt: new Date() }, { new: true });
  }

  /**
   * Count courses with filter
   * @param filter - Query filter
   * @returns Promise<number>
   */
  static async count(filter: Record<string, any> = {}): Promise<number> {
    return Course.countDocuments(filter);
  }

  /**
   * Find courses by level
   * @param level - Course level
   * @param includeInactive - Include inactive courses
   * @returns Promise<CourseDocument[]>
   */
  static async findByLevel(level: string, includeInactive: boolean = false): Promise<CourseDocument[]> {
    const filter: Record<string, any> = { level };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Course.find(filter);
  }

  /**
   * Find courses by subject
   * @param subject - Course subject
   * @param includeInactive - Include inactive courses
   * @returns Promise<CourseDocument[]>
   */
  static async findBySubject(subject: string, includeInactive: boolean = false): Promise<CourseDocument[]> {
    const filter: Record<string, any> = { subject };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Course.find(filter);
  }

  /**
   * Get course statistics aggregation
   * @returns Promise<any[]>
   */
  static async getStatistics(): Promise<any[]> {
    return Course.aggregate([
      {
        $group: {
          _id: '$level',
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', EntityStatus.Active] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$status', EntityStatus.Inactive] }, 1, 0] } },
          avgPrice: { $avg: '$pricing.basePrice' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }

  /**
   * Bulk update courses
   * @param filter - Query filter
   * @param updateData - Update data
   * @returns Promise<any>
   */
  static async updateMany(filter: Record<string, any>, updateData: Partial<CourseDocument>): Promise<any> {
    return Course.updateMany(filter, { ...updateData, updatedAt: new Date() });
  }

  /**
   * Check if course code exists (excluding current course)
   * @param code - Code to check
   * @param excludeId - Course ID to exclude from check
   * @returns Promise<boolean>
   */
  static async codeExists(code: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { code: code.toUpperCase() };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Course.countDocuments(filter);
    return count > 0;
  }

  /**
   * Search courses by text
   * @param searchText - Text to search in name and description
   * @param includeInactive - Include inactive courses
   * @returns Promise<CourseDocument[]>
   */
  static async searchByText(searchText: string, includeInactive: boolean = false): Promise<CourseDocument[]> {
    const filter: Record<string, any> = {
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
        { code: { $regex: searchText, $options: 'i' } },
      ],
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }

    return Course.find(filter).sort({ name: 1 });
  }

  /**
   * Get courses with pricing in range
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @param includeInactive - Include inactive courses
   * @returns Promise<CourseDocument[]>
   */
  static async findByPriceRange(
    minPrice: number,
    maxPrice: number,
    includeInactive: boolean = false,
  ): Promise<CourseDocument[]> {
    const filter: Record<string, any> = {
      'pricing.basePrice': { $gte: minPrice, $lte: maxPrice },
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }

    return Course.find(filter).sort({ 'pricing.basePrice': 1 });
  }
}

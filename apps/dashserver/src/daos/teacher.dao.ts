import { Types } from 'mongoose';
import Teacher from '../services/db/models/teacher.model';
import { TeacherDocument } from '../types';
import { EntityStatus } from '@schoola/types/src';

/**
 * Dat  ): Promise<boolean> {
    const filter: Record<string, any> = { employeeId: employeeId.toUpperCase() };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Teacher.countDocuments(filter);
    return count > 0;s Object for Teacher operations
 * Handles all database interactions for teacher management
 */
export class TeacherDAO {
  /**
   * Create a new teacher
   * @param teacherData - Teacher creation data
   * @returns Promise<TeacherDocument>
   */
  static async create(teacherData: Partial<TeacherDocument>): Promise<TeacherDocument> {
    const teacher = new Teacher(teacherData);
    return teacher.save();
  }

  /**
   * Find teacher by ID
   * @param teacherId - Teacher ID
   * @returns Promise<TeacherDocument | null>
   */
  static async findById(teacherId: string | Types.ObjectId): Promise<TeacherDocument | null> {
    return Teacher.findById(teacherId);
  }

  /**
   * Find teacher by email
   * @param email - Teacher email
   * @returns Promise<TeacherDocument | null>
   */
  static async findByEmail(email: string): Promise<TeacherDocument | null> {
    return Teacher.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find teacher by employee ID
   * @param employeeId - Teacher employee ID
   * @returns Promise<TeacherDocument | null>
   */
  static async findByEmployeeId(employeeId: string): Promise<TeacherDocument | null> {
    return Teacher.findOne({ employeeId });
  }

  /**
   * Find teachers with filters
   * @param filter - Query filter
   * @param options - Query options
   * @returns Promise<TeacherDocument[]>
   */
  static async find(
    filter: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      populate?: string;
    } = {},
  ): Promise<TeacherDocument[]> {
    let query = Teacher.find(filter);

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
   * Update teacher by ID
   * @param teacherId - Teacher ID
   * @param updateData - Update data
   * @returns Promise<TeacherDocument | null>
   */
  static async updateById(
    teacherId: string | Types.ObjectId,
    updateData: Partial<TeacherDocument>,
  ): Promise<TeacherDocument | null> {
    return Teacher.findByIdAndUpdate(
      teacherId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );
  }

  /**
   * Delete teacher by ID (soft delete)
   * @param teacherId - Teacher ID
   * @returns Promise<TeacherDocument | null>
   */
  static async deleteById(teacherId: string | Types.ObjectId): Promise<TeacherDocument | null> {
    return Teacher.findByIdAndUpdate(teacherId, { status: EntityStatus.Inactive, updatedAt: new Date() }, { new: true });
  }

  /**
   * Count teachers with filter
   * @param filter - Query filter
   * @returns Promise<number>
   */
  static async count(filter: Record<string, any> = {}): Promise<number> {
    return Teacher.countDocuments(filter);
  }

  /**
   * Find teachers by department
   * @param department - Department name
   * @param includeInactive - Include inactive teachers
   * @returns Promise<TeacherDocument[]>
   */
  static async findByDepartment(department: string, includeInactive: boolean = false): Promise<TeacherDocument[]> {
    const filter: Record<string, any> = { department };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Teacher.find(filter);
  }

  /**
   * Get teacher statistics aggregation
   * @returns Promise<any[]>
   */
  static async getStatistics(): Promise<any[]> {
    return Teacher.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', EntityStatus.Active] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$status', EntityStatus.Inactive] }, 1, 0] } },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }

  /**
   * Bulk update teachers
   * @param filter - Query filter
   * @param updateData - Update data
   * @returns Promise<any>
   */
  static async updateMany(filter: Record<string, any>, updateData: Partial<TeacherDocument>): Promise<any> {
    return Teacher.updateMany(filter, { ...updateData, updatedAt: new Date() });
  }

  /**
   * Check if email exists (excluding current teacher)
   * @param email - Email to check
   * @param excludeId - Teacher ID to exclude from check
   * @returns Promise<boolean>
   */
  static async emailExists(email: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { email: email.toLowerCase() };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Teacher.countDocuments(filter);
    return count > 0;
  }

  /**
   * Check if employee ID exists (excluding current teacher)
   * @param employeeId - Employee ID to check
   * @param excludeId - Teacher ID to exclude from check
   * @returns Promise<boolean>
   */
  static async employeeIdExists(employeeId: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { employeeId };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Teacher.countDocuments(filter);
    return count > 0;
  }
}

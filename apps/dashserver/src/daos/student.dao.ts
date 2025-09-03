import { Types } from 'mongoose';
import Student from '../services/db/models/student.model';
import { StudentDocument } from '../types';
import { EntityStatus } from '@schoola/types/src';

/**
 * Data Access Object for Student operations
 * Handles all database interactions for student management
 */
export class StudentDAO {
  /**
   * Create a new student
   * @param studentData - Student creation data
   * @returns Promise<StudentDocument>
   */
  static async create(studentData: Partial<StudentDocument>): Promise<StudentDocument> {
    const student = new Student(studentData);
    return student.save();
  }

  /**
   * Find student by ID
   * @param studentId - Student ID
   * @param populate - Fields to populate
   * @returns Promise<StudentDocument | null>
   */
  static async findById(studentId: string | Types.ObjectId, populate?: string[]): Promise<StudentDocument | null> {
    let query = Student.findById(studentId);

    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    return query.exec();
  }

  /**
   * Find student by email
   * @param email - Student email
   * @returns Promise<StudentDocument | null>
   */
  static async findByEmail(email: string): Promise<StudentDocument | null> {
    return Student.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find student by student code
   * @param studentCode - Student code
   * @returns Promise<StudentDocument | null>
   */
  static async findByStudentCode(studentCode: string): Promise<StudentDocument | null> {
    return Student.findOne({ studentCode });
  }

  /**
   * Find students with filters
   * @param filter - Query filter
   * @param options - Query options
   * @returns Promise<StudentDocument[]>
   */
  static async find(
    filter: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      populate?: string[];
    } = {},
  ): Promise<StudentDocument[]> {
    let query = Student.find(filter);

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
   * Update student by ID
   * @param studentId - Student ID
   * @param updateData - Update data
   * @returns Promise<StudentDocument | null>
   */
  static async updateById(
    studentId: string | Types.ObjectId,
    updateData: Partial<StudentDocument>,
  ): Promise<StudentDocument | null> {
    return Student.findByIdAndUpdate(
      studentId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate('group');
  }

  /**
   * Delete student by ID (soft delete)
   * @param studentId - Student ID
   * @returns Promise<StudentDocument | null>
   */
  static async deleteById(studentId: string | Types.ObjectId): Promise<StudentDocument | null> {
    return Student.findByIdAndUpdate(studentId, { status: EntityStatus.Inactive, updatedAt: new Date() }, { new: true });
  }

  /**
   * Count students with filter
   * @param filter - Query filter
   * @returns Promise<number>
   */
  static async count(filter: Record<string, any> = {}): Promise<number> {
    return Student.countDocuments(filter);
  }

  /**
   * Find students by group
   * @param groupId - Group ID
   * @param includeInactive - Include inactive students
   * @returns Promise<StudentDocument[]>
   */
  static async findByGroup(groupId: string | Types.ObjectId, includeInactive: boolean = false): Promise<StudentDocument[]> {
    const filter: Record<string, any> = { group: groupId };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Student.find(filter).populate('group');
  }

  /**
   * Get student statistics aggregation
   * @returns Promise<any[]>
   */
  static async getStatistics(): Promise<any[]> {
    return Student.aggregate([
      {
        $addFields: {
          age: {
            $floor: {
              $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 10] }, then: 'Under 10' },
                { case: { $lt: ['$age', 15] }, then: '10-14' },
                { case: { $lt: ['$age', 18] }, then: '15-17' },
              ],
              default: '18+',
            },
          },
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
   * Bulk update students
   * @param filter - Query filter
   * @param updateData - Update data
   * @returns Promise<any>
   */
  static async updateMany(filter: Record<string, any>, updateData: Partial<StudentDocument>): Promise<any> {
    return Student.updateMany(filter, { ...updateData, updatedAt: new Date() });
  }

  /**
   * Check if email exists (excluding current student)
   * @param email - Email to check
   * @param excludeId - Student ID to exclude from check
   * @returns Promise<boolean>
   */
  static async emailExists(email: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { email: email.toLowerCase() };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Student.countDocuments(filter);
    return count > 0;
  }

  /**
   * Check if student code exists (excluding current student)
   * @param studentCode - Student code to check
   * @param excludeId - Student ID to exclude from check
   * @returns Promise<boolean>
   */
  static async studentCodeExists(studentCode: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { studentCode };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Student.countDocuments(filter);
    return count > 0;
  }

  /**
   * Search students by text
   * @param searchText - Text to search in name and student code
   * @param includeInactive - Include inactive students
   * @returns Promise<StudentDocument[]>
   */
  static async searchByText(searchText: string, includeInactive: boolean = false): Promise<StudentDocument[]> {
    const filter: Record<string, any> = {
      $or: [
        { firstName: { $regex: searchText, $options: 'i' } },
        { lastName: { $regex: searchText, $options: 'i' } },
        { fullName: { $regex: searchText, $options: 'i' } },
        { studentCode: { $regex: searchText, $options: 'i' } },
      ],
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }

    return Student.find(filter).populate('group').sort({ firstName: 1, lastName: 1 });
  }

  /**
   * Get students by age range
   * @param minAge - Minimum age
   * @param maxAge - Maximum age
   * @param includeInactive - Include inactive students
   * @returns Promise<StudentDocument[]>
   */
  static async findByAgeRange(minAge: number, maxAge: number, includeInactive: boolean = false): Promise<StudentDocument[]> {
    const currentDate = new Date();
    const maxBirthDate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
    const minBirthDate = new Date(currentDate.getFullYear() - maxAge - 1, currentDate.getMonth(), currentDate.getDate());

    const filter: Record<string, any> = {
      dateOfBirth: {
        $gte: minBirthDate,
        $lte: maxBirthDate,
      },
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }

    return Student.find(filter).populate('group').sort({ dateOfBirth: -1 });
  }
}

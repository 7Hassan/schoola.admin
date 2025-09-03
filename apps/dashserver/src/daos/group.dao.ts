import { Types } from 'mongoose';
import Group from '../services/db/models/group.model';
import { GroupDocument } from '../types';
import { EntityStatus } from '@schoola/types/src';

/**
 * Data Access Object for Group operations
 * Handles all database interactions for group management
 */
export class GroupDAO {
  /**
   * Create a new group
   * @param groupData - Group creation data
   * @returns Promise<GroupDocument>
   */
  static async create(groupData: Partial<GroupDocument>): Promise<GroupDocument> {
    const group = new Group(groupData);
    return group.save();
  }

  /**
   * Find group by ID
   * @param groupId - Group ID
   * @param populate - Fields to populate
   * @returns Promise<GroupDocument | null>
   */
  static async findById(groupId: string | Types.ObjectId, populate?: string[]): Promise<GroupDocument | null> {
    let query = Group.findById(groupId);

    if (populate) {
      populate.forEach((field) => {
        query = query.populate(field);
      });
    }

    return query.exec();
  }

  /**
   * Find group by code
   * @param groupCode - Group code
   * @returns Promise<GroupDocument | null>
   */
  static async findByCode(groupCode: string): Promise<GroupDocument | null> {
    return Group.findOne({ groupCode });
  }

  /**
   * Find groups with filters
   * @param filter - Query filter
   * @param options - Query options
   * @returns Promise<GroupDocument[]>
   */
  static async find(
    filter: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      populate?: string[];
    } = {},
  ): Promise<GroupDocument[]> {
    let query = Group.find(filter);

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
   * Update group by ID
   * @param groupId - Group ID
   * @param updateData - Update data
   * @returns Promise<GroupDocument | null>
   */
  static async updateById(
    groupId: string | Types.ObjectId,
    updateData: Partial<GroupDocument>,
  ): Promise<GroupDocument | null> {
    return Group.findByIdAndUpdate(
      groupId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate(['locationId', 'courses.courseId', 'teacherAssignments.teacherId']);
  }

  /**
   * Delete group by ID (soft delete)
   * @param groupId - Group ID
   * @returns Promise<GroupDocument | null>
   */
  static async deleteById(groupId: string | Types.ObjectId): Promise<GroupDocument | null> {
    return Group.findByIdAndUpdate(groupId, { status: EntityStatus.Inactive, updatedAt: new Date() }, { new: true });
  }

  /**
   * Count groups with filter
   * @param filter - Query filter
   * @returns Promise<number>
   */
  static async count(filter: Record<string, any> = {}): Promise<number> {
    return Group.countDocuments(filter);
  }

  /**
   * Find groups by location
   * @param locationId - Location ID
   * @param includeInactive - Include inactive groups
   * @returns Promise<GroupDocument[]>
   */
  static async findByLocation(
    locationId: string | Types.ObjectId,
    includeInactive: boolean = false,
  ): Promise<GroupDocument[]> {
    const filter: Record<string, any> = { locationId };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Group.find(filter).populate(['locationId', 'courses.courseId']);
  }

  /**
   * Find groups by course
   * @param courseId - Course ID
   * @param includeInactive - Include inactive groups
   * @returns Promise<GroupDocument[]>
   */
  static async findByCourse(courseId: string | Types.ObjectId, includeInactive: boolean = false): Promise<GroupDocument[]> {
    const filter: Record<string, any> = {
      'courses.courseId': courseId,
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Group.find(filter).populate(['locationId', 'courses.courseId']);
  }

  /**
   * Find groups by teacher
   * @param teacherId - Teacher ID
   * @param includeInactive - Include inactive groups
   * @returns Promise<GroupDocument[]>
   */
  static async findByTeacher(
    teacherId: string | Types.ObjectId,
    includeInactive: boolean = false,
  ): Promise<GroupDocument[]> {
    const filter: Record<string, any> = {
      'teacherAssignments.teacherId': teacherId,
    };
    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }
    return Group.find(filter).populate(['locationId', 'teacherAssignments.teacherId']);
  }

  /**
   * Get group statistics aggregation
   * @returns Promise<any[]>
   */
  static async getStatistics(): Promise<any[]> {
    return Group.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
          avgCapacity: { $avg: '$capacity' },
          totalStudents: { $sum: { $size: { $ifNull: ['$studentIds', []] } } },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }

  /**
   * Get groups by capacity range
   * @param minCapacity - Minimum capacity
   * @param maxCapacity - Maximum capacity
   * @param includeInactive - Include inactive groups
   * @returns Promise<GroupDocument[]>
   */
  static async findByCapacityRange(
    minCapacity: number,
    maxCapacity: number,
    includeInactive: boolean = false,
  ): Promise<GroupDocument[]> {
    const filter: Record<string, any> = {
      capacity: { $gte: minCapacity, $lte: maxCapacity },
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }

    return Group.find(filter).populate(['locationId', 'courses.courseId']).sort({ capacity: 1 });
  }

  /**
   * Add student to group
   * @param groupId - Group ID
   * @param studentId - Student ID
   * @returns Promise<GroupDocument | null>
   */
  static async addStudent(
    groupId: string | Types.ObjectId,
    studentId: string | Types.ObjectId,
  ): Promise<GroupDocument | null> {
    return Group.findByIdAndUpdate(
      groupId,
      {
        $addToSet: { studentIds: studentId },
        updatedAt: new Date(),
      },
      { new: true },
    ).populate(['locationId', 'courses.courseId']);
  }

  /**
   * Remove student from group
   * @param groupId - Group ID
   * @param studentId - Student ID
   * @returns Promise<GroupDocument | null>
   */
  static async removeStudent(
    groupId: string | Types.ObjectId,
    studentId: string | Types.ObjectId,
  ): Promise<GroupDocument | null> {
    return Group.findByIdAndUpdate(
      groupId,
      {
        $pull: { studentIds: studentId },
        updatedAt: new Date(),
      },
      { new: true },
    ).populate(['locationId', 'courses.courseId']);
  }

  /**
   * Add teacher assignment to group
   * @param groupId - Group ID
   * @param teacherAssignment - Teacher assignment data
   * @returns Promise<GroupDocument | null>
   */
  static async addTeacherAssignment(
    groupId: string | Types.ObjectId,
    teacherAssignment: any,
  ): Promise<GroupDocument | null> {
    return Group.findByIdAndUpdate(
      groupId,
      {
        $push: { teacherAssignments: teacherAssignment },
        updatedAt: new Date(),
      },
      { new: true },
    ).populate(['locationId', 'teacherAssignments.teacherId']);
  }

  /**
   * Remove teacher assignment from group
   * @param groupId - Group ID
   * @param teacherId - Teacher ID
   * @returns Promise<GroupDocument | null>
   */
  static async removeTeacherAssignment(
    groupId: string | Types.ObjectId,
    teacherId: string | Types.ObjectId,
  ): Promise<GroupDocument | null> {
    return Group.findByIdAndUpdate(
      groupId,
      {
        $pull: { teacherAssignments: { teacherId } },
        updatedAt: new Date(),
      },
      { new: true },
    ).populate(['locationId', 'teacherAssignments.teacherId']);
  }

  /**
   * Check if group code exists (excluding current group)
   * @param groupCode - Group code to check
   * @param excludeId - Group ID to exclude from check
   * @returns Promise<boolean>
   */
  static async codeExists(groupCode: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const filter: Record<string, any> = { groupCode };
    if (excludeId) {
      filter['_id'] = { $ne: excludeId };
    }
    const count = await Group.countDocuments(filter);
    return count > 0;
  }

  /**
   * Search groups by text
   * @param searchText - Text to search in name and code
   * @param includeInactive - Include inactive groups
   * @returns Promise<GroupDocument[]>
   */
  static async searchByText(searchText: string, includeInactive: boolean = false): Promise<GroupDocument[]> {
    const filter: Record<string, any> = {
      $or: [{ groupName: { $regex: searchText, $options: 'i' } }, { groupCode: { $regex: searchText, $options: 'i' } }],
    };

    if (!includeInactive) {
      filter['status'] = EntityStatus.Active;
    }

    return Group.find(filter).populate(['locationId', 'courses.courseId']).sort({ groupName: 1 });
  }

  /**
   * Bulk update groups
   * @param filter - Query filter
   * @param updateData - Update data
   * @returns Promise<any>
   */
  static async updateMany(filter: Record<string, any>, updateData: Partial<GroupDocument>): Promise<any> {
    return Group.updateMany(filter, { ...updateData, updatedAt: new Date() });
  }
}

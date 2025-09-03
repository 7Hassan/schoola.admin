import { Types, FilterQuery, UpdateQuery } from 'mongoose';
import { UserDocument } from '../types/user.types';
import { UserModel } from '../services/db/schemas/user.schema';
import { UserRole } from '@schoola/types/src';
import { RBACService } from '../services/rbac.service';
import { CreateUserInput, UpdateUserInput, UserQueryFilter, UserSearchOptions } from '../types/service/user.service.types';

/**
 * User Data Access Object (DAO)
 * Handles all database operations for User documents with RBAC validation
 */
export class UserDAO {
  /**
   * Create a new user with role validation
   */
  static async create(userData: CreateUserInput, creatorRole: UserRole): Promise<UserDocument> {
    // Validate role assignment permissions
    if (!RBACService.canAssignRole(creatorRole, userData.role)) {
      throw new Error(`Insufficient permissions to assign role: ${userData.role}`);
    }

    // Set default role if not provided
    if (!userData.role) {
      userData.role = RBACService.getDefaultRegistrationRole();
    }

    // Create user document
    const user = new UserModel({
      ...userData,
      accessRights: RBACService.getAccessRightsByRole(userData.role),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await user.save();
  }

  /**
   * Find user by ID with role-based field filtering
   */
  static async findById(
    userId: string | Types.ObjectId,
    requesterRole: UserRole,
    options: { includePassword?: boolean; includeAccessRights?: boolean } = {},
  ): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    let query = UserModel.findById(userId);

    // Apply field filtering based on role permissions
    const projection = this.getFieldProjectionForRole(requesterRole, options);
    if (projection) {
      query = query.select(projection);
    }

    return await query.exec();
  }

  /**
   * Find user by email
   */
  static async findByEmail(
    email: string,
    requesterRole: UserRole,
    options: { includePassword?: boolean } = {},
  ): Promise<UserDocument | null> {
    let query = UserModel.findOne({ email: email.toLowerCase() });

    // Apply field filtering based on role permissions
    const projection = this.getFieldProjectionForRole(requesterRole, options);
    if (projection) {
      query = query.select(projection);
    }

    return await query.exec();
  }

  /**
   * Update user with role validation
   */
  static async updateById(
    userId: string | Types.ObjectId,
    updateData: UpdateUserInput,
    updaterRole: UserRole,
  ): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Validate role change permissions
    if (updateData.role && !RBACService.canAssignRole(updaterRole, updateData.role)) {
      throw new Error(`Insufficient permissions to assign role: ${updateData.role}`);
    }

    // Update access rights if role is changed
    if (updateData.role) {
      updateData.accessRights = RBACService.getAccessRightsByRole(updateData.role);
    }

    const updateQuery: UpdateQuery<UserDocument> = {
      ...updateData,
      updatedAt: new Date(),
    };

    return await UserModel.findByIdAndUpdate(userId, updateQuery, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteById(userId: string | Types.ObjectId, deleterRole: UserRole): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Check if deleter has permission to delete users
    if (!RBACService.hasPermission(deleterRole, 'students', 'delete')) {
      throw new Error('Insufficient permissions to delete users');
    }

    // Soft delete by marking as inactive
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true },
    ).exec();
  }

  /**
   * Find users with filtering and role-based access control
   */
  static async find(
    filter: UserQueryFilter,
    requesterRole: UserRole,
    options: UserSearchOptions = {},
  ): Promise<{ users: UserDocument[]; total: number }> {
    // Build base query
    const query: FilterQuery<UserDocument> = { isActive: true };

    // Apply filters
    if (filter.role) {
      query.role = filter.role;
    }

    if (filter.isVerified !== undefined) {
      query['isVerified'] = filter.isVerified;
    }

    if (filter.searchTerm) {
      query.$or = [
        { firstName: { $regex: filter.searchTerm, $options: 'i' } },
        { lastName: { $regex: filter.searchTerm, $options: 'i' } },
        { email: { $regex: filter.searchTerm, $options: 'i' } },
      ];
    }

    if (filter.createdAfter) {
      query.createdAt = { $gte: filter.createdAfter };
    }

    if (filter.createdBefore) {
      query.createdAt = { ...query.createdAt, $lte: filter.createdBefore };
    }

    // Apply role-based filtering
    if (!RBACService.hasPermission(requesterRole, 'students', 'read')) {
      throw new Error('Insufficient permissions to view users');
    }

    // Build aggregation pipeline
    let aggregation = UserModel.aggregate([
      { $match: query },
      { $sort: options.sortBy ? { [options.sortBy]: options.sortOrder === 'desc' ? -1 : 1 } : { createdAt: -1 } },
    ]);

    // Add field projection based on role
    const projection = this.getFieldProjectionForRole(requesterRole, options);
    if (projection) {
      const projectionStage: Record<string, 1 | 0> = {};
      if (typeof projection === 'string') {
        projection.split(' ').forEach((field) => {
          projectionStage[field.replace('-', '')] = field.startsWith('-') ? 0 : 1;
        });
      }
      aggregation = aggregation.project(projectionStage);
    }

    // Add pagination
    if (options.skip) {
      aggregation = aggregation.skip(options.skip);
    }

    if (options.limit) {
      aggregation = aggregation.limit(options.limit);
    }

    // Execute query
    const [users, totalCount] = await Promise.all([aggregation.exec(), UserModel.countDocuments(query)]);

    return {
      users: users as UserDocument[],
      total: totalCount,
    };
  }

  /**
   * Update user role with validation
   */
  static async updateRole(
    userId: string | Types.ObjectId,
    newRole: UserRole,
    updaterRole: UserRole,
  ): Promise<UserDocument | null> {
    if (!RBACService.canAssignRole(updaterRole, newRole)) {
      throw new Error(`Insufficient permissions to assign role: ${newRole}`);
    }

    const accessRights = RBACService.getAccessRightsByRole(newRole);

    return await UserModel.findByIdAndUpdate(
      userId,
      {
        role: newRole,
        accessRights,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    ).exec();
  }

  /**
   * Get users by role
   */
  static async findByRole(
    role: UserRole,
    requesterRole: UserRole,
    options: UserSearchOptions = {},
  ): Promise<UserDocument[]> {
    if (!RBACService.hasPermission(requesterRole, 'students', 'read')) {
      throw new Error('Insufficient permissions to view users');
    }

    let query = UserModel.find({ role, isActive: true });

    // Apply field projection
    const projection = this.getFieldProjectionForRole(requesterRole, options);
    if (projection) {
      query = query.select(projection);
    }

    // Apply sorting and pagination
    if (options.sortBy) {
      query = query.sort({ [options.sortBy]: options.sortOrder === 'desc' ? -1 : 1 });
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.exec();
  }

  /**
   * Check if user exists by email
   */
  static async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({
      email: email.toLowerCase(),
      isActive: true,
    });
    return count > 0;
  }

  /**
   * Get field projection based on requester role
   */
  private static getFieldProjectionForRole(
    requesterRole: UserRole,
    options: { includePassword?: boolean; includeAccessRights?: boolean } = {},
  ): string | null {
    const baseFields = 'firstName lastName email role isVerified createdAt updatedAt';

    // Super admin and admin get full access
    if ([UserRole.SuperAdmin, UserRole.Admin].includes(requesterRole)) {
      let projection = `${baseFields} adminProfile studentId teacherId`;

      if (options.includePassword) {
        projection += ' password';
      }

      if (options.includeAccessRights) {
        projection += ' accessRights';
      }

      return projection;
    }

    // Teachers get limited access
    if (requesterRole === UserRole.Teacher) {
      return `${baseFields} studentId`;
    }

    // Students and others get minimal access
    return baseFields;
  }

  /**
   * Batch create users with role validation
   */
  static async createMany(usersData: CreateUserInput[], creatorRole: UserRole): Promise<UserDocument[]> {
    // Validate all role assignments
    for (const userData of usersData) {
      if (!RBACService.canAssignRole(creatorRole, userData.role)) {
        throw new Error(`Insufficient permissions to assign role: ${userData.role} for user: ${userData.email}`);
      }
    }

    // Prepare user documents
    const userDocs = usersData.map((userData) => ({
      ...userData,
      accessRights: RBACService.getAccessRightsByRole(userData.role),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await UserModel.insertMany(userDocs);
    return result as any;
  }

  /**
   * Get user statistics by role
   */
  static async getStatsByRole(requesterRole: UserRole): Promise<Record<string, number>> {
    if (!RBACService.hasPermission(requesterRole, 'students', 'read')) {
      throw new Error('Insufficient permissions to view user statistics');
    }

    const stats = await UserModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const result: Record<string, number> = {};
    stats.forEach((stat: any) => {
      result[stat._id] = stat.count;
    });

    return result;
  }
}

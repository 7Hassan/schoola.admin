import httpStatus from 'http-status';
import Course from './db/models/course.model';
import ApiError from '../modules/errors/ApiError';
import { CourseDocument } from '../types';
import { UserRole, EntityStatus } from '@schoola/types/src';

/**
 * Create a course
 * @param {Object} courseBody
 * @param {UserRole} requesterRole
 * @returns {Promise<CourseDocument>}
 */
export const createCourse = async (
  courseBody: Partial<CourseDocument>,
  requesterRole: UserRole,
): Promise<CourseDocument> => {
  // Only admins can create courses
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin && requesterRole !== UserRole.Editor) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to create course');
  }

  // Check if course with same code already exists
  if (await Course.findOne({ code: courseBody.code })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course code already exists');
  }

  return Course.create(courseBody);
};

/**
 * Query for courses with role-based filtering
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {UserRole} requesterRole - Role of the user making the request
 * @returns {Promise<CourseDocument[]>}
 */
export const queryCourses = async (
  filter: Record<string, any>,
  options: { limit?: number; page?: number; sortBy?: string },
  requesterRole: UserRole,
): Promise<{ results: CourseDocument[]; page: number; limit: number; totalPages: number; totalResults: number }> => {
  // Apply role-based filtering
  const roleFilter = { ...filter };

  // Non-admin users can only see active courses
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    roleFilter['status'] = EntityStatus.Active;
  }

  const courses = await Course.find(roleFilter);

  // Manual pagination
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const paginatedCourses = courses.slice(skip, skip + limit);

  return {
    results: paginatedCourses,
    page,
    limit,
    totalPages: Math.ceil(courses.length / limit),
    totalResults: courses.length,
  };
};

/**
 * Get course by id with role-based access control
 * @param {string} id
 * @param {UserRole} requesterRole
 * @returns {Promise<CourseDocument>}
 */
export const getCourseById = async (id: string, requesterRole: UserRole): Promise<CourseDocument | null> => {
  const course = await Course.findById(id);

  if (!course) {
    return null;
  }

  // Non-admin users can only view active courses
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin && course.status !== EntityStatus.Active) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  return course;
};

/**
 * Update course by id
 * @param {string} courseId
 * @param {Object} updateBody
 * @param {UserRole} requesterRole
 * @returns {Promise<CourseDocument>}
 */
export const updateCourseById = async (
  courseId: string,
  updateBody: Partial<CourseDocument>,
  requesterRole: UserRole,
): Promise<CourseDocument | null> => {
  const course = await getCourseById(courseId, requesterRole);

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Only admins and editors can update courses
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin && requesterRole !== UserRole.Editor) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to update course');
  }

  // Only admins can update certain fields
  const restrictedFields = ['code', 'status'];
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    restrictedFields.forEach((field) => {
      if (field in updateBody) {
        delete updateBody[field as keyof CourseDocument];
      }
    });
  }

  // Check if course code is being updated and is available
  if (updateBody.code && updateBody.code !== course.code) {
    if (await Course.findOne({ code: updateBody.code, _id: { $ne: courseId } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Course code already exists');
    }
  }

  Object.assign(course, updateBody);
  await course.save();
  return course;
};

/**
 * Delete course by id
 * @param {string} courseId
 * @param {UserRole} requesterRole
 * @returns {Promise<CourseDocument>}
 */
export const deleteCourseById = async (courseId: string, requesterRole: UserRole): Promise<CourseDocument | null> => {
  // Only admins can delete courses
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to delete course');
  }

  const course = await getCourseById(courseId, requesterRole);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Soft delete - update status to inactive
  course.status = EntityStatus.Inactive;
  await course.save();
  return course;
};

/**
 * Get courses by level
 * @param {string} level
 * @param {UserRole} requesterRole
 * @returns {Promise<CourseDocument[]>}
 */
export const getCoursesByLevel = async (level: string, requesterRole: UserRole): Promise<CourseDocument[]> => {
  const filter: Record<string, any> = { level };

  // Non-admin users can only see active courses
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    filter['status'] = EntityStatus.Active;
  }

  const courses = await Course.find(filter);
  return courses;
};

/**
 * Get course statistics
 * @param {UserRole} requesterRole
 * @returns {Promise<Object>}
 */
export const getCourseStats = async (requesterRole: UserRole): Promise<Record<string, any>> => {
  // Only admins can view statistics
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to view statistics');
  }

  const totalCourses = await Course.countDocuments();
  const activeCourses = await Course.countDocuments({ status: EntityStatus.Active });
  const inactiveCourses = await Course.countDocuments({ status: EntityStatus.Inactive });

  const levelStats = await Course.aggregate([{ $group: { _id: '$level', count: { $sum: 1 } } }]);

  return {
    total: totalCourses,
    active: activeCourses,
    inactive: inactiveCourses,
    byLevel: levelStats,
  };
};

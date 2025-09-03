import httpStatus from 'http-status';
import Teacher from './db/models/teacher.model';
import ApiError from '../modules/errors/ApiError';
import { TeacherDocument } from '../types';
import { QueryResult, IOptions } from '../modules/paginate/paginate';
import { UserRole, EntityStatus } from '@schoola/types/src';

/**
 * Create a teacher
 * @param {Object} teacherBody
 * @returns {Promise<TeacherDocument>}
 */
export const createTeacher = async (teacherBody: Partial<TeacherDocument>): Promise<TeacherDocument> => {
  // Check if teacher with same email already exists
  if (await Teacher.findOne({ email: teacherBody.email })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Check if teacher with same employeeId already exists
  if (await Teacher.findOne({ employeeId: teacherBody.employeeId })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Employee ID already taken');
  }

  return Teacher.create(teacherBody);
};

/**
 * Query for teachers with role-based filtering
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {UserRole} requesterRole - Role of the user making the request
 * @returns {Promise<QueryResult>}
 */
export const queryTeachers = async (
  filter: Record<string, any>,
  options: IOptions,
  requesterRole: UserRole,
): Promise<QueryResult> => {
  // Apply role-based filtering
  const roleFilter = { ...filter };

  // Non-admin users can only see active teachers
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    roleFilter['status'] = EntityStatus.Active;
  }

  const teachers = await Teacher.find(roleFilter);
  // Note: Using manual pagination since paginate might not be available
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const paginatedTeachers = teachers.slice(skip, skip + limit);

  return {
    results: paginatedTeachers,
    page,
    limit,
    totalPages: Math.ceil(teachers.length / limit),
    totalResults: teachers.length,
  };
};

/**
 * Get teacher by id with role-based access control
 * @param {ObjectId} id
 * @param {UserRole} requesterRole
 * @returns {Promise<TeacherDocument>}
 */
export const getTeacherById = async (id: string, requesterRole: UserRole): Promise<TeacherDocument | null> => {
  const teacher = await Teacher.findById(id);

  if (!teacher) {
    return null;
  }

  // Non-admin users can only view active teachers
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin && teacher.status !== EntityStatus.Active) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  return teacher;
};

/**
 * Update teacher by id
 * @param {ObjectId} teacherId
 * @param {Object} updateBody
 * @param {UserRole} requesterRole
 * @returns {Promise<TeacherDocument>}
 */
export const updateTeacherById = async (
  teacherId: string,
  updateBody: Partial<TeacherDocument>,
  requesterRole: UserRole,
): Promise<TeacherDocument | null> => {
  const teacher = await getTeacherById(teacherId, requesterRole);

  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
  }

  // Only admins can update certain fields
  const restrictedFields = ['employeeId', 'salary', 'status'];
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    restrictedFields.forEach((field) => {
      if (field in updateBody) {
        delete updateBody[field as keyof TeacherDocument];
      }
    });
  }

  // Check if email is being updated and is available
  if (updateBody.email && updateBody.email !== teacher.email) {
    if (await Teacher.findOne({ email: updateBody.email, _id: { $ne: teacherId } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  Object.assign(teacher, updateBody);
  await teacher.save();
  return teacher;
};

/**
 * Delete teacher by id
 * @param {ObjectId} teacherId
 * @param {UserRole} requesterRole
 * @returns {Promise<TeacherDocument>}
 */
export const deleteTeacherById = async (teacherId: string, requesterRole: UserRole): Promise<TeacherDocument | null> => {
  // Only admins can delete teachers
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to delete teacher');
  }

  const teacher = await getTeacherById(teacherId, requesterRole);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
  }

  // Soft delete - update status to inactive
  teacher.status = EntityStatus.Inactive;
  await teacher.save();
  return teacher;
};

/**
 * Get teachers by department
 * @param {string} department
 * @param {UserRole} requesterRole
 * @returns {Promise<TeacherDocument[]>}
 */
export const getTeachersByDepartment = async (department: string, requesterRole: UserRole): Promise<TeacherDocument[]> => {
  const filter: Record<string, any> = { department };

  // Non-admin users can only see active teachers
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    filter['status'] = EntityStatus.Active;
  }

  const teachers = await Teacher.find(filter);
  return teachers;
};

/**
 * Get teacher statistics
 * @param {UserRole} requesterRole
 * @returns {Promise<Object>}
 */
export const getTeacherStats = async (requesterRole: UserRole): Promise<Record<string, any>> => {
  // Only admins can view statistics
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to view statistics');
  }

  const totalTeachers = await Teacher.countDocuments();
  const activeTeachers = await Teacher.countDocuments({ status: EntityStatus.Active });
  const inactiveTeachers = await Teacher.countDocuments({ status: EntityStatus.Inactive });

  const departmentStats = await Teacher.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]);

  return {
    total: totalTeachers,
    active: activeTeachers,
    inactive: inactiveTeachers,
    byDepartment: departmentStats,
  };
};

import httpStatus from 'http-status';
import Student from './db/models/student.model';
import ApiError from '../modules/errors/ApiError';
import { StudentDocument } from '../types';
import { UserRole, EntityStatus } from '@schoola/types/src';

/**
 * Create a student
 * @param {Object} studentBody
 * @param {UserRole} requesterRole
 * @returns {Promise<StudentDocument>}
 */
export const createStudent = async (
  studentBody: Partial<StudentDocument>,
  requesterRole: UserRole,
): Promise<StudentDocument> => {
  // Only admins, editors, and teachers can create students
  if (
    requesterRole !== UserRole.SuperAdmin &&
    requesterRole !== UserRole.Admin &&
    requesterRole !== UserRole.Editor &&
    requesterRole !== UserRole.Teacher
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to create student');
  }

  // Check if student with same email already exists (if email is provided)
  if (studentBody.email && (await Student.findOne({ email: studentBody.email }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Check if student with same studentCode already exists
  if (studentBody.studentCode && (await Student.findOne({ studentCode: studentBody.studentCode }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student code already exists');
  }

  return Student.create(studentBody);
};

/**
 * Query for students with role-based filtering
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {UserRole} requesterRole - Role of the user making the request
 * @returns {Promise<Object>}
 */
export const queryStudents = async (
  filter: Record<string, any>,
  options: { limit?: number; page?: number; sortBy?: string },
  requesterRole: UserRole,
): Promise<{ results: StudentDocument[]; page: number; limit: number; totalPages: number; totalResults: number }> => {
  // Apply role-based filtering
  const roleFilter = { ...filter };

  // Non-admin users can only see active students
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    roleFilter['status'] = EntityStatus.Active;
  }

  const students = await Student.find(roleFilter).populate('group');

  // Manual pagination
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const paginatedStudents = students.slice(skip, skip + limit);

  return {
    results: paginatedStudents,
    page,
    limit,
    totalPages: Math.ceil(students.length / limit),
    totalResults: students.length,
  };
};

/**
 * Get student by id with role-based access control
 * @param {string} id
 * @param {UserRole} requesterRole
 * @returns {Promise<StudentDocument>}
 */
export const getStudentById = async (id: string, requesterRole: UserRole): Promise<StudentDocument | null> => {
  const student = await Student.findById(id).populate('group');

  if (!student) {
    return null;
  }

  // Non-admin users can only view active students
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin && student.status !== EntityStatus.Active) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  return student;
};

/**
 * Update student by id
 * @param {string} studentId
 * @param {Object} updateBody
 * @param {UserRole} requesterRole
 * @returns {Promise<StudentDocument>}
 */
export const updateStudentById = async (
  studentId: string,
  updateBody: Partial<StudentDocument>,
  requesterRole: UserRole,
): Promise<StudentDocument | null> => {
  const student = await getStudentById(studentId, requesterRole);

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  // Only admins, editors, and teachers can update students
  if (
    requesterRole !== UserRole.SuperAdmin &&
    requesterRole !== UserRole.Admin &&
    requesterRole !== UserRole.Editor &&
    requesterRole !== UserRole.Teacher
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to update student');
  }

  // Only admins can update certain fields
  const restrictedFields = ['studentCode', 'status'];
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    restrictedFields.forEach((field) => {
      if (field in updateBody) {
        delete updateBody[field as keyof StudentDocument];
      }
    });
  }

  // Check if email is being updated and is available
  if (updateBody.email && updateBody.email !== student.email) {
    if (await Student.findOne({ email: updateBody.email, _id: { $ne: studentId } })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  Object.assign(student, updateBody);
  await student.save();
  return student;
};

/**
 * Delete student by id
 * @param {string} studentId
 * @param {UserRole} requesterRole
 * @returns {Promise<StudentDocument>}
 */
export const deleteStudentById = async (studentId: string, requesterRole: UserRole): Promise<StudentDocument | null> => {
  // Only admins can delete students
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to delete student');
  }

  const student = await getStudentById(studentId, requesterRole);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  // Soft delete - update status to inactive
  student.status = EntityStatus.Inactive;
  await student.save();
  return student;
};

/**
 * Get students by group
 * @param {string} groupId
 * @param {UserRole} requesterRole
 * @returns {Promise<StudentDocument[]>}
 */
export const getStudentsByGroup = async (groupId: string, requesterRole: UserRole): Promise<StudentDocument[]> => {
  const filter: Record<string, any> = { group: groupId };

  // Non-admin users can only see active students
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    filter['status'] = EntityStatus.Active;
  }

  const students = await Student.find(filter).populate('group');
  return students;
};

/**
 * Get student statistics
 * @param {UserRole} requesterRole
 * @returns {Promise<Object>}
 */
export const getStudentStats = async (requesterRole: UserRole): Promise<Record<string, any>> => {
  // Only admins can view statistics
  if (requesterRole !== UserRole.SuperAdmin && requesterRole !== UserRole.Admin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to view statistics');
  }

  const totalStudents = await Student.countDocuments();
  const activeStudents = await Student.countDocuments({ status: EntityStatus.Active });
  const inactiveStudents = await Student.countDocuments({ status: EntityStatus.Inactive });

  const ageRangeStats = await Student.aggregate([
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
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    total: totalStudents,
    active: activeStudents,
    inactive: inactiveStudents,
    byAgeRange: ageRangeStats,
  };
};

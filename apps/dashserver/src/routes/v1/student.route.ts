import express from 'express';
import { AuthorizationMiddleware } from '../../middleware/auth.middleware';
import { UserRole } from '@schoola/types/src';
import {
  updateStudentProfileSchema,
  createStudentSchema,
  submitAssignmentSchema,
  gradeQuerySchema,
  attendanceQuerySchema,
  studentSearchSchema,
  studentIdParamSchema,
  createValidationMiddleware,
  createQueryValidationMiddleware,
  createParamValidationMiddleware,
} from '../../validation/schemas/student.schema';

const router = express.Router();

/**
 * Student Routes with RBAC Authorization and Validation
 * Comprehensive student management with role-based access control and input validation
 */

// ==================== STUDENT SELF-SERVICE ROUTES ====================

/**
 * @route GET /students/profile
 * @desc Get student's own profile
 * @access Student (own data only), Teacher, Admin, SuperAdmin
 */
router.get('/profile', AuthorizationMiddleware.authenticate as any, (req: any, res: any) => {
  res.json({
    success: true,
    message: 'Student profile retrieved successfully',
    data: {
      user: req.user,
      endpoint: 'GET /students/profile',
      access: 'Student can only view own profile',
    },
  });
});

/**
 * @route PUT /students/profile
 * @desc Update student's own profile
 * @access Student (own data only)
 */
router.put(
  '/profile',
  AuthorizationMiddleware.authenticate as any,
  AuthorizationMiddleware.requireUserAccess() as any,
  createValidationMiddleware(updateStudentProfileSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data: {
        user: req.user,
        validatedData: req.validatedData,
        endpoint: 'PUT /students/profile',
      },
    });
  },
);

/**
 * @route GET /students/courses
 * @desc Get student's enrolled courses
 * @access Student (own data only), Teacher, Admin, SuperAdmin
 */
router.get(
  '/courses',
  AuthorizationMiddleware.authenticate as any,
  createQueryValidationMiddleware(gradeQuerySchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student courses retrieved successfully',
      data: {
        user: req.user,
        query: req.validatedQuery,
        endpoint: 'GET /students/courses',
      },
    });
  },
);

/**
 * @route GET /students/assignments
 * @desc Get student's assignments
 * @access Student (own data only), Teacher, Admin, SuperAdmin
 */
router.get(
  '/assignments',
  AuthorizationMiddleware.authenticate as any,
  createQueryValidationMiddleware(attendanceQuerySchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student assignments retrieved successfully',
      data: {
        user: req.user,
        query: req.validatedQuery,
        endpoint: 'GET /students/assignments',
      },
    });
  },
);

/**
 * @route POST /students/assignments/:id/submit
 * @desc Submit assignment
 * @access Student (own submissions only)
 */
router.post(
  '/assignments/:id/submit',
  AuthorizationMiddleware.authenticate as any,
  createParamValidationMiddleware(studentIdParamSchema),
  createValidationMiddleware(submitAssignmentSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: {
        user: req.user,
        params: req.validatedParams,
        submissionData: req.validatedData,
        endpoint: 'POST /students/assignments/:id/submit',
      },
    });
  },
);

/**
 * @route GET /students/grades
 * @desc Get student's grades
 * @access Student (own data only), Teacher, Admin, SuperAdmin
 */
router.get(
  '/grades',
  AuthorizationMiddleware.authenticate as any,
  createQueryValidationMiddleware(gradeQuerySchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student grades retrieved successfully',
      data: {
        user: req.user,
        query: req.validatedQuery,
        endpoint: 'GET /students/grades',
      },
    });
  },
);

// ==================== TEACHER/ADMIN ROUTES ====================

/**
 * @route GET /students
 * @desc Get all students (with filtering and pagination)
 * @access Teacher, Admin, SuperAdmin
 */
router.get(
  '/',
  AuthorizationMiddleware.requireTeacher as any,
  createQueryValidationMiddleware(studentSearchSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Students retrieved successfully',
      data: {
        user: req.user,
        searchParams: req.validatedQuery,
        endpoint: 'GET /students',
      },
    });
  },
);

/**
 * @route GET /students/:id
 * @desc Get specific student details
 * @access Teacher, Admin, SuperAdmin
 */
router.get(
  '/:id',
  AuthorizationMiddleware.requireTeacher as any,
  createParamValidationMiddleware(studentIdParamSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student details retrieved successfully',
      data: {
        user: req.user,
        studentId: req.validatedParams.id,
        endpoint: 'GET /students/:id',
      },
    });
  },
);

/**
 * @route POST /students
 * @desc Create new student account
 * @access Admin, SuperAdmin
 */
router.post(
  '/',
  AuthorizationMiddleware.requireAdmin as any,
  createValidationMiddleware(createStudentSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student created successfully',
      data: {
        user: req.user,
        studentData: req.validatedData,
        endpoint: 'POST /students',
      },
    });
  },
);

/**
 * @route PUT /students/:id
 * @desc Update student account details
 * @access Admin, SuperAdmin
 */
router.put(
  '/:id',
  AuthorizationMiddleware.requireAdmin as any,
  createParamValidationMiddleware(studentIdParamSchema),
  createValidationMiddleware(updateStudentProfileSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: {
        user: req.user,
        studentId: req.validatedParams.id,
        updateData: req.validatedData,
        endpoint: 'PUT /students/:id',
      },
    });
  },
);

/**
 * @route DELETE /students/:id
 * @desc Delete/deactivate student account
 * @access SuperAdmin only
 */
router.delete(
  '/:id',
  AuthorizationMiddleware.authenticate as any,
  AuthorizationMiddleware.requireRole(UserRole.SuperAdmin) as any,
  createParamValidationMiddleware(studentIdParamSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student account deleted successfully',
      data: {
        user: req.user,
        studentId: req.validatedParams.id,
        endpoint: 'DELETE /students/:id',
      },
    });
  },
);

/**
 * @route POST /students/:id/enroll
 * @desc Enroll student in course
 * @access Admin, SuperAdmin
 */
router.post(
  '/:id/enroll',
  AuthorizationMiddleware.requireAdmin as any,
  createParamValidationMiddleware(studentIdParamSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student enrolled successfully',
      data: {
        user: req.user,
        studentId: req.validatedParams.id,
        endpoint: 'POST /students/:id/enroll',
      },
    });
  },
);

/**
 * @route POST /students/:id/fees/pay
 * @desc Process fee payment for student
 * @access Admin, SuperAdmin, Student (own payments)
 */
router.post(
  '/:id/fees/pay',
  AuthorizationMiddleware.authenticate as any,
  createParamValidationMiddleware(studentIdParamSchema),
  (req: any, res: any) => {
    res.json({
      success: true,
      message: 'Fee payment processed successfully',
      data: {
        user: req.user,
        studentId: req.validatedParams.id,
        endpoint: 'POST /students/:id/fees/pay',
      },
    });
  },
);

// ==================== DEVELOPMENT ROUTES ====================

if (process.env['NODE_ENV'] === 'development') {
  /**
   * @route GET /students/debug/permissions
   * @desc Debug student permissions and validation
   * @access Development only
   */
  router.get('/debug/permissions', AuthorizationMiddleware.authenticate as any, (_req: any, res: any) => {
    res.json({
      success: true,
      message: 'Student route permissions and validation debug',
      data: {
        student_permissions: {
          own_profile: 'read, write',
          own_courses: 'read',
          own_assignments: 'read, submit',
          own_grades: 'read',
          own_attendance: 'read',
        },
        teacher_permissions: {
          student_lists: 'read',
          student_details: 'read',
          grade_assignments: 'write',
          attendance_tracking: 'write',
        },
        admin_permissions: {
          all_students: 'create, read, update',
          enrollment_management: 'full_access',
          fee_management: 'full_access',
        },
        superadmin_permissions: {
          all_operations: 'full_access_including_delete',
        },
        validation_schemas: [
          'updateStudentProfileSchema',
          'createStudentSchema',
          'enrollCourseSchema',
          'submitAssignmentSchema',
          'gradeQuerySchema',
          'attendanceQuerySchema',
          'studentSearchSchema',
          'feePaymentSchema',
          'parentCommunicationSchema',
        ],
      },
    });
  });
}

export default router;

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management endpoints
 */

/**
 * @swagger
 * /students/profile:
 *   get:
 *     summary: Get student profile
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Student profile retrieved successfully
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: grade
 *         schema:
 *           type: string
 *         description: Filter by grade
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *     responses:
 *       "200":
 *         description: Students retrieved successfully
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Insufficient permissions
 */

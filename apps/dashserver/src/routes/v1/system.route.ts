import express from 'express';
import { auth, requireAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * System Overview Routes
 * Administrative routes for system overview and debugging
 */

/**
 * @route GET /system/overview
 * @desc Get complete system overview
 * @access Admin, SuperAdmin
 */
router.get('/overview', requireAdmin as any, (req: any, res: any) => {
  res.json({
    success: true,
    message: 'School Management System Overview',
    data: {
      system_info: {
        name: 'Schoola Management System',
        version: '1.0.0',
        environment: process.env['NODE_ENV'] || 'development',
        timestamp: new Date().toISOString(),
      },
      user_context: {
        current_user: req.user,
        access_level: req.user?.role || 'unknown',
      },
      available_routes: {
        authentication: {
          base_path: '/v1/auth',
          endpoints: [
            'POST /login - User authentication',
            'POST /register - User registration',
            'POST /logout - User logout',
            'POST /refresh - Token refresh',
            'POST /forgot-password - Password reset request',
            'POST /reset-password - Password reset',
            'GET /me - Current user profile',
            'GET /test - Authentication test',
            'GET /admin-test - SuperAdmin test',
          ],
        },
        students: {
          base_path: '/v1/students',
          endpoints: [
            'GET /profile - Student own profile',
            'PUT /profile - Update student profile',
            'GET /courses - Student enrolled courses',
            'GET /assignments - Student assignments',
            'POST /assignments/:id/submit - Submit assignment',
            'GET /grades - Student grades',
            'GET / - All students (Teacher+)',
            'GET /:id - Specific student (Teacher+)',
            'PUT /:id/grade - Grade student (Teacher+)',
            'POST / - Create student (Admin+)',
            'PUT /:id - Update student (Admin+)',
            'DELETE /:id - Delete student (SuperAdmin)',
            'POST /:id/enroll - Enroll in course (Admin+)',
            'DELETE /:id/enroll/:courseId - Unenroll (Admin+)',
          ],
        },
        teachers: {
          base_path: '/v1/teachers',
          endpoints: [
            'GET /profile - Teacher own profile',
            'PUT /profile - Update teacher profile',
            'GET /courses - Teacher assigned courses',
            "GET /students - Teacher's students",
            'POST /assignments - Create assignment',
            'GET /assignments - Teacher assignments',
            'PUT /assignments/:id - Update assignment',
            'GET /submissions - Student submissions',
            'PUT /submissions/:id/grade - Grade submission',
            'GET /schedule - Teacher schedule',
            'GET / - All teachers (Admin+)',
            'GET /:id - Specific teacher (Admin+)',
            'POST / - Create teacher (Admin+)',
            'PUT /:id - Update teacher (Admin+)',
            'DELETE /:id - Delete teacher (SuperAdmin)',
          ],
        },
        courses: {
          base_path: '/v1/courses',
          endpoints: [
            'GET /public - Public course catalog',
            'GET /public/:id - Public course details',
            'GET / - All courses (role-filtered)',
            'GET /:id - Specific course (access-controlled)',
            'POST /:id/enroll - Course enrollment',
            'DELETE /:id/enroll - Course unenrollment',
            'GET /:id/materials - Course materials',
            'GET /:id/assignments - Course assignments',
            'GET /:id/students - Enrolled students (Teacher+)',
            'GET /:id/grades - Course gradebook (Teacher+)',
            'POST /:id/materials - Upload material (Teacher+)',
            'POST / - Create course (Admin+)',
            'PUT /:id - Update course (Admin+)',
            'DELETE /:id - Delete course (SuperAdmin)',
          ],
        },
        authorities: {
          base_path: '/v1/authorities',
          endpoints: [
            'GET /profile - Authority own profile',
            'PUT /profile - Update authority profile',
            'GET /schools - Authority jurisdiction schools',
            'GET /reports - Authority reports',
            'GET /compliance - Compliance status',
            'POST /audit - Schedule audit',
            'GET /statistics - Jurisdiction statistics',
            'POST /policies - Create policy',
            'PUT /policies/:id - Update policy',
            'GET / - All authorities (Admin+)',
            'POST / - Create authority (Admin+)',
            'DELETE /:id - Delete authority (SuperAdmin)',
          ],
        },
        parents: {
          base_path: '/v1/parents',
          endpoints: [
            'GET /profile - Parent own profile',
            'PUT /profile - Update parent profile',
            "GET /children - Parent's children",
            'GET /children/:childId/grades - Child grades',
            'GET /children/:childId/attendance - Child attendance',
            'GET /children/:childId/assignments - Child assignments',
            'GET /children/:childId/progress - Child progress',
            'GET /children/:childId/teachers - Child teachers',
            'POST /children/:childId/excuses - Submit excuse',
            'POST /messages - Message teacher',
            'GET /messages - Parent messages',
            'POST /meetings/request - Request meeting',
            'GET /meetings - Scheduled meetings',
            'GET / - All parents (Admin+)',
            'POST / - Create parent (Admin+)',
          ],
        },
        users: {
          base_path: '/v1/users',
          endpoints: [
            'GET / - All users (Admin+)',
            'GET /:id - Specific user (Admin+)',
            'POST / - Create user (Admin+)',
            'PUT /:id - Update user (Admin+)',
            'DELETE /:id - Delete user (Admin+)',
          ],
        },
      },
      rbac_summary: {
        roles: [
          'SuperAdmin - Full system access including deletions',
          'Admin - Full management access except peer admin deletion',
          'Teacher - Course and student management within assigned classes',
          'Student - Own data and enrolled course access',
          "Parent - Own children's academic information access",
          'Authority - Educational jurisdiction oversight',
          'Editor - Content management with limited scope',
          'Viewer - Read-only access to assigned resources',
        ],
        permission_levels: {
          SuperAdmin: 'All permissions including delete operations',
          Admin: 'Create, Read, Update operations (no delete of peer admins)',
          Teacher: 'Manage assigned courses and students, grade, communicate',
          Student: 'Read own academic data, submit assignments, self-enroll if enabled',
          Parent: "Read children's academic data, communicate with teachers",
          Authority: 'Oversight of jurisdiction, compliance, auditing, policy',
          Editor: 'Content creation and modification within scope',
          Viewer: 'Read-only access to assigned resources',
        },
      },
      middleware_features: [
        'JWT Authentication with role-based validation',
        'Resource-specific access control',
        'Permission-based route protection',
        'User context injection for fine-grained access',
        'Audit logging for access attempts',
        'Development debugging and testing endpoints',
      ],
    },
  });
});

/**
 * @route GET /system/routes
 * @desc Get all available routes in the system
 * @access Admin, SuperAdmin
 */
router.get('/routes', requireAdmin as any, (_req: any, res: any) => {
  res.json({
    success: true,
    message: 'Complete route listing',
    data: {
      v1_routes: {
        '/v1/auth/*': 'Authentication and authorization endpoints',
        '/v1/users/*': 'User management endpoints',
        '/v1/students/*': 'Student management and self-service endpoints',
        '/v1/teachers/*': 'Teacher management and classroom endpoints',
        '/v1/courses/*': 'Course management and content endpoints',
        '/v1/authorities/*': 'Educational authority oversight endpoints',
        '/v1/parents/*': 'Parent/guardian access and communication endpoints',
        '/v1/system/*': 'System overview and administrative endpoints',
      },
      route_patterns: {
        public: 'No authentication required',
        authenticated: 'Requires valid JWT token',
        role_based: 'Requires specific role (Teacher, Admin, etc.)',
        permission_based: 'Requires specific permission (read, write, delete)',
        resource_specific: 'Access limited to own resources or assigned resources',
      },
    },
  });
});

/**
 * @route GET /system/health
 * @desc System health check
 * @access Admin, SuperAdmin
 */
router.get('/health', requireAdmin as any, (_req: any, res: any) => {
  res.json({
    success: true,
    message: 'System health check',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'],
      node_version: process.version,
      memory_usage: process.memoryUsage(),
      services: {
        authentication: 'operational',
        authorization: 'operational',
        routes: 'operational',
        middleware: 'operational',
      },
    },
  });
});

/**
 * @route GET /system/permissions
 * @desc Get detailed permission matrix
 * @access SuperAdmin only
 */
router.get('/permissions', auth as any, (req: any, res: any) => {
  // Only SuperAdmin can view the full permission matrix
  if (req.user?.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. SuperAdmin role required.',
      data: null,
    });
  }

  res.json({
    success: true,
    message: 'Complete permission matrix',
    data: {
      resources: {
        students: {
          SuperAdmin: ['read', 'write', 'delete'],
          Admin: ['read', 'write'],
          Teacher: ['read_assigned', 'grade_assigned'],
          Student: ['read_own'],
          Parent: ['read_own_children'],
        },
        teachers: {
          SuperAdmin: ['read', 'write', 'delete'],
          Admin: ['read', 'write'],
          Teacher: ['read_own', 'write_own'],
          Student: ['read_assigned'],
          Parent: ['read_children_teachers'],
        },
        courses: {
          SuperAdmin: ['read', 'write', 'delete'],
          Admin: ['read', 'write'],
          Teacher: ['read_assigned', 'write_assigned', 'manage_content'],
          Student: ['read_enrolled', 'enroll_if_enabled'],
          Parent: ['read_children_courses'],
        },
        authorities: {
          SuperAdmin: ['read', 'write', 'delete'],
          Admin: ['read', 'write'],
          Authority: ['read_own', 'write_own', 'manage_jurisdiction'],
        },
        users: {
          SuperAdmin: ['read', 'write', 'delete'],
          Admin: ['read', 'write', 'no_delete_peer_admins'],
        },
      },
      special_permissions: {
        role_assignment: 'SuperAdmin only',
        system_configuration: 'SuperAdmin only',
        audit_logs: 'SuperAdmin and Admin',
        bulk_operations: 'Admin and SuperAdmin',
        cross_jurisdiction_access: 'SuperAdmin only',
      },
    },
  });
});

export default router;

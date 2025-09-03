import express from 'express';
import { Types } from 'mongoose';
import { GroupDAO } from '../daos/group.dao';
import { groupService } from '../services/group.service';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';
import { UserRole } from '../types';
import { EntityStatus } from '@schoola/types/src';
import { AuthenticatedRequest, ApiResponse, PaginatedResponse, QueryFilter } from '../types/controller.types';

const router = express.Router();

/**
 * Get all groups with filtering and pagination
 * @route GET /api/groups
 * @access Private - Admin, Editor, Teacher
 */
router.get(
  '/',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor, UserRole.Teacher]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const {
        page = '1',
        limit = '10',
        search,
        location,
        course,
        teacher,
        status = EntityStatus.Active,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        minCapacity,
        maxCapacity,
      } = req.query as QueryFilter;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Build filter
      const filter: Record<string, any> = { status };

      if (search) {
        filter['$or'] = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (location) {
        filter['location'] = new Types.ObjectId(location as string);
      }

      if (course) {
        filter['course'] = new Types.ObjectId(course as string);
      }

      if (teacher) {
        filter['teachers'] = new Types.ObjectId(teacher as string);
      }

      if (minCapacity || maxCapacity) {
        filter['capacity'] = {};
        if (minCapacity) filter['capacity']['$gte'] = parseInt(minCapacity as string);
        if (maxCapacity) filter['capacity']['$lte'] = parseInt(maxCapacity as string);
      }

      const groups = await GroupDAO.find(filter, {
        limit: parseInt(limit),
        skip,
        sort: sortOptions,
        populate: ['location', 'course', 'teachers', 'students', 'createdBy'],
      });

      const total = await GroupDAO.count(filter);

      const response: ApiResponse<PaginatedResponse<any>> = {
        success: true,
        message: 'Groups retrieved successfully',
        data: {
          data: groups,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
          },
        },
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve groups',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Get group by ID
 * @route GET /api/groups/:id
 * @access Private - Admin, Editor, Teacher
 */
router.get(
  '/:id',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor, UserRole.Teacher]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid group ID',
        };
        return res.status(400).json(response);
      }

      const group = await GroupDAO.findById(id, ['location', 'course', 'teachers', 'students', 'createdBy']);

      if (!group) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Group retrieved successfully',
        data: group,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve group',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Create new group
 * @route POST /api/groups
 * @access Private - Admin, Editor
 */
router.post(
  '/',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const groupData = {
        ...req.body,
        createdBy: req.user.userId,
      };

      // Check if group code already exists
      if (groupData.code && (await GroupDAO.codeExists(groupData.code))) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group code already exists',
        };
        return res.status(400).json(response);
      }

      const group = await groupService.createGroup(groupData);

      const response: ApiResponse<any> = {
        success: true,
        message: 'Group created successfully',
        data: group,
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to create group',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Update group by ID
 * @route PUT /api/groups/:id
 * @access Private - Admin, Editor
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid group ID',
        };
        return res.status(400).json(response);
      }

      // Check if group code already exists (excluding current group)
      if (req.body.code && (await GroupDAO.codeExists(req.body.code, id))) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group code already exists',
        };
        return res.status(400).json(response);
      }

      const group = await groupService.updateGroup(id, req.body);

      if (!group) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Group updated successfully',
        data: group,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to update group',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Delete group by ID
 * @route DELETE /api/groups/:id
 * @access Private - Admin
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole([UserRole.Admin]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid group ID',
        };
        return res.status(400).json(response);
      }

      const group = await groupService.deleteGroup(id);

      if (!group) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Group deleted successfully',
        data: group,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to delete group',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Add student to group
 * @route POST /api/groups/:id/students
 * @access Private - Admin, Editor
 */
router.post(
  '/:id/students',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { studentId } = req.body;

      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(studentId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid group or student ID',
        };
        return res.status(400).json(response);
      }

      const group = await GroupDAO.addStudent(id, studentId);

      if (!group) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group not found or student already in group',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Student added to group successfully',
        data: group,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to add student to group',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Remove student from group
 * @route DELETE /api/groups/:id/students/:studentId
 * @access Private - Admin, Editor
 */
router.delete(
  '/:id/students/:studentId',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id, studentId } = req.params;

      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(studentId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid group or student ID',
        };
        return res.status(400).json(response);
      }

      const group = await GroupDAO.removeStudent(id, studentId);

      if (!group) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group not found or student not in group',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Student removed from group successfully',
        data: group,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to remove student from group',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Add teacher assignment to group
 * @route POST /api/groups/:id/teachers
 * @access Private - Admin, Editor
 */
router.post(
  '/:id/teachers',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id } = req.params;
      const { teacherId, role = 'primary', startDate, endDate } = req.body;

      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(teacherId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid group or teacher ID',
        };
        return res.status(400).json(response);
      }

      const assignment = {
        teacher: teacherId,
        role,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: true,
      };

      const group = await GroupDAO.addTeacherAssignment(id, assignment);

      if (!group) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Teacher assignment added successfully',
        data: group,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to add teacher assignment',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Remove teacher assignment from group
 * @route DELETE /api/groups/:id/teachers/:teacherId
 * @access Private - Admin, Editor
 */
router.delete(
  '/:id/teachers/:teacherId',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id, teacherId } = req.params;

      if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(teacherId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid group or teacher ID',
        };
        return res.status(400).json(response);
      }

      const group = await GroupDAO.removeTeacherAssignment(id, teacherId);

      if (!group) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Group not found or teacher assignment not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Teacher assignment removed successfully',
        data: group,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to remove teacher assignment',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Get group statistics
 * @route GET /api/groups/stats/overview
 * @access Private - Admin, Editor
 */
router.get(
  '/stats/overview',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const stats = await GroupDAO.getStatistics();

      const response: ApiResponse<any> = {
        success: true,
        message: 'Group statistics retrieved successfully',
        data: stats,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve group statistics',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Get groups by location
 * @route GET /api/groups/location/:locationId
 * @access Private - Admin, Editor, Teacher
 */
router.get(
  '/location/:locationId',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor, UserRole.Teacher]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { locationId } = req.params;

      if (!Types.ObjectId.isValid(locationId)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid location ID',
        };
        return res.status(400).json(response);
      }

      const groups = await GroupDAO.findByLocation(locationId);

      const response: ApiResponse<any[]> = {
        success: true,
        message: 'Groups retrieved successfully',
        data: groups,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve groups',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Search groups by text
 * @route GET /api/groups/search
 * @access Private - Admin, Editor, Teacher
 */
router.get(
  '/search',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor, UserRole.Teacher]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { q: searchText, includeInactive = 'false' } = req.query;

      if (!searchText || typeof searchText !== 'string') {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Search text is required',
        };
        return res.status(400).json(response);
      }

      const groups = await GroupDAO.searchByText(searchText, includeInactive === 'true');

      const response: ApiResponse<any[]> = {
        success: true,
        message: 'Groups retrieved successfully',
        data: groups,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to search groups',
        error: error.message,
      };
      res.status(500).json(response);
    }
  },
);

export default router;

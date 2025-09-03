import express from 'express';
import { Types } from 'mongoose';
import { DiscountDAO } from '../daos/discount.dao';
import { discountService } from '../services/discount.service';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';
import { UserRole } from '../types';
import { EntityStatus } from '@schoola/types/src';
import { AuthenticatedRequest, ApiResponse, PaginatedResponse, QueryFilter } from '../types/controller.types';

const router = express.Router();

/**
 * Get all discounts with filtering and pagination
 * @route GET /api/discounts
 * @access Private - Admin, Editor
 */
router.get(
  '/',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const {
        page = '1',
        limit = '10',
        search,
        type,
        status = EntityStatus.Active,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        minValue,
        maxValue,
        active,
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

      if (type) {
        filter['type'] = type;
      }

      if (active !== undefined) {
        filter['isActive'] = active === 'true';
      }

      if (minValue || maxValue) {
        filter['value'] = {};
        if (minValue) filter['value']['$gte'] = parseFloat(minValue as string);
        if (maxValue) filter['value']['$lte'] = parseFloat(maxValue as string);
      }

      const discounts = await DiscountDAO.find(filter, {
        limit: parseInt(limit),
        skip,
        sort: sortOptions,
        populate: ['createdBy'],
      });

      const total = await DiscountDAO.count(filter);

      const response: ApiResponse<PaginatedResponse<any>> = {
        success: true,
        message: 'Discounts retrieved successfully',
        data: {
          items: discounts,
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
        message: 'Failed to retrieve discounts',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Get discount by ID
 * @route GET /api/discounts/:id
 * @access Private - Admin, Editor
 */
router.get(
  '/:id',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid discount ID',
        };
        return res.status(400).json(response);
      }

      const discount = await DiscountDAO.findById(id, ['createdBy']);

      if (!discount) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Discount not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Discount retrieved successfully',
        data: discount,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve discount',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Create new discount
 * @route POST /api/discounts
 * @access Private - Admin, Editor
 */
router.post(
  '/',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const discountData = {
        ...req.body,
        createdBy: req.user?.id,
      };

      // Check if discount code already exists
      if (discountData.code && (await DiscountDAO.codeExists(discountData.code))) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Discount code already exists',
        };
        return res.status(400).json(response);
      }

      const discount = await discountService.createDiscount(discountData);

      const response: ApiResponse<any> = {
        success: true,
        message: 'Discount created successfully',
        data: discount,
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to create discount',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Update discount by ID
 * @route PUT /api/discounts/:id
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
          message: 'Invalid discount ID',
        };
        return res.status(400).json(response);
      }

      // Check if discount code already exists (excluding current discount)
      if (req.body.code && (await DiscountDAO.codeExists(req.body.code, id))) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Discount code already exists',
        };
        return res.status(400).json(response);
      }

      const discount = await discountService.updateDiscount(id, req.body);

      if (!discount) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Discount not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Discount updated successfully',
        data: discount,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to update discount',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Delete discount by ID
 * @route DELETE /api/discounts/:id
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
          message: 'Invalid discount ID',
        };
        return res.status(400).json(response);
      }

      const discount = await discountService.deleteDiscount(id);

      if (!discount) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Discount not found',
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Discount deleted successfully',
        data: discount,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to delete discount',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Validate discount code
 * @route POST /api/discounts/validate
 * @access Private - All authenticated users
 */
router.post('/validate', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Discount code is required',
      };
      return res.status(400).json(response);
    }

    const validation = await DiscountDAO.validateDiscount(code, userId);

    const response: ApiResponse<any> = {
      success: validation.valid,
      message: validation.valid ? 'Discount is valid' : validation.reason || 'Discount is invalid',
      data: validation.discount || null,
    };

    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to validate discount',
      errors: [error.message],
    };
    res.status(500).json(response);
  }
});

/**
 * Get active discounts
 * @route GET /api/discounts/active
 * @access Private - All authenticated users
 */
router.get('/active', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const discounts = await DiscountDAO.findActiveDiscounts();

    const response: ApiResponse<any[]> = {
      success: true,
      message: 'Active discounts retrieved successfully',
      data: discounts,
    };

    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to retrieve active discounts',
      errors: [error.message],
    };
    res.status(500).json(response);
  }
});

/**
 * Get discount statistics
 * @route GET /api/discounts/stats/overview
 * @access Private - Admin, Editor
 */
router.get(
  '/stats/overview',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const stats = await DiscountDAO.getStatistics();

      const response: ApiResponse<any> = {
        success: true,
        message: 'Discount statistics retrieved successfully',
        data: stats,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve discount statistics',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Get discounts by type
 * @route GET /api/discounts/type/:type
 * @access Private - Admin, Editor
 */
router.get(
  '/type/:type',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
  async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { type } = req.params;
      const { includeInactive = 'false' } = req.query;

      const discounts = await DiscountDAO.findByType(type, includeInactive === 'true');

      const response: ApiResponse<any[]> = {
        success: true,
        message: 'Discounts retrieved successfully',
        data: discounts,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to retrieve discounts',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Search discounts by text
 * @route GET /api/discounts/search
 * @access Private - Admin, Editor
 */
router.get(
  '/search',
  authenticateToken,
  requireRole([UserRole.Admin, UserRole.Editor]),
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

      const discounts = await DiscountDAO.searchByText(searchText, includeInactive === 'true');

      const response: ApiResponse<any[]> = {
        success: true,
        message: 'Discounts retrieved successfully',
        data: discounts,
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Failed to search discounts',
        errors: [error.message],
      };
      res.status(500).json(response);
    }
  },
);

/**
 * Use discount (apply to transaction)
 * @route POST /api/discounts/:id/use
 * @access Private - All authenticated users
 */
router.post('/:id/use', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;
    const userId = req.user?.id;

    if (!Types.ObjectId.isValid(id)) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Invalid discount ID',
      };
      return res.status(400).json(response);
    }

    if (!transactionId || !userId) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Transaction ID and user ID are required',
      };
      return res.status(400).json(response);
    }

    // First validate the discount
    const validation = await DiscountDAO.validateDiscount((await DiscountDAO.findById(id))?.code || '', userId);

    if (!validation.valid) {
      const response: ApiResponse<null> = {
        success: false,
        message: validation.reason || 'Discount is not valid',
      };
      return res.status(400).json(response);
    }

    const discount = await DiscountDAO.useDiscount(id, userId, transactionId);

    const response: ApiResponse<any> = {
      success: true,
      message: 'Discount applied successfully',
      data: discount,
    };

    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to apply discount',
      errors: [error.message],
    };
    res.status(500).json(response);
  }
});

export default router;

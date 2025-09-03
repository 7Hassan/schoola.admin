import express from 'express';
import { authRoutes } from './auth.routes';

/**
 * Main Router Index
 * Combines all route modules and applies global middleware
 */

const router = express.Router();

/**
 * API version and health check
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Schoola API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
  });
});

/**
 * API info endpoint
 */
router.get('/info', (_req, res) => {
  res.json({
    success: true,
    message: 'Schoola API Information',
    data: {
      name: 'Schoola Dashboard API',
      version: '1.0.0',
      description: 'Role-based access control API for school management',
      documentation: '/api/docs',
      endpoints: {
        auth: '/api/auth/*',
        health: '/api/health',
        info: '/api/info',
      },
      features: [
        'JWT Authentication',
        'Role-based Access Control',
        'User Management',
        'Session Management',
        'Input Validation',
        'Security Middleware',
      ],
    },
  });
});

/**
 * Mount route modules
 */

// Authentication routes
router.use('/auth', authRoutes);

// TODO: Add other route modules as they are implemented
// router.use('/users', userRoutes);
// router.use('/courses', courseRoutes);
// router.use('/teachers', teacherRoutes);
// router.use('/students', studentRoutes);
// router.use('/authorities', authorityRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/sessions', sessionRoutes);

/**
 * Catch-all for undefined routes
 */
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
    availableEndpoints: {
      auth: '/api/auth/*',
      health: '/api/health',
      info: '/api/info',
    },
  });
});

export { router as apiRoutes };
export default router;

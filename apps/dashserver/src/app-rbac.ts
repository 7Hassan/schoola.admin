import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { apiRoutes } from './routes';

/**
 * New RBAC-enabled Express Application Configuration
 * This replaces the old app.ts with our new authentication system
 */

export class NewAppConfig {
  private app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  /**
   * Configure middleware stack
   */
  private configureMiddleware(): void {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
          },
        },
        crossOriginEmbedderPolicy: false,
      }),
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (mobile apps, Postman, etc.)
          if (!origin) return callback(null, true);

          const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:8080',
            'https://schoola.app',
            'https://dashboard.schoola.app',
            'https://api.schoola.app',
          ];

          if (allowedOrigins.includes(origin)) {
            callback(null, true);
          } else if (process.env['NODE_ENV'] === 'development') {
            // Allow all origins in development
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
      }),
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env['NODE_ENV'] === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(
      express.json({
        limit: '10mb',
        strict: true,
      }),
    );

    this.app.use(
      express.urlencoded({
        extended: true,
        limit: '10mb',
      }),
    );

    // Cookie parsing
    this.app.use(cookieParser(process.env['COOKIE_SECRET'] || 'schoola-secret'));

    // Compression
    this.app.use(compression());

    // Request logging (simple version)
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
      });

      next();
    });
  }

  /**
   * Configure application routes
   */
  private configureRoutes(): void {
    // Root endpoint
    this.app.get('/', (_req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Schoola API Server (RBAC Enabled)',
        version: '2.0.0',
        authentication: 'JWT with Role-based Access Control',
        documentation: '/api/info',
        health: '/api/health',
      });
    });

    // API routes
    this.app.use('/api', apiRoutes);

    // Keep old v1 routes for backward compatibility (if needed)
    // this.app.use('/v1', oldRoutes);

    // Serve static files if needed (e.g., documentation)
    if (process.env['NODE_ENV'] !== 'production') {
      this.app.use('/docs', express.static('docs'));
    }
  }

  /**
   * Configure error handling
   */
  private configureErrorHandling(): void {
    // 404 handler for non-API routes
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.url.startsWith('/api/')) {
        return next(); // Let API routes handle their own 404s
      }

      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        code: 'NOT_FOUND',
        availableEndpoints: {
          api: '/api/*',
          health: '/api/health',
          info: '/api/info',
        },
      });
    });

    // Global error handler
    this.app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      console.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        user: (req as any).user?.id,
        timestamp: new Date().toISOString(),
      });

      // Don't leak error details in production
      const isDevelopment = process.env['NODE_ENV'] === 'development';

      if (err.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: isDevelopment ? err.errors : undefined,
        });
        return;
      }

      if (err.name === 'UnauthorizedError' || err.message?.includes('jwt')) {
        res.status(401).json({
          success: false,
          message: 'Authentication failed',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      if (err.name === 'ForbiddenError') {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          code: 'FORBIDDEN',
        });
        return;
      }

      if (err.name === 'CastError') {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
          code: 'INVALID_ID',
        });
        return;
      }

      if (err.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'Resource already exists',
          code: 'DUPLICATE_RESOURCE',
        });
        return;
      }

      // CORS errors
      if (err.message?.includes('CORS')) {
        res.status(403).json({
          success: false,
          message: 'CORS policy violation',
          code: 'CORS_ERROR',
        });
        return;
      }

      // Rate limit errors
      if (err.message?.includes('rate limit')) {
        res.status(429).json({
          success: false,
          message: 'Rate limit exceeded',
          code: 'RATE_LIMIT_ERROR',
        });
        return;
      }

      // Default server error
      res.status(500).json({
        success: false,
        message: isDevelopment ? err.message : 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        stack: isDevelopment ? err.stack : undefined,
      });
    });
  }

  /**
   * Get configured Express application
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Get application for testing
   */
  public getAppForTesting(): Application {
    return this.app;
  }
}

export default NewAppConfig;

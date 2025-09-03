import mongoose from 'mongoose';
import NewAppConfig from './app-rbac';

/**
 * Server startup with RBAC Authentication System
 * This demonstrates how to start the server with our new architecture
 */

// Environment configuration
const PORT = process.env['PORT'] || 3000;
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/schoola';
const JWT_SECRET = process.env['JWT_SECRET'];

// Validate required environment variables
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  process.exit(1);
}

/**
 * Database connection
 */
async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Log database info
    if (mongoose.connection.db) {
      console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    }
    console.log(`🔗 Connection: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
function setupGracefulShutdown(): void {
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n📋 Received ${signal}. Starting graceful shutdown...`);

    try {
      // Close database connection
      await mongoose.connection.close();
      console.log('✅ Database connection closed');

      // Exit process
      console.log('👋 Server shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Handle different shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('Unhandled Rejection');
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('Uncaught Exception');
  });
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    console.log('🚀 Starting Schoola API Server...');
    console.log(`📦 Environment: ${NODE_ENV}`);
    console.log(`🔧 Port: ${PORT}`);

    // Connect to database
    await connectDatabase();

    // Create and configure the app
    const appConfig = new NewAppConfig();
    const app = appConfig.getApp();

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
      console.log(`💖 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📖 API Info: http://localhost:${PORT}/api/info`);
      console.log(`🔐 Authentication: http://localhost:${PORT}/api/auth/*`);

      if (NODE_ENV === 'development') {
        console.log('\n🛠️  Development Features:');
        console.log(`   • Debug endpoints: http://localhost:${PORT}/api/auth/debug/*`);
        console.log(`   • CORS: All origins allowed`);
        console.log(`   • Rate limiting: Relaxed (1000 requests/15min)`);
        console.log(`   • Error details: Full stack traces`);
      }

      console.log('\n🔑 Available Authentication Endpoints:');
      console.log('   POST /api/auth/login');
      console.log('   POST /api/auth/register');
      console.log('   POST /api/auth/logout');
      console.log('   GET  /api/auth/me');
      console.log('   POST /api/auth/change-password');
      console.log('   POST /api/auth/refresh');
      console.log('   GET  /api/auth/capabilities');
      console.log('   GET  /api/auth/session');

      console.log('\n🛡️  RBAC Features Enabled:');
      console.log('   • Role-based access control');
      console.log('   • JWT authentication with HTTP-only cookies');
      console.log('   • Permission checking middleware');
      console.log('   • User role hierarchy (SuperAdmin → Admin → Teacher/Authority → Student/Parent)');
      console.log('   • Resource-based permissions');
      console.log('   • Rate limiting by role');
      console.log('   • Audit logging');

      console.log('\n📚 Next Steps:');
      console.log('   1. Test authentication endpoints');
      console.log('   2. Create your first SuperAdmin user');
      console.log('   3. Implement additional resource routes');
      console.log('   4. Add input validation for remaining endpoints');
      console.log('   5. Set up comprehensive testing');
    });

    // Setup graceful shutdown
    setupGracefulShutdown();

    // Store server reference for potential shutdown
    (global as any).server = server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  });
}

export { startServer };
export default startServer;

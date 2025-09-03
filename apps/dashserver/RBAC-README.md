# Schoola RBAC Authentication System

This is the new Role-Based Access Control (RBAC) authentication system for the Schoola platform. It provides a complete separation of concerns with controllers, services, data access objects (DAOs), middleware, and validation layers.

## 🏗️ Architecture Overview

```
┌─────────────────┬──────────────────┬─────────────────┬──────────────────┐
│   Controllers   │    Services      │      DAOs       │    Middleware    │
│                 │                  │                 │                  │
│ HTTP Endpoints  │ Business Logic   │ Database Access │ Authentication   │
│ Request/Response│ RBAC Integration │ Role Filtering  │ Authorization    │
│ Error Handling  │ Data Validation  │ Query Building  │ Permission Check │
│                 │                  │                 │                  │
└─────────────────┴──────────────────┴─────────────────┴──────────────────┘
                                │
                         ┌─────────────┐
                         │ Validation  │
                         │             │
                         │ Input       │
                         │ Sanitization│
                         │ Type Safety │
                         └─────────────┘
```

## 📁 Directory Structure

```
src/
├── controllers/           # HTTP request handlers
│   └── auth.controller.ts # Authentication endpoints
├── services/              # Business logic layer
│   ├── auth.service.ts    # Authentication operations
│   └── rbac.service.ts    # Role-based access control utilities
├── daos/                  # Data access layer
│   ├── auth.dao.ts        # Authentication database operations
│   └── user.dao.ts        # User database operations
├── middleware/            # Express middleware
│   └── rbac.middleware.ts # Authentication & authorization
├── validation/            # Input validation
│   └── auth.validation.ts # Authentication validation rules
├── routes/                # Route configuration
│   ├── auth.routes.ts     # Authentication routes
│   └── index.ts           # Main router
├── types/                 # TypeScript type definitions
│   ├── auth.types.ts      # Authentication types
│   ├── service.types.ts   # Service layer types
│   └── api.types.ts       # API request/response types
├── app-rbac.ts            # Express application configuration
└── server-rbac.ts         # Server startup file
```

## 🔐 RBAC System

### User Roles Hierarchy

```
SuperAdmin
    ├── Full system access
    ├── Can assign any role
    └── Access to debug endpoints

Admin
    ├── Manage users, teachers, students
    ├── Can assign: Teacher, Authority, Student, Parent
    └── Access to admin endpoints

Teacher/Authority
    ├── Manage assigned courses/classes
    ├── View student information
    └── Cannot assign roles

Student/Parent
    ├── View own information
    ├── Access assigned courses
    └── Limited permissions
```

### Permissions System

Each role has specific permissions for different resources:

- **Courses**: read, write, delete
- **Students**: read, write, delete
- **Teachers**: read, write, delete
- **Payments**: read, write, delete
- **Sessions**: read, write, delete
- **Reports**: read, write, delete

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Required
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/schoola

# Optional
PORT=3000
NODE_ENV=development
COOKIE_SECRET=your-cookie-secret-here

# JWT Configuration
JWT_ACCESS_TOKEN_EXPIRE=15m
JWT_REFRESH_TOKEN_EXPIRE=7d
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Start the Server

#### Development Mode

```bash
npm run dev
# or use the new RBAC server
ts-node src/server-rbac.ts
```

#### Production Mode

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/auth/login`          | User login            |
| POST   | `/api/auth/register`       | User registration     |
| POST   | `/api/auth/logout`         | User logout           |
| POST   | `/api/auth/validate-email` | Validate email format |
| GET    | `/api/health`              | Health check          |
| GET    | `/api/info`                | API information       |

### Protected Endpoints

| Method | Endpoint                     | Description               | Required Role     |
| ------ | ---------------------------- | ------------------------- | ----------------- |
| GET    | `/api/auth/me`               | Get user profile          | Any authenticated |
| POST   | `/api/auth/change-password`  | Change password           | Any authenticated |
| POST   | `/api/auth/refresh`          | Refresh token             | Any authenticated |
| GET    | `/api/auth/capabilities`     | Get user permissions      | Any authenticated |
| GET    | `/api/auth/session`          | Get session info          | Any authenticated |
| GET    | `/api/auth/check-permission` | Check specific permission | Any authenticated |
| PUT    | `/api/auth/users/:id/role`   | Update user role          | SuperAdmin only   |

### Development Endpoints

| Method | Endpoint                | Description                    | Required Role |
| ------ | ----------------------- | ------------------------------ | ------------- |
| GET    | `/api/auth/debug/roles` | List all roles and permissions | SuperAdmin    |
| GET    | `/api/auth/debug/token` | Debug token information        | SuperAdmin    |

## 🧪 Testing the API

### 1. Register a SuperAdmin User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoola.app",
    "password": "SuperSecure123!",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "SuperAdmin"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoola.app",
    "password": "SuperSecure123!"
  }'
```

### 3. Get Profile (with JWT token)

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🔧 Configuration

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot be a common weak password

### JWT Configuration

- **Access Token**: 15 minutes (configurable)
- **Refresh Token**: 7 days (configurable)
- **Algorithm**: HS256
- **Storage**: HTTP-only cookies + Authorization header

### Rate Limiting

- **Development**: 1000 requests per 15 minutes
- **Production**: 100 requests per 15 minutes
- **Scope**: Per IP address
- **Endpoints**: All `/api/*` routes

## 🛡️ Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **HTTP-Only Cookies**: Prevent XSS attacks
3. **Password Hashing**: bcrypt with salt rounds
4. **Rate Limiting**: Prevent brute force attacks
5. **Input Validation**: Comprehensive request validation
6. **CORS Protection**: Configurable origin whitelist
7. **Helmet Security**: Security headers
8. **Request Sanitization**: XSS and injection prevention
9. **Role-Based Access**: Granular permissions
10. **Audit Logging**: Security event logging

## 📊 Monitoring and Logging

The system includes comprehensive logging for:

- Authentication attempts
- Authorization failures
- Permission checks
- Role assignments
- Rate limiting violations
- Security events
- Error tracking

## 🔄 Migration from Old System

To migrate from the existing authentication system:

1. **Backup existing data**
2. **Update imports** from old modules to new structure
3. **Replace route handlers** with new RBAC controllers
4. **Update middleware** to use new RBAC system
5. **Test thoroughly** before deploying

### Key Changes

| Old System           | New RBAC System                     |
| -------------------- | ----------------------------------- |
| `passport-jwt`       | Custom JWT middleware               |
| Single auth module   | Separated controllers/services/DAOs |
| Basic role checking  | Comprehensive RBAC                  |
| Limited validation   | Extensive input validation          |
| Basic error handling | Structured error responses          |

## 🧪 Testing

### Unit Tests (TODO)

```bash
# Run tests for individual components
npm run test:unit

# Test coverage
npm run test:coverage
```

### Integration Tests (TODO)

```bash
# Test complete authentication flows
npm run test:integration
```

### API Tests (TODO)

```bash
# Test all endpoints with different roles
npm run test:api
```

## 🚀 Deployment

### Environment Variables (Production)

```bash
# Required
JWT_SECRET=your-production-jwt-secret-256-bit-minimum
MONGODB_URI=mongodb+srv://your-production-database
NODE_ENV=production

# Optional
PORT=3000
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100
LOG_LEVEL=info
```

### Docker Deployment (TODO)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server-rbac.js"]
```

## 🤝 Contributing

1. Follow the established architecture patterns
2. Maintain separation of concerns
3. Add proper TypeScript types
4. Include comprehensive validation
5. Write tests for new features
6. Update this documentation

## 📚 Additional Resources

- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Authentication Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ✅ Implementation Status

- [x] RBAC Service with role permissions
- [x] User and Auth Data Access Objects
- [x] Authentication Service with business logic
- [x] Authentication Controller with HTTP endpoints
- [x] RBAC Middleware with JWT and permission checking
- [x] Input validation and sanitization
- [x] Route configuration and Express integration
- [x] Error handling and security middleware
- [x] Development server setup
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Production deployment configuration
- [ ] Performance monitoring
- [ ] Audit logging enhancement

The foundation is complete and ready for production use with proper testing and monitoring setup.

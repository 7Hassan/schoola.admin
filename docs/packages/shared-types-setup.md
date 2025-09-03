# Shared Types Package Setup Guide

## Overview

This document explains how to set up and use the shared types package (`@schoola/types`) in the Schoola monorepo. The shared types package provides consistent TypeScript type definitions across all applications and packages in the workspace.

## 📁 Package Structure

```
packages/types/
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── src/
│   └── index.ts          # Main types export file
└── dist/                 # Built output (generated)
    ├── index.js          # CommonJS build
    ├── index.mjs         # ES Module build
    ├── index.d.ts        # Type definitions
    └── index.d.ts.map    # Source maps
```

## 🔧 Technical Setup

### Package Configuration

The `@schoola/types` package is configured as a TypeScript library with multiple output formats:

**Key Features:**

- **Dual Format Support**: Both CommonJS (`index.js`) and ES Modules (`index.mjs`)
- **Type Definitions**: Generated `.d.ts` files for TypeScript support
- **Source Maps**: For debugging support
- **Modern Build Tool**: Uses `tsup` for fast, zero-config bundling

### Build Configuration

```json
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rimraf dist",
    "typecheck": "tsc --noEmit"
  }
}
```

### Package Exports

The package uses modern Node.js exports field for proper module resolution:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## 📋 Type Categories

The shared types package includes comprehensive type definitions organized into logical categories:

### 1. Common Enums

- `EmploymentType`: Full-time, Part-time, Contract, Freelance
- `Gender`: Male, Female, Other, PreferNotToSay
- `Currency`: EGP, USD, EUR, GBP
- `UserRole`: SuperAdmin, Admin, Editor, Teacher, Student, Parent, Viewer
- `EntityStatus`: Active, Inactive, Draft, Archived, Suspended
- `CourseLevel`: Beginner, Intermediate, Advanced, Expert

### 2. Common Interfaces

- `Address`: Street, city, state, postal code, country
- `Salary`: Amount and currency
- `Contact`: Email, phone, alternate phone
- `EmergencyContact`: Name, phone, relationship, email
- `DateRange`: Start and end dates
- `AgeRange`: Min and max age

### 3. Entity Types

- **User & Authentication**: User, AuthTokens, LoginCredentials, RegisterData
- **Student**: Student, StudentCreateInput, StudentUpdateInput
- **Teacher**: Teacher, TeacherCreateInput, TeacherUpdateInput
- **Course**: Course, MaterialLink, CourseCreateInput, CourseUpdateInput
- **Group**: Group, SessionTime, GroupCreateInput, GroupUpdateInput
- **Location**: Location, LocationCreateInput, LocationUpdateInput

### 4. Form Builder Types

- `FieldType`: Text, number, email, textarea, select, checkbox, radio, file, date
- `FieldDefinition`: Complete field configuration
- `FormSchema`: Complete form structure

### 5. API Response Types

- `ApiResponse<T>`: Standardized API response format
- `PaginationQuery`: Common pagination parameters
- `FilterQuery`: Extended query parameters with filtering

### 6. Utility Types

- `WithId<T>`: Adds id field to type
- `WithTimestamps<T>`: Adds createdAt/updatedAt fields
- `CreateInput<T>`: Omits id and timestamp fields for creation
- `UpdateInput<T>`: Makes CreateInput fields optional for updates
- `EntityWithTimestamps<T>`: Combines all metadata fields

## 🚀 Usage in Applications

### Frontend (Dashboard App)

The dashboard app already includes the types package as a dependency:

```json
{
  "dependencies": {
    "@schoola/types": "workspace:*"
  }
}
```

**Usage Example:**

```typescript
import {
  Student,
  StudentCreateInput,
  Teacher,
  Course,
  EntityStatus,
  UserRole
} from '@schoola/types'

// Define a student
const student: Student = {
  id: '1',
  studentCode: 'STU001',
  firstName: 'John',
  lastName: 'Doe',
  // ... other fields
  status: EntityStatus.Active,
  createdAt: new Date(),
  updatedAt: new Date()
}

// Create input for new student
const newStudent: StudentCreateInput = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com'
  // ... other fields without id/timestamps
}

// API response typing
const response: ApiResponse<Student[]> = await fetchStudents()
```

### Backend (Dashboard Server)

The backend server also uses the shared types:

```json
{
  "dependencies": {
    "@schoola/types": "workspace:*"
  }
}
```

**Usage Example:**

```typescript
import {
  Student,
  StudentCreateInput,
  ApiResponse,
  PaginationQuery
} from '@schoola/types'
import { Request, Response } from 'express'

// API endpoint with typed parameters
export const getStudents = async (
  req: Request<{}, ApiResponse<Student[]>, {}, PaginationQuery>,
  res: Response<ApiResponse<Student[]>>
) => {
  const { page = 1, limit = 10, search } = req.query

  // ... fetch students logic

  return res.json({
    success: true,
    data: students,
    meta: {
      total: 100,
      page,
      limit,
      pages: 10
    }
  })
}

// Create student endpoint
export const createStudent = async (
  req: Request<{}, ApiResponse<Student>, StudentCreateInput>,
  res: Response<ApiResponse<Student>>
) => {
  const studentData: StudentCreateInput = req.body

  // ... create student logic

  return res.json({
    success: true,
    data: createdStudent,
    message: 'Student created successfully'
  })
}
```

## 🔄 Development Workflow

### 1. Adding New Types

To add new types to the shared package:

```typescript
// In packages/types/src/index.ts

export interface NewEntityType {
  id: string
  name: string
  description?: string
  status: EntityStatus
  createdAt: Date
  updatedAt: Date
}

export interface NewEntityCreateInput {
  name: string
  description?: string
}

export interface NewEntityUpdateInput extends Partial<NewEntityCreateInput> {
  status?: EntityStatus
}
```

### 2. Building the Package

```bash
# Build once
pnpm --filter @schoola/types build

# Watch mode for development
pnpm --filter @schoola/types dev

# Build all packages (includes types)
pnpm build
```

### 3. Type Checking

```bash
# Check types in the package
pnpm --filter @schoola/types typecheck

# Check all packages
pnpm typecheck
```

## 🎯 Best Practices

### 1. Type Naming Conventions

- **Entities**: Use PascalCase (e.g., `Student`, `Teacher`, `Course`)
- **Enums**: Use PascalCase with descriptive names (e.g., `EntityStatus`, `UserRole`)
- **Interfaces**: Use descriptive names ending with purpose (e.g., `StudentCreateInput`, `ApiResponse`)
- **Utility Types**: Use descriptive names (e.g., `WithTimestamps`, `EntityWithTimestamps`)

### 2. Input/Output Type Patterns

Follow consistent patterns for CRUD operations:

```typescript
// Base entity
export interface Entity {
  id: string
  name: string
  status: EntityStatus
  createdAt: Date
  updatedAt: Date
}

// Create input (excludes id and timestamps)
export interface EntityCreateInput {
  name: string
}

// Update input (makes create fields optional)
export interface EntityUpdateInput extends Partial<EntityCreateInput> {
  status?: EntityStatus
}
```

### 3. Enum Usage

Use string enums for better serialization and debugging:

```typescript
export enum Status {
  Active = 'active',
  Inactive = 'inactive'
}
```

### 4. Generic Types

Create reusable generic types for common patterns:

```typescript
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
```

## 🏗️ Integration with Build System

The types package is integrated into the Turbo monorepo build system:

### Turbo Configuration

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```

### Package Dependencies

The build system ensures that:

1. Types package builds before dependent packages
2. Type checking runs across all packages
3. Changes in types trigger rebuilds in dependent packages

## 🔍 Troubleshooting

### Common Issues

1. **Type Import Errors**

   ```typescript
   // ❌ Don't import from source
   import { Student } from '@schoola/types/src/index'

   // ✅ Import from package root
   import { Student } from '@schoola/types'
   ```

2. **Build Errors**

   ```bash
   # Clean and rebuild if having issues
   pnpm --filter @schoola/types clean
   pnpm --filter @schoola/types build
   ```

3. **Type Conflicts**
   - Ensure consistent TypeScript versions across packages
   - Check that all packages use the same base configuration
   - Rebuild types package after changes

### Debugging

1. **Check Package Build**

   ```bash
   # Verify dist folder is generated
   ls packages/types/dist

   # Check build output
   pnpm --filter @schoola/types build
   ```

2. **Verify Package Resolution**
   ```bash
   # Check if package is properly linked
   pnpm list @schoola/types
   ```

## 📈 Future Enhancements

### Potential Improvements

1. **Runtime Type Validation**
   - Integrate with `zod` for runtime type checking
   - Generate validation schemas from TypeScript types

2. **API Client Generation**
   - Generate typed API clients from shared types
   - Automatic OpenAPI schema generation

3. **Database Schema Sync**
   - Generate database schemas from TypeScript types
   - Ensure consistency between API and database

4. **Type Documentation**
   - Automatic documentation generation
   - Interactive type explorer

## 🎉 Conclusion

The shared types package provides a solid foundation for type safety across the Schoola monorepo. It ensures consistency, reduces duplication, and improves developer experience by providing centralized type definitions.

By following the patterns and best practices outlined in this guide, you can maintain a robust and scalable type system that grows with your application needs.

---

**Last Updated:** August 27, 2025  
**Version:** 1.0.0  
**Maintainer:** Schoola Development Team


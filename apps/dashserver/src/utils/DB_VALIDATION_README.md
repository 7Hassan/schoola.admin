# Database Validation Utilities

Enhanced database validation utilities for MongoDB operations in the School App backend.

## Overview

The `dbValidation.ts` module provides comprehensive validation utilities for MongoDB operations, ensuring data integrity, performance, and reliability across the application.

## Features

### ✨ **Core Validation Functions**

- **ObjectId Validation**: Format validation for MongoDB ObjectIds
- **Document Existence**: Check if documents exist in collections
- **Criteria Matching**: Validate documents against specific criteria
- **Field Uniqueness**: Ensure field values are unique within collections
- **Relationship Validation**: Validate relationships between documents
- **Count Constraints**: Validate document counts within specified limits
- **Connection Health**: Check database connection status

### 🚀 **Key Improvements Over Original**

- **Type Safety**: Full TypeScript support with detailed result types
- **Error Handling**: Comprehensive error catching and reporting
- **Bulk Operations**: Efficient validation of multiple documents
- **Performance**: Optimized queries with minimal database hits
- **Flexibility**: Configurable filters and criteria
- **Detailed Results**: Rich validation results with debugging information

## API Reference

### Basic ObjectId Validation

```typescript
import { isValidObjectId, validateObjectIds } from './dbValidation';

// Single ObjectId validation
const isValid = isValidObjectId('507f1f77bcf86cd799439011'); // true

// Multiple ObjectIds validation
const result = validateObjectIds(['507f1f77bcf86cd799439011', 'invalid-id']);
// Returns: { isValid: false, validIds: ['507f...'], invalidIds: ['invalid-id'], ... }
```

### Document Existence Validation

```typescript
import { validateDocumentExistence, validateDocumentsExistence } from './dbValidation';

// Single document existence
const result = await validateDocumentExistence('Student', studentId);
// Returns: { isValid: boolean, message: string, details: object }

// Multiple documents existence
const bulkResult = await validateDocumentsExistence('Teacher', teacherIds);
// Returns: { isValid: boolean, existingIds: string[], nonExistentIds: string[], ... }

// With additional criteria
const activeStudentResult = await validateDocumentExistence('Student', studentId, { isActive: true });
```

### Criteria Validation

```typescript
import { validateDocumentCriteria } from './dbValidation';

const result = await validateDocumentCriteria('Teacher', teacherId, {
  status: 'active',
  department: 'Mathematics',
  experienceYears: { $gte: 5 },
});
```

### Uniqueness Validation

```typescript
import { validateFieldUniqueness } from './dbValidation';

// Check if email is unique for new user
const result = await validateFieldUniqueness('User', 'email', 'new@example.com');

// Check uniqueness for update (exclude current user)
const updateResult = await validateFieldUniqueness(
  'User',
  'email',
  'existing@example.com',
  currentUserId, // Exclude this ID from uniqueness check
);
```

### Relationship Validation

```typescript
import { validateDocumentRelationships, RelationshipValidation } from './dbValidation';

const relationships: RelationshipValidation[] = [
  {
    parentModel: 'Group',
    parentId: groupId,
    childModel: 'Student',
    childIds: [studentId1, studentId2],
    relationshipField: 'enrolledStudents',
  },
];

const results = await validateDocumentRelationships(relationships);
```

### Count Validation

```typescript
import { validateDocumentCount } from './dbValidation';

// Validate student count in active groups
const result = await validateDocumentCount(
  'Student',
  { isActive: true, groupId: groupId },
  1, // minimum count
  30, // maximum count
);
```

### Connection Health Check

```typescript
import { validateDatabaseConnection } from './dbValidation';

const connectionStatus = validateDatabaseConnection();
// Returns connection state, host, port, database name
```

## Result Types

### ValidationResult

```typescript
interface ValidationResult {
  isValid: boolean;
  message?: string;
  details?: any;
}
```

### BulkValidationResult

```typescript
interface BulkValidationResult {
  isValid: boolean;
  validIds: string[];
  invalidIds: string[];
  existingIds: string[];
  nonExistentIds: string[];
  totalCount: number;
  validCount: number;
}
```

## Usage Examples

### Basic Validation Workflow

```typescript
async function validateStudentEnrollment(groupId: string, studentIds: string[]) {
  try {
    // 1. Check database connection
    const connectionCheck = validateDatabaseConnection();
    if (!connectionCheck.isValid) {
      throw new Error('Database connection failed');
    }

    // 2. Validate ObjectId formats
    const idValidation = validateObjectIds([groupId, ...studentIds]);
    if (!idValidation.isValid) {
      throw new Error(`Invalid ObjectIds: ${idValidation.invalidIds.join(', ')}`);
    }

    // 3. Validate document existence
    const [groupExists, studentsExist] = await Promise.all([
      validateDocumentExistence('Group', groupId, { isActive: true }),
      validateDocumentsExistence('Student', studentIds, { isActive: true }),
    ]);

    if (!groupExists.isValid) {
      throw new Error(`Group ${groupId} not found or inactive`);
    }

    if (!studentsExist.isValid) {
      throw new Error(`Students not found: ${studentsExist.nonExistentIds.join(', ')}`);
    }

    // 4. Validate business rules
    const capacityCheck = await validateDocumentCount(
      'Student',
      { groupId: groupId },
      undefined,
      30, // Max capacity
    );

    if (!capacityCheck.isValid) {
      throw new Error('Group capacity exceeded');
    }

    return { success: true, message: 'All validations passed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Validation failed',
    };
  }
}
```

### Error Handling Patterns

```typescript
// Handle validation results
const result = await validateDocumentExistence('Student', studentId);

if (!result.isValid) {
  console.error('Validation failed:', result.message);
  console.error('Details:', result.details);
  // Handle error appropriately
}

// Bulk validation error handling
const bulkResult = await validateDocumentsExistence('Student', studentIds);

if (!bulkResult.isValid) {
  console.log(`Found ${bulkResult.existingIds.length} valid students`);
  console.log(`Missing students: ${bulkResult.nonExistentIds.join(', ')}`);
  console.log(`Invalid IDs: ${bulkResult.invalidIds.join(', ')}`);
}
```

## Performance Considerations

### Efficient Bulk Operations

- Use `validateDocumentsExistence` for multiple documents instead of individual calls
- Combine validation operations with `Promise.all()` when possible
- Use `exists()` queries instead of `find()` for existence checks

### Query Optimization

- Additional filters are applied at the database level for efficiency
- Indexes are utilized automatically for common fields like `_id`, `isActive`, etc.
- Lean queries are used to minimize data transfer

### Caching Recommendations

```typescript
// Cache frequently validated documents
const cache = new Map();

async function cachedValidation(modelName: string, id: string) {
  const cacheKey = `${modelName}:${id}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await validateDocumentExistence(modelName, id);

  if (result.isValid) {
    cache.set(cacheKey, result);
    // Set expiration as needed
  }

  return result;
}
```

## Testing

### Unit Tests

```typescript
import { runUnitTests } from './dbValidation.test-utils';

// Run all unit tests
const testResults = runUnitTests();
console.log(`Tests passed: ${testResults.passed}/${testResults.total}`);
```

### Integration Tests

```typescript
import { integrationTestExamples } from './dbValidation.test-utils';

// Run integration tests (requires database)
await integrationTestExamples.documentExistenceTest();
await integrationTestExamples.bulkDocumentExistenceTest();
```

### Performance Testing

```typescript
import { performanceTest } from './dbValidation.test-utils';

// Benchmark validation performance
await performanceTest();
```

## Migration from Legacy Code

### Before (Legacy)

```typescript
const validateDocumentExistence = async (modelName: string, id: string) => {
  console.log('🚀 ~ validateDocumentExistence ~ id:', id);
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const Model = mongoose.model(modelName);
  const exists = await Model.exists({ _id: id });

  return Boolean(exists);
};
```

### After (Enhanced)

```typescript
const result = await validateDocumentExistence('Student', studentId);
// Returns: { isValid: boolean, message: string, details: object }

// Or with additional criteria
const result = await validateDocumentExistence('Student', studentId, { isActive: true });
```

## Best Practices

### 1. Always Check Connection First

```typescript
const connectionStatus = validateDatabaseConnection();
if (!connectionStatus.isValid) {
  throw new Error('Database unavailable');
}
```

### 2. Validate ObjectIds Before Database Operations

```typescript
if (!isValidObjectId(documentId)) {
  return { error: 'Invalid document ID format' };
}
```

### 3. Use Bulk Operations for Multiple Documents

```typescript
// ✅ Good - Single query for multiple documents
const result = await validateDocumentsExistence('Student', studentIds);

// ❌ Avoid - Multiple individual queries
const results = await Promise.all(studentIds.map((id) => validateDocumentExistence('Student', id)));
```

### 4. Handle Validation Results Consistently

```typescript
function handleValidationResult(result: ValidationResult, operation: string) {
  if (!result.isValid) {
    logger.error(`${operation} failed:`, result.message, result.details);
    throw new Error(`${operation}: ${result.message}`);
  }

  logger.info(`${operation} successful:`, result.message);
  return result;
}
```

### 5. Use Appropriate Validation Level

```typescript
// For critical operations - comprehensive validation
await validateDocumentRelationships(relationships);

// For simple checks - basic existence validation
await validateDocumentExistence('User', userId);

// For bulk operations - efficient bulk validation
await validateDocumentsExistence('Student', studentIds);
```

## Related Files

- `dbValidation.examples.ts` - Usage examples and patterns
- `dbValidation.test-utils.ts` - Testing utilities and mock data
- Schema files in `/schemas/` - Mongoose schemas that work with these validations
- Model files in `/models/` - Mongoose models referenced by validation functions

## Contributing

When adding new validation functions:

1. Follow the established pattern of returning `ValidationResult` objects
2. Include comprehensive error handling with try-catch blocks
3. Add TypeScript types for all parameters and return values
4. Include JSDoc documentation for all public functions
5. Add examples to the examples file
6. Add test cases to the test-utils file

---

_This documentation covers the enhanced database validation utilities. For specific implementation details, refer to the source code and example files._

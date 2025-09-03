/**
 * Example usage of enhanced dbValidation utilities
 * This file demonstrates various validation scenarios
 */

import {
  isValidObjectId,
  validateObjectIds,
  validateDocumentExistence,
  validateDocumentsExistence,
  validateDocumentCriteria,
  validateFieldUniqueness,
  validateDocumentRelationships,
  validateDocumentCount,
  validateDatabaseConnection,
  type RelationshipValidation,
} from './dbValidation';

// Example: Basic ObjectId validation
export const exampleObjectIdValidation = () => {
  console.log('=== ObjectId Validation Examples ===');

  // Single ID validation
  const validId = '507f1f77bcf86cd799439011';
  const invalidId = 'invalid-id';

  console.log(`${validId} is valid:`, isValidObjectId(validId)); // true
  console.log(`${invalidId} is valid:`, isValidObjectId(invalidId)); // false

  // Multiple IDs validation
  const ids = [validId, invalidId, '507f1f77bcf86cd799439012', null, undefined];
  const result = validateObjectIds(ids);
  console.log('Bulk validation result:', result);
};

// Example: Document existence validation
export const exampleDocumentExistence = async () => {
  console.log('=== Document Existence Examples ===');

  // Single document existence
  const studentId = '507f1f77bcf86cd799439011';
  const result = await validateDocumentExistence('Student', studentId);
  console.log('Student existence result:', result);

  // Multiple documents existence
  const teacherIds = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'];
  const bulkResult = await validateDocumentsExistence('Teacher', teacherIds);
  console.log('Teachers existence result:', bulkResult);

  // Document existence with additional criteria
  const activeStudentResult = await validateDocumentExistence('Student', studentId, { isActive: true });
  console.log('Active student result:', activeStudentResult);
};

// Example: Criteria validation
export const exampleCriteriaValidation = async () => {
  console.log('=== Criteria Validation Examples ===');

  const teacherId = '507f1f77bcf86cd799439011';
  const criteria = {
    status: 'active',
    department: 'Mathematics',
    experienceYears: { $gte: 5 },
  };

  const result = await validateDocumentCriteria('Teacher', teacherId, criteria);
  console.log('Teacher criteria result:', result);
};

// Example: Uniqueness validation
export const exampleUniquenessValidation = async () => {
  console.log('=== Uniqueness Validation Examples ===');

  // Check if email is unique (for new user)
  const newEmailResult = await validateFieldUniqueness('User', 'email', 'newuser@example.com');
  console.log('New email uniqueness:', newEmailResult);

  // Check if email is unique for update (exclude current user)
  const updateEmailResult = await validateFieldUniqueness(
    'User',
    'email',
    'existing@example.com',
    '507f1f77bcf86cd799439011', // Current user ID to exclude
  );
  console.log('Update email uniqueness:', updateEmailResult);
};

// Example: Relationship validation
export const exampleRelationshipValidation = async () => {
  console.log('=== Relationship Validation Examples ===');

  const relationships: RelationshipValidation[] = [
    {
      parentModel: 'Group',
      parentId: '507f1f77bcf86cd799439011',
      childModel: 'Student',
      childIds: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
      relationshipField: 'enrolledStudents',
    },
    {
      parentModel: 'Course',
      parentId: '507f1f77bcf86cd799439014',
      childModel: 'Teacher',
      childIds: ['507f1f77bcf86cd799439015'],
      relationshipField: 'instructorIds',
    },
  ];

  const results = await validateDocumentRelationships(relationships);
  console.log('Relationship validation results:', results);
};

// Example: Count validation
export const exampleCountValidation = async () => {
  console.log('=== Count Validation Examples ===');

  // Validate minimum number of active students
  const studentCountResult = await validateDocumentCount(
    'Student',
    { isActive: true },
    1, // minimum 1 active student
    1000, // maximum 1000 active students
  );
  console.log('Student count validation:', studentCountResult);

  // Validate teachers per department
  const mathTeachersResult = await validateDocumentCount(
    'Teacher',
    { department: 'Mathematics', status: 'active' },
    2, // minimum 2 math teachers required
  );
  console.log('Math teachers count:', mathTeachersResult);
};

// Example: Database connection validation
export const exampleConnectionValidation = () => {
  console.log('=== Database Connection Validation ===');

  const connectionResult = validateDatabaseConnection();
  console.log('Database connection status:', connectionResult);
};

// Example: Comprehensive validation workflow
export const exampleComprehensiveValidation = async (groupId: string, studentIds: string[], teacherId: string) => {
  console.log('=== Comprehensive Validation Workflow ===');

  try {
    // 1. Validate database connection
    const connectionCheck = validateDatabaseConnection();
    if (!connectionCheck.isValid) {
      throw new Error('Database connection failed');
    }

    // 2. Validate ObjectId formats
    const idValidation = validateObjectIds([groupId, teacherId, ...studentIds]);
    if (!idValidation.isValid) {
      throw new Error(`Invalid ObjectIds: ${idValidation.invalidIds.join(', ')}`);
    }

    // 3. Validate document existence
    const [groupExists, teacherExists, studentsExist] = await Promise.all([
      validateDocumentExistence('Group', groupId, { isActive: true }),
      validateDocumentExistence('Teacher', teacherId, { status: 'active' }),
      validateDocumentsExistence('Student', studentIds, { isActive: true }),
    ]);

    if (!groupExists.isValid) {
      throw new Error(`Group ${groupId} not found or inactive`);
    }

    if (!teacherExists.isValid) {
      throw new Error(`Teacher ${teacherId} not found or inactive`);
    }

    if (!studentsExist.isValid) {
      throw new Error(`Some students not found: ${studentsExist.nonExistentIds.join(', ')}`);
    }

    // 4. Validate business rules
    const groupCapacityResult = await validateDocumentCount(
      'Student',
      { groupId: groupId },
      undefined,
      30, // Max 30 students per group
    );

    if (!groupCapacityResult.isValid) {
      throw new Error('Group capacity exceeded');
    }

    console.log('✅ All validations passed!');
    return {
      isValid: true,
      message: 'Comprehensive validation successful',
      details: {
        groupExists,
        teacherExists,
        studentsExist,
        groupCapacity: groupCapacityResult,
      },
    };
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return {
      isValid: false,
      message: error instanceof Error ? error.message : 'Unknown validation error',
      details: { error },
    };
  }
};

// Export all examples for easy testing
export const runAllExamples = async () => {
  console.log('🚀 Running all dbValidation examples...\n');

  exampleObjectIdValidation();
  await exampleDocumentExistence();
  await exampleCriteriaValidation();
  await exampleUniquenessValidation();
  await exampleRelationshipValidation();
  await exampleCountValidation();
  exampleConnectionValidation();

  console.log('\n✨ All examples completed!');
};

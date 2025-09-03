import mongoose from 'mongoose';

// Types for validation results
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  details?: any;
}

export interface BulkValidationResult {
  isValid: boolean;
  validIds: string[];
  invalidIds: string[];
  existingIds: string[];
  nonExistentIds: string[];
  totalCount: number;
  validCount: number;
}

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The ID string to validate
 * @returns boolean indicating if the ID is valid
 */
export const isValidObjectId = (id: string | undefined | null): boolean => {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validates if multiple IDs are valid ObjectIds
 * @param ids - Array of ID strings to validate
 * @returns Object with validation results
 */
export const validateObjectIds = (ids: (string | undefined | null)[]): BulkValidationResult => {
  const validIds: string[] = [];
  const invalidIds: string[] = [];

  ids.forEach((id) => {
    if (isValidObjectId(id)) {
      validIds.push(id as string);
    } else {
      invalidIds.push(id as string);
    }
  });

  return {
    isValid: invalidIds.length === 0,
    validIds,
    invalidIds,
    existingIds: [], // Will be populated by validateDocumentsExistence
    nonExistentIds: [], // Will be populated by validateDocumentsExistence
    totalCount: ids.length,
    validCount: validIds.length,
  };
};

/**
 * Validates if a document exists in the database
 * @param modelName - Name of the mongoose model
 * @param id - Document ID to check
 * @param additionalFilter - Optional additional filter criteria
 * @returns ValidationResult with existence status
 */
export const validateDocumentExistence = async (
  modelName: string,
  id: string,
  additionalFilter?: Record<string, any>,
): Promise<ValidationResult> => {
  try {
    if (!isValidObjectId(id)) {
      return {
        isValid: false,
        message: 'Invalid ObjectId format',
        details: { id, modelName },
      };
    }

    const Model = mongoose.model(modelName);
    const filter = { _id: id, ...additionalFilter };
    const exists = await Model.exists(filter);

    return {
      isValid: Boolean(exists),
      message: exists ? 'Document exists' : 'Document not found',
      details: { id, modelName, filter },
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Database validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { id, modelName, error },
    };
  }
};

/**
 * Validates existence of multiple documents
 * @param modelName - Name of the mongoose model
 * @param ids - Array of document IDs to check
 * @param additionalFilter - Optional additional filter criteria
 * @returns BulkValidationResult with detailed validation results
 */
export const validateDocumentsExistence = async (
  modelName: string,
  ids: string[],
  additionalFilter?: Record<string, any>,
): Promise<BulkValidationResult> => {
  try {
    // First validate ObjectId format
    const idValidation = validateObjectIds(ids);

    if (idValidation.invalidIds.length > 0) {
      return {
        ...idValidation,
        existingIds: [],
        nonExistentIds: idValidation.validIds,
      };
    }

    // Check existence of valid IDs
    const Model = mongoose.model(modelName);
    const filter = { _id: { $in: idValidation.validIds }, ...additionalFilter };
    const existingDocs = await Model.find(filter, '_id').lean();
    const existingIds = existingDocs.map((doc: any) => doc._id.toString());
    const nonExistentIds = idValidation.validIds.filter((id) => !existingIds.includes(id));

    return {
      ...idValidation,
      existingIds,
      nonExistentIds,
      isValid: nonExistentIds.length === 0 && idValidation.invalidIds.length === 0,
    };
  } catch (error) {
    return {
      isValid: false,
      validIds: [],
      invalidIds: ids,
      existingIds: [],
      nonExistentIds: ids,
      totalCount: ids.length,
      validCount: 0,
    };
  }
};

/**
 * Validates if a document exists and matches specific criteria
 * @param modelName - Name of the mongoose model
 * @param id - Document ID to check
 * @param criteria - Criteria the document must match
 * @returns ValidationResult with match status
 */
export const validateDocumentCriteria = async (
  modelName: string,
  id: string,
  criteria: Record<string, any>,
): Promise<ValidationResult> => {
  try {
    if (!isValidObjectId(id)) {
      return {
        isValid: false,
        message: 'Invalid ObjectId format',
        details: { id, modelName, criteria },
      };
    }

    const Model = mongoose.model(modelName);
    const filter = { _id: id, ...criteria };
    const document = await Model.findOne(filter).lean();

    return {
      isValid: Boolean(document),
      message: document ? 'Document matches criteria' : 'Document not found or criteria not met',
      details: { id, modelName, criteria, found: Boolean(document) },
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Database validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { id, modelName, criteria, error },
    };
  }
};

/**
 * Validates if a field value is unique in the collection
 * @param modelName - Name of the mongoose model
 * @param field - Field name to check uniqueness
 * @param value - Value to check
 * @param excludeId - Optional ID to exclude from check (for updates)
 * @returns ValidationResult with uniqueness status
 */
export const validateFieldUniqueness = async (
  modelName: string,
  field: string,
  value: any,
  excludeId?: string,
): Promise<ValidationResult> => {
  try {
    const Model = mongoose.model(modelName);
    const filter: Record<string, any> = { [field]: value };

    if (excludeId && isValidObjectId(excludeId)) {
      filter['_id'] = { $ne: excludeId };
    }

    const exists = await Model.exists(filter);

    return {
      isValid: !exists,
      message: exists ? `${field} value already exists` : `${field} value is unique`,
      details: { field, value, exists: Boolean(exists), excludeId },
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Database validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { field, value, excludeId, error },
    };
  }
};

/**
 * Validates relationships between documents
 * @param relationships - Array of relationship validations to perform
 * @returns ValidationResult with relationship status
 */
export interface RelationshipValidation {
  parentModel: string;
  parentId: string;
  childModel: string;
  childIds: string[];
  relationshipField?: string;
}

export const validateDocumentRelationships = async (
  relationships: RelationshipValidation[],
): Promise<ValidationResult[]> => {
  const results: ValidationResult[] = [];

  for (const relationship of relationships) {
    try {
      const { parentModel, parentId, childModel, childIds } = relationship;

      // Validate parent exists
      const parentValidation = await validateDocumentExistence(parentModel, parentId);
      if (!parentValidation.isValid) {
        results.push({
          isValid: false,
          message: `Parent document ${parentModel}:${parentId} not found`,
          details: relationship,
        });
        continue;
      }

      // Validate all children exist
      const childrenValidation = await validateDocumentsExistence(childModel, childIds);
      if (!childrenValidation.isValid) {
        results.push({
          isValid: false,
          message: `Some child documents not found: ${childrenValidation.nonExistentIds.join(', ')}`,
          details: { ...relationship, ...childrenValidation },
        });
        continue;
      }

      results.push({
        isValid: true,
        message: 'All relationships valid',
        details: relationship,
      });
    } catch (error) {
      results.push({
        isValid: false,
        message: `Relationship validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { ...relationship, error },
      });
    }
  }

  return results;
};

/**
 * Validates document count constraints
 * @param modelName - Name of the mongoose model
 * @param filter - Filter criteria for counting
 * @param minCount - Minimum expected count
 * @param maxCount - Maximum expected count
 * @returns ValidationResult with count validation status
 */
export const validateDocumentCount = async (
  modelName: string,
  filter: Record<string, any> = {},
  minCount?: number,
  maxCount?: number,
): Promise<ValidationResult> => {
  try {
    const Model = mongoose.model(modelName);
    const count = await Model.countDocuments(filter);

    let isValid = true;
    let message = `Document count: ${count}`;
    const details = { modelName, filter, count, minCount, maxCount };

    if (minCount !== undefined && count < minCount) {
      isValid = false;
      message = `Document count ${count} is below minimum ${minCount}`;
    } else if (maxCount !== undefined && count > maxCount) {
      isValid = false;
      message = `Document count ${count} exceeds maximum ${maxCount}`;
    }

    return {
      isValid,
      message,
      details,
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Document count validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { modelName, filter, minCount, maxCount, error },
    };
  }
};

/**
 * Validates database connection health
 * @returns ValidationResult with connection status
 */
export const validateDatabaseConnection = (): ValidationResult => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    isValid: state === 1,
    message: `Database is ${states[state as keyof typeof states] || 'unknown'}`,
    details: {
      readyState: state,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    },
  };
};

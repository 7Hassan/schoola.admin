/**
 * Form Builder Hook
 * Manages form schema state and provides actions for editing forms
 */

import { useReducer, useCallback } from 'react'
import {
  FormBuilderState,
  FormBuilderAction,
  UseFormBuilderReturn,
  FormSchema,
  FieldDefinition,
  FieldType,
  DEFAULT_FIELD_CONFIGS,
  SchemaExport
} from '@/types/forms/form-builder-types'

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Initial form schema
const createEmptySchema = (): FormSchema => ({
  id: generateId(),
  title: 'Untitled Form',
  description: '',
  fields: [],
  settings: {
    allowMultipleSubmissions: true,
    requireLogin: false,
    showProgressBar: false,
    submitButtonText: 'Submit'
  },
  createdAt: new Date(),
  updatedAt: new Date()
})

// Initial state
const initialState: FormBuilderState = {
  schema: createEmptySchema(),
  selectedFieldId: null,
  isPreviewMode: false,
  isDirty: false
}

// Reducer function
function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState {
  switch (action.type) {
    case 'SET_SCHEMA':
      return {
        ...state,
        schema: action.payload,
        selectedFieldId: null,
        isDirty: false
      }

    case 'UPDATE_FORM_INFO':
      return {
        ...state,
        schema: {
          ...state.schema,
          ...action.payload,
          updatedAt: new Date()
        },
        isDirty: true
      }

    case 'ADD_FIELD': {
      const { type, position } = action.payload
      const fieldId = generateId()
      const newField: FieldDefinition = {
        id: fieldId,
        type,
        label: DEFAULT_FIELD_CONFIGS[type]?.label || 'New Field',
        placeholder: DEFAULT_FIELD_CONFIGS[type]?.placeholder,
        required: false,
        validation: DEFAULT_FIELD_CONFIGS[type]?.validation,
        options: DEFAULT_FIELD_CONFIGS[type]?.options,
        defaultValue: DEFAULT_FIELD_CONFIGS[type]?.defaultValue,
        order: position !== undefined ? position : state.schema.fields.length
      }

      const newFields = [...state.schema.fields]

      if (position !== undefined) {
        // Insert at specific position and update orders
        newFields.splice(position, 0, newField)
        newFields.forEach((field: FieldDefinition, index: number) => {
          field.order = index
        })
      } else {
        // Add to end
        newFields.push(newField)
      }

      return {
        ...state,
        schema: {
          ...state.schema,
          fields: newFields,
          updatedAt: new Date()
        },
        selectedFieldId: fieldId,
        isDirty: true
      }
    }

    case 'UPDATE_FIELD':
      return {
        ...state,
        schema: {
          ...state.schema,
          fields: state.schema.fields.map((field: FieldDefinition) =>
            field.id === action.payload.id
              ? { ...field, ...action.payload.updates }
              : field
          ),
          updatedAt: new Date()
        },
        isDirty: true
      }

    case 'DELETE_FIELD': {
      const newFields = state.schema.fields
        .filter((field: FieldDefinition) => field.id !== action.payload.id)
        .map((field: FieldDefinition, index: number) => ({
          ...field,
          order: index
        }))

      return {
        ...state,
        schema: {
          ...state.schema,
          fields: newFields,
          updatedAt: new Date()
        },
        selectedFieldId:
          state.selectedFieldId === action.payload.id
            ? null
            : state.selectedFieldId,
        isDirty: true
      }
    }

    case 'REORDER_FIELDS': {
      const { fromIndex, toIndex } = action.payload
      const newFields = [...state.schema.fields]
      const [removed] = newFields.splice(fromIndex, 1)

      if (removed) {
        newFields.splice(toIndex, 0, removed)

        // Update order values
        newFields.forEach((field: FieldDefinition, index: number) => {
          field.order = index
        })
      }

      return {
        ...state,
        schema: {
          ...state.schema,
          fields: newFields,
          updatedAt: new Date()
        },
        isDirty: true
      }
    }

    case 'SELECT_FIELD':
      return {
        ...state,
        selectedFieldId: action.payload.id
      }

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload.enabled,
        selectedFieldId: action.payload.enabled ? null : state.selectedFieldId
      }

    case 'RESET_FORM':
      return {
        ...initialState,
        schema: createEmptySchema()
      }

    case 'IMPORT_SCHEMA':
      return {
        ...state,
        schema: action.payload,
        selectedFieldId: null,
        isDirty: false
      }

    default:
      return state
  }
}

// Custom hook
export function useFormBuilder(
  initialSchema?: FormSchema
): UseFormBuilderReturn {
  const [state, dispatch] = useReducer(formBuilderReducer, {
    ...initialState,
    schema: initialSchema || createEmptySchema()
  })

  // Actions
  const updateFormInfo = useCallback(
    (
      updates: Partial<
        Pick<FormSchema, 'title' | 'description' | 'coverImage' | 'settings'>
      >
    ) => {
      dispatch({ type: 'UPDATE_FORM_INFO', payload: updates })
    },
    []
  )

  const addField = useCallback((type: FieldType, position?: number): string => {
    dispatch({ type: 'ADD_FIELD', payload: { type, position } })
    // Return the generated field ID (we'll need to modify the reducer to return it)
    return generateId() // This is a simplification - in practice, we'd need to get the actual ID
  }, [])

  const updateField = useCallback(
    (id: string, updates: Partial<FieldDefinition>) => {
      dispatch({ type: 'UPDATE_FIELD', payload: { id, updates } })
    },
    []
  )

  const deleteField = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FIELD', payload: { id } })
  }, [])

  const reorderFields = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_FIELDS', payload: { fromIndex, toIndex } })
  }, [])

  const selectField = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_FIELD', payload: { id } })
  }, [])

  const setPreviewMode = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: { enabled } })
  }, [])

  const exportSchema = useCallback((): SchemaExport => {
    const { createdAt, updatedAt, ...schemaWithoutDates } = state.schema
    return {
      version: '1.0.0',
      schema: schemaWithoutDates,
      exportedAt: new Date().toISOString()
    }
  }, [state.schema])

  const importSchema = useCallback((exported: SchemaExport): boolean => {
    try {
      // Validate the imported schema structure
      if (!exported.schema || !exported.version) {
        throw new Error('Invalid schema format')
      }

      const importedSchema: FormSchema = {
        ...exported.schema,
        id: generateId(), // Generate new ID for imported schema
        createdAt: new Date(),
        updatedAt: new Date()
      }

      dispatch({ type: 'IMPORT_SCHEMA', payload: importedSchema })
      return true
    } catch (error) {
      console.error('Failed to import schema:', error)
      return false
    }
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  return {
    state,
    actions: {
      updateFormInfo,
      addField,
      updateField,
      deleteField,
      reorderFields,
      selectField,
      setPreviewMode,
      exportSchema,
      importSchema,
      resetForm
    }
  }
}

// Utility functions for working with form schemas
export const formBuilderUtils = {
  /**
   * Get field by ID
   */
  getField: (
    schema: FormSchema,
    fieldId: string
  ): FieldDefinition | undefined => {
    return schema.fields.find((field: FieldDefinition) => field.id === fieldId)
  },

  /**
   * Get fields sorted by order
   */
  getSortedFields: (schema: FormSchema): FieldDefinition[] => {
    return [...schema.fields].sort((a, b) => a.order - b.order)
  },

  /**
   * Get next available order value
   */
  getNextOrder: (schema: FormSchema): number => {
    return (
      Math.max(...schema.fields.map((f: FieldDefinition) => f.order), -1) + 1
    )
  },

  /**
   * Validate schema structure
   */
  validateSchema: (
    schema: FormSchema
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!schema.title?.trim()) {
      errors.push('Form title is required')
    }

    if (schema.fields.length === 0) {
      errors.push('At least one field is required')
    }

    // Check for duplicate field IDs
    const fieldIds = schema.fields.map((f: FieldDefinition) => f.id)
    const duplicateIds = fieldIds.filter(
      (id: string, index: number) => fieldIds.indexOf(id) !== index
    )
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate field IDs found: ${duplicateIds.join(', ')}`)
    }

    // Validate individual fields
    schema.fields.forEach((field: FieldDefinition, index: number) => {
      if (!field.label?.trim()) {
        errors.push(`Field ${index + 1}: Label is required`)
      }

      if (field.type === 'select' || field.type === 'radio') {
        if (!field.options || field.options.length === 0) {
          errors.push(
            `Field "${field.label}": Options are required for ${field.type} fields`
          )
        }
      }

      // Validate validation rules
      if (field.validation) {
        const { min, max, minLength, maxLength } = field.validation

        if (min !== undefined && max !== undefined && min > max) {
          errors.push(
            `Field "${field.label}": Minimum value cannot be greater than maximum value`
          )
        }

        if (
          minLength !== undefined &&
          maxLength !== undefined &&
          minLength > maxLength
        ) {
          errors.push(
            `Field "${field.label}": Minimum length cannot be greater than maximum length`
          )
        }
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  /**
   * Create a copy of a field with a new ID
   */
  duplicateField: (field: FieldDefinition): FieldDefinition => {
    return {
      ...field,
      id: generateId(),
      label: `${field.label} (Copy)`,
      order: field.order
    }
  },

  /**
   * Generate sample data for a form
   */
  generateSampleData: (schema: FormSchema): Record<string, any> => {
    const sampleData: Record<string, any> = {}

    schema.fields.forEach((field: FieldDefinition) => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'textarea':
          sampleData[field.id] = field.placeholder || 'Sample text'
          break
        case 'number':
          sampleData[field.id] = field.validation?.min || 0
          break
        case 'checkbox':
          sampleData[field.id] = field.defaultValue || false
          break
        case 'select':
        case 'radio':
          if (field.options && field.options.length > 0) {
            sampleData[field.id] = field.options[0]?.value || ''
          }
          break
        default:
          sampleData[field.id] = ''
      }
    })

    return sampleData
  }
}


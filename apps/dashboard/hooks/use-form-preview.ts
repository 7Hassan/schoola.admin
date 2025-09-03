/**
 * Form Preview Hook
 * Manages form values, validation, and submission for form previews
 */

import { useReducer, useCallback } from 'react'
import {
  FormPreviewState,
  FormPreviewAction,
  UseFormPreviewReturn,
  FormSchema,
  FormValues,
  FormErrors,
  FieldValidationResult,
  FormSubmissionResult,
  generateZodSchema
} from '@/types/forms/form-builder-types'

// Initial state
const createInitialState = (schema: FormSchema): FormPreviewState => {
  const initialValues: FormValues = {}

  // Set default values for fields
  schema.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      initialValues[field.id] = field.defaultValue
    } else {
      // Set appropriate default based on field type
      switch (field.type) {
        case 'checkbox':
          initialValues[field.id] = false
          break
        case 'number':
          initialValues[field.id] = ''
          break
        default:
          initialValues[field.id] = ''
      }
    }
  })

  return {
    values: initialValues,
    errors: {},
    isSubmitting: false,
    isValid: false,
    touchedFields: new Set()
  }
}

// Reducer function
function formPreviewReducer(
  state: FormPreviewState,
  action: FormPreviewAction
): FormPreviewState {
  switch (action.type) {
    case 'SET_VALUE': {
      const { fieldId, value } = action.payload
      const newValues = { ...state.values, [fieldId]: value }

      // Clear error for this field when value changes
      const newErrors = { ...state.errors }
      delete newErrors[fieldId]

      return {
        ...state,
        values: newValues,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0
      }
    }

    case 'SET_ERROR': {
      const { fieldId, error } = action.payload
      const newErrors = { ...state.errors, [fieldId]: error }

      return {
        ...state,
        errors: newErrors,
        isValid: false
      }
    }

    case 'CLEAR_ERROR': {
      const { fieldId } = action.payload
      const newErrors = { ...state.errors }
      delete newErrors[fieldId]

      return {
        ...state,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0
      }
    }

    case 'SET_ERRORS': {
      return {
        ...state,
        errors: action.payload,
        isValid: Object.keys(action.payload).length === 0,
        isSubmitting: false
      }
    }

    case 'TOUCH_FIELD': {
      const { fieldId } = action.payload
      const newTouchedFields = new Set(state.touchedFields)
      newTouchedFields.add(fieldId)

      return {
        ...state,
        touchedFields: newTouchedFields
      }
    }

    case 'SET_SUBMITTING': {
      return {
        ...state,
        isSubmitting: action.payload.isSubmitting
      }
    }

    case 'RESET_FORM': {
      return {
        values: {},
        errors: {},
        isSubmitting: false,
        isValid: false,
        touchedFields: new Set()
      }
    }

    case 'SUBMIT_SUCCESS': {
      return {
        ...state,
        isSubmitting: false,
        errors: {},
        isValid: true
      }
    }

    case 'SUBMIT_ERROR': {
      return {
        ...state,
        isSubmitting: false,
        errors: action.payload.errors,
        isValid: false
      }
    }

    default:
      return state
  }
}

// Custom hook
export function useFormPreview(schema: FormSchema): UseFormPreviewReturn {
  const [state, dispatch] = useReducer(
    formPreviewReducer,
    createInitialState(schema)
  )

  // Actions
  const setValue = useCallback((fieldId: string, value: any) => {
    dispatch({ type: 'SET_VALUE', payload: { fieldId, value } })
  }, [])

  const validateField = useCallback(
    (fieldId: string, value: any): FieldValidationResult => {
      const field = schema.fields.find((f) => f.id === fieldId)
      if (!field) {
        return { isValid: false, error: 'Field not found' }
      }

      try {
        // Generate Zod schema for just this field
        const fieldSchema = generateZodSchema([field])
        const result = fieldSchema.safeParse({ [fieldId]: value })

        if (result.success) {
          dispatch({ type: 'CLEAR_ERROR', payload: { fieldId } })
          return { isValid: true }
        } else {
          const error = result.error.errors[0]?.message || 'Invalid value'
          dispatch({ type: 'SET_ERROR', payload: { fieldId, error } })
          return { isValid: false, error }
        }
      } catch (error) {
        const errorMessage = 'Validation error'
        dispatch({
          type: 'SET_ERROR',
          payload: { fieldId, error: errorMessage }
        })
        return { isValid: false, error: errorMessage }
      }
    },
    [schema.fields]
  )

  const validateForm = useCallback((): boolean => {
    try {
      const formSchema = generateZodSchema(schema.fields)
      const result = formSchema.safeParse(state.values)

      if (result.success) {
        dispatch({ type: 'SET_ERRORS', payload: {} })
        return true
      } else {
        const errors: FormErrors = {}
        result.error.errors.forEach((error) => {
          const fieldPath = error.path[0] as string
          if (fieldPath) {
            errors[fieldPath] = error.message
          }
        })
        dispatch({ type: 'SET_ERRORS', payload: errors })
        return false
      }
    } catch (error) {
      console.error('Form validation error:', error)
      return false
    }
  }, [schema.fields, state.values])

  const submitForm = useCallback(
    async (
      onSubmit: (data: FormValues) => Promise<FormSubmissionResult>
    ): Promise<void> => {
      dispatch({ type: 'SET_SUBMITTING', payload: { isSubmitting: true } })

      // Validate form before submission
      const isValid = validateForm()
      if (!isValid) {
        dispatch({ type: 'SET_SUBMITTING', payload: { isSubmitting: false } })
        return
      }

      try {
        const result = await onSubmit(state.values)

        if (result.success) {
          dispatch({
            type: 'SUBMIT_SUCCESS',
            payload: { data: result.data || {} }
          })
        } else {
          dispatch({
            type: 'SUBMIT_ERROR',
            payload: { errors: result.errors || {} }
          })
        }
      } catch (error) {
        console.error('Form submission error:', error)
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: {
            errors: { _form: 'Submission failed. Please try again.' }
          }
        })
      }
    },
    [validateForm, state.values]
  )

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const touchField = useCallback((fieldId: string) => {
    dispatch({ type: 'TOUCH_FIELD', payload: { fieldId } })
  }, [])

  // Helpers
  const getFieldValue = useCallback(
    (fieldId: string): any => {
      return state.values[fieldId]
    },
    [state.values]
  )

  const getFieldError = useCallback(
    (fieldId: string): string | undefined => {
      return state.errors[fieldId]
    },
    [state.errors]
  )

  const isFieldTouched = useCallback(
    (fieldId: string): boolean => {
      return state.touchedFields.has(fieldId)
    },
    [state.touchedFields]
  )

  const getFieldProps = useCallback(
    (fieldId: string) => {
      return {
        value: getFieldValue(fieldId),
        onChange: (value: any) => setValue(fieldId, value),
        onBlur: () => {
          touchField(fieldId)
          validateField(fieldId, getFieldValue(fieldId))
        },
        error: getFieldError(fieldId),
        touched: isFieldTouched(fieldId)
      }
    },
    [
      getFieldValue,
      setValue,
      touchField,
      validateField,
      getFieldError,
      isFieldTouched
    ]
  )

  return {
    state,
    actions: {
      setValue,
      validateField,
      validateForm,
      submitForm,
      resetForm,
      touchField
    },
    helpers: {
      getFieldValue,
      getFieldError,
      isFieldTouched,
      getFieldProps
    }
  }
}

// Utility functions for form preview
export const formPreviewUtils = {
  /**
   * Transform form values for submission
   */
  transformValues: (values: FormValues, schema: FormSchema): FormValues => {
    const transformed: FormValues = {}

    schema.fields.forEach((field) => {
      const value = values[field.id]

      switch (field.type) {
        case 'number':
          // Convert string to number if needed
          transformed[field.id] =
            typeof value === 'string' ? parseFloat(value) || 0 : value
          break
        case 'checkbox':
          // Ensure boolean
          transformed[field.id] = Boolean(value)
          break
        default:
          transformed[field.id] = value
      }
    })

    return transformed
  },

  /**
   * Get form completion percentage
   */
  getCompletionPercentage: (values: FormValues, schema: FormSchema): number => {
    const requiredFields = schema.fields.filter((field) => field.required)
    if (requiredFields.length === 0) return 100

    const completedFields = requiredFields.filter((field) => {
      const value = values[field.id]
      return value !== undefined && value !== '' && value !== null
    })

    return Math.round((completedFields.length / requiredFields.length) * 100)
  },

  /**
   * Get validation summary
   */
  getValidationSummary: (
    errors: FormErrors,
    schema: FormSchema
  ): {
    totalFields: number
    invalidFields: number
    validFields: number
    errorMessages: string[]
  } => {
    const totalFields = schema.fields.length
    const errorFields = Object.keys(errors)
    const invalidFields = errorFields.length
    const validFields = totalFields - invalidFields
    const errorMessages = Object.values(errors)

    return {
      totalFields,
      invalidFields,
      validFields,
      errorMessages
    }
  },

  /**
   * Check if form is ready for submission
   */
  isFormSubmittable: (
    values: FormValues,
    errors: FormErrors,
    schema: FormSchema
  ): boolean => {
    // No validation errors
    if (Object.keys(errors).length > 0) return false

    // All required fields are filled
    const requiredFields = schema.fields.filter((field) => field.required)
    for (const field of requiredFields) {
      const value = values[field.id]
      if (value === undefined || value === '' || value === null) {
        return false
      }
    }

    return true
  },

  /**
   * Generate form submission payload
   */
  generateSubmissionPayload: (
    values: FormValues,
    schema: FormSchema
  ): {
    formId: string
    formTitle: string
    submittedAt: string
    values: FormValues
    metadata: {
      completionTime?: number
      userAgent?: string
      timestamp: number
    }
  } => {
    return {
      formId: schema.id,
      formTitle: schema.title,
      submittedAt: new Date().toISOString(),
      values: formPreviewUtils.transformValues(values, schema),
      metadata: {
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: Date.now()
      }
    }
  }
}


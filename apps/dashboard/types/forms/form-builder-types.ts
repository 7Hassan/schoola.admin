/**
 * Comprehensive Form Builder Type Definitions
 * Supports advanced field types, validation rules, and schema management
 */

import { z } from 'zod'

// Base field types supported by the form builder
export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'email'
  | 'textarea'
  | 'radio'
  | 'file'

// Validation rule types
export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number // for numbers
  max?: number // for numbers
  pattern?: string // regex pattern
  customMessage?: string
}

// Option for select/radio fields
export interface FieldOption {
  id: string
  label: string
  value: string
}

// Enhanced field definition with validation and configuration
export interface FieldDefinition {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  description?: string
  required: boolean
  validation?: ValidationRules
  options?: FieldOption[] // for select/radio fields
  defaultValue?: any
  coverImage?: string // image URL for visual field representation
  order: number
}

// Complete form schema
export interface FormSchema {
  id: string
  title: string
  description?: string
  coverImage?: string
  fields: FieldDefinition[]
  settings?: {
    allowMultipleSubmissions?: boolean
    requireLogin?: boolean
    showProgressBar?: boolean
    submitButtonText?: string
  }
  createdAt: Date
  updatedAt: Date
}

// Form values (filled form data)
export type FormValues = Record<string, any>

// Form validation errors
export type FormErrors = Record<string, string>

// Form submission result
export interface FormSubmissionResult {
  success: boolean
  data?: FormValues
  errors?: FormErrors
  message?: string
}

// Schema export/import format
export interface SchemaExport {
  version: string
  schema: Omit<FormSchema, 'createdAt' | 'updatedAt'>
  exportedAt: string
}

// Field validation result
export interface FieldValidationResult {
  isValid: boolean
  error?: string
}

// Form builder state
export interface FormBuilderState {
  schema: FormSchema
  selectedFieldId: string | null
  isPreviewMode: boolean
  isDirty: boolean
}

// Form preview state
export interface FormPreviewState {
  values: FormValues
  errors: FormErrors
  isSubmitting: boolean
  isValid: boolean
  touchedFields: Set<string>
}

// Actions for form builder
export type FormBuilderAction =
  | { type: 'SET_SCHEMA'; payload: FormSchema }
  | {
      type: 'UPDATE_FORM_INFO'
      payload: Partial<
        Pick<FormSchema, 'title' | 'description' | 'coverImage' | 'settings'>
      >
    }
  | { type: 'ADD_FIELD'; payload: { type: FieldType; position?: number } }
  | {
      type: 'UPDATE_FIELD'
      payload: { id: string; updates: Partial<FieldDefinition> }
    }
  | { type: 'DELETE_FIELD'; payload: { id: string } }
  | { type: 'REORDER_FIELDS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SELECT_FIELD'; payload: { id: string | null } }
  | { type: 'SET_PREVIEW_MODE'; payload: { enabled: boolean } }
  | { type: 'RESET_FORM' }
  | { type: 'IMPORT_SCHEMA'; payload: FormSchema }

// Actions for form preview
export type FormPreviewAction =
  | { type: 'SET_VALUE'; payload: { fieldId: string; value: any } }
  | { type: 'SET_ERROR'; payload: { fieldId: string; error: string } }
  | { type: 'CLEAR_ERROR'; payload: { fieldId: string } }
  | { type: 'SET_ERRORS'; payload: FormErrors }
  | { type: 'TOUCH_FIELD'; payload: { fieldId: string } }
  | { type: 'SET_SUBMITTING'; payload: { isSubmitting: boolean } }
  | { type: 'RESET_FORM' }
  | { type: 'SUBMIT_SUCCESS'; payload: { data: FormValues } }
  | { type: 'SUBMIT_ERROR'; payload: { errors: FormErrors } }

// Hook return types
export interface UseFormBuilderReturn {
  state: FormBuilderState
  actions: {
    updateFormInfo: (
      updates: Partial<
        Pick<FormSchema, 'title' | 'description' | 'coverImage' | 'settings'>
      >
    ) => void
    addField: (type: FieldType, position?: number) => string
    updateField: (id: string, updates: Partial<FieldDefinition>) => void
    deleteField: (id: string) => void
    reorderFields: (fromIndex: number, toIndex: number) => void
    selectField: (id: string | null) => void
    setPreviewMode: (enabled: boolean) => void
    exportSchema: () => SchemaExport
    importSchema: (exported: SchemaExport) => boolean
    resetForm: () => void
  }
}

export interface UseFormPreviewReturn {
  state: FormPreviewState
  actions: {
    setValue: (fieldId: string, value: any) => void
    validateField: (fieldId: string, value: any) => FieldValidationResult
    validateForm: () => boolean
    submitForm: (
      onSubmit: (data: FormValues) => Promise<FormSubmissionResult>
    ) => Promise<void>
    resetForm: () => void
    touchField: (fieldId: string) => void
  }
  helpers: {
    getFieldValue: (fieldId: string) => any
    getFieldError: (fieldId: string) => string | undefined
    isFieldTouched: (fieldId: string) => boolean
    getFieldProps: (fieldId: string) => {
      value: any
      onChange: (value: any) => void
      onBlur: () => void
      error: string | undefined
      touched: boolean
    }
  }
}

// Default field configurations
export const DEFAULT_FIELD_CONFIGS: Record<
  FieldType,
  Partial<FieldDefinition>
> = {
  text: {
    label: 'Text Input',
    placeholder: 'Enter text...',
    validation: { maxLength: 255 }
  },
  number: {
    label: 'Number Input',
    placeholder: 'Enter number...',
    validation: { min: 0 }
  },
  email: {
    label: 'Email Address',
    placeholder: 'Enter email...',
    validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
  },
  textarea: {
    label: 'Long Text',
    placeholder: 'Enter detailed text...',
    validation: { maxLength: 1000 }
  },
  select: {
    label: 'Dropdown',
    options: [
      { id: '1', label: 'Option 1', value: 'option1' },
      { id: '2', label: 'Option 2', value: 'option2' }
    ]
  },
  radio: {
    label: 'Single Choice',
    options: [
      { id: '1', label: 'Choice 1', value: 'choice1' },
      { id: '2', label: 'Choice 2', value: 'choice2' }
    ]
  },
  checkbox: {
    label: 'Checkbox',
    defaultValue: false
  },
  file: {
    label: 'File Upload',
    validation: { maxLength: 1 }
  }
}

// Field type labels for UI
export const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Text Input',
  number: 'Number',
  email: 'Email',
  textarea: 'Long Text',
  select: 'Dropdown',
  radio: 'Multiple Choice',
  checkbox: 'Checkbox',
  file: 'File Upload'
}

// Helper function to create a default field
export function createDefaultField(type: FieldType): FieldDefinition {
  const baseConfig = DEFAULT_FIELD_CONFIGS[type]
  return {
    id: crypto.randomUUID(),
    type,
    required: false,
    order: 0,
    ...baseConfig
  } as FieldDefinition
}

// Form validation schema generator using Zod
export function generateZodSchema(
  fields: FieldDefinition[]
): z.ZodSchema<FormValues> {
  const shape: Record<string, z.ZodTypeAny> = {}

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny

    // Base schema based on field type
    switch (field.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string()
        break
      case 'email':
        fieldSchema = z.string().email('Invalid email address')
        break
      case 'number':
        fieldSchema = z.number()
        break
      case 'checkbox':
        fieldSchema = z.boolean()
        break
      case 'select':
      case 'radio':
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(
            field.options.map((opt) => opt.value) as [string, ...string[]]
          )
        } else {
          fieldSchema = z.string()
        }
        break
      case 'file':
        fieldSchema = z.any() // File validation would be handled separately
        break
      default:
        fieldSchema = z.any()
    }

    // Apply validation rules
    if (field.validation) {
      const { required, minLength, maxLength, min, max, pattern } =
        field.validation

      // String validations
      if (field.type === 'text' || field.type === 'textarea') {
        let stringSchema = fieldSchema as z.ZodString

        if (minLength !== undefined) {
          stringSchema = stringSchema.min(
            minLength,
            `Minimum ${minLength} characters required`
          )
        }
        if (maxLength !== undefined) {
          stringSchema = stringSchema.max(
            maxLength,
            `Maximum ${maxLength} characters allowed`
          )
        }
        if (pattern) {
          stringSchema = stringSchema.regex(
            new RegExp(pattern),
            'Invalid format'
          )
        }

        fieldSchema = stringSchema
      }

      // Email validations
      if (field.type === 'email') {
        let emailSchema = fieldSchema as z.ZodString

        if (minLength !== undefined) {
          emailSchema = emailSchema.min(
            minLength,
            `Minimum ${minLength} characters required`
          )
        }
        if (maxLength !== undefined) {
          emailSchema = emailSchema.max(
            maxLength,
            `Maximum ${maxLength} characters allowed`
          )
        }

        fieldSchema = emailSchema
      }

      // Number validations
      if (field.type === 'number') {
        let numberSchema = fieldSchema as z.ZodNumber

        if (min !== undefined) {
          numberSchema = numberSchema.min(min, `Minimum value is ${min}`)
        }
        if (max !== undefined) {
          numberSchema = numberSchema.max(max, `Maximum value is ${max}`)
        }

        fieldSchema = numberSchema
      }

      // Handle required fields
      if (!required) {
        fieldSchema = fieldSchema.optional()
      }
    } else if (!field.required) {
      fieldSchema = fieldSchema.optional()
    }

    shape[field.id] = fieldSchema
  })

  return z.object(shape)
}

// Sample form schema for testing
export const SAMPLE_FORM_SCHEMA: FormSchema = {
  id: 'sample-form',
  title: 'Contact Form',
  description: 'Please fill out this contact form to get in touch with us.',
  coverImage:
    'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      validation: { minLength: 2, maxLength: 100 },
      order: 0
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      order: 1
    },
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      required: false,
      validation: { min: 1, max: 120 },
      order: 2
    },
    {
      id: 'country',
      type: 'select',
      label: 'Country',
      required: true,
      options: [
        { id: 'us', label: 'United States', value: 'us' },
        { id: 'uk', label: 'United Kingdom', value: 'uk' },
        { id: 'ca', label: 'Canada', value: 'ca' },
        { id: 'au', label: 'Australia', value: 'au' }
      ],
      order: 3
    },
    {
      id: 'newsletter',
      type: 'checkbox',
      label: 'Subscribe to newsletter',
      description: 'Receive updates about our latest products and services',
      required: false,
      defaultValue: false,
      order: 4
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message...',
      required: true,
      validation: { minLength: 10, maxLength: 500 },
      order: 5
    }
  ],
  settings: {
    allowMultipleSubmissions: false,
    requireLogin: false,
    showProgressBar: true,
    submitButtonText: 'Send Message'
  },
  createdAt: new Date(),
  updatedAt: new Date()
}


/**
 * Form Schema Serialization Utilities
 * Handles import/export of form schemas with validation
 */

import {
  FormSchema,
  SchemaExport,
  FieldDefinition
} from '@/types/forms/form-builder-types'

// Current schema version for compatibility tracking
const CURRENT_SCHEMA_VERSION = '1.0.0'

/**
 * Export a form schema to a portable format
 */
export function exportFormSchema(schema: FormSchema): SchemaExport {
  // Remove non-serializable fields
  const cleanSchema = {
    ...schema,
    createdAt: undefined,
    updatedAt: undefined
  }

  return {
    version: CURRENT_SCHEMA_VERSION,
    schema: cleanSchema,
    exportedAt: new Date().toISOString()
  }
}

/**
 * Import and validate a form schema from exported data
 */
export function importFormSchema(exportData: SchemaExport): FormSchema | null {
  try {
    // Basic validation
    if (!exportData || !exportData.schema || !exportData.version) {
      throw new Error('Invalid export format')
    }

    // Version compatibility check
    if (!isVersionCompatible(exportData.version)) {
      throw new Error(`Unsupported schema version: ${exportData.version}`)
    }

    // Validate schema structure
    const validatedSchema = validateSchemaStructure(exportData.schema)

    // Add timestamps
    const now = new Date()
    return {
      ...validatedSchema,
      id: validatedSchema.id || crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }
  } catch (error) {
    console.error('Failed to import schema:', error)
    return null
  }
}

/**
 * Check if a schema version is compatible with the current system
 */
function isVersionCompatible(version: string): boolean {
  // For now, we only support version 1.0.0
  return version === '1.0.0'
}

/**
 * Validate and clean imported schema structure
 */
function validateSchemaStructure(
  schema: any
): Omit<FormSchema, 'createdAt' | 'updatedAt'> {
  // Required fields
  if (!schema.title || typeof schema.title !== 'string') {
    throw new Error('Schema must have a valid title')
  }

  if (!Array.isArray(schema.fields)) {
    throw new Error('Schema must have a fields array')
  }

  // Validate and clean fields
  const validatedFields: FieldDefinition[] = schema.fields.map(
    (field: any, index: number) => {
      if (!field || typeof field !== 'object') {
        throw new Error(`Invalid field at index ${index}`)
      }

      if (!field.id || typeof field.id !== 'string') {
        throw new Error(`Field at index ${index} must have a valid ID`)
      }

      if (!field.type || typeof field.type !== 'string') {
        throw new Error(`Field at index ${index} must have a valid type`)
      }

      if (!field.label || typeof field.label !== 'string') {
        throw new Error(`Field at index ${index} must have a valid label`)
      }

      // Ensure required field is boolean
      const required = Boolean(field.required)

      // Validate options for select/radio fields
      let options: FieldDefinition['options'] = undefined
      if (
        (field.type === 'select' || field.type === 'radio') &&
        field.options
      ) {
        if (!Array.isArray(field.options)) {
          throw new Error(`Field ${field.id} options must be an array`)
        }

        options = field.options.map((option: any, optIndex: number) => {
          if (!option || typeof option !== 'object') {
            throw new Error(
              `Invalid option at index ${optIndex} for field ${field.id}`
            )
          }

          if (!option.id || !option.label || !option.value) {
            throw new Error(
              `Option at index ${optIndex} for field ${field.id} must have id, label, and value`
            )
          }

          return {
            id: String(option.id),
            label: String(option.label),
            value: String(option.value)
          }
        })
      }

      // Clean and validate field
      return {
        id: field.id,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder ? String(field.placeholder) : undefined,
        description: field.description ? String(field.description) : undefined,
        required,
        validation: field.validation || undefined,
        options,
        defaultValue: field.defaultValue,
        coverImage: field.coverImage ? String(field.coverImage) : undefined,
        order: typeof field.order === 'number' ? field.order : index
      }
    }
  )

  // Sort fields by order
  validatedFields.sort((a, b) => a.order - b.order)

  // Rebuild order indices
  validatedFields.forEach((field, index) => {
    field.order = index
  })

  return {
    id: schema.id || crypto.randomUUID(),
    title: schema.title,
    description: schema.description ? String(schema.description) : undefined,
    coverImage: schema.coverImage ? String(schema.coverImage) : undefined,
    fields: validatedFields,
    settings: schema.settings
      ? {
          allowMultipleSubmissions: Boolean(
            schema.settings.allowMultipleSubmissions
          ),
          requireLogin: Boolean(schema.settings.requireLogin),
          showProgressBar: Boolean(schema.settings.showProgressBar),
          submitButtonText: schema.settings.submitButtonText
            ? String(schema.settings.submitButtonText)
            : undefined
        }
      : undefined
  }
}

/**
 * Create a sample form schema for testing
 */
export function createSampleFormSchema(): FormSchema {
  const now = new Date()

  return {
    id: crypto.randomUUID(),
    title: 'Sample Contact Form',
    description:
      'A sample contact form to demonstrate the form builder capabilities.',
    fields: [
      {
        id: crypto.randomUUID(),
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        validation: { minLength: 2, maxLength: 100 },
        order: 0
      },
      {
        id: crypto.randomUUID(),
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        order: 1
      },
      {
        id: crypto.randomUUID(),
        type: 'select',
        label: 'How did you hear about us?',
        required: false,
        options: [
          { id: crypto.randomUUID(), label: 'Search Engine', value: 'search' },
          { id: crypto.randomUUID(), label: 'Social Media', value: 'social' },
          {
            id: crypto.randomUUID(),
            label: 'Friend Referral',
            value: 'referral'
          },
          { id: crypto.randomUUID(), label: 'Other', value: 'other' }
        ],
        order: 2
      },
      {
        id: crypto.randomUUID(),
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter your message...',
        required: true,
        validation: { minLength: 10, maxLength: 500 },
        order: 3
      },
      {
        id: crypto.randomUUID(),
        type: 'checkbox',
        label: 'Subscribe to newsletter',
        description: 'Receive updates about our latest products and services',
        required: false,
        defaultValue: false,
        order: 4
      }
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireLogin: false,
      showProgressBar: true,
      submitButtonText: 'Send Message'
    },
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Generate a downloadable JSON file for a form schema
 */
export function downloadSchemaAsJson(
  schema: FormSchema,
  filename?: string
): void {
  const exportData = exportFormSchema(schema)
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download =
    filename ||
    `${schema.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-schema.json`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Upload and parse a JSON file containing a form schema
 */
export function uploadSchemaFromJson(file: File): Promise<FormSchema> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const exportData: SchemaExport = JSON.parse(content)
        const schema = importFormSchema(exportData)

        if (schema) {
          resolve(schema)
        } else {
          reject(new Error('Failed to parse schema'))
        }
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}


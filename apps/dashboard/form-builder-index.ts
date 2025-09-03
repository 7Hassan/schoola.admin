/**
 * Form Builder - Complete Export Index
 *
 * A comprehensive form builder system with:
 * - Drag-and-drop field management
 * - Live form preview with validation
 * - Advanced field configuration
 * - JSON import/export capabilities
 * - TypeScript type safety
 */

// Core Components
export { FormBuilderTab } from './components/forms/form-builder-tab'
export { SchemaEditor } from './components/forms/schema-editor'
export { FormPreview } from './components/forms/form-preview'
export { FieldEditor } from './components/forms/field-editor'
export { SortableFieldItem } from './components/forms/sortable-field-item'

// Hooks
export { useFormBuilder } from './hooks/use-form-builder'
export { useFormPreview } from './hooks/use-form-preview'

// Types and Utilities
export * from '@/types/forms/form-builder-types'
export * from '@/utils/form-serialization'

// Re-export commonly used types for convenience
export type {
  FormSchema,
  FieldDefinition,
  FieldType,
  ValidationRules,
  FieldOption,
  FormValues,
  FormErrors,
  FormSubmissionResult,
  SchemaExport,
  UseFormBuilderReturn,
  UseFormPreviewReturn
} from '@/types/forms/form-builder-types'


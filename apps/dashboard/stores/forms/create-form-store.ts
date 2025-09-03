/**
 * Forms Creation Store
 * Manages state for form creation including form metadata, form builder integration, and submission state
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
  FormCreateFormData,
  FormSchema,
  FormSubmissionResult
} from '@/types/forms/create-form'
import { FORM_CREATE_FORM_DEFAULTS } from '@/statics/forms/create-form'

/**
 * Form creation store state interface
 */
interface FormCreateFormState {
  /** Current form metadata */
  formData: FormCreateFormData
  /** Form schema from form builder */
  formSchema: FormSchema | null
  /** Form submission loading state */
  isSubmitting: boolean
  /** Form submission error message */
  submitError: string | null
  /** Form submission success state */
  submitSuccess: boolean
  /** Form builder save state */
  isSavingForm: boolean
  /** Whether form has unsaved changes */
  hasUnsavedChanges: boolean
  /** Form validation errors */
  validationErrors: Record<string, string>
  /** Form builder preview mode */
  isPreviewMode: boolean

  /** Actions */
  /** Update form metadata */
  updateFormData: (data: Partial<FormCreateFormData>) => void
  /** Update form schema from form builder */
  updateFormSchema: (schema: FormSchema | null) => void
  /** Reset form to default values */
  resetForm: () => void
  /** Set submission state */
  setSubmitting: (isSubmitting: boolean) => void
  /** Set submit error */
  setSubmitError: (error: string | null) => void
  /** Set submit success */
  setSubmitSuccess: (success: boolean) => void
  /** Set form builder save state */
  setSavingForm: (isSaving: boolean) => void
  /** Set unsaved changes state */
  setHasUnsavedChanges: (hasChanges: boolean) => void
  /** Set validation errors */
  setValidationErrors: (errors: Record<string, string>) => void
  /** Clear validation errors */
  clearValidationErrors: () => void
  /** Toggle preview mode */
  togglePreviewMode: () => void
  /** Update department access */
  updateDepartmentAccess: (department: string, isSelected: boolean) => void
  /** Update notifications settings */
  updateNotifications: (
    field: keyof FormCreateFormData['notifications'],
    value: any
  ) => void
  /** Submit form for creation */
  submitForm: () => Promise<void>
  /** Save form schema from form builder */
  saveFormSchema: (schema: FormSchema) => Promise<void>
}

/**
 * Form creation form store
 *
 * Features:
 * - Form metadata management with immutable updates
 * - Form builder integration with schema management
 * - Submission state tracking
 * - Department access management
 * - Notifications configuration
 * - Form validation error handling
 * - Preview mode toggle
 * - Auto-save functionality
 *
 * @example
 * ```tsx
 * import { useFormCreateFormStore } from '@/stores/forms/create-form-store'
 *
 * function FormCreateForm() {
 *   const {
 *     formData,
 *     updateFormData,
 *     formSchema,
 *     updateFormSchema,
 *     submitForm,
 *     isSubmitting
 *   } = useFormCreateFormStore()
 *
 *   return (
 *     <form onSubmit={submitForm}>
 *       <input
 *         value={formData.title}
 *         onChange={(e) => updateFormData({ title: e.target.value })}
 *       />
 *       // ... other form fields and form builder
 *     </form>
 *   )
 * }
 * ```
 */
export const useFormCreateFormStore = create<FormCreateFormState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      formData: { ...FORM_CREATE_FORM_DEFAULTS },
      formSchema: null,
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
      isSavingForm: false,
      hasUnsavedChanges: false,
      validationErrors: {},
      isPreviewMode: false,

      // Actions
      updateFormData: (data) =>
        set((state) => {
          Object.assign(state.formData, data)
          state.hasUnsavedChanges = true
          // Clear validation errors for updated fields
          Object.keys(data).forEach((key) => {
            delete state.validationErrors[key]
          })
        }),

      updateFormSchema: (schema) =>
        set((state) => {
          state.formSchema = schema
          state.hasUnsavedChanges = true
        }),

      resetForm: () =>
        set((state) => {
          state.formData = { ...FORM_CREATE_FORM_DEFAULTS }
          state.formSchema = null
          state.isSubmitting = false
          state.submitError = null
          state.submitSuccess = false
          state.isSavingForm = false
          state.hasUnsavedChanges = false
          state.validationErrors = {}
          state.isPreviewMode = false
        }),

      setSubmitting: (isSubmitting) =>
        set((state) => {
          state.isSubmitting = isSubmitting
        }),

      setSubmitError: (error) =>
        set((state) => {
          state.submitError = error
          if (error) {
            state.submitSuccess = false
          }
        }),

      setSubmitSuccess: (success) =>
        set((state) => {
          state.submitSuccess = success
          if (success) {
            state.submitError = null
            state.hasUnsavedChanges = false
          }
        }),

      setSavingForm: (isSaving) =>
        set((state) => {
          state.isSavingForm = isSaving
        }),

      setHasUnsavedChanges: (hasChanges) =>
        set((state) => {
          state.hasUnsavedChanges = hasChanges
        }),

      setValidationErrors: (errors) =>
        set((state) => {
          state.validationErrors = { ...errors }
        }),

      clearValidationErrors: () =>
        set((state) => {
          state.validationErrors = {}
        }),

      togglePreviewMode: () =>
        set((state) => {
          state.isPreviewMode = !state.isPreviewMode
        }),

      updateDepartmentAccess: (department, isSelected) =>
        set((state) => {
          if (isSelected) {
            if (!state.formData.departmentAccess.includes(department)) {
              state.formData.departmentAccess.push(department)
            }
          } else {
            state.formData.departmentAccess =
              state.formData.departmentAccess.filter(
                (d: string) => d !== department
              )
          }
          state.hasUnsavedChanges = true
        }),

      updateNotifications: (field, value) =>
        set((state) => {
          state.formData.notifications[field] = value
          state.hasUnsavedChanges = true
        }),

      saveFormSchema: async (schema) => {
        const state = get()

        try {
          set((draft) => {
            draft.isSavingForm = true
            draft.submitError = null
          })

          // Simulate API call to save form schema
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Update form schema in state
          set((draft) => {
            draft.formSchema = schema
            draft.isSavingForm = false
          })
        } catch (error) {
          set((draft) => {
            draft.isSavingForm = false
            draft.submitError =
              error instanceof Error ? error.message : 'Failed to save form'
          })
        }
      },

      submitForm: async () => {
        const state = get()

        try {
          // Set submitting state
          set((draft) => {
            draft.isSubmitting = true
            draft.submitError = null
            draft.submitSuccess = false
          })

          // Validate required fields
          const validationErrors: Record<string, string> = {}

          if (!state.formData.title.trim()) {
            validationErrors.title = 'Form title is required'
          }

          if (!state.formSchema || !state.formSchema.fields?.length) {
            validationErrors.formSchema = 'Form must have at least one field'
          }

          if (Object.keys(validationErrors).length > 0) {
            set((draft) => {
              draft.isSubmitting = false
              draft.validationErrors = validationErrors
              draft.submitError =
                'Please fix validation errors before submitting'
            })
            return
          }

          // Prepare form data for submission
          const submitData = {
            ...state.formData,
            formSchema: state.formSchema
          }

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Simulate potential API errors (remove in production)
          if (Math.random() > 0.8) {
            throw new Error('Failed to create form. Please try again.')
          }

          // Success
          set((draft) => {
            draft.isSubmitting = false
            draft.submitSuccess = true
            draft.submitError = null
            draft.hasUnsavedChanges = false
          })

          console.log('Form created successfully:', submitData)
        } catch (error) {
          set((draft) => {
            draft.isSubmitting = false
            draft.submitError =
              error instanceof Error
                ? error.message
                : 'An unexpected error occurred'
            draft.submitSuccess = false
          })
        }
      }
    })),
    {
      name: 'form-create-form-store',
      // Enable Redux DevTools integration
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

/**
 * Selectors for optimized component re-renders
 * Use these when you only need specific parts of the store state
 */

/** Select only form metadata */
export const useFormData = () =>
  useFormCreateFormStore((state) => state.formData)

/** Select only form schema */
export const useFormSchema = () =>
  useFormCreateFormStore((state) => state.formSchema)

/** Select only submission state */
export const useFormSubmissionState = () =>
  useFormCreateFormStore((state) => ({
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    submitSuccess: state.submitSuccess,
    isSavingForm: state.isSavingForm
  }))

/** Select only validation errors */
export const useFormValidationErrors = () =>
  useFormCreateFormStore((state) => state.validationErrors)

/** Select only unsaved changes state */
export const useFormUnsavedChanges = () =>
  useFormCreateFormStore((state) => state.hasUnsavedChanges)

/** Select only preview mode state */
export const useFormPreviewMode = () =>
  useFormCreateFormStore((state) => state.isPreviewMode)

/** Select only notifications settings */
export const useFormNotifications = () =>
  useFormCreateFormStore((state) => state.formData.notifications)

/** Select only department access settings */
export const useFormDepartmentAccess = () =>
  useFormCreateFormStore((state) => state.formData.departmentAccess)

/** Select only form actions */
export const useFormActions = () =>
  useFormCreateFormStore((state) => ({
    updateFormData: state.updateFormData,
    updateFormSchema: state.updateFormSchema,
    resetForm: state.resetForm,
    submitForm: state.submitForm,
    saveFormSchema: state.saveFormSchema,
    togglePreviewMode: state.togglePreviewMode,
    updateDepartmentAccess: state.updateDepartmentAccess,
    updateNotifications: state.updateNotifications,
    setValidationErrors: state.setValidationErrors,
    clearValidationErrors: state.clearValidationErrors
  }))


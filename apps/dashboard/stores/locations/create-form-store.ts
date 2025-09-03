/**
 * Location Creation Store
 * Manages state for location creation form including form data, submission state, and actions
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { LocationCreateFormData } from '@/types/locations/create-form'
import { LOCATION_CREATE_FORM_DEFAULTS } from '@/statics/locations/create-form'

/**
 * Location creation store state interface
 */
interface LocationCreateFormState {
  /** Current form data */
  formData: LocationCreateFormData
  /** Form submission loading state */
  isSubmitting: boolean
  /** Form submission error message */
  submitError: string | null
  /** Form submission success state */
  submitSuccess: boolean
  /** Selected features for the location */
  selectedFeatures: string[]
  /** Validation errors for form fields */
  validationErrors: Record<string, string>

  /** Actions */
  /** Update form data */
  updateFormData: (data: Partial<LocationCreateFormData>) => void
  /** Reset form to default values */
  resetForm: () => void
  /** Set submission state */
  setSubmitting: (isSubmitting: boolean) => void
  /** Set submit error */
  setSubmitError: (error: string | null) => void
  /** Set submit success */
  setSubmitSuccess: (success: boolean) => void
  /** Toggle feature selection */
  toggleFeature: (featureId: string) => void
  /** Set selected features */
  setSelectedFeatures: (featureIds: string[]) => void
  /** Set validation errors */
  setValidationErrors: (errors: Record<string, string>) => void
  /** Clear validation errors */
  clearValidationErrors: () => void
  /** Submit form */
  submitForm: () => Promise<void>
}

/**
 * Location creation form store
 *
 * Features:
 * - Form data management with immutable updates
 * - Submission state tracking
 * - Feature selection management
 * - Form validation error handling
 * - Form reset functionality
 *
 * @example
 * ```tsx
 * import { useLocationCreateFormStore } from '@/stores/locations/create-form-store'
 *
 * function LocationCreateForm() {
 *   const {
 *     formData,
 *     updateFormData,
 *     selectedFeatures,
 *     toggleFeature,
 *     submitForm,
 *     isSubmitting
 *   } = useLocationCreateFormStore()
 *
 *   return (
 *     <form onSubmit={submitForm}>
 *       <input
 *         value={formData.name}
 *         onChange={(e) => updateFormData({ name: e.target.value })}
 *       />
 *       // ... other form fields
 *     </form>
 *   )
 * }
 * ```
 */
export const useLocationCreateFormStore = create<LocationCreateFormState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      formData: { ...LOCATION_CREATE_FORM_DEFAULTS },
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
      selectedFeatures: [],
      validationErrors: {},

      // Actions
      updateFormData: (data) =>
        set((state) => {
          Object.assign(state.formData, data)
          // Clear validation errors for updated fields
          Object.keys(data).forEach((key) => {
            delete state.validationErrors[key]
          })
        }),

      resetForm: () =>
        set((state) => {
          state.formData = { ...LOCATION_CREATE_FORM_DEFAULTS }
          state.isSubmitting = false
          state.submitError = null
          state.submitSuccess = false
          state.selectedFeatures = []
          state.validationErrors = {}
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
          }
        }),

      toggleFeature: (featureId) =>
        set((state) => {
          const index = state.selectedFeatures.indexOf(featureId)
          if (index > -1) {
            state.selectedFeatures.splice(index, 1)
          } else {
            state.selectedFeatures.push(featureId)
          }
          // Update form data features array
          state.formData.features = [...state.selectedFeatures]
        }),

      setSelectedFeatures: (featureIds) =>
        set((state) => {
          state.selectedFeatures = [...featureIds]
          state.formData.features = [...featureIds]
        }),

      setValidationErrors: (errors) =>
        set((state) => {
          state.validationErrors = { ...errors }
        }),

      clearValidationErrors: () =>
        set((state) => {
          state.validationErrors = {}
        }),

      submitForm: async () => {
        const state = get()

        try {
          // Set submitting state
          set((draft) => {
            draft.isSubmitting = true
            draft.submitError = null
            draft.submitSuccess = false
          })

          // Validate form data
          // In a real implementation, you would validate against the Zod schema
          // and handle validation errors

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Simulate potential API errors (remove in production)
          if (Math.random() > 0.8) {
            throw new Error('Failed to create location. Please try again.')
          }

          // Success
          set((draft) => {
            draft.isSubmitting = false
            draft.submitSuccess = true
            draft.submitError = null
          })

          // Optionally reset form on success
          // get().resetForm()
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
      name: 'location-create-form-store',
      // Enable Redux DevTools integration
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

/**
 * Selectors for optimized component re-renders
 * Use these when you only need specific parts of the store state
 */

/** Select only form data */
export const useLocationFormData = () =>
  useLocationCreateFormStore((state) => state.formData)

/** Select only submission state */
export const useLocationSubmissionState = () =>
  useLocationCreateFormStore((state) => ({
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    submitSuccess: state.submitSuccess
  }))

/** Select only selected features */
export const useLocationSelectedFeatures = () =>
  useLocationCreateFormStore((state) => state.selectedFeatures)

/** Select only validation errors */
export const useLocationValidationErrors = () =>
  useLocationCreateFormStore((state) => state.validationErrors)

/** Select only form actions */
export const useLocationFormActions = () =>
  useLocationCreateFormStore((state) => ({
    updateFormData: state.updateFormData,
    resetForm: state.resetForm,
    submitForm: state.submitForm,
    toggleFeature: state.toggleFeature,
    setSelectedFeatures: state.setSelectedFeatures,
    setValidationErrors: state.setValidationErrors,
    clearValidationErrors: state.clearValidationErrors
  }))


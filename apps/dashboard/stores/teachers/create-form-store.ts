/**
 * Teacher Create Form Store
 * Manages state for teacher creation form including form state, validation, and submission
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { TeacherCreateFormData } from '@/types/teachers/create-form'
import { TEACHER_CREATE_FORM_DEFAULTS } from '@/statics/teachers/create-form'

/**
 * Teacher creation form state interface
 */
interface TeacherCreateFormState {
  readonly isSubmitting: boolean
  readonly submitSuccess: boolean
  readonly submitError: string | null
  readonly newQualification: string
  readonly formData: TeacherCreateFormData
}

/**
 * Teacher creation form actions interface
 */
interface TeacherCreateFormActions {
  setSubmitting: (isSubmitting: boolean) => void
  setSubmitSuccess: (success: boolean) => void
  setSubmitError: (error: string | null) => void
  setNewQualification: (qualification: string) => void
  updateFormData: (data: Partial<TeacherCreateFormData>) => void
  addQualification: (qualification: string) => void
  removeQualification: (index: number) => void
  resetForm: () => void
  submitForm: (data: TeacherCreateFormData) => Promise<void>
}

/**
 * Combined store interface
 */
type TeacherCreateFormStore = TeacherCreateFormState & TeacherCreateFormActions

/**
 * Initial state for the teacher create form
 */
const initialState: TeacherCreateFormState = {
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
  newQualification: '',
  formData: TEACHER_CREATE_FORM_DEFAULTS
}

/**
 * Teacher create form store implementation
 * Uses Zustand with Immer for immutable state updates and DevTools for debugging
 */
export const useTeacherCreateStore = create<TeacherCreateFormStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      /**
       * Set form submission state
       */
      setSubmitting: (isSubmitting: boolean) =>
        set((state) => {
          state.isSubmitting = isSubmitting
        }),

      /**
       * Set form submission success state
       */
      setSubmitSuccess: (success: boolean) =>
        set((state) => {
          state.submitSuccess = success
          if (success) {
            state.submitError = null
          }
        }),

      /**
       * Set form submission error
       */
      setSubmitError: (error: string | null) =>
        set((state) => {
          state.submitError = error
          if (error) {
            state.submitSuccess = false
          }
        }),

      /**
       * Set new qualification input value
       */
      setNewQualification: (qualification: string) =>
        set((state) => {
          state.newQualification = qualification
        }),

      /**
       * Update form data with partial updates
       */
      updateFormData: (data: Partial<TeacherCreateFormData>) =>
        set((state) => {
          Object.assign(state.formData, data)
        }),

      /**
       * Add a new qualification to the form data
       */
      addQualification: (qualification: string) =>
        set((state) => {
          const trimmedQualification = qualification.trim()
          if (
            trimmedQualification &&
            !state.formData.qualifications.includes(trimmedQualification)
          ) {
            state.formData.qualifications.push(trimmedQualification)
          }
          state.newQualification = ''
        }),

      /**
       * Remove qualification at specific index
       */
      removeQualification: (index: number) =>
        set((state) => {
          state.formData.qualifications.splice(index, 1)
        }),

      /**
       * Reset form to initial state
       */
      resetForm: () =>
        set((state) => {
          Object.assign(state, initialState)
        }),

      /**
       * Submit teacher creation form
       * Simulates API call - replace with actual API integration
       */
      submitForm: async (data: TeacherCreateFormData) => {
        set((state) => {
          state.isSubmitting = true
          state.submitError = null
          state.submitSuccess = false
        })

        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // TODO: Replace with actual API call
          console.log('Creating teacher with data:', data)

          // Simulate success
          set((state) => {
            state.isSubmitting = false
            state.submitSuccess = true
            state.formData = TEACHER_CREATE_FORM_DEFAULTS // Reset form data
          })

          // Auto-clear success message after 3 seconds
          setTimeout(() => {
            set((state) => {
              state.submitSuccess = false
            })
          }, 3000)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to create teacher'
          set((state) => {
            state.isSubmitting = false
            state.submitError = errorMessage
          })
        }
      }
    })),
    {
      name: 'teacher-create-store'
    }
  )
)

/**
 * Selector hooks for better performance and convenience
 */

/**
 * Hook to get form submission state
 */
export const useTeacherCreateSubmission = () =>
  useTeacherCreateStore((state) => ({
    isSubmitting: state.isSubmitting,
    submitSuccess: state.submitSuccess,
    submitError: state.submitError
  }))

/**
 * Hook to get qualification management state and actions
 */
export const useTeacherCreateQualifications = () =>
  useTeacherCreateStore((state) => ({
    qualifications: state.formData.qualifications,
    newQualification: state.newQualification,
    setNewQualification: state.setNewQualification,
    addQualification: state.addQualification,
    removeQualification: state.removeQualification
  }))

/**
 * Hook to get form actions
 */
export const useTeacherCreateActions = () =>
  useTeacherCreateStore((state) => ({
    setSubmitting: state.setSubmitting,
    setSubmitSuccess: state.setSubmitSuccess,
    setSubmitError: state.setSubmitError,
    updateFormData: state.updateFormData,
    resetForm: state.resetForm,
    submitForm: state.submitForm
  }))


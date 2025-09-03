/**
 * Course Create Form Store
 * Manages state for course creation form including form state, validation, and submission
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { CourseCreateFormData } from '@/types/courses/createForm.types'
import { COURSE_CREATE_FORM_DEFAULTS } from '@/statics/courses/create-form'

/**
 * Course creation form state interface
 */
interface CourseCreateFormState {
  readonly isSubmitting: boolean
  readonly submitSuccess: boolean
  readonly submitError: string | null
  readonly formData: CourseCreateFormData
}

/**
 * Course creation form actions interface
 */
interface CourseCreateFormActions {
  setSubmitting: (isSubmitting: boolean) => void
  setSubmitSuccess: (success: boolean) => void
  setSubmitError: (error: string | null) => void
  updateFormData: (data: Partial<CourseCreateFormData>) => void
  addPrerequisite: (courseId: string) => void
  removePrerequisite: (courseId: string) => void
  addInstructor: (instructorId: string) => void
  removeInstructor: (instructorId: string) => void
  resetForm: () => void
  submitForm: (data: CourseCreateFormData) => Promise<void>
}

/**
 * Combined store interface
 */
type CourseCreateFormStore = CourseCreateFormState & CourseCreateFormActions

/**
 * Initial state for the course create form
 */
const initialState: CourseCreateFormState = {
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
  formData: COURSE_CREATE_FORM_DEFAULTS
}

/**
 * Course create form store implementation
 * Uses Zustand with Immer for immutable state updates and DevTools for debugging
 */
export const useCourseCreateStore = create<CourseCreateFormStore>()(
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
       * Update form data with partial updates
       */
      updateFormData: (data: Partial<CourseCreateFormData>) =>
        set((state) => {
          Object.assign(state.formData, data)
        }),

      /**
       * Add a prerequisite course to the form data
       */
      addPrerequisite: (courseId: string) =>
        set((state) => {
          if (!state.formData.prerequisites) {
            state.formData.prerequisites = []
          }
          if (!state.formData.prerequisites.includes(courseId)) {
            state.formData.prerequisites.push(courseId)
          }
        }),

      /**
       * Remove prerequisite course from form data
       */
      removePrerequisite: (courseId: string) =>
        set((state) => {
          if (state.formData.prerequisites) {
            const index = state.formData.prerequisites.indexOf(courseId)
            if (index > -1) {
              state.formData.prerequisites.splice(index, 1)
            }
          }
        }),

      /**
       * Add an instructor to the form data
       */
      addInstructor: (instructorId: string) =>
        set((state) => {
          if (!state.formData.instructors) {
            state.formData.instructors = []
          }
          if (!state.formData.instructors.includes(instructorId)) {
            state.formData.instructors.push(instructorId)
          }
        }),

      /**
       * Remove instructor from form data
       */
      removeInstructor: (instructorId: string) =>
        set((state) => {
          if (state.formData.instructors) {
            const index = state.formData.instructors.indexOf(instructorId)
            if (index > -1) {
              state.formData.instructors.splice(index, 1)
            }
          }
        }),

      /**
       * Reset form to initial state
       */
      resetForm: () =>
        set((state) => {
          Object.assign(state, initialState)
        }),

      /**
       * Submit course creation form
       * Simulates API call - replace with actual API integration
       */
      submitForm: async (data: CourseCreateFormData) => {
        set((state) => {
          state.isSubmitting = true
          state.submitError = null
          state.submitSuccess = false
        })

        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // TODO: Replace with actual API call
          console.log('Creating course with data:', data)

          // Simulate success
          set((state) => {
            state.isSubmitting = false
            state.submitSuccess = true
            state.formData = COURSE_CREATE_FORM_DEFAULTS // Reset form data
          })

          // Auto-clear success message after 3 seconds
          setTimeout(() => {
            set((state) => {
              state.submitSuccess = false
            })
          }, 3000)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to create course'
          set((state) => {
            state.isSubmitting = false
            state.submitError = errorMessage
          })
        }
      }
    })),
    {
      name: 'course-create-store'
    }
  )
)

/**
 * Selector hooks for better performance and convenience
 */

/**
 * Hook to get form submission state
 */
export const useCourseCreateSubmission = () =>
  useCourseCreateStore((state) => ({
    isSubmitting: state.isSubmitting,
    submitSuccess: state.submitSuccess,
    submitError: state.submitError
  }))

/**
 * Hook to get prerequisites management state and actions
 */
export const useCourseCreatePrerequisites = () =>
  useCourseCreateStore((state) => ({
    prerequisites: state.formData.prerequisites || [],
    addPrerequisite: state.addPrerequisite,
    removePrerequisite: state.removePrerequisite
  }))

/**
 * Hook to get instructors management state and actions
 */
export const useCourseCreateInstructors = () =>
  useCourseCreateStore((state) => ({
    instructors: state.formData.instructors || [],
    addInstructor: state.addInstructor,
    removeInstructor: state.removeInstructor
  }))

/**
 * Hook to get form actions
 */
export const useCourseCreateActions = () =>
  useCourseCreateStore((state) => ({
    setSubmitting: state.setSubmitting,
    setSubmitSuccess: state.setSubmitSuccess,
    setSubmitError: state.setSubmitError,
    updateFormData: state.updateFormData,
    resetForm: state.resetForm,
    submitForm: state.submitForm
  }))


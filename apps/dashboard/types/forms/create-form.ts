/**
 * Forms Creation Types and Validation Schema
 * Contains all TypeScript types and Zod schemas for form creation functionality
 */

import { z } from 'zod'

/**
 * Form categories enumeration
 * Defines the different categories a form can belong to
 */
export type FormCategory =
  | 'general'
  | 'registration'
  | 'feedback'
  | 'application'
  | 'assessment'
  | 'event'
  | 'support'

/**
 * Form notifications configuration interface
 */
export interface FormNotifications {
  /** Enable email notifications */
  email: boolean
  /** Enable Slack notifications */
  slack: boolean
  /** Email recipients for notifications (comma-separated) */
  emailRecipients: string
}

/**
 * Form metadata interface
 * Contains all configuration and metadata for a form
 */
export interface FormMetadata {
  /** Form title */
  title: string
  /** Form description/instructions */
  description: string
  /** Form category */
  category: FormCategory
  /** Whether the form is publicly accessible */
  isPublic: boolean
  /** Whether anonymous submissions are allowed */
  allowAnonymous: boolean
  /** Whether to collect email addresses from submitters */
  collectEmails: boolean
  /** Whether submissions require approval before publishing */
  requireApproval: boolean
  /** Message shown after successful form submission */
  confirmationMessage: string
  /** URL to redirect to after form submission */
  redirectUrl: string
  /** List of departments that can access this form */
  departmentAccess: string[]
  /** Notification settings */
  notifications: FormNotifications
}

/**
 * Form creation data type
 * Inferred from the Zod schema below
 */
export type FormCreateFormData = z.infer<typeof formCreateSchema>

/**
 * Form categories configuration
 */
export const FORM_CATEGORIES: readonly {
  value: FormCategory
  label: string
  description: string
}[] = [
  { value: 'general', label: 'General', description: 'General purpose forms' },
  {
    value: 'registration',
    label: 'Registration',
    description: 'Course and event registration forms'
  },
  {
    value: 'feedback',
    label: 'Feedback/Survey',
    description: 'Feedback collection and survey forms'
  },
  {
    value: 'application',
    label: 'Application',
    description: 'Application and admission forms'
  },
  {
    value: 'assessment',
    label: 'Assessment',
    description: 'Evaluation and assessment forms'
  },
  { value: 'event', label: 'Event', description: 'Event-related forms' },
  {
    value: 'support',
    label: 'Support Request',
    description: 'Help and support request forms'
  }
] as const

/**
 * Form departments list
 */
export const FORM_DEPARTMENTS = [
  'Administration',
  'Academics',
  'Student Services',
  'IT Support',
  'Finance',
  'Human Resources',
  'Facilities',
  'Athletics',
  'Library'
] as const

/**
 * Form creation validation schema
 * Validates all form metadata and configuration
 */
export const formCreateSchema = z.object({
  /** Form title (required) */
  title: z
    .string()
    .min(1, 'Form title is required')
    .max(200, 'Form title cannot exceed 200 characters'),

  /** Form description (optional) */
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .default(''),

  /** Form category */
  category: z
    .enum([
      'general',
      'registration',
      'feedback',
      'application',
      'assessment',
      'event',
      'support'
    ])
    .default('general'),

  /** Public access setting */
  isPublic: z.boolean().default(false),

  /** Anonymous submissions setting */
  allowAnonymous: z.boolean().default(false),

  /** Email collection setting */
  collectEmails: z.boolean().default(true),

  /** Approval requirement setting */
  requireApproval: z.boolean().default(false),

  /** Confirmation message */
  confirmationMessage: z
    .string()
    .max(500, 'Confirmation message cannot exceed 500 characters')
    .optional()
    .default(''),

  /** Redirect URL */
  redirectUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal(''))
    .default(''),

  /** Department access list */
  departmentAccess: z.array(z.string()).default([]),

  /** Notifications configuration */
  notifications: z
    .object({
      /** Email notifications enabled */
      email: z.boolean().default(true),

      /** Slack notifications enabled */
      slack: z.boolean().default(false),

      /** Email recipients */
      emailRecipients: z.string().optional().default('')
    })
    .default({
      email: true,
      slack: false,
      emailRecipients: ''
    }),

  /** Form schema (from form builder) */
  formSchema: z.any().optional(),

  /** Unsaved changes indicator */
  hasUnsavedChanges: z.boolean().optional().default(false)
})

/**
 * Form submission result interface
 */
export interface FormSubmissionResult {
  /** Whether the submission was successful */
  success: boolean
  /** Result message */
  message: string
  /** Optional error details */
  error?: string
  /** Optional form ID if created successfully */
  formId?: string
}

/**
 * Form builder schema interface (placeholder)
 * This would be replaced with the actual form builder schema
 */
export interface FormSchema {
  /** Form fields configuration */
  fields?: any[]
  /** Form settings */
  settings?: Record<string, any>
  /** Form validation rules */
  validation?: Record<string, any>
}

/**
 * Form submission values interface (placeholder)
 * This would be replaced with the actual form submission values type
 */
export interface FormValues {
  /** Dynamic form field values */
  [key: string]: any
}


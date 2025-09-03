/**
 * Forms Creation Static Data and Constants
 * Contains all static data, mock data, and configuration constants for form creation
 */

import type {
  FormCreateFormData,
  FormCategory,
  FormNotifications,
  FORM_CATEGORIES,
  FORM_DEPARTMENTS
} from '@/types/forms/create-form'

/**
 * Default form values for form creation
 * Used as initial state for form components
 */
export const FORM_CREATE_FORM_DEFAULTS: FormCreateFormData = {
  title: '',
  description: '',
  category: 'general',
  isPublic: false,
  allowAnonymous: false,
  collectEmails: true,
  requireApproval: false,
  confirmationMessage: '',
  redirectUrl: '',
  departmentAccess: [],
  notifications: {
    email: true,
    slack: false,
    emailRecipients: ''
  },
  formSchema: undefined,
  hasUnsavedChanges: false
}

/**
 * Form category options with enhanced metadata
 */
export const FORM_CATEGORY_OPTIONS: readonly {
  value: FormCategory
  label: string
  description: string
  icon: string
  color: string
}[] = [
  {
    value: 'general',
    label: 'General',
    description: 'General purpose forms for various needs',
    icon: '📝',
    color: '#6B7280'
  },
  {
    value: 'registration',
    label: 'Registration',
    description: 'Course and event registration forms',
    icon: '📝',
    color: '#3B82F6'
  },
  {
    value: 'feedback',
    label: 'Feedback/Survey',
    description: 'Feedback collection and survey forms',
    icon: '📊',
    color: '#10B981'
  },
  {
    value: 'application',
    label: 'Application',
    description: 'Application and admission forms',
    icon: '📄',
    color: '#8B5CF6'
  },
  {
    value: 'assessment',
    label: 'Assessment',
    description: 'Evaluation and assessment forms',
    icon: '📋',
    color: '#F59E0B'
  },
  {
    value: 'event',
    label: 'Event',
    description: 'Event-related forms and registrations',
    icon: '🎉',
    color: '#EF4444'
  },
  {
    value: 'support',
    label: 'Support Request',
    description: 'Help and support request forms',
    icon: '🆘',
    color: '#06B6D4'
  }
] as const

/**
 * Department options with additional metadata
 */
export const FORM_DEPARTMENT_OPTIONS: readonly {
  value: string
  label: string
  description: string
  icon: string
}[] = [
  {
    value: 'Administration',
    label: 'Administration',
    description: 'Administrative departments and offices',
    icon: '🏢'
  },
  {
    value: 'Academics',
    label: 'Academics',
    description: 'Academic departments and faculty',
    icon: '🎓'
  },
  {
    value: 'Student Services',
    label: 'Student Services',
    description: 'Student support and services',
    icon: '👥'
  },
  {
    value: 'IT Support',
    label: 'IT Support',
    description: 'Information technology and technical support',
    icon: '💻'
  },
  {
    value: 'Finance',
    label: 'Finance',
    description: 'Financial services and accounting',
    icon: '💰'
  },
  {
    value: 'Human Resources',
    label: 'Human Resources',
    description: 'Staff and employee services',
    icon: '👔'
  },
  {
    value: 'Facilities',
    label: 'Facilities',
    description: 'Building maintenance and facilities management',
    icon: '🏗️'
  },
  {
    value: 'Athletics',
    label: 'Athletics',
    description: 'Sports and physical education',
    icon: '⚽'
  },
  {
    value: 'Library',
    label: 'Library',
    description: 'Library services and resources',
    icon: '📚'
  }
] as const

/**
 * Default notification settings templates
 */
export const NOTIFICATION_TEMPLATES: readonly {
  name: string
  description: string
  settings: FormNotifications
}[] = [
  {
    name: 'Email Only',
    description: 'Send notifications via email only',
    settings: {
      email: true,
      slack: false,
      emailRecipients: ''
    }
  },
  {
    name: 'Slack Only',
    description: 'Send notifications via Slack only',
    settings: {
      email: false,
      slack: true,
      emailRecipients: ''
    }
  },
  {
    name: 'Both Email & Slack',
    description: 'Send notifications via both email and Slack',
    settings: {
      email: true,
      slack: true,
      emailRecipients: ''
    }
  },
  {
    name: 'No Notifications',
    description: 'Disable all notifications',
    settings: {
      email: false,
      slack: false,
      emailRecipients: ''
    }
  }
] as const

/**
 * Common confirmation messages by form category
 */
export const CONFIRMATION_MESSAGE_TEMPLATES: Record<FormCategory, string[]> = {
  general: [
    'Thank you for your submission!',
    'Your form has been received and will be reviewed.',
    'We appreciate your time and feedback.'
  ],
  registration: [
    'Registration successful! You will receive a confirmation email shortly.',
    'Thank you for registering! Please check your email for next steps.',
    'Your registration has been received and is being processed.'
  ],
  feedback: [
    'Thank you for your valuable feedback!',
    'Your feedback has been submitted and will help us improve.',
    'We appreciate you taking the time to share your thoughts.'
  ],
  application: [
    'Your application has been submitted successfully!',
    'Application received! You will be contacted regarding the next steps.',
    'Thank you for your application. We will review it and get back to you.'
  ],
  assessment: [
    'Assessment completed successfully!',
    'Your responses have been recorded. Thank you for participating.',
    'Assessment submission received. Results will be available soon.'
  ],
  event: [
    'Event registration confirmed!',
    'Thank you for registering for our event!',
    'Your event registration has been received and confirmed.'
  ],
  support: [
    'Support request submitted! Our team will get back to you soon.',
    'Thank you for contacting support. We will respond within 24 hours.',
    'Your support ticket has been created and assigned to our team.'
  ]
} as const

/**
 * Form validation configuration
 */
export const FORM_VALIDATION_CONFIG = {
  /** Maximum form title length */
  MAX_TITLE_LENGTH: 200,
  /** Maximum form description length */
  MAX_DESCRIPTION_LENGTH: 1000,
  /** Maximum confirmation message length */
  MAX_CONFIRMATION_MESSAGE_LENGTH: 500,
  /** Maximum email recipients string length */
  MAX_EMAIL_RECIPIENTS_LENGTH: 2000,
  /** Maximum number of department access selections */
  MAX_DEPARTMENT_ACCESS: 15
} as const

/**
 * Form builder configuration
 */
export const FORM_BUILDER_CONFIG = {
  /** Minimum form height */
  MIN_FORM_HEIGHT: 400,
  /** Default form height */
  DEFAULT_FORM_HEIGHT: 600,
  /** Maximum form height */
  MAX_FORM_HEIGHT: 1200,
  /** Maximum number of form fields */
  MAX_FORM_FIELDS: 50,
  /** Auto-save interval in milliseconds */
  AUTO_SAVE_INTERVAL: 30000 // 30 seconds
} as const

/**
 * Common email domain suffixes for validation
 */
export const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'school.edu',
  'university.edu',
  'college.edu'
] as const

/**
 * Helper function to get category option by value
 */
export const getFormCategoryOption = (category: FormCategory) => {
  return FORM_CATEGORY_OPTIONS.find((option) => option.value === category)
}

/**
 * Helper function to get department option by value
 */
export const getFormDepartmentOption = (department: string) => {
  return FORM_DEPARTMENT_OPTIONS.find((option) => option.value === department)
}

/**
 * Helper function to get confirmation message templates by category
 */
export const getConfirmationMessageTemplates = (
  category: FormCategory
): string[] => {
  return (
    CONFIRMATION_MESSAGE_TEMPLATES[category] ||
    CONFIRMATION_MESSAGE_TEMPLATES.general
  )
}

/**
 * Helper function to validate email recipients string
 */
export const validateEmailRecipients = (
  emailString: string
): {
  isValid: boolean
  emails: string[]
  errors: string[]
} => {
  if (!emailString.trim()) {
    return { isValid: true, emails: [], errors: [] }
  }

  const emails = emailString
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
  const errors: string[] = []
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  emails.forEach((email, index) => {
    if (!emailRegex.test(email)) {
      errors.push(`Invalid email format at position ${index + 1}: ${email}`)
    }
  })

  return {
    isValid: errors.length === 0,
    emails: emails.filter((email) => emailRegex.test(email)),
    errors
  }
}

/**
 * Helper function to generate form preview data
 */
export const generateFormPreview = (formData: FormCreateFormData) => {
  const category = getFormCategoryOption(formData.category)
  const departments = formData.departmentAccess.map(
    (dept) => getFormDepartmentOption(dept)?.label || dept
  )

  return {
    title: formData.title || 'Untitled Form',
    description: formData.description || 'No description provided',
    category: category?.label || 'General',
    categoryIcon: category?.icon || '📝',
    categoryColor: category?.color || '#6B7280',
    accessType: formData.isPublic ? 'Public' : 'Internal',
    anonymousAllowed: formData.allowAnonymous,
    emailCollection: formData.collectEmails,
    approvalRequired: formData.requireApproval,
    departments: departments,
    notificationsEnabled:
      formData.notifications.email || formData.notifications.slack,
    hasRedirect: !!formData.redirectUrl,
    hasCustomConfirmation: !!formData.confirmationMessage
  }
}


import type { CourseLevel, CourseStatus } from '@/types/courses/course.types'

/**
 * Age range configuration constants for course filtering
 * These values define the valid age range for school courses (5-18 years)
 */
export const AGE_RANGE_CONFIG = {
  /** Minimum age for course eligibility */
  MIN_AGE: 5,
  /** Maximum age for course eligibility */
  MAX_AGE: 18,
  /** Default age range when no filter is applied */
  DEFAULT_RANGE: [5, 18] as const,
  /** Step increment for age range slider */
  STEP: 1
} as const

/**
 * UI configuration constants for filter components
 */
export const FILTER_UI_CONFIG = {
  /** Minimum width for age range filter component */
  MIN_AGE_FILTER_WIDTH: 200,
  /** Dropdown menu width for category selection */
  CATEGORY_DROPDOWN_WIDTH: 224, // w-56 = 14rem = 224px
  /** Dropdown menu width for level/status selection */
  STANDARD_DROPDOWN_WIDTH: 192, // w-48 = 12rem = 192px
  /** Maximum number of visible filter badges before overflow */
  MAX_VISIBLE_BADGES: 10
} as const

/**
 * Available course difficulty levels for filtering
 * Ordered from easiest to most difficult
 */
export const COURSE_LEVELS: readonly CourseLevel[] = [
  'Kids',
  'Beginner',
  'Intermediate',
  'Advanced'
] as const

/**
 * Available course statuses for filtering
 * Represents the lifecycle of a course
 */
export const COURSE_STATUSES: readonly CourseStatus[] = [
  'draft', // Course is being created/edited
  'active', // Course is available for enrollment
  'archived' // Course is no longer active
] as const

/**
 * Course level display configuration
 * Maps level types to their display properties
 */
export const COURSE_LEVEL_CONFIG = {
  Kids: {
    label: 'Kids',
    description: 'Designed for young learners aged 5-12',
    color: '#3B82F6', // blue-500
    order: 0
  },
  Beginner: {
    label: 'Beginner',
    description: 'Suitable for students with no prior experience',
    color: '#10B981', // green-500
    order: 1
  },
  Intermediate: {
    label: 'Intermediate',
    description: 'Requires basic knowledge in the subject',
    color: '#F59E0B', // amber-500
    order: 2
  },
  Advanced: {
    label: 'Advanced',
    description: 'For experienced students seeking deeper knowledge',
    color: '#EF4444', // red-500
    order: 3
  }
} as const satisfies Record<
  CourseLevel,
  {
    label: string
    description: string
    color: string
    order: number
  }
>

/**
 * Course status display configuration
 * Maps status types to their display properties
 */
export const COURSE_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    description: 'Course is being prepared and not yet available',
    color: '#6B7280', // gray-500
    badgeVariant: 'secondary' as const
  },
  active: {
    label: 'Active',
    description: 'Course is available for enrollment',
    color: '#10B981', // green-500
    badgeVariant: 'default' as const
  },
  archived: {
    label: 'Archived',
    description: 'Course is no longer available',
    color: '#9CA3AF', // gray-400
    badgeVariant: 'outline' as const
  }
} as const satisfies Record<
  CourseStatus,
  {
    label: string
    description: string
    color: string
    badgeVariant: 'default' | 'secondary' | 'outline'
  }
>

/**
 * Type definitions derived from constants
 */
export type AgeLimitType =
  | typeof AGE_RANGE_CONFIG.MIN_AGE
  | typeof AGE_RANGE_CONFIG.MAX_AGE
export type DefaultAgeRange = typeof AGE_RANGE_CONFIG.DEFAULT_RANGE
export type CourseLevelKey = keyof typeof COURSE_LEVEL_CONFIG
export type CourseStatusKey = keyof typeof COURSE_STATUS_CONFIG


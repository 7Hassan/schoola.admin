/**
 * Groups Creation Types and Validation Schema
 * Contains all TypeScript types and Zod schemas for group creation functionality
 */

import {
  GroupStatus,
  SubscriptionType
} from '@schoola/types/src/enums/global.enums'
import { z } from 'zod'
import { Currency } from '../global.types'

export interface SessionTime {
  /** Session ID */
  id?: string
  /** Day of week */
  dayOfWeek: string
  /** Start time */
  startTime: string
  /** End time */
  endTime: string
  /** Duration in minutes */
  duration?: number
}

/**
 * Teacher assignment interface
 */
export interface TeacherAssignment {
  /** Teacher ID */
  teacherId: string
  /** Assigned lecture numbers */
  lectureNumbers: number[]
  /** Assignment notes */
  notes?: string
}

/**
 * Student interface (simplified for group creation)
 */
export interface Student {
  /** Student ID */
  id: string
  /** Student name */
  name: string
  /** Student email */
  email: string
  /** Parent phone number */
  parentPhone: string
  /** Student status */
  status: string
  /** Payment status */
  paid: boolean
}

/**
 * Group creation form data type
 * Inferred from the Zod schema below
 */
export type GroupCreateFormData = z.infer<typeof groupCreateSchema>

/**
 * Group status options configuration
 */
export const GROUP_STATUS_OPTIONS: readonly {
  value: GroupStatus
  label: string
  color: string
  description: string
}[] = [
  {
    value: 'active',
    label: 'Active',
    color: '#10B981',
    description: 'Group is currently running with active sessions'
  },
  {
    value: 'completed',
    label: 'Completed',
    color: '#6B7280',
    description: 'Group has finished all scheduled lectures'
  },
  {
    value: 'canceled',
    label: 'Canceled',
    color: '#EF4444',
    description: 'Group has been canceled and will not continue'
  }
] as const

/**
 * Currency options configuration
 */
export const CURRENCY_OPTIONS: readonly {
  value: Currency
  label: string
  symbol: string
}[] = [
  { value: 'egp', label: 'Egyptian Pound', symbol: 'EGP' },
  { value: 'usd', label: 'US Dollar', symbol: 'USD' }
] as const

/**
 * Subscription type options configuration
 */
export const SUBSCRIPTION_TYPE_OPTIONS: readonly {
  value: SubscriptionType
  label: string
  description: string
  defaultCost: Cost
  defaultLectures: number
}[] = [
  {
    value: 'monthly',
    label: 'Monthly Subscription',
    description: 'Recurring monthly payment plan',
    defaultCost: { amount: 500, currency: 'egp' },
    defaultLectures: 4
  },
  {
    value: 'level',
    label: 'Level Subscription',
    description: 'One-time payment for entire level/course',
    defaultCost: { amount: 1000, currency: 'egp' },
    defaultLectures: 12
  }
] as const

/**
 * Group creation validation schema
 */
export const groupCreateSchema = z
  .object({
    /** Teacher assignment validation */
    teachers: z
      .array(z.string().min(1, 'Teacher ID cannot be empty'))
      .min(1, 'At least one teacher is required')
      .max(5, 'Cannot assign more than 5 teachers'),

    /** Course selection validation */
    courses: z
      .array(z.string().min(1, 'Course ID cannot be empty'))
      .min(1, 'A course is required')
      .max(1, 'Only one course can be selected'),

    /** Capacity validation */
    capacityLimit: z
      .number()
      .int('Capacity must be a whole number')
      .min(1, 'Capacity must be at least 1')
      .max(100, 'Capacity cannot exceed 100'),

    /** Current enrollment validation */
    currentEnrollment: z
      .number()
      .int('Current enrollment must be a whole number')
      .min(0, 'Current enrollment cannot be negative'),

    /** Location validation */
    location: z.string().min(1, 'Location is required'),

    /** Status validation */
    status: z.enum(['active', 'completed', 'canceled']),

    /** Sessions validation */
    sessions: z
      .array(z.any())
      .min(1, 'At least one session is required')
      .max(7, 'Cannot have more than 7 sessions per week'),

    /** Lecture counts validation */
    totalLectures: z
      .number()
      .int('Total lectures must be a whole number')
      .min(1, 'Total lectures must be at least 1')
      .max(100, 'Total lectures cannot exceed 100'),

    currentLectureNumber: z
      .number()
      .int('Current lecture number must be a whole number')
      .min(0, 'Current lecture cannot be negative'),

    upcomingLectureNumber: z
      .number()
      .int('Upcoming lecture number must be a whole number')
      .min(1, 'Upcoming lecture must be at least 1'),

    /** Optional student selection */
    selectedStudents: z
      .array(z.string().min(1, 'Student ID cannot be empty'))
      .optional()
      .default([]),

    /** Optional subscriptions */
    subscriptions: z
      .array(
        z.object({
          id: z.string().optional(),
          type: z.enum(['monthly', 'level']),
          cost: z.object({
            amount: z.number().min(0, 'Amount must be positive'),
            currency: z.enum(['egp', 'usd'])
          }),
          numberOfLecturesIncluded: z
            .number()
            .int('Number of lectures must be a whole number')
            .min(1, 'Must include at least 1 lecture')
        })
      )
      .optional()
      .default([]),

    /** Optional teacher assignments */
    teacherAssignments: z
      .array(
        z.object({
          teacherId: z.string().min(1, 'Teacher ID is required'),
          lectureNumbers: z.array(z.number().int().positive()),
          notes: z.string().optional()
        })
      )
      .optional()
      .default([]),

    /** Legacy price support */
    price: z
      .object({
        amount: z.number().min(0, 'Price must be positive'),
        currency: z.enum(['egp', 'usd'])
      })
      .optional()
  })

  // Add refinements for cross-field validation
  .refine((data) => data.currentEnrollment <= data.capacityLimit, {
    message: 'Current enrollment cannot exceed capacity limit',
    path: ['currentEnrollment']
  })
  .refine((data) => data.currentLectureNumber <= data.totalLectures, {
    message: 'Current lecture cannot exceed total lectures',
    path: ['currentLectureNumber']
  })
  .refine((data) => data.upcomingLectureNumber <= data.totalLectures, {
    message: 'Upcoming lecture cannot exceed total lectures',
    path: ['upcomingLectureNumber']
  })
  .refine((data) => data.upcomingLectureNumber > data.currentLectureNumber, {
    message: 'Upcoming lecture must be after current lecture',
    path: ['upcomingLectureNumber']
  })
  .refine(
    (data) =>
      !data.selectedStudents ||
      data.selectedStudents.length <= data.capacityLimit,
    {
      message: 'Selected students cannot exceed capacity limit',
      path: ['selectedStudents']
    }
  )

/**
 * Teacher interface (simplified for group creation)
 */
export interface Teacher {
  /** Teacher ID */
  id: string
  /** Teacher name */
  name: string
  /** Teacher email */
  email: string
  /** Teacher subjects */
  subjects: string[]
  /** Teacher status */
  status: string
}

/**
 * Course interface (simplified for group creation)
 */
export interface Course {
  /** Course ID */
  id: string
  /** Course name */
  name: string
  /** Course description */
  description: string
  /** Course level */
  level: string
  /** Course subject */
  subject: string
}

/**
 * Location interface (simplified for group creation)
 */
export interface Location {
  /** Location ID */
  id: string
  /** Location name */
  name: string
  /** Location type */
  type: string
  /** Location capacity */
  capacity: number
}

/**
 * Group creation success result interface
 */
export interface GroupCreateResult {
  /** Whether creation was successful */
  success: boolean
  /** Result message */
  message: string
  /** Optional error details */
  error?: string
  /** Optional created group ID */
  groupId?: string
}


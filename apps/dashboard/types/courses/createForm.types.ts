/**
 * Course Create Form Types and Schema
 * Contains all TypeScript interfaces and Zod schemas for course creation
 */

import { z } from 'zod'

/**
 * Zod validation schema for course creation form
 * Ensures type safety and data validation at runtime
 */
export const courseCreateSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  subjectCategory: z.string().min(1, 'Subject category is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  creditHours: z.number().min(0).optional(),
  description: z.string().min(1, 'Course description is required'),

  // Course Details
  courseType: z.string(),
  difficultyLevel: z.string(),
  maxStudents: z.number().min(1).optional(),
  minStudents: z.number().min(1).optional(),
  duration: z.number().min(1).optional(),

  // Prerequisites
  prerequisites: z.array(z.string()).optional(),

  // Schedule
  academicTerm: z.string().optional(),
  meetingPattern: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),

  // Instructors
  instructors: z.array(z.string()).optional(),

  // Materials
  textbooks: z.string().optional(),
  additionalMaterials: z.string().optional(),
  onlineResources: z.string().optional()
})

/**
 * TypeScript interface inferred from course create schema
 * Used for form data typing throughout the application
 */
export type CourseCreateFormData = z.infer<typeof courseCreateSchema>

/**
 * Course type options
 */
export type CourseType = 'core' | 'elective' | 'advanced' | 'remedial'

/**
 * Difficulty level options
 */
export type DifficultyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'

/**
 * Meeting pattern options
 */
export type MeetingPattern = 'daily' | 'mwf' | 'tth' | 'custom'

/**
 * Academic term options
 */
export type AcademicTerm = 'fall' | 'spring' | 'summer' | 'year_round'

/**
 * Subject category interface
 */
export interface SubjectCategory {
  readonly id: string
  readonly name: string
  readonly description?: string
}

/**
 * Grade level interface
 */
export interface GradeLevel {
  readonly id: string
  readonly name: string
  readonly order: number
}

/**
 * Teacher interface for instructor assignment
 */
export interface Teacher {
  readonly id: string
  readonly name: string
  readonly subject: string
  readonly email: string
}

/**
 * Prerequisite course interface
 */
export interface PrerequisiteCourse {
  readonly id: string
  readonly name: string
  readonly code: string
}

/**
 * Location interface for course venues
 */
export interface Location {
  readonly id: string
  readonly name: string
  readonly type: 'classroom' | 'lab' | 'online' | 'hybrid'
  readonly capacity?: number
}


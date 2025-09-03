/**
 * Teacher Create Form Types and Schema
 * Contains all TypeScript interfaces and Zod schemas for teacher creation
 */

import { z } from 'zod'

/**
 * Zod validation schema for teacher creation form
 * Ensures type safety and data validation at runtime
 */
export const teacherCreateSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  profilePhoto: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'not_specified']).optional(),

  // Professional Details
  department: z.string().min(1, 'Department is required'),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  qualifications: z
    .array(z.string())
    .min(1, 'At least one qualification is required'),
  experienceYears: z
    .number()
    .min(0, 'Experience years must be positive')
    .max(50, 'Experience cannot exceed 50 years'),

  // Employment Information
  hireDate: z.string().min(1, 'Hire date is required'),
  employmentType: z.enum(['full_time', 'part_time', 'contract']),
  salaryAmount: z.number().min(0, 'Salary must be positive').optional(),
  salaryCurrency: z.enum(['egp', 'usd']).optional(),

  // Contact & Address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),

  // System Access
  createAccount: z.boolean().optional(),
  role: z.string().optional(),
  initialPassword: z.string().optional(),
  permissions: z.array(z.string()).optional()
})

/**
 * TypeScript interface inferred from teacher create schema
 * Used for form data typing throughout the application
 */
export type TeacherCreateFormData = z.infer<typeof teacherCreateSchema>

/**
 * Gender options enum
 */
export type Gender = 'male' | 'female' | 'not_specified'

/**
 * Employment type options
 */
export type EmploymentType = 'full_time' | 'part_time' | 'contract'

/**
 * Currency options for salary
 */
export type SalaryCurrency = 'egp' | 'usd'

/**
 * Department interface for selectable departments
 */
export interface Department {
  readonly id: string
  readonly name: string
}

/**
 * Subject interface for selectable subjects
 */
export interface Subject {
  readonly id: string
  readonly name: string
  readonly department: string
}

/**
 * Teacher role options for system access
 */
export type TeacherRole = 'teacher' | 'senior_teacher' | 'department_head'

/**
 * Default form values configuration
 */
export interface TeacherCreateFormDefaults {
  readonly name: string
  readonly employeeId: string
  readonly email: string
  readonly phone: string
  readonly profilePhoto: string
  readonly dateOfBirth: string
  readonly gender: Gender | undefined
  readonly department: string
  readonly subjects: readonly string[]
  readonly qualifications: readonly string[]
  readonly experienceYears: number
  readonly hireDate: string
  readonly employmentType: EmploymentType
  readonly salaryAmount: number | undefined
  readonly salaryCurrency: SalaryCurrency | undefined
  readonly street: string
  readonly city: string
  readonly state: string
  readonly postalCode: string
  readonly emergencyContactName: string
  readonly emergencyContactPhone: string
  readonly emergencyContactRelationship: string
  readonly createAccount: boolean
  readonly role: string
  readonly initialPassword: string
  readonly permissions: readonly string[]
}


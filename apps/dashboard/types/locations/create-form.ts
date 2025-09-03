/**
 * Location Create Form Types and Schema
 * Contains all TypeScript interfaces and Zod schemas for location creation
 */

import { z } from 'zod'

/**
 * Zod validation schema for location creation form
 * Ensures type safety and data validation at runtime
 */
export const locationCreateSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  code: z.string().optional(),
  type: z.string().min(1, 'Location type is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  description: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(1, 'ZIP/Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional(),
  operatingHours: z.string().optional(),
  status: z.enum(['active', 'under_construction', 'maintenance', 'inactive']),
  features: z.array(z.string()).optional(),
  manager: z.string().optional(),
  department: z.string().optional(),
  notes: z.string().optional()
})

/**
 * TypeScript interface inferred from location create schema
 * Used for form data typing throughout the application
 */
export type LocationCreateFormData = z.infer<typeof locationCreateSchema>

/**
 * Location status options
 */
export type LocationStatus =
  | 'active'
  | 'under_construction'
  | 'maintenance'
  | 'inactive'

/**
 * Location type options
 */
export type LocationType =
  | 'classroom'
  | 'laboratory'
  | 'library'
  | 'auditorium'
  | 'gymnasium'
  | 'cafeteria'
  | 'office'
  | 'outdoor'
  | 'online'
  | 'other'

/**
 * Operating hours options
 */
export type OperatingHours = '24/7' | 'business' | 'academic' | 'custom'

/**
 * Location feature interface
 */
export interface LocationFeature {
  readonly id: string
  readonly name: string
  readonly icon?: string
  readonly category: 'technology' | 'accessibility' | 'amenities' | 'safety'
}

/**
 * Manager interface for location management
 */
export interface LocationManager {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly role: string
}

/**
 * Department interface for location assignment
 */
export interface LocationDepartment {
  readonly id: string
  readonly name: string
}


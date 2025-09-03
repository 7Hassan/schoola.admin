export type CourseLevel = 'Kids' | 'Beginner' | 'Intermediate' | 'Advanced'
export type CourseStatus = 'draft' | 'active' | 'archived'
export type Currency = 'egp' | 'usd'
export type UserRole = 'admin' | 'super-admin'
export type ResourceType = 'document' | 'video' | 'link' | 'book'
export type AssessmentType =
  | 'exam'
  | 'assignment'
  | 'project'
  | 'participation'
  | 'quiz'
export type GradingScale = 'letter' | 'percentage' | 'pass-fail'

// Core interfaces following established patterns
export interface Course {
  id: string
  name: string // Name of course (customer requirement)
  code: string
  level: CourseLevel
  description: string // Description (customer requirement)
  category: string
  duration: number // Duration in weeks
  totalLectures: number
  prerequisites: string[]
  learningObjectives: string[]
  status: CourseStatus
  createdAt: Date
  updatedAt: Date

  // Customer Requirements
  ageRange: {
    min: number
    max: number
  } // Valid Age range (customer requirement)
  materialLinks: MaterialLink[] // Material links (customer requirement)
  notes: string // Notes (customer requirement)

  // Course content structure
  syllabus: CourseSyllabus[]
  resources: CourseResource[]
  assessmentMethods: AssessmentMethod[]
  gradingScheme: GradingScheme

  // Group relationships - courses are connected to groups, not directly to instructors/enrollments
  relatedGroupIds: string[] // Groups that take this course
}

export interface MaterialLink {
  id: string
  title: string
  url: string
  type: 'pdf' | 'video' | 'document' | 'link' | 'image'
  description?: string
  isRequired: boolean
  uploadedAt: Date
}

export interface CourseSyllabus {
  id: string
  week: number
  title: string
  topics: string[]
  learningOutcomes: string[]
  readings: string[]
  assignments: string[]
}

export interface CourseResource {
  id: string
  title: string
  type: ResourceType
  url?: string
  description?: string
  isRequired: boolean
}

export interface AssessmentMethod {
  id: string
  type: AssessmentType
  weight: number
  description: string
}

export interface Threshold {
  id: string
  grade: string
  minPercentage: number
}

export interface GradingScheme {
  id: string
  scale: GradingScale
  thresholds: Threshold[]
}

export interface CourseCategory {
  id: string
  name: string
  description: string
  color: string
  parentId?: string
}

export interface CourseFilters {
  searchQuery: string
  categories: string[]
  levels: CourseLevel[]
  status: CourseStatus[]
  dateRange: [Date | null, Date | null]
  ageRange: [number, number] // Filter by valid age range
  relatedGroups: string[] // Filter by related group IDs
}


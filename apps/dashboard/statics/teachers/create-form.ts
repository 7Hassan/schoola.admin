/**
 * Teacher Creation Static Data and Constants
 * Contains all static data, mock data, and configuration constants for teacher creation
 */

import type {
  Department,
  Subject,
  TeacherCreateFormData,
  Gender,
  EmploymentType,
  SalaryCurrency,
  TeacherRole
} from '@/types/teachers/create-form'

/**
 * Default form values for teacher creation
 * Used as initial state for form components
 */
export const TEACHER_CREATE_FORM_DEFAULTS: TeacherCreateFormData = {
  name: '',
  employeeId: '',
  email: '',
  phone: '',
  profilePhoto: '',
  dateOfBirth: '',
  gender: undefined,
  department: '',
  subjects: [],
  qualifications: [],
  experienceYears: 0,
  hireDate: '',
  employmentType: 'full_time',
  salaryAmount: undefined,
  salaryCurrency: undefined,
  street: '',
  city: '',
  state: '',
  postalCode: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  createAccount: false,
  role: '',
  initialPassword: '',
  permissions: []
}

/**
 * Gender options configuration
 */
export const GENDER_OPTIONS: readonly { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'not_specified', label: 'Not Specified' }
] as const

/**
 * Employment type options configuration
 */
export const EMPLOYMENT_TYPE_OPTIONS: readonly {
  value: EmploymentType
  label: string
}[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' }
] as const

/**
 * Currency options configuration
 */
export const SALARY_CURRENCY_OPTIONS: readonly {
  value: SalaryCurrency
  label: string
  symbol: string
}[] = [
  { value: 'egp', label: 'Egyptian Pound', symbol: 'EGP' },
  { value: 'usd', label: 'US Dollar', symbol: 'USD' }
] as const

/**
 * Teacher role options configuration
 */
export const TEACHER_ROLE_OPTIONS: readonly {
  value: TeacherRole
  label: string
}[] = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'senior_teacher', label: 'Senior Teacher' },
  { value: 'department_head', label: 'Department Head' }
] as const

/**
 * Mock department data for development and testing
 * In production, this should come from the departments store/API
 *
 * @TODO Integrate with actual departments store: `import { useDepartmentsStore } from '@/stores/departments-store'`
 */
export const MOCK_DEPARTMENTS: readonly Department[] = [
  { id: '1', name: 'Computer Science' },
  { id: '2', name: 'Mathematics' },
  { id: '3', name: 'Physics' },
  { id: '4', name: 'English' },
  { id: '5', name: 'Business' }
] as const

/**
 * Mock subject data for development and testing
 * In production, this should come from the subjects store/API
 *
 * @TODO Integrate with actual subjects store: `import { useSubjectsStore } from '@/stores/subjects-store'`
 */
export const MOCK_SUBJECTS: readonly Subject[] = [
  { id: '1', name: 'Python Programming', department: '1' },
  { id: '2', name: 'Web Development', department: '1' },
  { id: '3', name: 'Data Science', department: '1' },
  { id: '4', name: 'Mobile Development', department: '1' },
  { id: '5', name: 'Calculus', department: '2' },
  { id: '6', name: 'Statistics', department: '2' },
  { id: '7', name: 'Algebra', department: '2' },
  { id: '8', name: 'Quantum Physics', department: '3' },
  { id: '9', name: 'Mechanics', department: '3' },
  { id: '10', name: 'English Literature', department: '4' },
  { id: '11', name: 'Academic Writing', department: '4' },
  { id: '12', name: 'Business Strategy', department: '5' },
  { id: '13', name: 'Project Management', department: '5' }
] as const

/**
 * Helper function to get subjects by department ID
 */
export const getSubjectsByDepartment = (departmentId: string): Subject[] => {
  return MOCK_SUBJECTS.filter((subject) => subject.department === departmentId)
}

/**
 * Helper function to get department by ID
 */
export const getDepartmentById = (
  departmentId: string
): Department | undefined => {
  return MOCK_DEPARTMENTS.find((dept) => dept.id === departmentId)
}

/**
 * Helper function to get subject by ID
 */
export const getSubjectById = (subjectId: string): Subject | undefined => {
  return MOCK_SUBJECTS.find((subject) => subject.id === subjectId)
}

/**
 * Common qualifications options for teacher creation
 */
export const COMMON_QUALIFICATIONS = [
  "Bachelor's Degree in Computer Science",
  "Master's Degree in Computer Science",
  'PhD in Computer Science',
  "Bachelor's Degree in Mathematics",
  "Master's Degree in Mathematics",
  'PhD in Mathematics',
  "Bachelor's Degree in Physics",
  "Master's Degree in Physics",
  'PhD in Physics',
  "Bachelor's Degree in English",
  "Master's Degree in English",
  'PhD in English',
  "Bachelor's Degree in Business",
  "Master's Degree in Business Administration",
  'Teaching Certificate',
  'Educational Leadership Certificate'
] as const

/**
 * Form validation configuration
 */
export const TEACHER_FORM_VALIDATION_CONFIG = {
  /** Minimum name length */
  MIN_NAME_LENGTH: 2,
  /** Minimum phone number length */
  MIN_PHONE_LENGTH: 10,
  /** Maximum experience years */
  MAX_EXPERIENCE_YEARS: 50,
  /** Minimum experience years */
  MIN_EXPERIENCE_YEARS: 0
} as const


/**
 * Course Creation Static Data and Constants
 * Contains all static data, mock data, and configuration constants for course creation
 */

import type {
  CourseCreateFormData,
  CourseType,
  DifficultyLevel,
  MeetingPattern,
  AcademicTerm,
  SubjectCategory,
  GradeLevel,
  Teacher,
  PrerequisiteCourse,
  Location
} from '@/types/courses/createForm.types'

/**
 * Default form values for course creation
 * Used as initial state for form components
 */
export const COURSE_CREATE_FORM_DEFAULTS: CourseCreateFormData = {
  name: '',
  code: '',
  subjectCategory: '',
  gradeLevel: '',
  creditHours: undefined,
  description: '',
  courseType: 'core',
  difficultyLevel: 'intermediate',
  maxStudents: undefined,
  minStudents: undefined,
  duration: undefined,
  prerequisites: [],
  academicTerm: '',
  meetingPattern: '',
  startTime: '',
  endTime: '',
  location: '',
  instructors: [],
  textbooks: '',
  additionalMaterials: '',
  onlineResources: ''
}

/**
 * Course type options configuration
 */
export const COURSE_TYPE_OPTIONS: readonly {
  value: CourseType
  label: string
  description: string
}[] = [
  {
    value: 'core',
    label: 'Core Course',
    description: 'Required course for all students in the program'
  },
  {
    value: 'elective',
    label: 'Elective',
    description: 'Optional course students can choose to take'
  },
  {
    value: 'advanced',
    label: 'Advanced Course',
    description: 'Advanced level course with prerequisites'
  },
  {
    value: 'remedial',
    label: 'Remedial Course',
    description: 'Support course for students needing extra help'
  }
] as const

/**
 * Difficulty level options configuration
 */
export const DIFFICULTY_LEVEL_OPTIONS: readonly {
  value: DifficultyLevel
  label: string
  color: string
}[] = [
  { value: 'beginner', label: 'Beginner', color: '#10B981' },
  { value: 'intermediate', label: 'Intermediate', color: '#F59E0B' },
  { value: 'advanced', label: 'Advanced', color: '#EF4444' },
  { value: 'expert', label: 'Expert', color: '#7C3AED' }
] as const

/**
 * Meeting pattern options configuration
 */
export const MEETING_PATTERN_OPTIONS: readonly {
  value: MeetingPattern
  label: string
  description: string
}[] = [
  {
    value: 'daily',
    label: 'Daily (Monday-Friday)',
    description: 'Classes every weekday'
  },
  {
    value: 'mwf',
    label: 'Monday, Wednesday, Friday',
    description: 'Classes three times per week'
  },
  {
    value: 'tth',
    label: 'Tuesday, Thursday',
    description: 'Classes twice per week'
  },
  {
    value: 'custom',
    label: 'Custom Schedule',
    description: 'Flexible scheduling'
  }
] as const

/**
 * Academic term options configuration
 */
export const ACADEMIC_TERM_OPTIONS: readonly {
  value: AcademicTerm
  label: string
}[] = [
  { value: 'fall', label: 'Fall Semester' },
  { value: 'spring', label: 'Spring Semester' },
  { value: 'summer', label: 'Summer Term' },
  { value: 'year_round', label: 'Year Round' }
] as const

/**
 * Mock subject categories for development and testing
 * In production, this should come from the categories store/API
 *
 * @TODO Integrate with actual categories store: `import { useCategoriesStore } from '@/stores/categories-store'`
 */
export const MOCK_SUBJECT_CATEGORIES: readonly SubjectCategory[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Mathematical sciences and related fields'
  },
  {
    id: '2',
    name: 'Science',
    description: 'Natural sciences including physics, chemistry, biology'
  },
  {
    id: '3',
    name: 'Language Arts',
    description: 'English, literature, writing, and communication'
  },
  {
    id: '4',
    name: 'Social Studies',
    description: 'History, geography, civics, and social sciences'
  },
  {
    id: '5',
    name: 'Computer Science',
    description: 'Programming, software development, and technology'
  },
  {
    id: '6',
    name: 'Arts',
    description: 'Visual arts, music, drama, and creative expression'
  },
  {
    id: '7',
    name: 'Physical Education',
    description: 'Sports, fitness, and physical wellness'
  },
  {
    id: '8',
    name: 'Foreign Languages',
    description: 'World languages and cultural studies'
  }
] as const

/**
 * Mock grade levels for development and testing
 * In production, this should come from the grade levels store/API
 *
 * @TODO Integrate with actual grade levels store: `import { useGradeLevelsStore } from '@/stores/grade-levels-store'`
 */
export const MOCK_GRADE_LEVELS: readonly GradeLevel[] = [
  { id: '1', name: 'Grade 1', order: 1 },
  { id: '2', name: 'Grade 2', order: 2 },
  { id: '3', name: 'Grade 3', order: 3 },
  { id: '4', name: 'Grade 4', order: 4 },
  { id: '5', name: 'Grade 5', order: 5 },
  { id: '6', name: 'Grade 6', order: 6 },
  { id: '7', name: 'Grade 7', order: 7 },
  { id: '8', name: 'Grade 8', order: 8 },
  { id: '9', name: 'Grade 9', order: 9 },
  { id: '10', name: 'Grade 10', order: 10 },
  { id: '11', name: 'Grade 11', order: 11 },
  { id: '12', name: 'Grade 12', order: 12 }
] as const

/**
 * Mock teachers for development and testing
 * In production, this should come from the teachers store/API
 *
 * @TODO Integrate with actual teachers store: `import { useTeachersStore } from '@/stores/teachers-store'`
 */
export const MOCK_TEACHERS: readonly Teacher[] = [
  {
    id: '1',
    name: 'Dr. Alice Cooper',
    subject: 'Mathematics',
    email: 'alice.cooper@school.edu'
  },
  {
    id: '2',
    name: 'Mr. Bob Johnson',
    subject: 'English',
    email: 'bob.johnson@school.edu'
  },
  {
    id: '3',
    name: 'Ms. Carol Davis',
    subject: 'Science',
    email: 'carol.davis@school.edu'
  },
  {
    id: '4',
    name: 'Dr. David Wilson',
    subject: 'Computer Science',
    email: 'david.wilson@school.edu'
  },
  {
    id: '5',
    name: 'Ms. Emma Thompson',
    subject: 'History',
    email: 'emma.thompson@school.edu'
  }
] as const

/**
 * Mock prerequisite courses for development and testing
 * In production, this should come from the courses store/API
 *
 * @TODO Integrate with actual courses store: `import { useCoursesStore } from '@/stores/courses-store'`
 */
export const MOCK_PREREQUISITE_COURSES: readonly PrerequisiteCourse[] = [
  { id: '1', name: 'Algebra I', code: 'MATH-100' },
  { id: '2', name: 'Geometry', code: 'MATH-110' },
  { id: '3', name: 'English I', code: 'ENG-100' },
  { id: '4', name: 'Biology I', code: 'SCI-100' },
  { id: '5', name: 'World History', code: 'HIST-100' },
  { id: '6', name: 'Introduction to Programming', code: 'CS-100' }
] as const

/**
 * Mock locations for development and testing
 * In production, this should come from the locations store/API
 *
 * @TODO Integrate with actual locations store: `import { useLocationsStore } from '@/stores/locations-store'`
 */
export const MOCK_LOCATIONS: readonly Location[] = [
  { id: '1', name: 'Room A101', type: 'classroom', capacity: 30 },
  { id: '2', name: 'Science Lab 1', type: 'lab', capacity: 20 },
  { id: '3', name: 'Computer Lab', type: 'lab', capacity: 25 },
  { id: '4', name: 'Online Platform', type: 'online' },
  { id: '5', name: 'Hybrid Room B205', type: 'hybrid', capacity: 35 }
] as const

/**
 * Helper function to get subject category by ID
 */
export const getSubjectCategoryById = (
  categoryId: string
): SubjectCategory | undefined => {
  return MOCK_SUBJECT_CATEGORIES.find((category) => category.id === categoryId)
}

/**
 * Helper function to get grade level by ID
 */
export const getGradeLevelById = (gradeId: string): GradeLevel | undefined => {
  return MOCK_GRADE_LEVELS.find((grade) => grade.id === gradeId)
}

/**
 * Helper function to get teacher by ID
 */
export const getTeacherById = (teacherId: string): Teacher | undefined => {
  return MOCK_TEACHERS.find((teacher) => teacher.id === teacherId)
}

/**
 * Helper function to get prerequisite course by ID
 */
export const getPrerequisiteCourseById = (
  courseId: string
): PrerequisiteCourse | undefined => {
  return MOCK_PREREQUISITE_COURSES.find((course) => course.id === courseId)
}

/**
 * Helper function to get location by ID
 */
export const getLocationById = (locationId: string): Location | undefined => {
  return MOCK_LOCATIONS.find((location) => location.id === locationId)
}

/**
 * Form validation configuration
 */
export const COURSE_FORM_VALIDATION_CONFIG = {
  /** Minimum course name length */
  MIN_NAME_LENGTH: 1,
  /** Minimum course code length */
  MIN_CODE_LENGTH: 1,
  /** Minimum description length */
  MIN_DESCRIPTION_LENGTH: 1,
  /** Minimum students per course */
  MIN_STUDENTS: 1,
  /** Maximum students per course */
  MAX_STUDENTS: 500,
  /** Minimum course duration (hours) */
  MIN_DURATION: 1,
  /** Maximum course duration (hours) */
  MAX_DURATION: 1000
} as const


// /apps/dashboard/stores/courses-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  Course,
  CourseCategory,
  CourseFilters,
  UserRole
} from '@/types/courses/course.types'

interface CoursesStore {
  // State
  courses: Course[]
  categories: CourseCategory[]
  filters: CourseFilters
  selectedCourse: Course | null
  isEditDrawerOpen: boolean
  currentPage: number
  itemsPerPage: number
  userRole: UserRole
  isDeleteMode: boolean
  selectedCoursesForDeletion: string[]
  isDeleteModalOpen: boolean
  isExportModalOpen: boolean

  // Actions
  setCourses: (courses: Course[]) => void
  setCategories: (categories: CourseCategory[]) => void
  updateFilters: (filters: Partial<CourseFilters>) => void
  setSelectedCourse: (course: Course | null) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourses: (courseIds: string[]) => void
  archiveCourse: (courseId: string) => void

  // UI State Management
  openEditDrawer: (course: Course) => void
  closeEditDrawer: () => void
  setCurrentPage: (page: number) => void
  setUserRole: (role: UserRole) => void
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  toggleCourseForDeletion: (courseId: string) => void
  selectAllCoursesForDeletion: () => void
  clearSelectedCoursesForDeletion: () => void
  openDeleteModal: () => void
  closeDeleteModal: () => void
  confirmDeleteSelectedCourses: () => void
  executeDeleteSelectedCourses: () => void
  openExportModal: () => void
  closeExportModal: () => void

  // Computed
  getFilteredCourses: () => Course[]
  getPaginatedCourses: () => Course[]
  getTotalPages: () => number
}

const defaultFilters: CourseFilters = {
  searchQuery: '',
  categories: [],
  levels: [],
  status: [],
  dateRange: [null, null],
  ageRange: [5, 18], // Default age range from 5 to 18 years
  relatedGroups: [] // Filter by related group IDs
}

// Mock data following groups-store pattern
const mockCategories: CourseCategory[] = [
  {
    id: '1',
    name: 'Programming',
    description: 'Programming and software development courses',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Web Development',
    description: 'Frontend and backend web development',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'Data Science',
    description: 'Data analysis and machine learning',
    color: '#8B5CF6'
  },
  {
    id: '4',
    name: 'Mobile Development',
    description: 'iOS and Android app development',
    color: '#F59E0B'
  },
  {
    id: '5',
    name: 'Game Development',
    description: 'Video game programming and design',
    color: '#EF4444'
  }
]

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Python Programming',
    code: 'PY-101',
    level: 'Beginner',
    description: 'Learn the fundamentals of Python programming from scratch',
    category: '1',
    duration: 12,
    totalLectures: 24,
    prerequisites: [],
    learningObjectives: [
      'Understand Python syntax and basic programming concepts',
      'Write simple Python programs',
      'Work with data types and control structures'
    ],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),

    // Customer Requirements
    ageRange: {
      min: 12,
      max: 18
    },
    materialLinks: [
      {
        id: '1',
        title: 'Python Fundamentals PDF',
        url: '/materials/python-fundamentals.pdf',
        type: 'pdf',
        description: 'Complete guide to Python basics',
        isRequired: true,
        uploadedAt: new Date('2024-01-10')
      },
      {
        id: '2',
        title: 'Python Setup Video',
        url: '/materials/python-setup-guide.mp4',
        type: 'video',
        description: 'Step-by-step Python installation guide',
        isRequired: true,
        uploadedAt: new Date('2024-01-12')
      }
    ],
    notes:
      'This course is designed for absolute beginners. Students should have basic computer literacy. Weekly assignments are mandatory for progress tracking.',

    // Group relationships - courses are connected to groups, not directly to instructors/enrollments
    relatedGroupIds: ['group-1', 'group-2'], // Example group IDs that take this course

    syllabus: [
      {
        id: '1',
        week: 1,
        title: 'Python Basics',
        topics: ['Variables', 'Data Types', 'Basic Operations'],
        learningOutcomes: ['Understand Python syntax', 'Create variables'],
        readings: ['Chapter 1-2 of Python Crash Course'],
        assignments: ['Hello World program', 'Variable exercises']
      }
    ],
    resources: [
      {
        id: '1',
        title: 'Python Official Documentation',
        type: 'link',
        url: 'https://docs.python.org',
        description: 'Official Python documentation',
        isRequired: true
      }
    ],
    assessmentMethods: [
      {
        id: '1',
        type: 'assignment',
        weight: 40,
        description: 'Weekly programming assignments'
      },
      {
        id: '2',
        type: 'exam',
        weight: 60,
        description: 'Final project and exam'
      }
    ],
    gradingScheme: {
      id: '1',
      scale: 'letter',
      thresholds: [
        { id: '1', grade: 'A', minPercentage: 90 },
        { id: '2', grade: 'B', minPercentage: 80 },
        { id: '3', grade: 'C', minPercentage: 70 },
        { id: '4', grade: 'D', minPercentage: 60 },
        { id: '5', grade: 'F', minPercentage: 0 }
      ]
    }
  },
  {
    id: '2',
    name: 'Advanced React Development',
    code: 'REACT-301',
    level: 'Advanced',
    description:
      'Master React with hooks, context, and performance optimization',
    category: '2',
    duration: 16,
    totalLectures: 32,
    prerequisites: ['1'],
    learningObjectives: [
      'Master React hooks and context API',
      'Implement performance optimizations',
      'Build scalable React applications'
    ],
    status: 'active',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-01'),

    // Customer Requirements
    ageRange: {
      min: 15,
      max: 18
    },
    materialLinks: [
      {
        id: '3',
        title: 'React Patterns Guide',
        url: '/materials/react-patterns.pdf',
        type: 'pdf',
        description: 'Advanced React patterns and best practices',
        isRequired: true,
        uploadedAt: new Date('2024-02-15')
      }
    ],
    notes:
      'Requires solid JavaScript foundation. Prior React experience recommended.',

    // Group relationships - courses are connected to groups, not directly to instructors/enrollments
    relatedGroupIds: ['group-3', 'group-4'], // Example group IDs that take this course

    syllabus: [
      {
        id: '2',
        week: 1,
        title: 'Advanced Hooks',
        topics: ['useCallback', 'useMemo', 'useRef'],
        learningOutcomes: [
          'Optimize component performance',
          'Manage complex state'
        ],
        readings: ['React Official Docs - Hooks'],
        assignments: ['Custom hooks implementation']
      }
    ],
    resources: [
      {
        id: '2',
        title: 'React Documentation',
        type: 'link',
        url: 'https://react.dev',
        description: 'Official React documentation',
        isRequired: true
      }
    ],
    assessmentMethods: [
      {
        id: '3',
        type: 'project',
        weight: 70,
        description: 'Final React application project'
      },
      {
        id: '4',
        type: 'assignment',
        weight: 30,
        description: 'Weekly coding challenges'
      }
    ],
    gradingScheme: {
      id: '2',
      scale: 'percentage',
      thresholds: [
        { id: '1', grade: '90+', minPercentage: 90 },
        { id: '2', grade: '80-89', minPercentage: 80 },
        { id: '3', grade: '70-79', minPercentage: 70 },
        { id: '4', grade: '60-69', minPercentage: 60 },
        { id: '5', grade: 'Below 60', minPercentage: 0 }
      ]
    }
  },
  {
    id: '3',
    name: 'Data Science Fundamentals',
    code: 'DS-201',
    level: 'Intermediate',
    description:
      'Introduction to data analysis, visualization, and machine learning',
    category: '3',
    duration: 14,
    totalLectures: 28,
    prerequisites: [],
    learningObjectives: [
      'Analyze data using Python and pandas',
      'Create meaningful visualizations',
      'Apply basic machine learning algorithms'
    ],
    status: 'draft',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),

    // Customer Requirements
    ageRange: {
      min: 14,
      max: 18
    },
    materialLinks: [
      {
        id: '4',
        title: 'Data Science Handbook',
        url: '/materials/data-science-handbook.pdf',
        type: 'pdf',
        description: 'Comprehensive guide to data science concepts',
        isRequired: true,
        uploadedAt: new Date('2024-03-08')
      },
      {
        id: '5',
        title: 'Python for Data Analysis',
        url: '/materials/python-data-analysis.pdf',
        type: 'pdf',
        description: 'Using Python libraries for data analysis',
        isRequired: false,
        uploadedAt: new Date('2024-03-09')
      }
    ],
    notes:
      'Basic programming knowledge helpful but not required. We will cover Python basics.',

    // Group relationships - courses are connected to groups, not directly to instructors/enrollments
    relatedGroupIds: ['group-5'], // Example group IDs that take this course

    syllabus: [
      {
        id: '3',
        week: 1,
        title: 'Introduction to Data Science',
        topics: ['Data types', 'Data collection', 'Data cleaning'],
        learningOutcomes: [
          'Understand data science workflow',
          'Clean messy data'
        ],
        readings: ['Chapter 1-2 of Data Science Handbook'],
        assignments: ['Data cleaning exercise']
      }
    ],
    resources: [
      {
        id: '3',
        title: 'Kaggle Learn',
        type: 'link',
        url: 'https://kaggle.com/learn',
        description: 'Free data science courses',
        isRequired: false
      }
    ],
    assessmentMethods: [
      {
        id: '5',
        type: 'project',
        weight: 50,
        description: 'End-to-end data analysis project'
      },
      {
        id: '6',
        type: 'quiz',
        weight: 30,
        description: 'Weekly knowledge checks'
      },
      {
        id: '7',
        type: 'participation',
        weight: 20,
        description: 'Class participation and discussions'
      }
    ],
    gradingScheme: {
      id: '3',
      scale: 'letter',
      thresholds: [
        { id: '1', grade: 'A', minPercentage: 90 },
        { id: '2', grade: 'B', minPercentage: 80 },
        { id: '3', grade: 'C', minPercentage: 70 },
        { id: '4', grade: 'D', minPercentage: 60 },
        { id: '5', grade: 'F', minPercentage: 0 }
      ]
    }
  }
]

export const useCoursesStore = create<CoursesStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      courses: mockCourses,
      categories: mockCategories,
      filters: defaultFilters,
      selectedCourse: null,
      isEditDrawerOpen: false,
      currentPage: 1,
      itemsPerPage: 12,
      userRole: 'admin',
      isDeleteMode: false,
      selectedCoursesForDeletion: [],
      isDeleteModalOpen: false,
      isExportModalOpen: false,

      // Actions
      setCourses: (courses) => set({ courses }),
      setCategories: (categories) => set({ categories }),
      updateFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      setSelectedCourse: (course) => set({ selectedCourse: course }),

      updateCourse: (id, updates) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === id
              ? { ...course, ...updates, updatedAt: new Date() }
              : course
          )
        })),

      deleteCourses: (courseIds) =>
        set((state) => ({
          courses: state.courses.filter(
            (course) => !courseIds.includes(course.id)
          )
        })),

      archiveCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  status: 'archived',
                  updatedAt: new Date()
                }
              : course
          )
        })),

      // UI State Management
      openEditDrawer: (course) =>
        set({ isEditDrawerOpen: true, selectedCourse: course }),
      closeEditDrawer: () =>
        set({ isEditDrawerOpen: false, selectedCourse: null }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setUserRole: (role) => set({ userRole: role }),
      enterDeleteMode: () => set({ isDeleteMode: true }),
      exitDeleteMode: () =>
        set({ isDeleteMode: false, selectedCoursesForDeletion: [] }),

      toggleCourseForDeletion: (courseId) =>
        set((state) => ({
          selectedCoursesForDeletion: state.selectedCoursesForDeletion.includes(
            courseId
          )
            ? state.selectedCoursesForDeletion.filter((id) => id !== courseId)
            : [...state.selectedCoursesForDeletion, courseId]
        })),

      selectAllCoursesForDeletion: () => {
        const filteredCourses = get().getFilteredCourses()
        set({
          selectedCoursesForDeletion: filteredCourses.map((course) => course.id)
        })
      },

      clearSelectedCoursesForDeletion: () =>
        set({ selectedCoursesForDeletion: [] }),
      openDeleteModal: () => set({ isDeleteModalOpen: true }),
      closeDeleteModal: () => set({ isDeleteModalOpen: false }),

      confirmDeleteSelectedCourses: () => {
        const { selectedCoursesForDeletion } = get()
        get().deleteCourses(selectedCoursesForDeletion)
        set({
          selectedCoursesForDeletion: [],
          isDeleteMode: false,
          isDeleteModalOpen: false
        })
      },

      executeDeleteSelectedCourses: () => {
        get().confirmDeleteSelectedCourses()
      },

      openExportModal: () => set({ isExportModalOpen: true }),
      closeExportModal: () => set({ isExportModalOpen: false }),

      // Computed functions
      getFilteredCourses: () => {
        const { courses, filters } = get()
        return courses.filter((course) => {
          // Search query filter
          if (
            filters.searchQuery &&
            !course.name
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) &&
            !course.code
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase())
          ) {
            return false
          }

          // Category filter
          if (
            filters.categories.length > 0 &&
            !filters.categories.includes(course.category)
          ) {
            return false
          }

          // Level filter
          if (
            filters.levels.length > 0 &&
            !filters.levels.includes(course.level)
          ) {
            return false
          }

          // Status filter
          if (
            filters.status.length > 0 &&
            !filters.status.includes(course.status)
          ) {
            return false
          }

          // Related groups filter
          if (
            filters.relatedGroups.length > 0 &&
            !filters.relatedGroups.some((groupId) =>
              course.relatedGroupIds.includes(groupId)
            )
          ) {
            return false
          }

          // Date range filter
          if (filters.dateRange[0] && course.createdAt < filters.dateRange[0])
            return false
          if (filters.dateRange[1] && course.createdAt > filters.dateRange[1])
            return false

          // Age range filter
          if (
            course.ageRange.max < filters.ageRange[0] ||
            course.ageRange.min > filters.ageRange[1]
          ) {
            return false
          }

          return true
        })
      },

      getPaginatedCourses: () => {
        const { currentPage, itemsPerPage } = get()
        const filteredCourses = get().getFilteredCourses()
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredCourses.slice(startIndex, endIndex)
      },

      getTotalPages: () => {
        const { itemsPerPage } = get()
        const filteredCourses = get().getFilteredCourses()
        return Math.ceil(filteredCourses.length / itemsPerPage)
      }
    }),
    {
      name: 'courses-store'
    }
  )
)


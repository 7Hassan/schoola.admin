import {
  Salary,
  EmploymentType,
  Address,
  Gender,
  Currency
} from '@/types/global.types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Department {
  id: string
  name: string
  description?: string
}

export interface Subject {
  id: string
  name: string
  department: string
  description?: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  profilePhoto?: string
  dateOfBirth?: Date
  gender?: Gender

  // Professional Details
  department: Department[] // Department ID
  subjects: Subject[] // Subject IDs
  qualifications: string[]
  experienceYears: number

  // Employment Information
  hireDate: Date
  employmentType: EmploymentType
  salary: Salary

  // Contact & Address
  address?: Address

  // Status
  status: 'active' | 'inactive' | 'on_leave'

  // Additional Information
  info?: string
}

/**
 * Filters interface for teachers
 */
export interface TeachersFilters {
  searchQuery: string
  status: ('active' | 'inactive' | 'on_leave')[]
  departments: string[]
  subjects: string[]
  employmentType: ('full_time' | 'part_time' | 'contract')[]
  experienceRange: [number, number]
  hireDate: [Date | null, Date | null]
}

/**
 * Teachers management store state
 */
interface TeachersManagementState {
  // Data
  teachers: Teacher[]
  departments: Department[]
  subjects: Subject[]

  // Pagination
  currentPage: number
  itemsPerPage: number

  // Filters
  filters: TeachersFilters

  // UI State
  isLoading: boolean
  error: string | null
  isDrawerOpen: boolean
  selectedTeacher: Teacher | null
  isDeleteMode: boolean
  selectedTeachersForDeletion: string[]
  isDeleteModalOpen: boolean
  isExportModalOpen: boolean
}

/**
 * Teachers management store actions
 */
interface TeachersManagementActions {
  // Data operations
  loadTeachers: () => Promise<void>
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void
  updateTeacher: (id: string, updates: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void
  deleteMultipleTeachers: (ids: string[]) => void

  // Filtering and search
  updateFilters: (filters: Partial<TeachersFilters>) => void
  clearFilters: () => void
  getFilteredTeachers: () => Teacher[]

  // Pagination
  setPagination: (page: number, itemsPerPage?: number) => void
  getPaginatedTeachers: () => Teacher[]
  getTotalPages: () => number

  // UI actions
  openDrawer: (teacher?: Teacher) => void
  closeDrawer: () => void
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  toggleTeacherSelection: (teacherId: string) => void
  selectAllTeachers: () => void
  clearTeacherSelection: () => void
  openDeleteModal: () => void
  closeDeleteModal: () => void
  openExportModal: () => void
  closeExportModal: () => void

  // Utility functions
  getTeacherById: (id: string) => Teacher | undefined
  getDepartmentById: (id: string) => Department | undefined
  getSubjectById: (id: string) => Subject | undefined
}

/**
 * Initial state
 */
const initialFilters: TeachersFilters = {
  searchQuery: '',
  status: [],
  departments: [],
  subjects: [],
  employmentType: [],
  experienceRange: [0, 20],
  hireDate: [null, null]
}

/**
 * Mock data - In real app, this would come from API
 */
const mockTeachers: Teacher[] = [
  // Add some mock teachers for development
  {
    id: '1',
    name: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@school.edu',
    phone: '+201234567890',
    profilePhoto: 'https://example.com/photo.jpg',
    dateOfBirth: new Date('1985-05-15'),
    gender: Gender.Male,
    salary: {
      amount: 50000,
      currency: Currency.USD
    },
    department: [
      {
        id: '1',
        name: 'Mathematics'
      }
    ],
    subjects: [
      {
        id: '1',
        name: 'Algebra',
        department: 'math'
      }
    ],
    qualifications: ['PhD Mathematics', 'MSc Applied Mathematics'],
    experienceYears: 8,
    hireDate: new Date('2020-09-01'),
    employmentType: EmploymentType.FullTime,
    status: 'active'
  }
  // Add more mock teachers as needed
]

const mockDepartments: Department[] = [
  { id: 'math', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'english', name: 'English' },
  { id: 'history', name: 'History' }
]

const mockSubjects: Subject[] = [
  { id: 'algebra', name: 'Algebra', department: 'math' },
  { id: 'geometry', name: 'Geometry', department: 'math' },
  { id: 'physics', name: 'Physics', department: 'science' },
  { id: 'chemistry', name: 'Chemistry', department: 'science' }
]

/**
 * Teachers Management Store
 *
 * @example
 * ```tsx
 * import { useTeachersManagementStore } from '@/stores/teachers/management-store'
 *
 * function TeachersList() {
 *   const {
 *     getPaginatedTeachers,
 *     updateFilters,
 *     currentPage,
 *     setPagination
 *   } = useTeachersManagementStore()
 *
 *   const teachers = getPaginatedTeachers()
 *   // ...
 * }
 * ```
 */
export const useTeachersManagementStore = create<
  TeachersManagementState & TeachersManagementActions
>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      teachers: mockTeachers,
      departments: mockDepartments,
      subjects: mockSubjects,
      currentPage: 1,
      itemsPerPage: 12,
      filters: initialFilters,
      isLoading: false,
      error: null,
      isDrawerOpen: false,
      selectedTeacher: null,
      isDeleteMode: false,
      selectedTeachersForDeletion: [],
      isDeleteModalOpen: false,
      isExportModalOpen: false,

      // Data operations
      loadTeachers: async () => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // In real app, fetch from API
          // const teachers = await fetchTeachers()

          set((state) => {
            state.teachers = mockTeachers
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : 'Failed to load teachers'
            state.isLoading = false
          })
        }
      },

      addTeacher: (teacherData) =>
        set((state) => {
          const newTeacher: Teacher = {
            ...teacherData,
            id: `teacher_${Date.now()}`
          }
          state.teachers.push(newTeacher)
        }),

      updateTeacher: (id, updates) =>
        set((state) => {
          const index = state.teachers.findIndex((t: Teacher) => t.id === id)
          if (index !== -1) {
            Object.assign(state.teachers[index]!, updates)
          }
        }),

      deleteTeacher: (id) =>
        set((state) => {
          state.teachers = state.teachers.filter((t: Teacher) => t.id !== id)
        }),

      deleteMultipleTeachers: (ids) =>
        set((state) => {
          state.teachers = state.teachers.filter(
            (t: Teacher) => !ids.includes(t.id)
          )
          state.selectedTeachersForDeletion = []
        }),

      // Filtering and search
      updateFilters: (newFilters) =>
        set((state) => {
          Object.assign(state.filters, newFilters)
          state.currentPage = 1 // Reset to first page when filters change
        }),

      clearFilters: () =>
        set((state) => {
          state.filters = { ...initialFilters }
          state.currentPage = 1
        }),

      getFilteredTeachers: () => {
        const { teachers, filters } = get()
        return teachers.filter((teacher) => {
          // Search query filter
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase()
            const matchesQuery =
              teacher.name.toLowerCase().includes(query) ||
              teacher.email.toLowerCase().includes(query)
            if (!matchesQuery) return false
          }

          // Status filter
          if (
            filters.status.length > 0 &&
            !filters.status.includes(teacher.status)
          ) {
            return false
          }

          // Department filter
          if (
            filters.departments.length > 0 &&
            !teacher.department.some((dept) =>
              filters.departments.includes(dept.name)
            )
          ) {
            return false
          }

          // Subjects filter
          if (filters.subjects.length > 0) {
            const hasMatchingSubject = filters.subjects.some((subjectId) =>
              teacher.subjects.some((subject) => subject.id === subjectId)
            )
            if (!hasMatchingSubject) return false
          }

          // Employment type filter
          if (
            filters.employmentType.length > 0 &&
            !filters.employmentType.includes(teacher.employmentType)
          ) {
            return false
          }

          // Experience range filter
          if (
            teacher.experienceYears < filters.experienceRange[0] ||
            teacher.experienceYears > filters.experienceRange[1]
          ) {
            return false
          }

          return true
        })
      },

      // Pagination
      setPagination: (page, itemsPerPage) =>
        set((state) => {
          state.currentPage = page
          if (itemsPerPage) {
            state.itemsPerPage = itemsPerPage
          }
        }),

      getPaginatedTeachers: () => {
        const { currentPage, itemsPerPage } = get()
        const filteredTeachers = get().getFilteredTeachers()
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredTeachers.slice(startIndex, endIndex)
      },

      getTotalPages: () => {
        const { itemsPerPage } = get()
        const filteredTeachers = get().getFilteredTeachers()
        return Math.ceil(filteredTeachers.length / itemsPerPage)
      },

      // UI actions
      openDrawer: (teacher) =>
        set((state) => {
          state.isDrawerOpen = true
          state.selectedTeacher = teacher || null
        }),

      closeDrawer: () =>
        set((state) => {
          state.isDrawerOpen = false
          state.selectedTeacher = null
        }),

      enterDeleteMode: () =>
        set((state) => {
          state.isDeleteMode = true
          state.selectedTeachersForDeletion = []
        }),

      exitDeleteMode: () =>
        set((state) => {
          state.isDeleteMode = false
          state.selectedTeachersForDeletion = []
        }),

      toggleTeacherSelection: (teacherId) =>
        set((state) => {
          const index = state.selectedTeachersForDeletion.indexOf(teacherId)
          if (index > -1) {
            state.selectedTeachersForDeletion.splice(index, 1)
          } else {
            state.selectedTeachersForDeletion.push(teacherId)
          }
        }),

      selectAllTeachers: () =>
        set((state) => {
          const filteredTeachers = get().getFilteredTeachers()
          state.selectedTeachersForDeletion = filteredTeachers.map((t) => t.id)
        }),

      clearTeacherSelection: () =>
        set((state) => {
          state.selectedTeachersForDeletion = []
        }),

      openDeleteModal: () =>
        set((state) => {
          state.isDeleteModalOpen = true
        }),

      closeDeleteModal: () =>
        set((state) => {
          state.isDeleteModalOpen = false
        }),

      openExportModal: () =>
        set((state) => {
          state.isExportModalOpen = true
        }),

      closeExportModal: () =>
        set((state) => {
          state.isExportModalOpen = false
        }),

      // Utility functions
      getTeacherById: (id) => {
        return get().teachers.find((teacher) => teacher.id === id)
      },

      getDepartmentById: (id) => {
        return get().departments.find((dept) => dept.id === id)
      },

      getSubjectById: (id) => {
        return get().subjects.find((subject) => subject.id === id)
      }
    })),
    {
      name: 'teachers-management-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)


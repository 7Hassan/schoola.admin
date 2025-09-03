import { create } from 'zustand'
import { getPhoneDigits } from '@/utils/phone-utils'

export type StudentStatus = 'Active' | 'Archived' | 'Free-day' | 'Waiting'
export type UserRole = 'admin' | 'super-admin'

export interface StudyGroup {
  id: string
  name: string
  level: string
}

export interface Student {
  id: string
  childName: string
  parentName: string
  code: string
  parentPhone: string
  hasWhatsapp?: boolean
  whatsappPhone?: string
  age: number
  email: string
  source: string
  paid: boolean
  status: StudentStatus
  group: string
  info: string
  createdAt: Date
  lastUpdatedAt: Date
}

export interface StudentFilters {
  ageRange: [number, number]
  status: StudentStatus[]
  paidFilter: 'all' | 'paid' | 'unpaid'
  studyGroups: string[]
  dateRange: [Date | null, Date | null]
  updatedDateRange: [Date | null, Date | null]
  sourceCode: string
  searchQuery: string
  phoneQuery: string
}

interface StudentsStore {
  students: Student[]
  studyGroups: StudyGroup[]
  filters: StudentFilters
  selectedStudent: Student | null
  isDrawerOpen: boolean
  isAddMode: boolean
  currentPage: number
  itemsPerPage: number
  userRole: UserRole
  isDeleteMode: boolean
  selectedStudentsForDeletion: string[]
  isDeleteModalOpen: boolean
  isExportModalOpen: boolean

  // Actions
  setStudents: (students: Student[]) => void
  setStudyGroups: (groups: StudyGroup[]) => void
  updateFilters: (filters: Partial<StudentFilters>) => void
  setSelectedStudent: (student: Student | null) => void
  setDrawerOpen: (open: boolean) => void
  setAddMode: (isAdd: boolean) => void
  addStudent: (
    student: Omit<Student, 'id' | 'createdAt' | 'lastUpdatedAt'>
  ) => void
  updateStudent: (id: string, updates: Partial<Student>) => void
  deleteStudents: (studentIds: string[]) => void
  openAddDrawer: () => void
  openEditDrawer: (student: Student) => void
  closeDrawer: () => void
  setCurrentPage: (page: number) => void
  setUserRole: (role: UserRole) => void
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  toggleStudentForDeletion: (studentId: string) => void
  selectAllStudentsForDeletion: () => void
  clearSelectedStudentsForDeletion: () => void
  openDeleteModal: () => void
  closeDeleteModal: () => void
  confirmDeleteSelectedStudents: () => void
  executeDeleteSelectedStudents: () => void
  openExportModal: () => void
  closeExportModal: () => void

  // Computed
  getFilteredStudents: () => Student[]
  getPaginatedStudents: () => Student[]
  getTotalPages: () => number
}

const defaultFilters: StudentFilters = {
  ageRange: [5, 18],
  status: [],
  paidFilter: 'all',
  studyGroups: [],
  dateRange: [null, null],
  updatedDateRange: [null, null],
  sourceCode: '',
  searchQuery: '',
  phoneQuery: ''
}

// Mock data
const mockStudyGroups: StudyGroup[] = [
  { id: '1', name: 'Beginner Python', level: 'Beginner' },
  { id: '2', name: 'Advanced JavaScript', level: 'Advanced' },
  { id: '3', name: 'Web Development', level: 'Intermediate' },
  { id: '4', name: 'Data Science', level: 'Advanced' },
  { id: '5', name: 'Mobile Development', level: 'Intermediate' }
]

const mockStudents: Student[] = [
  {
    id: '1',
    code: 'STU-001',
    childName: 'Ahmed',
    parentName: 'Hassan',
    parentPhone: '+20 123 456 7890',
  hasWhatsapp: true,
  whatsappPhone: '+20 123 456 7890',
    age: 12,
    email: 'ahmed.hassan@email.com',
    source: 'Website',
    paid: true,
    status: 'Active',
    group: 'Beginner Python',
    info: 'Excellent student with strong problem-solving skills',
    createdAt: new Date('2024-01-15'),
    lastUpdatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    code: 'STU-002',
    childName: 'Sarah',
    parentName: 'Johnson',
    parentPhone: '+1 555 123 4567',
  hasWhatsapp: false,
  whatsappPhone: '',
    age: 15,
    email: 'sarah.johnson@email.com',
    source: 'Referral',
    paid: false,
    status: 'Waiting',
    group: 'Web Development',
    info: 'Creative student interested in UI/UX design',
    createdAt: new Date('2024-02-20'),
    lastUpdatedAt: new Date('2024-11-28')
  },
  {
    id: '3',
    code: 'STU-003',
    childName: 'Mohammed',
    parentName: 'Al-Rashid',
    parentPhone: '+966 50 123 4567',
  hasWhatsapp: true,
  whatsappPhone: '+966 50 123 4567',
    age: 14,
    email: 'mohammed.rashid@email.com',
    source: 'Social Media',
    paid: true,
    status: 'Active',
    group: 'Advanced JavaScript',
    info: 'Quick learner with leadership qualities',
    createdAt: new Date('2024-03-10'),
    lastUpdatedAt: new Date('2024-12-02')
  },
  {
    id: '4',
    code: 'STU-004',
    childName: 'Emily',
    parentName: 'Davis',
    parentPhone: '+44 20 7123 4567',
  hasWhatsapp: false,
  whatsappPhone: '',
    age: 11,
    email: 'emily.davis@email.com',
    source: 'Google Ads',
    paid: true,
    status: 'Free-day',
    group: 'Beginner Python',
    info: 'Enthusiastic about coding games',
    createdAt: new Date('2024-04-05'),
    lastUpdatedAt: new Date('2024-11-30')
  }
]

export const useStudentsStore = create<StudentsStore>((set, get) => ({
  students: mockStudents,
  studyGroups: mockStudyGroups,
  filters: defaultFilters,
  selectedStudent: null,
  isDrawerOpen: false,
  isAddMode: false,
  currentPage: 1,
  itemsPerPage: 12,
  userRole: 'admin',
  isDeleteMode: false,
  selectedStudentsForDeletion: [],
  isDeleteModalOpen: false,
  isExportModalOpen: false,

  setStudents: (students) => set({ students }),
  setStudyGroups: (studyGroups) => set({ studyGroups }),
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1 // Reset to first page when filters change
    })),
  setSelectedStudent: (selectedStudent) => set({ selectedStudent }),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  setAddMode: (isAddMode) => set({ isAddMode }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setUserRole: (userRole) => set({ userRole }),

  openAddDrawer: () =>
    set({
      isDrawerOpen: true,
      isAddMode: true,
      selectedStudent: null
    }),

  openEditDrawer: (student) =>
    set({
      isDrawerOpen: true,
      isAddMode: false,
      selectedStudent: student
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      isAddMode: false,
      selectedStudent: null
    }),

  addStudent: (studentData) => {
    // ensure whatsappPhone falls back to parentPhone when empty
    const parent = (studentData.parentPhone || '').toString().trim()
    const whatsappFromInput = (studentData.whatsappPhone || '').toString().trim()
    const finalWhatsapp = whatsappFromInput || parent || ''

    const newStudent: Student = {
      id: `student_${Date.now()}`,
      ...studentData,
      whatsappPhone: finalWhatsapp,
      hasWhatsapp: !!finalWhatsapp,
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    }

    set((state) => ({
      students: [...state.students, newStudent],
      isDrawerOpen: false,
      isAddMode: false,
      selectedStudent: null
    }))
  },

  updateStudent: (id, updates) =>
    set((state) => ({
      students: state.students.map((student) => {
        if (student.id !== id) return student

        // merge existing student with updates first
        const merged: Student = { ...student, ...updates } as Student

        // determine whatsapp fallback: prefer merged.whatsappPhone, else merged.parentPhone
        const parent = (merged.parentPhone || '').toString().trim()
        const whatsappFromMerged = (merged.whatsappPhone || '').toString().trim()
        const finalWhatsapp = whatsappFromMerged || parent || ''

        return {
          ...merged,
          whatsappPhone: finalWhatsapp,
          hasWhatsapp: !!finalWhatsapp,
          lastUpdatedAt: new Date()
        }
      })
    })),

  deleteStudents: (studentIds) =>
    set((state) => ({
      students: state.students.filter(
        (student) => !studentIds.includes(student.id)
      )
    })),

  enterDeleteMode: () =>
    set({
      isDeleteMode: true,
      selectedStudentsForDeletion: []
    }),

  exitDeleteMode: () =>
    set({
      isDeleteMode: false,
      selectedStudentsForDeletion: []
    }),

  toggleStudentForDeletion: (studentId) =>
    set((state) => ({
      selectedStudentsForDeletion: state.selectedStudentsForDeletion.includes(
        studentId
      )
        ? state.selectedStudentsForDeletion.filter((id) => id !== studentId)
        : [...state.selectedStudentsForDeletion, studentId]
    })),

  selectAllStudentsForDeletion: () => {
    const filteredStudents = get().getFilteredStudents()
    set({
      selectedStudentsForDeletion: filteredStudents.map((student) => student.id)
    })
  },

  clearSelectedStudentsForDeletion: () =>
    set({
      selectedStudentsForDeletion: []
    }),

  openDeleteModal: () =>
    set({
      isDeleteModalOpen: true
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false
    }),

  confirmDeleteSelectedStudents: () => {
    const { selectedStudentsForDeletion } = get()
    if (selectedStudentsForDeletion.length === 0) return

    // Open the modal instead of direct deletion
    get().openDeleteModal()
  },

  executeDeleteSelectedStudents: () => {
    const { selectedStudentsForDeletion } = get()
    if (selectedStudentsForDeletion.length > 0) {
      get().deleteStudents(selectedStudentsForDeletion)
      get().exitDeleteMode()
      get().closeDeleteModal()
    }
  },

  openExportModal: () =>
    set({
      isExportModalOpen: true
    }),

  closeExportModal: () =>
    set({
      isExportModalOpen: false
    }),

  getFilteredStudents: () => {
    const { students, filters } = get()

    return students.filter((student) => {
      // Age range filter
      if (
        student.age < filters.ageRange[0] ||
        student.age > filters.ageRange[1]
      ) {
        return false
      }

      // Status filter
      if (
        filters.status.length > 0 &&
        !filters.status.includes(student.status)
      ) {
        return false
      }

      // Paid filter
      if (filters.paidFilter === 'paid' && !student.paid) return false
      if (filters.paidFilter === 'unpaid' && student.paid) return false

      // Study groups filter
      if (filters.studyGroups.length > 0) {
        // filters.studyGroups stores group ids (or an empty string ('') for No Group).
        // Students store the group name in student.group, so for non-empty ids we
        // need to look up the group name by id from the store's studyGroups.
        const selected = filters.studyGroups
        const hasMatch = selected.some((sel) => {
          if (sel === '') {
            return !student.group || (typeof student.group === 'string' && student.group.trim() === '')
          }
          const grp = get().studyGroups.find((g) => g.id === sel)
          const groupName = grp ? grp.name : null
          return groupName ? student.group === groupName : false
        })
        if (!hasMatch) return false
      }

      // Date range filter
      if (filters.dateRange[0] && student.createdAt < filters.dateRange[0])
        return false
      if (filters.dateRange[1] && student.createdAt > filters.dateRange[1])
        return false

      // Updated date range filter (by lastUpdatedAt)
      if (filters.updatedDateRange[0] && student.lastUpdatedAt < filters.updatedDateRange[0])
        return false
      if (filters.updatedDateRange[1] && student.lastUpdatedAt > filters.updatedDateRange[1])
        return false

      // Search query filter
      if (
        filters.searchQuery &&
        !(`${student.childName} ${student.parentName}`.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      ) {
        return false
      }

      // Phone search filter
      if (filters.phoneQuery) {
        const queryDigits = getPhoneDigits(filters.phoneQuery.toLowerCase())
        const phoneDigits = getPhoneDigits(student.parentPhone.toLowerCase())
        const phoneOriginal = student.parentPhone.toLowerCase()
        const queryOriginal = filters.phoneQuery.toLowerCase()

        const matches =
          phoneDigits.includes(queryDigits) ||
          phoneOriginal.includes(queryOriginal) ||
          student.parentPhone
            .replace(/[^\d+]/g, '')
            .toLowerCase()
            .includes(filters.phoneQuery.replace(/[^\d+]/g, '').toLowerCase())

        if (!matches) {
          return false
        }
      }

      return true
    })
  },

  getPaginatedStudents: () => {
    const { currentPage, itemsPerPage } = get()
    const filteredStudents = get().getFilteredStudents()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredStudents.slice(startIndex, endIndex)
  },

  getTotalPages: () => {
    const { itemsPerPage } = get()
    const filteredStudents = get().getFilteredStudents()
    return Math.ceil(filteredStudents.length / itemsPerPage)
  }
}))


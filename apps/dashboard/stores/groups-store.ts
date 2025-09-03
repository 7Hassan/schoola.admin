import { create } from 'zustand'
import { SessionTime, SessionTimeHelper } from '@/utils/date-utils'

export type GroupStatus = 'active' | 'completed' | 'canceled'
export type SubscriptionType = 'monthly' | 'level'
// Removed SubscriptionStatus - no longer needed
export type Currency = 'egp' | 'usd'
export type UserRole = 'admin' | 'super-admin'

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
}

export interface Course {
  id: string
  name: string
  level: string
  description: string
}

export interface Location {
  id: string
  name: string
  address: string
  type: 'onsite' | 'online'
}

export interface TeacherLectureAssignment {
  lectureNumber: number
  teacherId: string
  status:
    | 'scheduled'
    | 'completed'
    | 'current'
    | 'next'
    | 'upcoming'
    | 'dismissed'
  notes?: string
}

export interface Subscription {
  id: string // Unique identifier for each subscription
  type: SubscriptionType
  cost: {
    amount: number
    currency: Currency
  }
  numberOfLecturesIncluded: number // Renamed from numberOfLectures for clarity
}

export interface Group {
  id: string
  // Basic info
  name: string // Auto-generated based on naming convention
  createdAt: Date
  updatedAt: Date

  // Course schedule dates (derived from sessions)
  startDate: Date
  endDate: Date

  // Teachers and courses
  teachers: string[] // Teacher IDs
  courses: string[] // Course IDs

  // Capacity and location
  capacityLimit: number
  currentEnrollment: number // Current number of enrolled students
  location: string // Location ID
  status: GroupStatus

  // Sessions (replaces basic schedule with detailed timing)
  sessions: SessionTime[]

  // Lectures
  totalLectures: number
  currentLectureNumber: number
  upcomingLectureNumber: number

  // Teacher-Lecture Assignments
  teacherAssignments: TeacherLectureAssignment[]

  // Subscriptions - can have max one monthly and one level
  subscriptions: Subscription[]

  // Calculated price (total cost)
  price: {
    amount: number
    currency: Currency
  }
}

export interface GroupFilters {
  searchQuery: string
  status: GroupStatus[]
  teachers: string[]
  courses: string[]
  locations: string[]
  subscriptionType: SubscriptionType[]
  // Removed subscriptionStatus since we're removing status from subscriptions
  dateRange: [Date | null, Date | null]
  capacityRange: [number, number]
  lectureRange: [number, number]
}

interface GroupsStore {
  groups: Group[]
  teachers: Teacher[]
  courses: Course[]
  locations: Location[]
  filters: GroupFilters
  selectedGroup: Group | null
  isDrawerOpen: boolean
  isAddMode: boolean
  currentPage: number
  itemsPerPage: number
  userRole: UserRole
  isDeleteMode: boolean
  selectedGroupsForDeletion: string[]
  isDeleteModalOpen: boolean
  isExportModalOpen: boolean

  // Actions
  setGroups: (groups: Group[]) => void
  setTeachers: (teachers: Teacher[]) => void
  setCourses: (courses: Course[]) => void
  setLocations: (locations: Location[]) => void
  updateFilters: (filters: Partial<GroupFilters>) => void
  setSelectedGroup: (group: Group | null) => void
  setDrawerOpen: (open: boolean) => void
  setAddMode: (isAdd: boolean) => void
  addGroup: (
    group: Omit<
      Group,
      'id' | 'name' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate'
    >
  ) => void
  updateGroup: (id: string, updates: Partial<Group>) => void
  deleteGroups: (groupIds: string[]) => void

  // Subscription Management
  addSubscription: (
    groupId: string,
    subscription: Omit<Subscription, 'id'>
  ) => void
  updateSubscription: (
    groupId: string,
    subscriptionId: string,
    updates: Partial<Omit<Subscription, 'id'>>
  ) => void
  deleteSubscription: (groupId: string, subscriptionId: string) => void
  getGroupSubscriptions: (groupId: string) => Subscription[]
  hasSubscriptionType: (groupId: string, type: SubscriptionType) => boolean
  openAddDrawer: () => void
  openEditDrawer: (group: Group) => void
  closeDrawer: () => void
  setCurrentPage: (page: number) => void
  setUserRole: (role: UserRole) => void
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  toggleGroupForDeletion: (groupId: string) => void
  selectAllGroupsForDeletion: () => void
  clearSelectedGroupsForDeletion: () => void
  openDeleteModal: () => void
  closeDeleteModal: () => void
  confirmDeleteSelectedGroups: () => void
  executeDeleteSelectedGroups: () => void
  openExportModal: () => void
  closeExportModal: () => void

  // Teacher Assignment Management
  updateTeacherAssignment: (
    groupId: string,
    lectureNumber: number,
    teacherId: string,
    status?: TeacherLectureAssignment['status'],
    notes?: string
  ) => void
  bulkUpdateTeacherAssignments: (
    groupId: string,
    assignments: Partial<TeacherLectureAssignment>[]
  ) => void
  getTeacherAssignments: (groupId: string) => TeacherLectureAssignment[]
  getAssignmentsByTeacher: (
    groupId: string,
    teacherId: string
  ) => TeacherLectureAssignment[]

  // Computed
  getFilteredGroups: () => Group[]
  getPaginatedGroups: () => Group[]
  getTotalPages: () => number
  calculateTotalPrice: (subscriptions: Subscription[]) => {
    amount: number
    currency: Currency
  }
}

const defaultFilters: GroupFilters = {
  searchQuery: '',
  status: [],
  teachers: [],
  courses: [],
  locations: [],
  subscriptionType: [],
  dateRange: [null, null],
  capacityRange: [1, 100],
  lectureRange: [1, 50]
}

// Mock data
const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@school.com',
    phone: '+20 123 456 7890',
    specialization: 'Mathematics'
  },
  {
    id: '2',
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1 555 123 4567',
    specialization: 'Computer Science'
  },
  {
    id: '3',
    name: 'Dr. Mohammed Al-Rashid',
    email: 'mohammed.rashid@school.com',
    phone: '+966 50 123 4567',
    specialization: 'Physics'
  },
  {
    id: '4',
    name: 'Ms. Emily Davis',
    email: 'emily.davis@school.com',
    phone: '+44 20 7123 4567',
    specialization: 'English Literature'
  }
]

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Advanced Python Programming',
    level: 'Advanced',
    description: 'Comprehensive Python course covering advanced concepts'
  },
  {
    id: '2',
    name: 'Web Development Fundamentals',
    level: 'Beginner',
    description: 'Introduction to HTML, CSS, and JavaScript'
  },
  {
    id: '3',
    name: 'Data Science with Python',
    level: 'Intermediate',
    description: 'Data analysis and machine learning with Python'
  },
  {
    id: '4',
    name: 'Mobile App Development',
    level: 'Intermediate',
    description: 'Building mobile applications for iOS and Android'
  },
  {
    id: '5',
    name: 'Mathematics for Programming',
    level: 'Beginner',
    description: 'Essential mathematics concepts for programmers'
  }
]

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown Campus',
    address: '123 Tech Street, Cairo, Egypt',
    type: 'onsite'
  },
  {
    id: '2',
    name: 'Virtual Classroom A',
    address: 'Online Platform',
    type: 'online'
  },
  {
    id: '3',
    name: 'Maadi Branch',
    address: '456 Learning Avenue, Maadi, Cairo, Egypt',
    type: 'onsite'
  },
  {
    id: '4',
    name: 'Alexandria Hub',
    address: '789 Innovation Road, Alexandria, Egypt',
    type: 'onsite'
  }
]

const mockGroups: Group[] = [
  {
    id: '1',
    name: '2024-01-15_2024-04-15_python_programming_data_analysis_20lectures',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    teachers: ['1', '2'],
    courses: ['1', '3'],
    capacityLimit: 25,
    currentEnrollment: 18,
    location: '1',
    status: 'active',
    sessions: [
      {
        id: 'session_1_1',
        day: 'Sunday',
        startTime: SessionTimeHelper.createTodayTime(9, 0),
        endTime: SessionTimeHelper.createTodayTime(11, 0)
      },
      {
        id: 'session_1_2',
        day: 'Tuesday',
        startTime: SessionTimeHelper.createTodayTime(14, 0),
        endTime: SessionTimeHelper.createTodayTime(16, 0)
      }
    ],
    totalLectures: 20,
    currentLectureNumber: 8,
    upcomingLectureNumber: 9,
    teacherAssignments: [
      { lectureNumber: 1, teacherId: '1', status: 'completed' },
      { lectureNumber: 2, teacherId: '2', status: 'completed' },
      { lectureNumber: 3, teacherId: '1', status: 'completed' },
      { lectureNumber: 4, teacherId: '2', status: 'completed' },
      { lectureNumber: 5, teacherId: '1', status: 'completed' },
      { lectureNumber: 6, teacherId: '2', status: 'completed' },
      { lectureNumber: 7, teacherId: '1', status: 'completed' },
      { lectureNumber: 8, teacherId: '2', status: 'completed' },
      { lectureNumber: 9, teacherId: '1', status: 'current' },
      { lectureNumber: 10, teacherId: '2', status: 'next' },
      { lectureNumber: 11, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 12, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 13, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 14, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 15, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 16, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 17, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 18, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 19, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 20, teacherId: '2', status: 'upcoming' }
    ],
    subscriptions: [
      {
        id: 'sub_1_level',
        type: 'level',
        cost: {
          amount: 5000,
          currency: 'egp'
        },
        numberOfLecturesIncluded: 20
      }
    ],
    price: {
      amount: 5000,
      currency: 'egp'
    }
  },
  {
    id: '2',
    name: '2024-02-20_2024-06-20_web_development_16lectures',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-11-28'),
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-06-20'),
    teachers: ['3'],
    courses: ['2'],
    capacityLimit: 30,
    currentEnrollment: 22,
    location: '2',
    status: 'active',
    sessions: [
      {
        id: 'session_2_1',
        day: 'Monday',
        startTime: SessionTimeHelper.createTodayTime(10, 0),
        endTime: SessionTimeHelper.createTodayTime(12, 0)
      },
      {
        id: 'session_2_2',
        day: 'Wednesday',
        startTime: SessionTimeHelper.createTodayTime(15, 30),
        endTime: SessionTimeHelper.createTodayTime(17, 30)
      }
    ],
    totalLectures: 16,
    currentLectureNumber: 5,
    upcomingLectureNumber: 6,
    teacherAssignments: [
      { lectureNumber: 1, teacherId: '3', status: 'completed' },
      { lectureNumber: 2, teacherId: '3', status: 'completed' },
      { lectureNumber: 3, teacherId: '3', status: 'completed' },
      { lectureNumber: 4, teacherId: '3', status: 'completed' },
      { lectureNumber: 5, teacherId: '3', status: 'completed' },
      { lectureNumber: 6, teacherId: '3', status: 'current' },
      { lectureNumber: 7, teacherId: '3', status: 'next' },
      { lectureNumber: 8, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 9, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 10, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 11, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 12, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 13, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 14, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 15, teacherId: '3', status: 'upcoming' },
      { lectureNumber: 16, teacherId: '3', status: 'upcoming' }
    ],
    subscriptions: [
      {
        id: 'sub_2_monthly',
        type: 'monthly',
        cost: {
          amount: 800,
          currency: 'egp'
        },
        numberOfLecturesIncluded: 8
      }
    ],
    price: {
      amount: 1600,
      currency: 'egp'
    }
  },
  {
    id: '3',
    name: '2024-03-10_2024-07-10_data_analysis_mathematics_40lectures',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-02'),
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-07-10'),
    teachers: ['1', '2'],
    courses: ['3', '5'],
    capacityLimit: 20,
    currentEnrollment: 15,
    location: '3',
    status: 'active',
    sessions: [
      {
        id: 'session_3_1',
        day: 'Sunday',
        startTime: SessionTimeHelper.createTodayTime(16, 0),
        endTime: SessionTimeHelper.createTodayTime(18, 0)
      },
      {
        id: 'session_3_2',
        day: 'Thursday',
        startTime: SessionTimeHelper.createTodayTime(9, 0),
        endTime: SessionTimeHelper.createTodayTime(11, 30)
      }
    ],
    totalLectures: 40,
    currentLectureNumber: 15,
    upcomingLectureNumber: 16,
    teacherAssignments: [
      // First 15 lectures (completed)
      { lectureNumber: 1, teacherId: '1', status: 'completed' },
      { lectureNumber: 2, teacherId: '2', status: 'completed' },
      { lectureNumber: 3, teacherId: '1', status: 'completed' },
      { lectureNumber: 4, teacherId: '2', status: 'completed' },
      { lectureNumber: 5, teacherId: '1', status: 'completed' },
      { lectureNumber: 6, teacherId: '2', status: 'completed' },
      { lectureNumber: 7, teacherId: '1', status: 'completed' },
      { lectureNumber: 8, teacherId: '2', status: 'completed' },
      { lectureNumber: 9, teacherId: '1', status: 'completed' },
      { lectureNumber: 10, teacherId: '2', status: 'completed' },
      { lectureNumber: 11, teacherId: '1', status: 'completed' },
      { lectureNumber: 12, teacherId: '2', status: 'completed' },
      { lectureNumber: 13, teacherId: '1', status: 'completed' },
      { lectureNumber: 14, teacherId: '2', status: 'completed' },
      { lectureNumber: 15, teacherId: '1', status: 'completed' },
      // Current and upcoming lectures
      { lectureNumber: 16, teacherId: '2', status: 'current' },
      { lectureNumber: 17, teacherId: '1', status: 'next' },
      { lectureNumber: 18, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 19, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 20, teacherId: '2', status: 'upcoming' },
      // Continue alternating pattern for remaining lectures
      { lectureNumber: 21, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 22, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 23, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 24, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 25, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 26, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 27, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 28, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 29, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 30, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 31, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 32, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 33, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 34, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 35, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 36, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 37, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 38, teacherId: '2', status: 'upcoming' },
      { lectureNumber: 39, teacherId: '1', status: 'upcoming' },
      { lectureNumber: 40, teacherId: '2', status: 'upcoming' }
    ],
    subscriptions: [
      {
        id: 'sub_3_level',
        type: 'level',
        cost: {
          amount: 300,
          currency: 'usd'
        },
        numberOfLecturesIncluded: 40
      }
    ],
    price: {
      amount: 300,
      currency: 'usd'
    }
  },
  {
    id: '4',
    name: '2024-04-05_2024-06-28_mobile_development_12lectures',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-11-30'),
    startDate: new Date('2024-04-05'),
    endDate: new Date('2024-06-28'),
    teachers: ['4'],
    courses: ['4'],
    capacityLimit: 15,
    currentEnrollment: 15,
    location: '4',
    status: 'completed',
    sessions: [
      {
        id: 'session_4_1',
        day: 'Tuesday',
        startTime: SessionTimeHelper.createTodayTime(13, 0),
        endTime: SessionTimeHelper.createTodayTime(15, 0)
      }
    ],
    totalLectures: 12,
    currentLectureNumber: 12,
    upcomingLectureNumber: 12,
    teacherAssignments: [
      { lectureNumber: 1, teacherId: '4', status: 'completed' },
      { lectureNumber: 2, teacherId: '4', status: 'completed' },
      { lectureNumber: 3, teacherId: '4', status: 'completed' },
      { lectureNumber: 4, teacherId: '4', status: 'completed' },
      { lectureNumber: 5, teacherId: '4', status: 'completed' },
      { lectureNumber: 6, teacherId: '4', status: 'completed' },
      { lectureNumber: 7, teacherId: '4', status: 'completed' },
      { lectureNumber: 8, teacherId: '4', status: 'completed' },
      { lectureNumber: 9, teacherId: '4', status: 'completed' },
      { lectureNumber: 10, teacherId: '4', status: 'completed' },
      { lectureNumber: 11, teacherId: '4', status: 'completed' },
      { lectureNumber: 12, teacherId: '4', status: 'completed' }
    ],
    subscriptions: [
      {
        id: 'sub_4_level',
        type: 'level',
        cost: {
          amount: 2500,
          currency: 'egp'
        },
        numberOfLecturesIncluded: 12
      }
    ],
    price: {
      amount: 2500,
      currency: 'egp'
    }
  },
  {
    id: '5',
    name: '2024-05-12_2024-11-12_mathematics_24lectures',
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-12-03'),
    startDate: new Date('2024-05-12'),
    endDate: new Date('2024-11-12'),
    teachers: ['1'],
    courses: ['5'],
    capacityLimit: 35,
    currentEnrollment: 8,
    location: '1',
    status: 'canceled',
    sessions: [], // No sessions for canceled group
    totalLectures: 24,
    currentLectureNumber: 3,
    upcomingLectureNumber: 4,
    teacherAssignments: [
      { lectureNumber: 1, teacherId: '1', status: 'completed' },
      { lectureNumber: 2, teacherId: '1', status: 'completed' },
      { lectureNumber: 3, teacherId: '1', status: 'completed' },
      {
        lectureNumber: 4,
        teacherId: '1',
        status: 'dismissed',
        notes: 'Group cancelled due to low enrollment'
      },
      { lectureNumber: 5, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 6, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 7, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 8, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 9, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 10, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 11, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 12, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 13, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 14, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 15, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 16, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 17, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 18, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 19, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 20, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 21, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 22, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 23, teacherId: '1', status: 'dismissed' },
      { lectureNumber: 24, teacherId: '1', status: 'dismissed' }
    ],
    subscriptions: [
      {
        id: 'sub_5_monthly',
        type: 'monthly',
        cost: {
          amount: 600,
          currency: 'egp'
        },
        numberOfLecturesIncluded: 12
      }
    ],
    price: {
      amount: 1200,
      currency: 'egp'
    }
  }
]

const generateId = () => Math.random().toString(36).substr(2, 9)

// Utility functions for date derivation from sessions
const getGroupStartDate = (sessions: SessionTime[]): Date => {
  if (sessions.length === 0) return new Date()
  return sessions.reduce(
    (earliest, session) =>
      session.startTime < earliest ? session.startTime : earliest,
    sessions[0]!.startTime
  )
}

const getGroupEndDate = (sessions: SessionTime[]): Date => {
  if (sessions.length === 0) return new Date()
  return sessions.reduce(
    (latest, session) => (session.endTime > latest ? session.endTime : latest),
    sessions[0]!.endTime
  )
}

// Helper function to generate group name based on naming convention
const generateGroupName = (
  sessions: SessionTime[],
  courseIds: string[],
  totalLectures: number,
  courses: Course[]
): string => {
  if (sessions.length === 0) {
    return 'New Group'
  }

  // Helper function to abbreviate day names
  const abbreviateDay = (day: string): string => {
    const dayAbbr: Record<string, string> = {
      Sunday: 'Sun',
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu'
    }
    return dayAbbr[day] || day.slice(0, 3)
  }

  // Helper function to format time to 12-hour format
  const formatTime = (date: Date): string => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${ampm}`
  }

  // Sort sessions by day of week for consistent ordering
  const dayOrder: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4
  }

  const sortedSessions = [...sessions].sort((a, b) => {
    const orderA = dayOrder[a.day] ?? 999
    const orderB = dayOrder[b.day] ?? 999
    return orderA - orderB
  })

  if (sortedSessions.length === 1) {
    // Single session: "Sun [ 2:30 AM - 3:30 AM ]"
    const session = sortedSessions[0]
    if (!session) return 'New Group'

    const dayAbbr = abbreviateDay(session.day)
    const startTime = formatTime(session.startTime)
    const endTime = formatTime(session.endTime)
    return `${dayAbbr} [ ${startTime} - ${endTime} ]`
  } else if (sortedSessions.length === 2) {
    // Two sessions: "Sun [ 2:30 AM - 3:30 AM ] ~ Thu [ 5:40 PM - 6:40 PM ]"
    const session1 = sortedSessions[0]
    const session2 = sortedSessions[1]

    if (!session1 || !session2) return 'New Group'

    const day1Abbr = abbreviateDay(session1.day)
    const start1Time = formatTime(session1.startTime)
    const end1Time = formatTime(session1.endTime)

    const day2Abbr = abbreviateDay(session2.day)
    const start2Time = formatTime(session2.startTime)
    const end2Time = formatTime(session2.endTime)

    return `${day1Abbr} [ ${start1Time} - ${end1Time} ] ~ ${day2Abbr} [ ${start2Time} - ${end2Time} ]`
  } else {
    // Multiple sessions (>2): "Multiple (3 Sessions)"
    return `Multiple (${sortedSessions.length} Sessions)`
  }
}

export const useGroupsStore = create<GroupsStore>((set, get) => ({
  groups: mockGroups,
  teachers: mockTeachers,
  courses: mockCourses,
  locations: mockLocations,
  filters: defaultFilters,
  selectedGroup: null,
  isDrawerOpen: false,
  isAddMode: false,
  currentPage: 1,
  itemsPerPage: 12,
  userRole: 'admin',
  isDeleteMode: false,
  selectedGroupsForDeletion: [],
  isDeleteModalOpen: false,
  isExportModalOpen: false,

  setGroups: (groups: Group[]) => set({ groups }),
  setTeachers: (teachers: Teacher[]) => set({ teachers }),
  setCourses: (courses: Course[]) => set({ courses }),
  setLocations: (locations: Location[]) => set({ locations }),
  updateFilters: (newFilters: Partial<GroupFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1 // Reset to first page when filters change
    })),
  setSelectedGroup: (selectedGroup: Group | null) => set({ selectedGroup }),
  setDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
  setAddMode: (isAddMode: boolean) => set({ isAddMode }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
  setUserRole: (userRole: UserRole) => set({ userRole }),

  openAddDrawer: () =>
    set({
      isDrawerOpen: true,
      isAddMode: true,
      selectedGroup: null
    }),

  openEditDrawer: (group: Group) =>
    set({
      isDrawerOpen: true,
      isAddMode: false,
      selectedGroup: group
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      isAddMode: false,
      selectedGroup: null
    }),

  calculateTotalPrice: (subscriptions: Subscription[]) => {
    if (!subscriptions || subscriptions.length === 0) {
      return { amount: 0, currency: 'egp' }
    }

    // Calculate total price from all subscriptions
    // For now, assume all subscriptions use same currency (take from first one)
    const currency = subscriptions[0]?.cost.currency || 'egp'
    let totalAmount = 0

    subscriptions.forEach((subscription: Subscription) => {
      if (subscription.type === 'monthly') {
        // For monthly: cost per month * number of months needed
        const monthsNeeded = Math.ceil(
          subscription.numberOfLecturesIncluded / 4
        ) // Assuming 4 lectures per month
        totalAmount += subscription.cost.amount * monthsNeeded
      } else {
        // For level: fixed cost regardless of lectures
        totalAmount += subscription.cost.amount
      }
    })

    return {
      amount: totalAmount,
      currency: currency
    }
  },

  addGroup: (
    groupData: Omit<
      Group,
      'id' | 'name' | 'createdAt' | 'updatedAt' | 'startDate' | 'endDate'
    >
  ) => {
    const { courses } = get()
    const name = generateGroupName(
      groupData.sessions,
      groupData.courses,
      groupData.totalLectures,
      courses
    )

    // Derive start and end dates from sessions
    const startDate = getGroupStartDate(groupData.sessions)
    const endDate = getGroupEndDate(groupData.sessions)

    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name,
      ...groupData,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      price: get().calculateTotalPrice(groupData.subscriptions)
    }

    set((state) => ({
      groups: [...state.groups, newGroup],
      isDrawerOpen: false,
      isAddMode: false,
      selectedGroup: null
    }))
  },

  updateGroup: (id: string, updates: Partial<Group>) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id === id) {
          const updatedGroup = {
            ...group,
            ...updates,
            updatedAt: new Date()
          }

          // Update derived dates if sessions changed
          if (updates.sessions) {
            updatedGroup.startDate = getGroupStartDate(updatedGroup.sessions)
            updatedGroup.endDate = getGroupEndDate(updatedGroup.sessions)
          }

          // Recalculate price if subscriptions changed
          if (updates.subscriptions) {
            updatedGroup.price = get().calculateTotalPrice(
              updatedGroup.subscriptions
            )
          }

          // Regenerate name if relevant fields changed
          const needsNameUpdate =
            updates.sessions || updates.courses || updates.totalLectures
          if (needsNameUpdate) {
            const { courses } = get()
            updatedGroup.name = generateGroupName(
              updatedGroup.sessions,
              updatedGroup.courses,
              updatedGroup.totalLectures,
              courses
            )
          }

          return updatedGroup
        }
        return group
      })
    })),

  deleteGroups: (groupIds: string[]) =>
    set((state) => ({
      groups: state.groups.filter((group) => !groupIds.includes(group.id))
    })),

  // Subscription Management
  addSubscription: (groupId: string, subscription: Omit<Subscription, 'id'>) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id === groupId) {
          // Check if subscription type already exists
          const hasType = group.subscriptions.some(
            (sub) => sub.type === subscription.type
          )
          if (hasType) {
            console.warn(
              `Group already has a ${subscription.type} subscription`
            )
            return group
          }

          // Add new subscription
          const newSubscription: Subscription = {
            id: `sub_${groupId}_${subscription.type}_${Date.now()}`,
            ...subscription
          }

          const updatedGroup = {
            ...group,
            subscriptions: [...group.subscriptions, newSubscription],
            updatedAt: new Date()
          }

          // Recalculate total price
          updatedGroup.price = get().calculateTotalPrice(
            updatedGroup.subscriptions
          )
          return updatedGroup
        }
        return group
      })
    })),

  updateSubscription: (
    groupId: string,
    subscriptionId: string,
    updates: Partial<Omit<Subscription, 'id'>>
  ) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id === groupId) {
          const updatedGroup = {
            ...group,
            subscriptions: group.subscriptions.map((sub) => {
              if (sub.id === subscriptionId) {
                return { ...sub, ...updates }
              }
              return sub
            }),
            updatedAt: new Date()
          }

          // Recalculate total price
          updatedGroup.price = get().calculateTotalPrice(
            updatedGroup.subscriptions
          )
          return updatedGroup
        }
        return group
      })
    })),

  deleteSubscription: (groupId: string, subscriptionId: string) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id === groupId) {
          const updatedGroup = {
            ...group,
            subscriptions: group.subscriptions.filter(
              (sub) => sub.id !== subscriptionId
            ),
            updatedAt: new Date()
          }

          // Recalculate total price
          updatedGroup.price = get().calculateTotalPrice(
            updatedGroup.subscriptions
          )
          return updatedGroup
        }
        return group
      })
    })),

  getGroupSubscriptions: (groupId: string) => {
    const group = get().groups.find((g) => g.id === groupId)
    return group?.subscriptions || []
  },

  hasSubscriptionType: (groupId: string, type: SubscriptionType) => {
    const group = get().groups.find((g) => g.id === groupId)
    return group?.subscriptions.some((sub) => sub.type === type) || false
  },

  enterDeleteMode: () =>
    set({
      isDeleteMode: true,
      selectedGroupsForDeletion: []
    }),

  exitDeleteMode: () =>
    set({
      isDeleteMode: false,
      selectedGroupsForDeletion: []
    }),

  toggleGroupForDeletion: (groupId: string) =>
    set((state) => ({
      selectedGroupsForDeletion: state.selectedGroupsForDeletion.includes(
        groupId
      )
        ? state.selectedGroupsForDeletion.filter((id) => id !== groupId)
        : [...state.selectedGroupsForDeletion, groupId]
    })),

  selectAllGroupsForDeletion: () => {
    const filteredGroups = get().getFilteredGroups()
    set({
      selectedGroupsForDeletion: filteredGroups.map((group) => group.id)
    })
  },

  clearSelectedGroupsForDeletion: () =>
    set({
      selectedGroupsForDeletion: []
    }),

  openDeleteModal: () =>
    set({
      isDeleteModalOpen: true
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false
    }),

  confirmDeleteSelectedGroups: () => {
    const { selectedGroupsForDeletion } = get()
    if (selectedGroupsForDeletion.length === 0) return

    get().openDeleteModal()
  },

  executeDeleteSelectedGroups: () => {
    const { selectedGroupsForDeletion } = get()
    if (selectedGroupsForDeletion.length > 0) {
      get().deleteGroups(selectedGroupsForDeletion)
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

  // Teacher Assignment Management
  updateTeacherAssignment: (
    groupId: string,
    lectureNumber: number,
    teacherId: string,
    status?: TeacherLectureAssignment['status'],
    notes?: string
  ) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id === groupId) {
          const updatedAssignments = group.teacherAssignments.map(
            (assignment) => {
              if (assignment.lectureNumber === lectureNumber) {
                return {
                  ...assignment,
                  teacherId,
                  ...(status && { status }),
                  ...(notes !== undefined && { notes })
                }
              }
              return assignment
            }
          )

          // If assignment doesn't exist, create it
          if (
            !group.teacherAssignments.find(
              (a) => a.lectureNumber === lectureNumber
            )
          ) {
            updatedAssignments.push({
              lectureNumber,
              teacherId,
              status: status || 'scheduled',
              ...(notes && { notes })
            })
          }

          return {
            ...group,
            teacherAssignments: updatedAssignments,
            updatedAt: new Date()
          }
        }
        return group
      })
    })),

  bulkUpdateTeacherAssignments: (
    groupId: string,
    assignments: Partial<TeacherLectureAssignment>[]
  ) =>
    set((state) => ({
      groups: state.groups.map((group) => {
        if (group.id === groupId) {
          let updatedAssignments = [...group.teacherAssignments]

          assignments.forEach((update) => {
            if (update.lectureNumber !== undefined) {
              const existingIndex = updatedAssignments.findIndex(
                (a) => a.lectureNumber === update.lectureNumber
              )

              if (existingIndex >= 0) {
                updatedAssignments[existingIndex] = {
                  ...updatedAssignments[existingIndex],
                  ...update
                } as TeacherLectureAssignment
              } else if (update.teacherId) {
                updatedAssignments.push({
                  lectureNumber: update.lectureNumber,
                  teacherId: update.teacherId,
                  status: update.status || 'scheduled',
                  ...(update.notes && { notes: update.notes })
                })
              }
            }
          })

          return {
            ...group,
            teacherAssignments: updatedAssignments,
            updatedAt: new Date()
          }
        }
        return group
      })
    })),

  getTeacherAssignments: (groupId: string) => {
    const group = get().groups.find((g) => g.id === groupId)
    return group?.teacherAssignments || []
  },

  getAssignmentsByTeacher: (groupId: string, teacherId: string) => {
    const group = get().groups.find((g) => g.id === groupId)
    return (
      group?.teacherAssignments.filter((a) => a.teacherId === teacherId) || []
    )
  },

  getFilteredGroups: () => {
    const { groups, filters } = get()

    return groups.filter((group) => {
      // Search query filter
      if (
        filters.searchQuery &&
        !group.name?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(group.status)) {
        return false
      }

      // Teachers filter
      if (
        filters.teachers.length > 0 &&
        !filters.teachers.some((teacherId) =>
          group.teachers.includes(teacherId)
        )
      ) {
        return false
      }

      // Courses filter
      if (
        filters.courses.length > 0 &&
        !filters.courses.some((courseId) => group.courses.includes(courseId))
      ) {
        return false
      }

      // Locations filter
      if (
        filters.locations.length > 0 &&
        !filters.locations.includes(group.location)
      ) {
        return false
      }

      // Subscription type filter
      if (
        filters.subscriptionType.length > 0 &&
        !filters.subscriptionType.some((type) =>
          group.subscriptions.some((sub) => sub.type === type)
        )
      ) {
        return false
      }

      // Removed subscription status filter since we don't have status anymore

      // Date range filter
      if (filters.dateRange[0] && group.createdAt < filters.dateRange[0])
        return false
      if (filters.dateRange[1] && group.createdAt > filters.dateRange[1])
        return false

      // Capacity range filter
      if (
        group.capacityLimit < filters.capacityRange[0] ||
        group.capacityLimit > filters.capacityRange[1]
      ) {
        return false
      }

      // Lecture range filter
      if (
        group.totalLectures < filters.lectureRange[0] ||
        group.totalLectures > filters.lectureRange[1]
      ) {
        return false
      }

      return true
    })
  },

  getPaginatedGroups: () => {
    const { currentPage, itemsPerPage } = get()
    const filteredGroups = get().getFilteredGroups()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredGroups.slice(startIndex, endIndex)
  },

  getTotalPages: () => {
    const { itemsPerPage } = get()
    const filteredGroups = get().getFilteredGroups()
    return Math.ceil(filteredGroups.length / itemsPerPage)
  }
}))


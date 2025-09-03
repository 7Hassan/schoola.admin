# 📋 **Courses Management Page Implementation Plan**

## 🏗️ **Repository & Dashboard Structure Analysis**

### **Current Architecture:**

- **Monorepo Structure**: Turborepo with shared packages (UI, ESLint, TypeScript configs)
- **Dashboard Framework**: Next.js 15 + Tailwind CSS v4
- **State Management**: Zustand stores for domain entities
- **Component Architecture**: Modular, reusable components following consistent patterns
- **Routing**: Next.js App Router with nested layouts

### **Existing Patterns Identified:**

1. **Stores Pattern**: `stores/{entity}-store.ts` with CRUD operations, filters, pagination
2. **Components Pattern**: `components/{entity}/{entity}-{component}.tsx`
3. **Pages Pattern**: `app/(dashboard)/{entity}/{subpage}/page.tsx`
4. **UI Consistency**: Shared UI components from `@workspace/ui`
5. **Lib Directory**: `lib/` is reserved for third-party app integrations with the dashboard

---

## 🎯 **Implementation Plan**

### **Phase 1: Foundation (Core Infrastructure)**

#### **1.1 Course Store Creation**

**File**: `/apps/dashboard/stores/courses-store.ts`

```typescript
// Following TypeScript guidelines and existing patterns
interface Course {
  id: string
  name: string // Name of course (customer requirement)
  code: string // e.g., "CS-101", "MATH-201"
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string // Description (customer requirement)
  category: string
  duration: number // in weeks
  totalLectures: number
  price: {
    amount: number
    currency: 'egp' | 'usd'
  }
  prerequisites: string[] // Course IDs
  learningObjectives: string[]
  status: 'draft' | 'active' | 'archived'
  createdAt: Date
  lastUpdatedAt: Date

  // Customer Requirements
  validAgeRange: {
    minAge: number
    maxAge: number
  } // Valid Age range (customer requirement)
  materialLinks: MaterialLink[] // Material links (customer requirement)
  notes: string // Notes (customer requirement)

  // Instructor management
  instructors: string[] // Teacher IDs

  // Enrollment tracking
  maxEnrollment: number
  currentEnrollment: number

  // Content structure
  syllabus: CourseSyllabus[]
  resources: CourseResource[]

  // Assessment
  assessmentMethods: AssessmentMethod[]
  gradingScheme: GradingScheme
}

interface MaterialLink {
  id: string
  title: string
  url: string
  type: 'pdf' | 'video' | 'document' | 'link' | 'image'
  description?: string
  isRequired: boolean
  uploadedAt: Date
}

interface CourseSyllabus {
  id: string
  week: number
  title: string
  topics: string[]
  learningOutcomes: string[]
  readings: string[]
  assignments: string[]
}

interface CourseResource {
  id: string
  title: string
  type: 'document' | 'video' | 'link' | 'book'
  url?: string
  description?: string
  isRequired: boolean
}

interface AssessmentMethod {
  id: string
  type: 'exam' | 'assignment' | 'project' | 'participation' | 'quiz'
  weight: number // percentage
  description: string
}

interface GradingScheme {
  scale: 'letter' | 'percentage' | 'pass-fail'
  thresholds: { grade: string; minPercentage: number }[]
}

// Store implementation following groups-store pattern
interface CoursesStore {
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

  // CRUD Operations
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourses: (courseIds: string[]) => void

  // UI State Management
  openEditDrawer: (course: Course) => void
  closeEditDrawer: () => void

  // Filtering & Pagination
  updateFilters: (filters: Partial<CourseFilters>) => void
  getFilteredCourses: () => Course[]
  getPaginatedCourses: () => Course[]
  getTotalPages: () => number
}
```

#### **1.2 Course Category & Prerequisites Management**

```typescript
interface CourseCategory {
  id: string
  name: string
  description: string
  color: string
  parentId?: string // For hierarchical categories
}

interface CourseFilters {
  searchQuery: string
  categories: string[]
  levels: Course['level'][]
  status: Course['status'][]
  instructors: string[]
  dateRange: [Date | null, Date | null]
  priceRange: [number, number]
  enrollmentRange: [number, number]
  ageRange: [number, number] // Filter by valid age range
}
```

### **Phase 2: UI Components (Following Existing Patterns)**

#### **2.1 Core Course Components**

Following the groups component pattern:

**Files to Create:**

- `/components/courses/courses-dashboard.tsx` (Main container)
- `/components/courses/course-card.tsx` (Individual course display)
- `/components/courses/courses-grid.tsx` (Grid layout)
- `/components/courses/courses-filters.tsx` (Advanced filtering)
- `/components/courses/course-edit-drawer.tsx` (Edit form only)
- `/components/courses/courses-pagination.tsx` (Pagination controls)
- `/components/courses/course-syllabus-manager.tsx` (Syllabus editing)
- `/components/courses/course-resources-manager.tsx` (Resource management)
- `/components/courses/course-material-links-manager.tsx` (Material links management)
- `/components/courses/course-assessment-manager.tsx` (Assessment setup)

#### **2.2 Course Card Enhancement**

```tsx
// Following the group-card.tsx pattern with course-specific features
interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
  isSelected?: boolean
  onSelect?: (courseId: string) => void
}

// Features to include:
// - Course code and name display
// - Category badge with color coding
// - Level indicator
// - Age range display (e.g., "Ages 16-60")
// - Enrollment progress bar
// - Instructor avatars (max 3, then +N)
// - Price display
// - Status indicator
// - Material links count indicator
// - Quick action buttons (Edit, Duplicate, Archive)
```

#### **2.3 Course Edit Drawer**

```tsx
// Edit form for existing courses only
interface CourseEditDrawerProps {
  isOpen: boolean
  onClose: () => void
  course: Course // Required - editing existing course only
}

// Sections:
// 1. Basic Information (name, code, level, category, valid age range)
// 2. Course Details (description, duration, objectives, notes)
// 3. Instructors & Pricing
// 4. Syllabus & Content Structure
// 5. Resources & Material Links
// 6. Assessment & Grading

// Note: Course creation is handled by dedicated /courses/create page
```

### **Phase 3: Page Structure (Following Dashboard Patterns)**

#### **3.1 Course Pages Hierarchy**

```
/app/(dashboard)/courses/
├── page.tsx (redirect to overview)
├── overview/page.tsx (stats + quick actions)
├── management/page.tsx (main CRUD interface)
├── create/page.tsx (comprehensive course creation)
├── categories/page.tsx (category management)
├── reports/page.tsx (analytics & reports)
└── [courseId]/
    ├── page.tsx (course details view)
    ├── edit/page.tsx (course editing)
    ├── syllabus/page.tsx (syllabus management)
    ├── resources/page.tsx (resource management)
    ├── enrollments/page.tsx (student enrollments)
    └── analytics/page.tsx (course analytics)
```

#### **3.2 Overview Page Enhancement**

```tsx
// Replace current basic overview with comprehensive dashboard
interface CourseOverviewMetrics {
  totalCourses: number
  activeCourses: number
  totalInstructors: number
  totalEnrollments: number
  revenueThisMonth: number
  popularCourses: Course[]
  categoriesStats: { category: string; count: number }[]
  enrollmentTrends: { month: string; enrollments: number }[]
}

// Components:
// - Metrics cards with trend indicators
// - Popular courses list
// - Category distribution chart
// - Recent activity feed
// - Quick action buttons
```

#### **3.3 Management Page (Main Interface)**

```tsx
// Following groups-dashboard.tsx pattern exactly
export function CoursesManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with search and actions */}
        <CoursesDashboardHeader />

        {/* Filters */}
        <CoursesFilters />

        {/* Courses grid with pagination */}
        <CoursesGrid />

        {/* Course edit drawer for existing courses */}
        <CourseEditDrawer />

        {/* Modals */}
        <DeleteConfirmationModal />
        <ExportModal />
      </div>
    </div>
  )
}
```

### **Phase 4: Advanced Features**

#### **4.1 Course Templates System**

```typescript
interface CourseTemplate {
  id: string
  name: string
  description: string
  category: string
  defaultSyllabus: CourseSyllabus[]
  defaultResources: CourseResource[]
  defaultAssessments: AssessmentMethod[]
  tags: string[]
}

// Templates for common course types:
// - Programming Fundamentals
// - Web Development
// - Data Science
// - Mobile Development
// - etc.
```

#### **4.2 Prerequisites Management**

```tsx
// Visual prerequisite tree
interface PrerequisiteTreeProps {
  courseId: string
  onUpdate: (prerequisites: string[]) => void
}

// Features:
// - Drag-and-drop prerequisite assignment
// - Prerequisite validation (no circular dependencies)
// - Visual prerequisite tree display
// - Automatic student eligibility checking
```

#### **4.3 Course Analytics Dashboard**

```tsx
// Per-course analytics
interface CourseAnalytics {
  enrollmentHistory: { date: Date; count: number }[]
  completionRate: number
  averageGrade: number
  studentFeedback: { rating: number; comments: string[] }
  resourceUsage: { resourceId: string; accessCount: number }[]
  assessmentPerformance: { assessmentId: string; averageScore: number }[]
}
```

### **Phase 5: Integration & Relationships**

#### **5.1 Groups Integration**

```typescript
// Update groups store to include course relationship validation
interface GroupCourseValidation {
  validateCourseCompatibility: (courseIds: string[]) => boolean
  getCourseDependencies: (courseId: string) => Course[]
  validateInstructorCapacity: (
    instructorIds: string[],
    courseLoad: number
  ) => boolean
}
```

#### **5.2 Students Integration**

```typescript
// Student course eligibility and enrollment
interface StudentCourseEligibility {
  checkPrerequisites: (studentId: string, courseId: string) => boolean
  getEligibleCourses: (studentId: string) => Course[]
  enrollStudent: (studentId: string, courseId: string) => Promise<void>
}
```

#### **5.3 Teachers Integration**

```typescript
// Teacher course assignment and workload management
interface TeacherCourseManagement {
  assignInstructor: (
    teacherId: string,
    courseId: string,
    role: 'primary' | 'assistant'
  ) => void
  calculateWorkload: (teacherId: string) => number
  getInstructorCourses: (teacherId: string) => Course[]
}
```

---

## 🔧 **Technical Implementation Details**

### **Following TypeScript Guidelines:**

1. **Strict Type Safety**: All interfaces with proper generics and constraints
2. **Result Types**: Use `Result<T, E>` pattern for API calls
3. **Schema Validation**: Zod schemas for all forms and API responses
4. **Performance**: React.memo for course cards, useMemo for expensive calculations
5. **Error Boundaries**: Proper error handling throughout

### **Following UI Guidelines:**

1. **Component Consistency**: Use existing UI components from `@workspace/ui`
2. **Layout Patterns**: Match groups/students page layouts exactly
3. **Responsive Design**: Mobile-first approach with existing breakpoints
4. **Loading States**: Skeleton loaders matching existing patterns
5. **Empty States**: Consistent empty state messaging and actions

### **State Management Pattern:**

```typescript
// Following groups-store.ts pattern exactly
const useCoursesStore = create<CoursesStore>()((set, get) => ({
  // Initial state
  courses: mockCourses,
  categories: mockCategories,
  filters: defaultFilters
  // ... rest following groups store pattern exactly
}))
```

**Note**: Store files are located in `/apps/dashboard/stores/` directory, while `/apps/dashboard/lib/` is reserved for third-party integrations.

---

## 📊 **Migration Strategy**

### **Phase 1**: Foundation (Week 1)

- Create courses store with full TypeScript types
- Implement basic CRUD operations
- Create course card component

### **Phase 2**: Core UI (Week 2)

- Implement courses dashboard following groups pattern
- Create course drawer with multi-step form
- Add filtering and pagination

### **Phase 3**: Advanced Features (Week 3)

- Syllabus and resource management
- Assessment configuration
- Course templates system

### **Phase 4**: Integration (Week 4)

- Groups integration for course validation
- Students integration for enrollment
- Teachers integration for assignments

### **Phase 5**: Analytics & Reports (Week 5)

- Course analytics dashboard
- Enrollment reports
- Performance metrics

---

## 🚀 **Detailed Implementation Steps**

### **Step 1: Create Courses Store**

#### **1.1 Basic Store Structure**

```typescript
// /apps/dashboard/stores/courses-store.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
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
  duration: number
  totalLectures: number
  price: {
    amount: number
    currency: Currency
  }
  prerequisites: string[]
  learningObjectives: string[]
  status: CourseStatus
  createdAt: Date
  lastUpdatedAt: Date

  // Customer Requirements
  validAgeRange: {
    minAge: number
    maxAge: number
  } // Valid Age range (customer requirement)
  materialLinks: MaterialLink[] // Material links (customer requirement)
  notes: string // Notes (customer requirement)

  instructors: string[]
  maxEnrollment: number
  currentEnrollment: number
  syllabus: CourseSyllabus[]
  resources: CourseResource[]
  assessmentMethods: AssessmentMethod[]
  gradingScheme: GradingScheme
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

export interface GradingScheme {
  scale: GradingScale
  thresholds: { grade: string; minPercentage: number }[]
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
  instructors: string[]
  dateRange: [Date | null, Date | null]
  priceRange: [number, number]
  enrollmentRange: [number, number]
  ageRange: [number, number] // Filter by valid age range
}

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
  instructors: [],
  dateRange: [null, null],
  priceRange: [0, 10000],
  enrollmentRange: [0, 500],
  ageRange: [5, 25] // Default age range from 5 to 25 years
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
    price: { amount: 2500, currency: 'egp' },
    prerequisites: [],
    learningObjectives: [
      'Understand Python syntax and basic programming concepts',
      'Write simple Python programs',
      'Work with data types and control structures'
    ],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastUpdatedAt: new Date('2024-02-01'),

    // Customer Requirements
    validAgeRange: {
      minAge: 16,
      maxAge: 60
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

    instructors: ['1', '2'],
    maxEnrollment: 30,
    currentEnrollment: 25,
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
      scale: 'letter',
      thresholds: [
        { grade: 'A', minPercentage: 90 },
        { grade: 'B', minPercentage: 80 },
        { grade: 'C', minPercentage: 70 },
        { grade: 'D', minPercentage: 60 },
        { grade: 'F', minPercentage: 0 }
      ]
    }
  }
  // Add more mock courses...
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
              ? { ...course, ...updates, lastUpdatedAt: new Date() }
              : course
          )
        })),

      deleteCourses: (courseIds) =>
        set((state) => ({
          courses: state.courses.filter(
            (course) => !courseIds.includes(course.id)
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

          // Instructors filter
          if (
            filters.instructors.length > 0 &&
            !filters.instructors.some((instructorId) =>
              course.instructors.includes(instructorId)
            )
          ) {
            return false
          }

          // Date range filter
          if (filters.dateRange[0] && course.createdAt < filters.dateRange[0])
            return false
          if (filters.dateRange[1] && course.createdAt > filters.dateRange[1])
            return false

          // Price range filter
          if (
            course.price.amount < filters.priceRange[0] ||
            course.price.amount > filters.priceRange[1]
          ) {
            return false
          }

          // Enrollment range filter
          if (
            course.currentEnrollment < filters.enrollmentRange[0] ||
            course.currentEnrollment > filters.enrollmentRange[1]
          ) {
            return false
          }

          // Age range filter
          if (
            course.validAgeRange.maxAge < filters.ageRange[0] ||
            course.validAgeRange.minAge > filters.ageRange[1]
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
```

### **Step 2: Create Course Components**

#### **2.1 Course Card Component**

```tsx
// /components/courses/course-card.tsx

'use client'

import React from 'react'
import {
  BookOpen,
  Users,
  Clock,
  DollarSign,
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  Star,
  TrendingUp
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Card } from '@workspace/ui/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/ui/dropdown-menu'
import { Progress } from '@workspace/ui/components/ui/progress'
import { useCoursesStore, type Course } from '@/stores/courses-store'
import { useGroupsStore } from '@/stores/groups-store'

interface CourseCardProps {
  course: Course
  isSelected?: boolean
  onSelect?: (courseId: string) => void
}

export function CourseCard({ course, isSelected, onSelect }: CourseCardProps) {
  const { openEditDrawer, userRole } = useCoursesStore()
  const { teachers } = useGroupsStore()

  const categoryColor = useCoursesStore(
    (state) =>
      state.categories.find((cat) => cat.id === course.category)?.color ||
      '#6B7280'
  )

  const enrollmentPercentage =
    (course.currentEnrollment / course.maxEnrollment) * 100

  const courseInstructors = teachers.filter((teacher) =>
    course.instructors.includes(teacher.id)
  )

  const handleEdit = () => {
    openEditDrawer(course)
  }

  const handleDuplicate = () => {
    // Implementation for duplicating course
    console.log('Duplicate course:', course.id)
  }

  const handleArchive = () => {
    // Implementation for archiving course
    console.log('Archive course:', course.id)
  }

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'draft':
        return 'bg-yellow-500'
      case 'archived':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={() => onSelect?.(course.id)}
    >
      {/* Status indicator */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(course.status)}`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor
                }}
              >
                {course.code}
              </Badge>
              <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                {course.level}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {course.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {course.description}
            </p>
          </div>

          {userRole === 'super-admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleArchive}
                  className="text-red-600"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration} weeks
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-1" />
            {course.totalLectures} lectures
          </div>
        </div>

        {/* Enrollment Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Enrollment
            </span>
            <span className="text-sm text-gray-600">
              {course.currentEnrollment}/{course.maxEnrollment}
            </span>
          </div>
          <Progress
            value={enrollmentPercentage}
            className="h-2"
          />
        </div>

        {/* Instructors */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Instructors:</span>
            <div className="flex -space-x-2">
              {courseInstructors.slice(0, 3).map((instructor) => (
                <Avatar
                  key={instructor.id}
                  className="h-6 w-6 border-2 border-white"
                >
                  <AvatarImage src={`/avatars/${instructor.id}.jpg`} />
                  <AvatarFallback className="text-xs">
                    {instructor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {courseInstructors.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{courseInstructors.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-lg font-semibold text-gray-900">
            <DollarSign className="h-4 w-4 mr-1" />
            {course.price.amount} {course.price.currency.toUpperCase()}
          </div>

          <div className="flex items-center gap-2">
            {course.status === 'active' && (
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Active</span>
              </div>
            )}

            {course.currentEnrollment > course.maxEnrollment * 0.8 && (
              <Badge
                variant="secondary"
                className="text-xs"
              >
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
```

### **Step 3: Create Management Page**

#### **3.1 Courses Dashboard Component**

```tsx
// /components/courses/courses-dashboard.tsx

'use client'

import React from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Upload,
  Download,
  Minus,
  X,
  BookOpen,
  Users,
  TrendingUp,
  Archive
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Card } from '@workspace/ui/components/ui/card'
import { useCoursesStore } from '@/stores/courses-store'
import { CourseCard } from './course-card'
import { CourseEditDrawer } from './course-edit-drawer'
import { CoursesFilters } from './courses-filters'
import { CoursesGrid } from './courses-grid'
import { CoursesPagination } from './courses-pagination'
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal'
import { ExportModal } from '../shared/export-modal'
import { formatCoursesForExport } from '@/lib/courses-export-utils'
import Link from 'next/link'

export function CoursesDashboard() {
  const {
    // Data
    courses,
    getFilteredCourses,
    getPaginatedCourses,
    categories,

    // UI State
    isEditDrawerOpen,
    isDeleteMode,
    selectedCoursesForDeletion,
    isDeleteModalOpen,
    isExportModalOpen,
    userRole,

    // Actions
    updateFilters,
    enterDeleteMode,
    exitDeleteMode,
    selectAllCoursesForDeletion,
    clearSelectedCoursesForDeletion,
    openDeleteModal,
    closeDeleteModal,
    openExportModal,
    closeExportModal,
    executeDeleteSelectedCourses
  } = useCoursesStore()

  const filteredCourses = getFilteredCourses()
  const hasSelectedCourses = selectedCoursesForDeletion.length > 0

  const handleSearch = (query: string) => {
    updateFilters({ searchQuery: query })
  }

  const handleBulkExport = () => {
    const coursesToExport = hasSelectedCourses
      ? courses.filter((course) =>
          selectedCoursesForDeletion.includes(course.id)
        )
      : filteredCourses

    openExportModal()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">
            Manage your courses, curriculum, and educational content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/courses/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {courses.filter((c) => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Courses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce(
                  (total, course) => total + course.currentEnrollment,
                  0
                )}
              </p>
              <p className="text-sm text-gray-600">Total Enrollments</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Archive className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses by name, code, or description..."
            className="pl-10"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {!isDeleteMode ? (
            <>
              <CoursesFilters />

              {userRole === 'super-admin' && (
                <>
                  <Button
                    variant="outline"
                    onClick={enterDeleteMode}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Delete
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleBulkExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={exitDeleteMode}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              {hasSelectedCourses && (
                <>
                  <Button
                    variant="outline"
                    onClick={selectAllCoursesForDeletion}
                  >
                    Select All ({filteredCourses.length})
                  </Button>

                  <Button
                    variant="outline"
                    onClick={clearSelectedCoursesForDeletion}
                  >
                    Clear Selection
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={openDeleteModal}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Delete ({selectedCoursesForDeletion.length})
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <CoursesGrid />

      {/* Pagination */}
      <CoursesPagination />

      {/* Modals */}
      <CourseEditDrawer />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDeleteSelectedCourses}
        title="Delete Courses"
        description={`Are you sure you want to delete ${selectedCoursesForDeletion.length} course(s)? This action cannot be undone.`}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={formatCoursesForExport(
          hasSelectedCourses
            ? courses.filter((course) =>
                selectedCoursesForDeletion.includes(course.id)
              )
            : filteredCourses
        )}
        filename="courses-export"
        title="Export Courses"
      />
    </div>
  )
}
```

---

## ✅ **Success Criteria**

1. **UI Consistency**: Matches existing groups/students pages exactly
2. **TypeScript Compliance**: Follows all TypeScript guidelines
3. **Performance**: Fast loading, efficient state management
4. **Accessibility**: Full keyboard navigation and screen reader support
5. **Mobile Responsive**: Works perfectly on all device sizes
6. **Integration**: Seamless integration with existing groups/students/teachers systems

This comprehensive plan ensures the courses management page will integrate seamlessly with the existing codebase while providing robust course management functionality following all established patterns and guidelines.


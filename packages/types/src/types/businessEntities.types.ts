import {
  AttendanceStatus,
  CourseLevel,
  Currency,
  EmploymentType,
  EntityStatus,
  Gender,
  GroupStatus,
  MaterialType,
  PaymentStatus,
  SessionStatus,
  SubscriptionType,
  TransactionType,
  PaymentMethod,
  PaymentGateway,
  InstallmentFrequency,
  InvoiceStatus,
  DiscountType,
  DiscountApplicableTo,
  PaymentPlanStatus,
  InstallmentStatus,
  SubscriptionStatus,
  GovernmentType,
  SocialMediaPlatform,
  Country,
  TeacherDepartment
} from '../enums/global.enums'
import {
  Address,
  AgeRange,
  Cost,
  ContactInfo,
  EmergencyContact,
  Payment,
  PaymentDetails,
  Salary,
  TimeSlot,
  TransactionPayment
} from './global.types'

export type Student = {
  id: string
  studentCode: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone?: string
  dateOfBirth?: Date
  gender?: Gender
  address?: Address
  emergencyContact?: EmergencyContact
  guardianName?: string
  guardianPhone?: string
  guardianEmail?: string
  profilePhoto?: string
  status: EntityStatus
  enrolledCourses: string[]
  groupIds: string[]
  authorityId?: string // Associated authority
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type Teacher = {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  dateOfBirth?: Date
  gender?: Gender
  address?: Address
  emergencyContact?: EmergencyContact
  profilePhoto?: string
  department: TeacherDepartment
  subjects: string[]
  qualifications: string[]
  experienceYears: number
  hireDate: Date
  employmentType: EmploymentType
  salary?: Salary
  status: EntityStatus
  assignedGroups: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type Course = {
  id: string
  name: string
  code: string
  description: string
  level: CourseLevel
  totalLectures: number
  lecturesPerWeek: number
  category: string
  status: EntityStatus
  validAgeRange: AgeRange
  learningObjectives: string[]
  prerequisites: string[]
  materialLinks: MaterialLink[]
  instructorIds: string[]
  coverImage?: string
  price?: number
  currency?: Currency
  createdAt: Date
  updatedAt: Date
}

export type MaterialLink = {
  id: string
  title: string
  url: string
  type: MaterialType
  isRequired: boolean
  description?: string
  uploadedAt: Date
}

export type SessionTime = {
  day: string
  startTime: string
  endTime: string
}

export type GroupCourse = {
  courseId: string
  startDate: Date
  endDate?: Date
  lecturesCompleted: number
  isActive: boolean
}

export type GroupSubscription = {
  id: string
  type: SubscriptionType
  cost: Cost
  numberOfLecturesIncluded: number
  studentsEnrolled: number
  isActive: boolean
  validFrom: Date
  validUntil: Date
}

export type TeacherAssignment = {
  teacherId: string
  courseId: string
  assignedSessions: string[] // Session IDs
  startDate: Date
  endDate?: Date
  isActive: boolean
}

export type Group = {
  id: string
  name: string
  code: string
  courses: GroupCourse[] // Multiple courses per group
  teacherAssignments: TeacherAssignment[] // Teacher-course-session assignments
  studentIds: string[]
  locationId: string
  sessionTimes: SessionTime[]
  capacity: number
  currentEnrollment: number
  subscriptions: GroupSubscription[] // Monthly and yearly subscriptions
  status: GroupStatus
  startDate: Date
  endDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// New Session entity to represent individual lectures
export type Session = {
  id: string
  groupId: string
  courseId: string
  teacherId: string
  sessionNumber: number // 1, 2, 3... for the course
  title: string
  description?: string
  scheduledDate: Date
  actualStartTime?: Date
  actualEndTime?: Date
  locationId: string
  materialLinks: MaterialLink[]
  status: SessionStatus
  attendanceRecords: AttendanceRecord[]
  notes?: string
  recordingUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Track student attendance for each session
export type AttendanceRecord = {
  studentId: string
  sessionId: string
  status: AttendanceStatus
  arrivalTime?: Date
  notes?: string
  recordedAt: Date
}

export type Location = {
  id: string
  name: string
  address: Address
  capacity: number
  facilities: string[]
  contactPerson?: string
  contactPhone?: string
  images: string[]
  status: EntityStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type Authority = {
  id: string
  name: string
  country: Country
  government: GovernmentType
  city: string
  address: Address
  contacts: ContactInfo
  studentIds: string[] // Associated students
  status: EntityStatus
  establishedDate?: Date
  website?: string
  description?: string
  logoUrl?: string
  certifications?: string[] // Any accreditations or certifications
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type Transaction = {
  id: string
  type: TransactionType
  studentId: string
  groupId: string
  subscriptionId?: string
  sessionIds?: string[] // For session-specific payments
  courseIds?: string[] // For course-specific payments
  description: string
  payment: Payment
  status: PaymentStatus
  dueDate?: Date
  invoiceId?: string
  receiptUrl?: string
  notes?: string
  createdBy: string // User ID who created the transaction
  processedBy?: string // User ID who processed the transaction
  createdAt: Date
  updatedAt: Date
}

// Enhanced invoice system
export type Invoice = {
  id: string
  invoiceNumber: string
  studentId: string
  groupId: string
  subscriptionId?: string
  items: InvoiceItem[]
  subtotal: number
  discounts: InvoiceDiscount[]
  totalDiscounts: number
  taxes: InvoiceTax[]
  totalTaxes: number
  totalAmount: number
  currency: Currency
  status: InvoiceStatus
  dueDate: Date
  issueDate: Date
  paidAt?: Date
  paymentId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type InvoiceItem = {
  id: string
  description: string
  courseId?: string
  sessionId?: string
  subscriptionId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  currency: Currency
}

export type InvoiceDiscount = {
  id: string
  type: DiscountType
  value: number
  description: string
  appliedAmount: number
  currency: Currency
}

export type InvoiceTax = {
  id: string
  name: string
  rate: number // Percentage
  appliedAmount: number
  currency: Currency
}

// Payment plan for students
export type PaymentPlan = {
  id: string
  studentId: string
  groupId: string
  subscriptionId?: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  currency: Currency
  installments: PaymentInstallment[]
  status: PaymentPlanStatus
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export type PaymentInstallment = {
  id: string
  paymentPlanId: string
  installmentNumber: number
  amount: number
  currency: Currency
  dueDate: Date
  paidAt?: Date
  paymentId?: string
  status: InstallmentStatus
  lateFee?: number
  notes?: string
}

// Financial summary types
export type StudentFinancialSummary = {
  studentId: string
  totalOwed: number
  totalPaid: number
  totalOverdue: number
  currency: Currency
  activePaymentPlans: PaymentPlan[]
  overdueInstallments: PaymentInstallment[]
  recentTransactions: Transaction[]
  lastPaymentDate?: Date
}

export type GroupFinancialSummary = {
  groupId: string
  totalRevenue: number
  totalOutstanding: number
  totalRefunded: number
  currency: Currency
  studentsWithOutstanding: number
  averagePaymentTime: number // days
  paymentSuccessRate: number // percentage
  monthlyRevenue: MonthlyRevenue[]
}

export type MonthlyRevenue = {
  month: string // YYYY-MM format
  revenue: number
  transactions: number
  refunds: number
  currency: Currency
}

// Discount and promotion system
export type Discount = {
  id: string
  code: string
  name: string
  description: string
  type: DiscountType
  value: number
  maxUsage?: number
  currentUsage: number
  maxUsagePerUser?: number // Maximum times a single user can use this discount
  minOrderAmount?: number
  maxDiscountAmount?: number
  applicableTo: DiscountApplicableTo
  applicableIds?: string[] // Course IDs, subscription IDs, or group IDs
  validFrom: Date
  validUntil: Date
  isActive: boolean
  createdBy: string
  usedByUsers: DiscountUserUsage[] // Track who used this discount and how many times
  createdAt: Date
  updatedAt: Date
}

export type DiscountUserUsage = {
  userId: string
  userPhone: string
  cardLast4?: string // Last 4 digits of credit card for additional verification
  cardFingerprint?: string // Unique card identifier (hashed)
  usageCount: number
  firstUsedAt: Date
  lastUsedAt: Date
  transactionIds: string[] // All transactions where this discount was applied by this user
}

export type DiscountUsage = {
  id: string
  discountId: string
  studentId: string
  transactionId: string
  appliedAmount: number
  currency: Currency
  userPhone: string // Phone number for tracking
  cardLast4?: string // Last 4 digits of payment card
  cardFingerprint?: string // Unique card identifier
  deviceFingerprint?: string // Browser/device fingerprint for additional security
  ipAddress?: string // IP address for fraud detection
  usedAt: Date
}

// Utility types for computed properties and relationships
export type GroupWithComputedData = Group & {
  totalLectures: number // Computed from all courses
  totalCompletedLectures: number // Sum of completed lectures across all courses
  activeCourses: GroupCourse[]
  activeTeachers: TeacherAssignment[]
  upcomingSessions: Session[]
  completedSessions: Session[]
}

export type CourseProgress = {
  courseId: string
  courseName: string
  totalLectures: number
  completedLectures: number
  upcomingLectures: number
  progressPercentage: number
  lastSessionDate?: Date
  nextSessionDate?: Date
}

export type StudentProgress = {
  studentId: string
  groupId: string
  courseProgress: CourseProgress[]
  overallAttendanceRate: number
  totalSessionsAttended: number
  totalSessionsScheduled: number
  subscriptionStatus: SubscriptionStatus
}

export type TeacherSchedule = {
  teacherId: string
  groupId: string
  courseId: string
  upcomingSessions: Session[]
  completedSessions: Session[]
  pendingSessions: Session[]
}

// Input types for creating/updating entities
export type SessionCreateInput = {
  groupId: string
  courseId: string
  teacherId: string
  sessionNumber: number
  title: string
  description?: string
  scheduledDate: Date
  locationId: string
  materialLinks?: MaterialLink[]
  notes?: string
}

export type GroupCreateInput = {
  name: string
  code: string
  locationId: string
  sessionTimes: SessionTime[]
  capacity: number
  startDate: Date
  endDate?: Date
  notes?: string
}

export type TeacherAssignmentInput = {
  teacherId: string
  courseId: string
  startDate: Date
  endDate?: Date
}

// Payment and transaction input types
export type PaymentCreateInput = {
  amount: number
  currency: Currency
  paymentDetails: PaymentDetails
  description?: string
  metadata?: Record<string, any>
}

export type TransactionCreateInput = {
  type: TransactionType
  studentId: string
  groupId: string
  subscriptionId?: string
  sessionIds?: string[]
  courseIds?: string[]
  description: string
  payment: PaymentCreateInput
  dueDate?: Date
  notes?: string
}

export type InvoiceCreateInput = {
  studentId: string
  groupId: string
  subscriptionId?: string
  items: Omit<InvoiceItem, 'id' | 'totalPrice'>[]
  discounts?: Omit<InvoiceDiscount, 'id' | 'appliedAmount'>[]
  taxes?: Omit<InvoiceTax, 'id' | 'appliedAmount'>[]
  dueDate: Date
  notes?: string
}

export type PaymentPlanCreateInput = {
  studentId: string
  groupId: string
  subscriptionId?: string
  totalAmount: number
  numberOfInstallments: number
  frequency: InstallmentFrequency
  startDate: Date
}

export type DiscountCreateInput = {
  code: string
  name: string
  description: string
  type: DiscountType
  value: number
  maxUsage?: number
  maxUsagePerUser?: number // Limit how many times a single user can use this discount
  minOrderAmount?: number
  maxDiscountAmount?: number
  applicableTo: DiscountApplicableTo
  applicableIds?: string[]
  validFrom: Date
  validUntil: Date
}

// Utility types for discount validation and fraud prevention
export type DiscountValidationResult = {
  isValid: boolean
  reason?:
    | 'expired'
    | 'max_usage_reached'
    | 'user_limit_exceeded'
    | 'min_order_not_met'
    | 'not_applicable'
    | 'inactive'
  userUsageCount: number
  maxAllowedForUser: number
  remainingGlobalUsage: number
  appliedAmount?: number
}

export type DiscountFraudCheck = {
  userId: string
  phone: string
  cardLast4?: string
  cardFingerprint?: string
  deviceFingerprint?: string
  ipAddress?: string
  suspiciousActivity: boolean
  riskScore: number // 0-100, higher means more risky
  riskFactors: string[] // Array of detected risk factors
}

export type DiscountApplicationInput = {
  discountCode: string
  userId: string
  userPhone: string
  orderAmount: number
  currency: Currency
  cardLast4?: string
  cardFingerprint?: string
  deviceFingerprint?: string
  ipAddress?: string
  applicableItems: {
    type: 'course' | 'subscription' | 'group'
    id: string
    amount: number
  }[]
}

// Authority input types
export type AuthorityCreateInput = {
  name: string
  country: Country
  government: GovernmentType
  city: string
  address: Address
  contacts: ContactInfo
  establishedDate?: Date
  website?: string
  description?: string
  logoUrl?: string
  certifications?: string[]
  notes?: string
}

export type AuthorityUpdateInput = {
  name?: string
  country?: Country
  government?: GovernmentType
  city?: string
  address?: Address
  contacts?: ContactInfo
  studentIds?: string[]
  status?: EntityStatus
  establishedDate?: Date
  website?: string
  description?: string
  logoUrl?: string
  certifications?: string[]
  notes?: string
}


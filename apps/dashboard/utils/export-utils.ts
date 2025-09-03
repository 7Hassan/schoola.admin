'use client'

export type ExportFormat = 'excel' | 'csv'

export interface ExportableRecord {
  [key: string]: any
}

export interface ExportOptions {
  filename?: string
  timestamp?: boolean
  format: ExportFormat
}

// Import types for specialized exports
export interface TeacherExportData {
  'Teacher ID': string
  'Employee ID': string
  Name: string
  Email: string
  Phone: string
  Department: string
  Subjects: string
  'Experience (Years)': number
  'Employment Type': string
  Status: string
  'Hire Date': string
  Salary: string
  'Has Account': string
  'Last Active': string
}

export interface GroupExportData {
  'Group Name': string
  'Start Date': string
  'End Date': string
  Status: string
  Teachers: string
  Courses: string
  Location: string
  'Capacity Limit': number
  'Current Enrollment': number
  'Total Lectures': number
  'Current Lecture': number
  'Upcoming Lecture': number
  'Monthly Subscription': string
  'Level Subscription': string
  Sessions: string
  'Total Price': number
  'Created Date': string
  'Last Updated': string
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: ExportableRecord[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0]!)
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle special characters and quotes in CSV
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"') || value.includes('\n'))
          ) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(',')
    )
  ].join('\n')

  return csvContent
}

/**
 * Convert data to Excel format (using CSV as fallback for browser compatibility)
 */
function convertToExcel(data: ExportableRecord[]): string {
  // For now, we'll use CSV format with .xlsx extension
  // In a real application, you might want to use a library like xlsx or ExcelJS
  return convertToCSV(data)
}

/**
 * Download file to user's device
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  window.URL.revokeObjectURL(url)
}

/**
 * Generate filename with timestamp
 */
function generateFilename(
  baseName: string,
  format: ExportFormat,
  includeTimestamp: boolean = true
): string {
  const extension = format === 'excel' ? 'xlsx' : 'csv'
  const timestamp = includeTimestamp
    ? `_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}`
    : ''
  return `${baseName}${timestamp}.${extension}`
}

/**
 * Main export function
 */
export function exportData(
  data: ExportableRecord[],
  options: ExportOptions
): void {
  if (data.length === 0) {
    throw new Error('No data to export')
  }

  const { format, filename = 'export', timestamp = true } = options

  let content: string
  let mimeType: string

  switch (format) {
    case 'excel':
      content = convertToExcel(data)
      mimeType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      break
    case 'csv':
      content = convertToCSV(data)
      mimeType = 'text/csv;charset=utf-8;'
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }

  const finalFilename = generateFilename(filename, format, timestamp)
  downloadFile(content, finalFilename, mimeType)
}

/**
 * Format student data for export
 */
export function formatStudentsForExport(students: any[]): ExportableRecord[] {
  return students.map((student) => ({
    Name: student.name,
    Age: student.age,
    'Parent Phone': student.parentPhone,
  'Has WhatsApp': student.hasWhatsapp ? 'Yes' : 'No',
  'WhatsApp': student.whatsappPhone || '',
    Email: student.email,
    Group: student.group,
    Status: student.status,
    Paid: student.paid ? 'Yes' : 'No',
    Source: student.source,
    'Created Date': new Date(student.createdAt).toLocaleDateString(),
    'Last Updated': new Date(student.lastUpdatedAt).toLocaleDateString(),
    Info: student.info
  }))
}

/**
 * Format teachers data for export (comprehensive)
 */
export function formatTeachersForExport(
  teachers: any[],
  departments?: { id: string; name: string }[],
  subjects?: { id: string; name: string }[]
): TeacherExportData[] {
  return teachers.map((teacher) => {
    const department =
      departments?.find((d) => d.id === teacher.department)?.name ||
      teacher.department ||
      'Unknown'

    const teacherSubjects = teacher.subjects
      ? Array.isArray(teacher.subjects)
        ? teacher.subjects
            .map(
              (subjectId: string) =>
                subjects?.find((s) => s.id === subjectId)?.name || subjectId
            )
            .filter(Boolean)
            .join(', ')
        : teacher.subjects
      : teacher.subject || 'Not specified'

    return {
      'Teacher ID': teacher.id,
      'Employee ID': teacher.employeeId || teacher.id,
      Name: teacher.name,
      Email: teacher.email,
      Phone: teacher.phone,
      Department: department,
      Subjects: teacherSubjects,
      'Experience (Years)': teacher.experienceYears || teacher.experience || 0,
      'Employment Type': (teacher.employmentType || 'full_time')
        .replace('_', ' ')
        .toUpperCase(),
      Status: (teacher.status || 'active').replace('_', ' ').toUpperCase(),
      'Hire Date': teacher.hireDate
        ? new Intl.DateTimeFormat('en-US').format(new Date(teacher.hireDate))
        : 'Not specified',
      Salary: teacher.salary
        ? `${teacher.salary.amount} ${teacher.salary.currency.toUpperCase()}`
        : 'Not specified',
      'Has Account': teacher.hasAccount ? 'Yes' : 'No',
      'Last Active': teacher.lastActiveAt
        ? new Intl.DateTimeFormat('en-US').format(
            new Date(teacher.lastActiveAt)
          )
        : 'Never'
    }
  })
}

/**
 * Format groups data for export (comprehensive)
 */
export function formatGroupsForExport(
  groups: any[],
  teachers: { id: string; name: string; specialization?: string }[],
  courses: { id: string; name: string; level?: string }[],
  locations: { id: string; name: string }[]
): GroupExportData[] {
  return groups.map((group) => {
    const groupTeachers =
      group.teachers
        ?.map((id: string) => teachers.find((t) => t.id === id)?.name)
        ?.filter(Boolean)
        ?.join(', ') || 'No teachers assigned'

    const groupCourses =
      group.courses
        ?.map((id: string) => courses.find((c) => c.id === id)?.name)
        ?.filter(Boolean)
        ?.join(', ') || 'No courses assigned'

    const groupLocation =
      locations.find((l) => l.id === group.location)?.name || 'Unknown'

    // Handle subscriptions
    const monthlySubscription = group.subscriptions?.find(
      (s: any) => s.type === 'monthly'
    )
    const levelSubscription = group.subscriptions?.find(
      (s: any) => s.type === 'level'
    )

    const monthlySubText = monthlySubscription
      ? `${monthlySubscription.cost.amount} ${monthlySubscription.cost.currency.toUpperCase()} (${monthlySubscription.numberOfLecturesIncluded} lectures)`
      : 'None'

    const levelSubText = levelSubscription
      ? `${levelSubscription.cost.amount} ${levelSubscription.cost.currency.toUpperCase()} (${levelSubscription.numberOfLecturesIncluded} lectures)`
      : 'None'

    // Format sessions with date utility
    const sessionsText =
      group.sessions
        ?.map((session: any) => {
          const startTime =
            session.startTime instanceof Date
              ? session.startTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : session.startTime
          const endTime =
            session.endTime instanceof Date
              ? session.endTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : session.endTime
          return `${session.day}: ${startTime} - ${endTime}`
        })
        ?.join('; ') || 'No sessions scheduled'

    // Calculate total price from subscriptions
    const totalPrice =
      group.subscriptions?.reduce(
        (sum: number, sub: any) => sum + (sub.cost?.amount || 0),
        0
      ) || 0

    // Format dates safely
    const formatDate = (date: any) => {
      if (!date) return 'Not specified'
      const dateObj = date instanceof Date ? date : new Date(date)
      return isNaN(dateObj.getTime())
        ? 'Invalid date'
        : dateObj.toLocaleDateString()
    }

    return {
      'Group Name': group.name || 'Unnamed Group',
      'Start Date': formatDate(group.startDate),
      'End Date': formatDate(group.endDate),
      Status: group.status || 'Unknown',
      Teachers: groupTeachers,
      Courses: groupCourses,
      Location: groupLocation,
      'Capacity Limit': group.capacityLimit || 0,
      'Current Enrollment': group.currentEnrollment || 0,
      'Total Lectures': group.totalLectures || 0,
      'Current Lecture': group.currentLectureNumber || 0,
      'Upcoming Lecture': group.upcomingLectureNumber || 0,
      'Monthly Subscription': monthlySubText,
      'Level Subscription': levelSubText,
      Sessions: sessionsText,
      'Total Price': totalPrice,
      'Created Date': formatDate(group.createdAt),
      'Last Updated': formatDate(group.lastUpdatedAt)
    }
  })
}

/**
 * Format courses data for export
 */
export function formatCoursesForExport(courses: any[]): ExportableRecord[] {
  return courses.map((course) => ({
    'Course ID': course.id,
    Title: course.title,
    Description: course.description,
    Level: course.level,
    Duration: course.duration,
    Price: course.price,
    Status: course.status,
    'Created Date': new Date(course.createdAt).toLocaleDateString()
  }))
}

/**
 * Specialized download functions for different data types
 */
export function downloadGroupsAsCSV(
  groups: any[],
  teachers: { id: string; name: string; specialization?: string }[],
  courses: { id: string; name: string; level?: string }[],
  locations: { id: string; name: string }[]
) {
  const data = formatGroupsForExport(groups, teachers, courses, locations)

  if (data.length === 0) {
    alert('No groups to export')
    return
  }

  exportData(data, {
    format: 'csv',
    filename: 'groups_export',
    timestamp: true
  })
}

export function downloadGroupsAsJSON(
  groups: any[],
  teachers: { id: string; name: string; specialization?: string }[],
  courses: { id: string; name: string; level?: string }[],
  locations: { id: string; name: string }[]
) {
  const data = formatGroupsForExport(groups, teachers, courses, locations)

  if (data.length === 0) {
    alert('No groups to export')
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], {
    type: 'application/json;charset=utf-8;'
  })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `groups_export_${new Date().toISOString().split('T')[0]}.json`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}


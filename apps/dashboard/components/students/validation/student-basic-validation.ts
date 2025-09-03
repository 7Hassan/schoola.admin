import { validatePhoneNumber } from '@/utils/phone-utils'

export interface StudentBasicInfo {
  childName?: string
  parentName?: string
  age?: number | string
  parentPhone?: string
  group?: string
}

export interface StudentValidationResult {
  isValid: boolean
  missingFields: string[]
  notes?: string[]
}

export function validateStudentBasicInfo(student: StudentBasicInfo): StudentValidationResult {
  const missingFields: string[] = []
  const notes: string[] = []

  if (!student.childName || student.childName.trim().length < 2) {
    missingFields.push('childName')
  }
  if (!student.parentName || student.parentName.trim().length < 2) {
    missingFields.push('parentName')
  }
  if (student.age === undefined || student.age === null || isNaN(Number(student.age)) || Number(student.age) < 5 || Number(student.age) > 18) {
    missingFields.push('age')
  }
  if (!student.parentPhone || !validatePhoneNumber(student.parentPhone).isValid) {
    missingFields.push('parentPhone')
  }
  if (!student.group) {
    notes.push('No group selected')
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    notes: notes.length > 0 ? notes : undefined
  }
}

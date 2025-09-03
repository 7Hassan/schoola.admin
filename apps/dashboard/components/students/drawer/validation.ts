"use client"

import * as z from 'zod'
import { validatePhoneNumber } from '@/utils/phone-utils'

export const studentSchema = z.object({
  childName: z.string().min(2, 'Child name must be at least 2 characters'),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentPhone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (phone) => validatePhoneNumber(phone).isValid,
      'Invalid phone number format (EG / AE only)'
    ),
  age: z.coerce.number()
    .min(5, 'Age must be at least 5')
    .max(18, 'Age must be at most 18'),
  email: z.string().optional().or(z.literal('')).refine(
    (val) => !val || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val),
    'Invalid email address'
  ),
  source: z.string().min(1, 'Source is required'),
  paid: z.boolean(),
  status: z.enum(['Active', 'Archived', 'Free-day', 'Waiting']),
  group: z.string(),
  info: z.string()
}).refine(
  (data) => {
    // If group is empty, info (note) is required
    if (!data.group || data.group.trim() === '') {
      return data.info && data.info.trim().length > 0;
    }
    // If group is selected, info is not required
    return true;
  },
  {
    message: 'Note is required if no group is selected',
    path: ['info']
  }
)

export type StudentFormData = z.infer<typeof studentSchema>

export const getDefaultFormValues = (): StudentFormData => ({
  childName: '',
  parentName: '',
  parentPhone: '',
  age: 12,
  email: '',
  source: 'Website',
  paid: false,
  status: 'Waiting',
  group: '',
  info: ''
})

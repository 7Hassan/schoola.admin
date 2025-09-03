export type Plan = {
  id: string
  name: string
  durationMonths: number
  sessions: number
  price: number
}

export type Subscription = {
  id: string
  studentId: string
  studentName: string
  planId: string
  planName: string
  startDate: string
  endDate: string
  status: 'active' | 'due_soon' | 'expired'
}

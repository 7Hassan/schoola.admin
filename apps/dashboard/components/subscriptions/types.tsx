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
  // planType is one of the two user-visible plan choices
  planType: 'Monthly' | 'Level'
  // keep planId/name for legacy compatibility (optional)
  planId?: string
  planName?: string
  // sessions tracking
  sessionsTotal: number
  sessionsUsed: number
  // payments tracking (simple amount-based flow)
  amountPaid: number
  planPrice: number
  startDate: string
  endDate: string
  // optional payment deadline and grace period
  paymentDeadline?: string
  graceDays?: number
  // status follows the rules requested by the user
  status: 'active_fully_paid' | 'active_partially_paid' | 'due_soon' | 'expired' | 'on_hold'
}

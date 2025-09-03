import { Subscription } from '@/components/subscriptions/types'

export type Payment = {
  id: string
  subscriptionId: string
  studentId: string
  amount: number
  date: string
  notes?: string
  createdAt: string
}

const payments: Payment[] = []

export function createPayment(p: Omit<Payment, 'id' | 'createdAt'>) {
  const payment: Payment = { ...p, id: `pay${Date.now()}`, createdAt: new Date().toISOString() }
  payments.push(payment)
  return payment
}

export function getPaymentsForSubscription(subscriptionId: string) {
  return payments.filter(p => p.subscriptionId === subscriptionId)
}

export function getPaymentsForStudent(studentId: string) {
  return payments.filter(p => p.studentId === studentId)
}

export function computeStatus(subscription: Subscription) {
  // expired when sessions finished
  if (subscription.sessionsUsed >= subscription.sessionsTotal) return 'expired' as const

  const remainingAmount = subscription.planPrice - subscription.amountPaid
  if (remainingAmount <= 0) return 'active_fully_paid' as const

  // due soon based on sessions
  if (subscription.sessionsTotal - subscription.sessionsUsed === 1) return 'due_soon' as const

  // on hold if past paymentDeadline (simple check)
  if (subscription['paymentDeadline']) {
    const deadline = new Date(subscription['paymentDeadline'])
    const now = new Date()
    const grace = subscription['graceDays'] || 0
    deadline.setDate(deadline.getDate() + grace)
    if (now > deadline && subscription.amountPaid < subscription.planPrice) return 'on_hold' as const
  }

  return 'active_partially_paid' as const
}

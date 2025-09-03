"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetHeader } from '@workspace/ui/components/ui/sheet'
import { Button } from '@workspace/ui/components/ui/button'
import { Subscription } from './types'

type Props = {
  isOpen: boolean
  onClose: () => void
  students: { id: string; name: string }[]
  subscriptions: Subscription[]
  defaultSubscriptionId?: string
  onSubmit: (payload: { subscriptionId: string; studentId: string; amount: number; date: string; notes?: string }) => void
}

export default function PaymentDrawer({ isOpen, onClose, students, subscriptions, defaultSubscriptionId, onSubmit }: Props) {
  const [studentQuery, setStudentQuery] = useState('')
  const [studentId, setStudentId] = useState('')
  const [subscriptionId, setSubscriptionId] = useState(defaultSubscriptionId || '')
  const [amount, setAmount] = useState<number>(0)
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (defaultSubscriptionId) setSubscriptionId(defaultSubscriptionId)
  }, [defaultSubscriptionId])

  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase()
    if (!q) return students
    return students.filter(s => s.name.toLowerCase().includes(q) || s.id.includes(q))
  }, [students, studentQuery])

  const subscriptionsForStudent = useMemo(() => subscriptions.filter(s => s.studentId === studentId), [subscriptions, studentId])

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!subscriptionId || !studentId || amount <= 0) return
    onSubmit({ subscriptionId, studentId, amount, date, notes: notes || undefined })
    // reset and close
    setAmount(0)
    setNotes('')
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <h2 className="text-xl font-semibold">Add Payment</h2>
          <p className="text-sm text-gray-600">Record a payment against a subscription</p>
        </SheetHeader>

        <form onSubmit={submit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <input value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} placeholder="Search students" className="w-full border p-2 rounded mb-2" />
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select a student</option>
              {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subscription</label>
            <select value={subscriptionId} onChange={(e) => setSubscriptionId(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select subscription</option>
              {subscriptionsForStudent.map(sub => <option key={sub.id} value={sub.id}>{sub.planType}{sub.planName ? ` — ${sub.planName}` : ''} ({sub.sessionsUsed}/{sub.sessionsTotal}) — Balance: ${Math.max(0, sub.planPrice - sub.amountPaid)}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Record Payment</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

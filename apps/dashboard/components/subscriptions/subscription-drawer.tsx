"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetHeader } from '@workspace/ui/components/ui/sheet'
import { Button } from '@workspace/ui/components/ui/button'
import { Plan, Subscription } from './types'

type Props = {
  isOpen: boolean
  onClose: () => void
  students: { id: string; name: string }[]
  plans: Plan[]
  onCreate: (sub: Subscription) => void
}

export default function SubscriptionDrawer({ isOpen, onClose, students, plans, onCreate }: Props) {
  const [studentId, setStudentId] = useState('')
  const [planType, setPlanType] = useState<'Monthly' | 'Level'>('Monthly')
  const [planId, setPlanId] = useState(plans[0]?.id || '')
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [sessionsTotal, setSessionsTotal] = useState<number>(() => {
    // default based on Monthly (4) vs Level (12)
    return planType === 'Monthly' ? 4 : 12
  })
  const [planPrice, setPlanPrice] = useState<number>(() => plans[0]?.price || 0)
  const [amountPaid, setAmountPaid] = useState<number>(0)
  const [studentQuery, setStudentQuery] = useState('')

  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase()
    if (!q) return students
    return students.filter(s => s.name.toLowerCase().includes(q) || s.id.includes(q))
  }, [students, studentQuery])

  useEffect(() => {
    if (!planId && plans?.[0]?.id) setPlanId(plans[0].id)
  }, [plans, planId])

  useEffect(() => {
    setSessionsTotal(planType === 'Monthly' ? 4 : 12)
    // if a planId maps to a plan with a price, update planPrice
    const p = plans.find(p => p.id === planId)
    setPlanPrice(p?.price || (planType === 'Monthly' ? 0 : 0))
  }, [planType, planId, plans])

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!studentId) return
    const id = `sub${Date.now()}`
    const start = startDate
    const endObj = new Date(start)
    // assume duration months based on plan selection if available, otherwise Monthly=1, Level=3
    const plan = plans.find(p => p.id === planId)
    const duration = plan?.durationMonths ?? (planType === 'Monthly' ? 1 : 3)
    endObj.setMonth(endObj.getMonth() + duration)
    const end = endObj.toISOString().slice(0, 10)
    const sub: Subscription = {
      id,
      studentId,
      studentName: students.find(s => s.id === studentId)?.name || 'Unknown',
      planType,
      planId: plan?.id,
      planName: plan?.name,
      sessionsTotal,
      sessionsUsed: 0,
      amountPaid,
      planPrice,
      startDate: start,
      endDate: end,
      status: amountPaid >= planPrice ? 'active_fully_paid' : 'active_partially_paid'
    }
    onCreate(sub)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <h2 className="text-xl font-semibold">Add Subscription</h2>
          <p className="text-sm text-gray-600">Create a subscription for an existing student</p>
        </SheetHeader>

        <form onSubmit={submit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <input value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} placeholder="Search students by name" className="w-full border p-2 rounded mb-2" />
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select a student</option>
              {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Plan Type</label>
            <div className="flex gap-2">
              <label className={`p-2 border rounded cursor-pointer ${planType === 'Monthly' ? 'bg-gray-100' : ''}`}>
                <input type="radio" name="planType" value="Monthly" checked={planType === 'Monthly'} onChange={() => setPlanType('Monthly')} className="sr-only" />
                Monthly (4 sessions)
              </label>
              <label className={`p-2 border rounded cursor-pointer ${planType === 'Level' ? 'bg-gray-100' : ''}`}>
                <input type="radio" name="planType" value="Level" checked={planType === 'Level'} onChange={() => setPlanType('Level')} className="sr-only" />
                Level (12 sessions)
              </label>
            </div>

            <label className="block text-sm font-medium mb-1 mt-3">Choose Plan (optional)</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Custom / None</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name}  {p.sessions} sessions — ${p.price}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sessions (total)</label>
            <input type="number" value={sessionsTotal} onChange={(e) => setSessionsTotal(Number(e.target.value))} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount Paid</label>
            <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} className="w-full border p-2 rounded" />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

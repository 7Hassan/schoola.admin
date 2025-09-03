"use client"

import React, { useEffect, useState } from 'react'
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
  const [planId, setPlanId] = useState(plans[0]?.id || '')
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    if (!planId && plans?.[0]?.id) setPlanId(plans[0].id)
  }, [plans, planId])

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!studentId || !planId) return
    const plan = plans.find(p => p.id === planId)!
    const id = `sub${Date.now()}`
    const start = startDate
    const endObj = new Date(start)
    endObj.setMonth(endObj.getMonth() + plan.durationMonths)
    const end = endObj.toISOString().slice(0, 10)
    const sub: Subscription = {
      id,
      studentId,
      studentName: students.find(s => s.id === studentId)?.name || 'Unknown',
      planId: plan.id,
      planName: plan.name,
      startDate: start,
      endDate: end,
      status: 'active'
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
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select a student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Plan</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="w-full border p-2 rounded">
              {plans.map(p => <option key={p.id} value={p.id}>{p.name} — {p.sessions} sessions</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border p-2 rounded" />
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

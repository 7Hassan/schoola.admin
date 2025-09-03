"use client"

import React, { useMemo, useState } from 'react'
import SubscriptionsHeader from './subscriptions-header'
import SubscriptionsFilters from './subscriptions-filters'
import SubscriptionsStats from './subscriptions-stats'
import SubscriptionsGrid from './subscriptions-grid'
import { Plan, Subscription } from './types'
import SubscriptionDrawer from './subscription-drawer'
import PaymentDrawer from './payment-drawer'
import { createPayment, computeStatus, Payment } from '@/services/payments-service'
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal'
import { useBulkDelete } from '../shared/use-bulk-delete'

export default function SubscriptionsDashboard() {
  const mockStudents = [
    { id: 's1', name: 'Alice' },
    { id: 's2', name: 'Bob' },
    { id: 's3', name: 'Charlie' }
  ]

  const initialPlans: Plan[] = [
    { id: 'p1', name: 'Intro', durationMonths: 1, sessions: 4, price: 50 },
    { id: 'p2', name: 'Standard', durationMonths: 3, sessions: 12, price: 140 }
  ]

  const initialSubs: Subscription[] = [
    { id: 'sub1', studentId: 's1', studentName: 'Alice', planType: 'Monthly', planId: 'p1', planName: 'Intro', sessionsTotal: 4, sessionsUsed: 1, amountPaid: 50, planPrice: 50, startDate: '2025-08-01', endDate: '2025-09-01', status: 'active_fully_paid' },
    { id: 'sub2', studentId: 's2', studentName: 'Bob', planType: 'Level', planId: 'p2', planName: 'Standard', sessionsTotal: 12, sessionsUsed: 11, amountPaid: 100, planPrice: 140, startDate: '2025-06-01', endDate: '2025-09-01', status: 'due_soon' }
  ]

  const [plans] = useState<Plan[]>(initialPlans)
  const [students] = useState(mockStudents)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubs)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false)
  const [paymentDefaultSubscriptionId, setPaymentDefaultSubscriptionId] = useState<string | undefined>(undefined)
  const {
    isDeleteMode,
    selectedIds: selectedForDeletion,
    isModalOpen: isDeleteModalOpen,
    enterDeleteMode,
    exitDeleteMode,
    toggleSelect,
    requestSingleDelete,
    confirmDeleteSelected,
    executeDeleteSelected: executeBulkDelete,
    closeModal: closeDeleteModal
  } = useBulkDelete()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  // whether the current user can edit subscriptions — mirror StudentsDashboard behaviour
  const canEdit = true

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return subscriptions.filter(s => {
      if (statusFilter && s.status !== statusFilter) return false
      if (!q) return true
      const planName = (s.planName || '').toLowerCase()
      return s.studentName.toLowerCase().includes(q) || planName.includes(q) || s.id.includes(q)
    })
  }, [subscriptions, query, statusFilter])

  function openAddDrawer() {
    setIsDrawerOpen(true)
  }

  function createSubscription(sub: Subscription) {
    setSubscriptions(prev => [sub, ...prev])
  }

  function remove(id: string) {
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  // confirm bulk delete will be executed via executeBulkDelete which takes a delete function

  function updateStatus(id: string, status: Subscription['status']) {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  function renewSubscription(id: string) {
    const original = subscriptions.find(s => s.id === id)
    if (!original) return
    const newId = `sub${Date.now()}`
    const start = new Date().toISOString().slice(0, 10)
    const endObj = new Date(start)
    // try to infer duration from original plan (approx)
    endObj.setMonth(endObj.getMonth() + (original.planType === 'Monthly' ? 1 : 3))
    const end = endObj.toISOString().slice(0, 10)
    const renewed: Subscription = {
      ...original,
      id: newId,
      startDate: start,
      endDate: end,
      sessionsUsed: 0,
      amountPaid: 0,
      status: 'active_partially_paid'
    }
    setSubscriptions(prev => [renewed, ...prev])
  }
  function addPayment(id: string) {
    // open payment drawer with selected subscription
    setPaymentDefaultSubscriptionId(id)
    setIsPaymentDrawerOpen(true)
  }

  function handleCreatePayment(payload: { subscriptionId: string; studentId: string; amount: number; date: string; notes?: string }) {
    // create payment record
    const payment: Payment = createPayment({ subscriptionId: payload.subscriptionId, studentId: payload.studentId, amount: payload.amount, date: payload.date, notes: payload.notes })
    // update subscription in-memory
    setSubscriptions(prev => prev.map(s => {
      if (s.id !== payload.subscriptionId) return s
      const updated = { ...s, amountPaid: s.amountPaid + payload.amount }
      const newStatus = computeStatus(updated)
      return { ...updated, status: newStatus }
    }))
  }

  // Request delete for a single row (opens modal with the subscription student name)
  function requestDelete(id: string) {
    const sub = subscriptions.find(s => s.id === id)
    if (!sub) return
    requestSingleDelete(id)
  }

  // Prepare modal data (human-readable names) similar to StudentsDashboard
  const selectedSubscriptionNames = subscriptions
    .filter((sub) => selectedForDeletion.includes(sub.id))
    .map((sub) => sub.studentName)

  return (
    <div className="space-y-6">
      <SubscriptionsHeader
        openAdd={openAddDrawer}
        isDeleteMode={isDeleteMode}
        selectedCount={selectedForDeletion.length}
        enterDeleteMode={() => enterDeleteMode(filtered.length === 1 ? filtered[0]?.id : undefined)}
        exitDeleteMode={exitDeleteMode}
        confirmDeleteSelected={() => confirmDeleteSelected()}
        canEdit={canEdit}
      />

      <SubscriptionsFilters query={query} onQuery={setQuery} status={statusFilter} onStatus={setStatusFilter} />

      <SubscriptionsStats subscriptions={subscriptions} payments={[]} />

      <SubscriptionsGrid
        items={filtered}
        onDelete={remove}
        onUpdateStatus={updateStatus}
        isDeleteMode={isDeleteMode}
        selectedIds={selectedForDeletion}
        onToggleSelect={toggleSelect}
        onRequestDelete={requestDelete}
        onRenew={renewSubscription}
        onAddPayment={addPayment}
      />

      <PaymentDrawer
        isOpen={isPaymentDrawerOpen}
        onClose={() => { setIsPaymentDrawerOpen(false); setPaymentDefaultSubscriptionId(undefined) }}
        students={students}
        subscriptions={subscriptions}
        defaultSubscriptionId={paymentDefaultSubscriptionId}
        onSubmit={handleCreatePayment}
      />
      <SubscriptionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} students={students} plans={plans} onCreate={createSubscription} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => closeDeleteModal()}
        onConfirm={() => executeBulkDelete((ids: string[]) => setSubscriptions(prev => prev.filter(s => !ids.includes(s.id))))}
        selectedCount={selectedForDeletion.length}
        selectedNames={selectedSubscriptionNames}
        itemType="subscription"
      />
    </div>
  )
}

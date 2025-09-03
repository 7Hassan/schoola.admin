"use client"

import React, { useMemo, useState } from 'react'
import SubscriptionsHeader from './subscriptions-header'
import SubscriptionsFilters from './subscriptions-filters'
import SubscriptionsStats from './subscriptions-stats'
import SubscriptionsGrid from './subscriptions-grid'
import { Plan, Subscription } from './types'
import SubscriptionDrawer from './subscription-drawer'
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
    { id: 'sub1', studentId: 's1', studentName: 'Alice', planId: 'p1', planName: 'Intro', startDate: '2025-08-01', endDate: '2025-09-01', status: 'active' },
    { id: 'sub2', studentId: 's2', studentName: 'Bob', planId: 'p2', planName: 'Standard', startDate: '2025-06-01', endDate: '2025-09-01', status: 'due_soon' }
  ]

  const [plans] = useState<Plan[]>(initialPlans)
  const [students] = useState(mockStudents)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubs)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
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
      return s.studentName.toLowerCase().includes(q) || s.planName.toLowerCase().includes(q) || s.id.includes(q)
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

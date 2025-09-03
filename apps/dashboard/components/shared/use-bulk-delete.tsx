"use client"

import { useState } from 'react'

export function useBulkDelete() {
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  function enterDeleteMode(preselectSingleId?: string) {
    setIsDeleteMode(true)
    if (preselectSingleId) setSelectedIds([preselectSingleId])
    else setSelectedIds([])
  }

  function exitDeleteMode() {
    setIsDeleteMode(false)
    setSelectedIds([])
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  function requestSingleDelete(id: string) {
    setIsDeleteMode(true)
    setSelectedIds([id])
    setIsModalOpen(true)
  }

  function confirmDeleteSelected() {
    if (selectedIds.length === 0) return
    setIsModalOpen(true)
  }

  function executeDeleteSelected(doDelete: (ids: string[]) => void) {
    doDelete(selectedIds)
    setSelectedIds([])
    setIsModalOpen(false)
    setIsDeleteMode(false)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  return {
    isDeleteMode,
    selectedIds,
    isModalOpen,
    enterDeleteMode,
    exitDeleteMode,
    toggleSelect,
    requestSingleDelete,
    confirmDeleteSelected,
    executeDeleteSelected,
    closeModal
  }
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseUnsavedChangesOptions {
  initialData: any
  currentData: any
  enabled?: boolean
}

export function useUnsavedChanges({
  initialData,
  currentData,
  enabled = true
}: UseUnsavedChangesOptions) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const router = useRouter()

  // Check for changes by comparing current data with initial data
  useEffect(() => {
    if (!enabled) {
      setHasUnsavedChanges(false)
      return
    }

    const hasChanges =
      JSON.stringify(initialData) !== JSON.stringify(currentData)
    setHasUnsavedChanges(hasChanges)
  }, [initialData, currentData, enabled])

  // Handle browser navigation away from page
  useEffect(() => {
    if (!enabled || !hasUnsavedChanges) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue =
        'You have unsaved changes. Are you sure you want to leave?'
      return 'You have unsaved changes. Are you sure you want to leave?'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, hasUnsavedChanges])

  const clearUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(false)
  }, [])

  return {
    hasUnsavedChanges,
    clearUnsavedChanges
  }
}


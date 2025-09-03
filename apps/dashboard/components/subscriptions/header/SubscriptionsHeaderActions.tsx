"use client"

import React from 'react'
import { Button } from '@workspace/ui/components/ui/button'
import { Plus, Minus, X } from 'lucide-react'
import { SubscriptionsHeaderProps } from './types'

export default function SubscriptionsHeaderActions({
  isDeleteMode = false,
  selectedCount = 0,
  openAdd,
  enterDeleteMode,
  exitDeleteMode,
  confirmDeleteSelected,
  canEdit = true
}: SubscriptionsHeaderProps) {
  return (
    <div className="flex items-center space-x-3">
      {!isDeleteMode ? (
        <>
          {canEdit && (
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          )}

          {canEdit && (
            <Button size="sm" className="bg-destructive hover:bg-destructive/90" onClick={enterDeleteMode}>
              <Minus className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" onClick={exitDeleteMode} className="border-red-300 text-red-700">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button size="sm" onClick={confirmDeleteSelected} disabled={selectedCount === 0} className="bg-red-600 hover:bg-red-700 text-white">
            <Minus className="h-4 w-4 mr-2" />
            Delete ({selectedCount})
          </Button>
        </>
      )}
    </div>
  )
}

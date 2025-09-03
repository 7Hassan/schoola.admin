"use client"

import React from 'react'
import { Button } from '@workspace/ui/components/ui/button'
import { X, Save } from 'lucide-react'

export type ActionsProps = {
  onCancel: () => void
  onSave: () => void
  onDelete?: () => void
  canEdit: boolean
  isAddMode: boolean
  isDirty?: boolean
}

export function Actions({ onCancel, onSave, onDelete, canEdit, isAddMode, isDirty }: ActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onCancel}>
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>

      {canEdit && (
        <Button onClick={onSave} disabled={!isDirty}>
          <Save className="h-4 w-4 mr-2" />
          {isAddMode ? 'Add Student' : 'Update Student'}
        </Button>
      )}

      {!isAddMode && onDelete && (
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      )}
    </div>
  )
}

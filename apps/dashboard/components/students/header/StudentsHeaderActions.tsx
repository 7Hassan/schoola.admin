import { Button } from '@workspace/ui/components/ui/button'
import { Upload, Plus, Minus, X } from 'lucide-react'
import React from 'react'

interface StudentsHeaderActionsProps {
  isDeleteMode: boolean
  selectedCount: number
  openExportModal: () => void
  openAddDrawer: () => void
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  confirmDeleteSelectedStudents: () => void
  canEdit: boolean
}

export function StudentsHeaderActions({
  isDeleteMode,
  selectedCount,
  openExportModal,
  openAddDrawer,
  enterDeleteMode,
  exitDeleteMode,
  confirmDeleteSelectedStudents,
  canEdit
}: StudentsHeaderActionsProps) {
  return (
    <div className="flex items-center space-x-3">
      {!isDeleteMode ? (
        <>
          <Button variant="outline" size="sm" onClick={openExportModal}>
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>

          {canEdit && (
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={openAddDrawer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          )}
          {canEdit && (
            <Button size="sm" className="bg-destructive hover:bg-destructive/90" onClick={enterDeleteMode}>
              <Minus className="h-4 w-4 mr-2" />
              Delete Student
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={exitDeleteMode}
            className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/30"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={confirmDeleteSelectedStudents}
            disabled={selectedCount === 0}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Minus className="h-4 w-4 mr-2" />
            Delete ({selectedCount})
          </Button>
        </>
      )}
    </div>
  )
}

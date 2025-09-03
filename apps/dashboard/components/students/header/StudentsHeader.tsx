import React from 'react'
import { StudentsHeaderActions } from './StudentsHeaderActions'

interface StudentsHeaderProps {
  isDeleteMode: boolean
  selectedCount: number
  openExportModal: () => void
  openAddDrawer: () => void
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  confirmDeleteSelectedStudents: () => void
  canEdit: boolean
}

export function StudentsHeader({
  isDeleteMode,
  selectedCount,
  openExportModal,
  openAddDrawer,
  enterDeleteMode,
  exitDeleteMode,
  confirmDeleteSelectedStudents,
  canEdit
}: StudentsHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isDeleteMode
        ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
        : ''
        }`}
    >
      <div>
        <h1
          className={`text-3xl font-bold transition-colors ${isDeleteMode ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-gray-100'
            }`}
        >
          {isDeleteMode ? 'Delete Students' : 'Students Management'}
        </h1>
        <p
          className={`mt-1 transition-colors ${isDeleteMode ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'
            }`}
        >
          {isDeleteMode
            ? `${selectedCount} student${selectedCount !== 1 ? 's' : ''} selected for deletion`
            : 'Manage and track student information, enrollment, and progress'}
        </p>
      </div>

      <StudentsHeaderActions
        isDeleteMode={isDeleteMode}
        selectedCount={selectedCount}
        openExportModal={openExportModal}
        openAddDrawer={openAddDrawer}
        enterDeleteMode={enterDeleteMode}
        exitDeleteMode={exitDeleteMode}
        confirmDeleteSelectedStudents={confirmDeleteSelectedStudents}
        canEdit={canEdit}
      />
    </div>
  )
}

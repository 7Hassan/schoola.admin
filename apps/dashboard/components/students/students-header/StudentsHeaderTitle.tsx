import React from 'react'

interface StudentsHeaderTitleProps {
  isDeleteMode: boolean
  selectedCount: number
}

export function StudentsHeaderTitle({ isDeleteMode, selectedCount }: StudentsHeaderTitleProps) {
  return (
    <div>
      <h1
        className={`text-3xl font-bold transition-colors ${isDeleteMode ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-gray-100'}`}
      >
        {isDeleteMode ? 'Delete Students' : 'Students Management'}
      </h1>
      <p
        className={`mt-1 transition-colors ${isDeleteMode ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}`}
      >
        {isDeleteMode
          ? `${selectedCount} student${selectedCount !== 1 ? 's' : ''} selected for deletion`
          : 'Manage and track student information, enrollment, and progress'}
      </p>
    </div>
  )
}

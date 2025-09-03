"use client"

import React from 'react'
import { Button } from '@workspace/ui/components/ui/button'

export interface StudentsResultsSummaryProps {
  startIndex: number
  endIndex: number
  totalStudents: number
  isDeleteMode: boolean
  allStudentsSelected: boolean
  onSelectAll: () => void
  selectedCount: number
  currentPage: number
  totalPages: number
}

export function StudentsResultsSummary({
  startIndex,
  endIndex,
  totalStudents,
  isDeleteMode,
  allStudentsSelected,
  onSelectAll,
  selectedCount,
  currentPage,
  totalPages
}: StudentsResultsSummaryProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex}-{endIndex} of {totalStudents} students
        </div>
        {isDeleteMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="text-sm border-red-300 text-red-700 hover:bg-red-50"
          >
            {allStudentsSelected ? 'Deselect All' : `Select All ${totalStudents}`}
          </Button>
        )}
      </div>
      <div className="text-sm text-gray-600">
        {isDeleteMode && selectedCount > 0 ? (
          <span className="text-red-600 font-medium">{selectedCount} selected for deletion</span>
        ) : (
          `Page ${currentPage} of ${totalPages}`
        )}
      </div>
    </div>
  )
}

"use client"

import React from 'react'
import { Button } from '@workspace/ui/components/ui/button'

export interface StudentsPaginationProps {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
  onPageClick: (page: number) => void
  getVisiblePages: () => (number | string)[]
}

export function StudentsPagination({ currentPage, totalPages, onPrevious, onNext, onPageClick, getVisiblePages }: StudentsPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 pt-6">
      <Button variant="outline" size="sm" onClick={onPrevious} disabled={currentPage === 1}>
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => onPageClick(page as number)} className="min-w-[40px]">
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={onNext} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  )
}

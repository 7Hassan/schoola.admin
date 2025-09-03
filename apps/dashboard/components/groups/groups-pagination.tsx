'use client'

import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { useGroupsStore } from '@/stores/groups-store'

export function GroupsPagination() {
  const {
    currentPage,
    itemsPerPage,
    getTotalPages,
    getFilteredGroups,
    setCurrentPage,
    updateFilters
  } = useGroupsStore()

  const totalPages = getTotalPages()
  const totalItems = getFilteredGroups().length
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalItems === 0) return null

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value)
    // Update items per page logic would need to be added to store
    setCurrentPage(1) // Reset to first page
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, currentPage + 2)

      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) {
          pages.push('...')
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-4">
      {/* Items count */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>
          Showing {startItem} to {endItem} of {totalItems} groups
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Items per page selector */}
        <div className="flex items-center space-x-2 mr-4">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-gray-400">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


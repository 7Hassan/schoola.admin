'use client'

import { LocationCard } from './location-card'
import { Button } from '@workspace/ui/components/ui/button'
import { Skeleton } from '@workspace/ui/components/ui/skeleton'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { useLocationsStore } from '@/stores/locations-store'

export function LocationGrid() {
  const {
    getPaginatedLocations,
    getFilteredLocations,
    currentPage,
    setCurrentPage,
    getTotalPages,
    itemsPerPage,
    isLoading,
    error,
    isDeleteMode,
    selectedLocationsForDeletion,
    selectAllLocationsForDeletion,
    clearSelectedLocationsForDeletion
  } = useLocationsStore()

  const locations = getPaginatedLocations()
  const totalLocations = getFilteredLocations().length
  const allFilteredLocations = getFilteredLocations()
  const totalPages = getTotalPages()

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalLocations)

  // Select All functionality
  const allLocationsSelected =
    allFilteredLocations.length > 0 &&
    allFilteredLocations.every((location) =>
      selectedLocationsForDeletion.includes(location.id)
    )

  const handleSelectAll = () => {
    if (allLocationsSelected) {
      clearSelectedLocationsForDeletion()
    } else {
      selectAllLocationsForDeletion()
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <MapPin className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Locations
        </h3>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4"
            >
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <MapPin className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No locations found
        </h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your filters or search criteria to find locations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Select All in Delete Mode */}
      {isDeleteMode && (
        <div className="flex items-center space-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-sm border-red-300 text-red-700 hover:bg-red-50"
          >
            {allLocationsSelected
              ? 'Deselect All'
              : `Select All ${totalLocations}`}
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isDeleteMode && selectedLocationsForDeletion.length > 0 ? (
            <span className="text-red-600 font-medium">
              {selectedLocationsForDeletion.length} selected for deletion
            </span>
          ) : (
            `Showing ${startIndex}-${endIndex} of ${totalLocations} locations`
          )}
        </div>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageClick(page as number)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

